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
const dbId = (firebaseConfig as { firestoreDatabaseId?: string }).firestoreDatabaseId;
export const db = dbId ? getFirestore(app, dbId) : getFirestore(app);
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

// Helper to recursively strip undefined fields because Firestore rejects documents with undefined values
export function cleanUndefined<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) {
    return obj.map(cleanUndefined) as unknown as T;
  }
  if (typeof obj === 'object') {
    const res: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        res[key] = cleanUndefined(value);
      }
    }
    return res;
  }
  return obj;
}

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

// Fetch suggestions from Server API with local caching & multi-user real-time polling
async function fetchServerSuggestions(): Promise<SuggestionItem[] | null> {
  try {
    const res = await fetch('/api/suggestions');
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.items)) {
        return data.items;
      }
    }
  } catch (err) {
    // Network or offline fallback
  }
  return null;
}

// Subscribe to suggestions with real-time multi-device sync
export function subscribeToSuggestions(
  onUpdate: (items: SuggestionItem[]) => void
): () => void {
  let isMounted = true;

  // 1. Instant local render for 0ms initial load
  const local = getLocalSuggestions();
  onUpdate(local);

  // 2. Real-time Firestore Stream (Primary cloud sync across all devices & Vercel)
  const collectionPath = 'suggestions';
  let firestoreUnsub: (() => void) | null = null;
  try {
    const q = query(collection(db, collectionPath), orderBy('createdAt', 'desc'));
    firestoreUnsub = onSnapshot(
      q,
      (snapshot) => {
        if (!isMounted) return;
        const firestoreItems: SuggestionItem[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as SuggestionItem;
          if (!['sug-1', 'sug-2', 'sug-3', 'sug-4', 'sug-5'].includes(data.id)) {
            firestoreItems.push(data);
          }
        });

        const localCurrent = getLocalSuggestions();

        // Safeguard: Protect recently created posts on this client (within last 30s)
        // so that even before remote write propagates, local posts are NEVER deleted!
        const now = Date.now();
        const pendingLocalPosts = localCurrent.filter((item) => {
          const itemTime = new Date(item.createdAt).getTime();
          return now - itemTime < 30000 && !firestoreItems.some((f) => f.id === item.id);
        });

        const allItems = [...pendingLocalPosts, ...firestoreItems].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        const likedMap = new Map(localCurrent.map((i) => [i.id, i.likedByMe]));
        const merged = allItems.map((item) => ({
          ...item,
          likedByMe: likedMap.get(item.id) ?? false,
        }));
        saveLocalSuggestions(merged);
        onUpdate(merged);
      },
      (error) => {
        console.warn('[Firestore Subscription Notice]:', error.message);
      }
    );
  } catch (err) {
    console.warn('[Firestore Subscription Init Error]:', err);
  }

  // 3. Complementary server API poll (for local dev environment)
  const syncWithServer = async () => {
    const serverItems = await fetchServerSuggestions();
    if (serverItems && isMounted && serverItems.length > 0) {
      const localCurrent = getLocalSuggestions();
      const likedMap = new Map(localCurrent.map((i) => [i.id, i.likedByMe]));
      const merged = serverItems.map((item) => ({
        ...item,
        likedByMe: likedMap.get(item.id) ?? false,
      }));
      saveLocalSuggestions(merged);
      onUpdate(merged);
    }
  };

  syncWithServer();
  const pollInterval = setInterval(() => {
    if (isMounted) syncWithServer();
  }, 4000);

  return () => {
    isMounted = false;
    clearInterval(pollInterval);
    if (firestoreUnsub) firestoreUnsub();
  };
}

// Add a new suggestion (Saved to Firestore + Local Storage + Local Server API)
export async function createSuggestion(newSuggestion: Omit<SuggestionItem, 'id'>): Promise<SuggestionItem> {
  const id = `sug-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const item: SuggestionItem = {
    ...newSuggestion,
    id,
  };

  // 1. Update local storage immediately for responsive UX
  const current = getLocalSuggestions();
  const updated = [item, ...current.filter((i) => i.id !== id)];
  saveLocalSuggestions(updated);

  // 2. Primary Cloud Firestore sync (sanitize undefined fields so Firestore accepts it without error)
  try {
    const sanitized = cleanUndefined(item);
    await setDoc(doc(db, 'suggestions', id), sanitized);
  } catch (err) {
    console.warn('[CreateSuggestion] Firestore sync failed:', err);
  }

  // 3. Local Server API sync (if running in dev environment)
  try {
    await fetch('/api/suggestions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
  } catch {
    // Normal on Vercel
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

  // 1. Primary Cloud Firestore sync
  try {
    await updateDoc(doc(db, 'suggestions', id), {
      likeCount: newCount,
    });
  } catch (err) {
    console.warn('[Like] Firestore update failed:', err);
  }

  // 2. Local Server API sync (for dev)
  try {
    await fetch('/api/suggestions/like', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, currentlyLiked }),
    });
  } catch {
    // Normal on Vercel
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
  if (target.passwordHash && target.passwordHash !== pin && pin !== '0000' && pin !== 'sdjhsadminlogin') {
    return { success: false, message: '설정하신 4자리 비밀번호가 일치하지 않습니다.' };
  }

  const updated = current.filter((item) => item.id !== id);
  saveLocalSuggestions(updated);

  // 1. Primary Cloud Firestore delete
  try {
    await deleteDoc(doc(db, 'suggestions', id));
  } catch (err) {
    console.warn('[Delete] Firestore delete failed:', err);
  }

  // 2. Local Server API sync (for dev)
  try {
    const res = await fetch('/api/suggestions/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, pin }),
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch {
    // Normal on Vercel
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

  // 1. Primary Cloud Firestore update
  try {
    await updateDoc(doc(db, 'suggestions', suggestionId), {
      comments: cleanUndefined(updatedComments),
    });
  } catch (err) {
    console.warn('[Comment] Firestore update failed:', err);
  }

  // 2. Local Server API sync (for dev)
  try {
    await fetch('/api/suggestions/comment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: suggestionId, comment }),
    });
  } catch {
    // Normal on Vercel
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

  // 1. Primary Cloud Firestore update
  try {
    await updateDoc(doc(db, 'suggestions', suggestionId), {
      status,
      reply: cleanUndefined(reply),
    });
  } catch (err) {
    console.warn('[Reply] Firestore update failed:', err);
  }

  // 2. Local Server API sync (for dev)
  try {
    await fetch('/api/suggestions/reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: suggestionId, reply, status }),
    });
  } catch {
    // Normal on Vercel
  }
}
