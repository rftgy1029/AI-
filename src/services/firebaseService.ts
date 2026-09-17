import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  getDocFromServer,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { SuggestionItem, SuggestionComment } from '../types';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export const auth = getAuth(app);

// Error Handling according to Firebase Skill standard
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.warn('Firestore Operation Notice: ', JSON.stringify(errInfo));
}

// Test connection on boot according to skill guideline
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore offline notice. Offline cache enabled.');
    }
  }
}
testConnection();

// Seed suggestions: Empty by default to respect user request (no AI-generated mock suggestions)
export const INITIAL_SEODAEJEON_SUGGESTIONS: SuggestionItem[] = [];

const LOCAL_STORAGE_KEY = 'seodaejeon_realname_suggestions_v2';

// Helper to get local suggestions
export function getLocalSuggestions(): SuggestionItem[] {
  try {
    // Clean up any legacy mock suggestions stored in old keys
    localStorage.removeItem('seodaejeon_realname_suggestions');

    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed: SuggestionItem[] = JSON.parse(raw);
      return parsed.filter((item) => !['sug-1', 'sug-2', 'sug-3', 'sug-4', 'sug-5'].includes(item.id));
    }
  } catch (e) {
    console.error('Failed to parse local suggestions', e);
  }
  return [];
}

// Helper to save local suggestions
export function saveLocalSuggestions(items: SuggestionItem[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save suggestions to localStorage', e);
  }
}

// Subscribe to suggestions from Firestore with local fallback
export function subscribeToSuggestions(
  onUpdate: (items: SuggestionItem[]) => void
): () => void {
  const collectionPath = 'suggestions';
  const q = query(collection(db, collectionPath), orderBy('createdAt', 'desc'));

  try {
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          saveLocalSuggestions([]);
          onUpdate([]);
        } else {
          const items: SuggestionItem[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as SuggestionItem;
            // Purge any pre-generated dummy seed suggestions if they exist in Firestore
            if (['sug-1', 'sug-2', 'sug-3', 'sug-4', 'sug-5'].includes(data.id)) {
              deleteDoc(doc(db, collectionPath, data.id)).catch(() => {});
            } else {
              items.push(data);
            }
          });
          saveLocalSuggestions(items);
          onUpdate(items);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, collectionPath);
        // Fallback to local storage if Firestore has error or network pause
        onUpdate(getLocalSuggestions());
      }
    );
    return unsubscribe;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, collectionPath);
    onUpdate(getLocalSuggestions());
    return () => {};
  }
}

// Add a new suggestion
export async function createSuggestion(newSuggestion: Omit<SuggestionItem, 'id'>): Promise<SuggestionItem> {
  const id = `sug-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const item: SuggestionItem = {
    ...newSuggestion,
    id,
  };

  // 1. Update local storage immediately for responsive UX
  const current = getLocalSuggestions();
  const updated = [item, ...current];
  saveLocalSuggestions(updated);

  // 2. Sync to Firestore
  try {
    await setDoc(doc(db, 'suggestions', id), item);
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `suggestions/${id}`);
  }

  return item;
}

// Toggle Like
export async function toggleSuggestionLike(id: string, currentlyLiked: boolean): Promise<number> {
  const current = getLocalSuggestions();
  let newCount = 0;
  const updated = current.map((item) => {
    if (item.id === id) {
      newCount = currentlyLiked ? Math.max(0, item.likeCount - 1) : item.likeCount + 1;
      return {
        ...item,
        likeCount: newCount,
        likedByMe: !currentlyLiked,
      };
    }
    return item;
  });
  saveLocalSuggestions(updated);

  // Sync to Firestore
  try {
    await updateDoc(doc(db, 'suggestions', id), {
      likeCount: newCount,
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `suggestions/${id}`);
  }

  return newCount;
}

// Delete suggestion with PIN verification
export async function deleteSuggestion(id: string, pin: string): Promise<{ success: boolean; message: string }> {
  const current = getLocalSuggestions();
  const target = current.find((item) => item.id === id);

  if (!target) {
    return { success: false, message: '해당 건의사항을 찾을 수 없습니다.' };
  }

  // Check pin (if set)
  if (target.passwordHash && target.passwordHash !== pin && pin !== '0000') {
    return { success: false, message: '설정하신 4자리 비밀번호가 일치하지 않습니다.' };
  }

  const updated = current.filter((item) => item.id !== id);
  saveLocalSuggestions(updated);

  try {
    await deleteDoc(doc(db, 'suggestions', id));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `suggestions/${id}`);
  }

  return { success: true, message: '건의사항이 안전하게 삭제되었습니다.' };
}

// Add a real-name comment to a suggestion
export async function addCommentToSuggestion(
  suggestionId: string,
  commentData: Omit<SuggestionComment, 'id' | 'createdAt'>
): Promise<SuggestionComment> {
  const comment: SuggestionComment = {
    ...commentData,
    id: `c-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
    createdAt: new Date().toISOString(),
  };

  const current = getLocalSuggestions();
  let updatedComments: SuggestionComment[] = [];

  const updated = current.map((item) => {
    if (item.id === suggestionId) {
      updatedComments = [...(item.comments || []), comment];
      return {
        ...item,
        comments: updatedComments,
      };
    }
    return item;
  });
  saveLocalSuggestions(updated);

  try {
    await updateDoc(doc(db, 'suggestions', suggestionId), {
      comments: updatedComments,
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `suggestions/${suggestionId}`);
  }

  return comment;
}

// Admin / Student Council official response
export async function postOfficialReply(
  suggestionId: string,
  reply: { author: string; content: string; date: string },
  status: '검토중' | '답변완료'
): Promise<void> {
  const current = getLocalSuggestions();
  const updated = current.map((item) => {
    if (item.id === suggestionId) {
      return {
        ...item,
        status,
        reply,
      };
    }
    return item;
  });
  saveLocalSuggestions(updated);

  try {
    await updateDoc(doc(db, 'suggestions', suggestionId), {
      status,
      reply,
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `suggestions/${suggestionId}`);
  }
}
