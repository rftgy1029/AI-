import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SuggestionItem, SuggestionComment } from '../types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.resolve(__dirname, '../../data/suggestions.json');

// Memory cache + File persistence
let memorySuggestions: SuggestionItem[] = [];
let isLoaded = false;

function loadFromFile(): SuggestionItem[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      if (raw.trim()) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    }
  } catch (err) {
    console.error('[SuggestionStore] Failed to read suggestions file:', err);
  }
  return [];
}

function saveToFile(items: SuggestionItem[]): void {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2), 'utf-8');
  } catch (err) {
    console.error('[SuggestionStore] Failed to write suggestions file:', err);
  }
}

function ensureLoaded(): void {
  if (!isLoaded) {
    memorySuggestions = loadFromFile();
    isLoaded = true;
  }
}

export function getAllSuggestions(): SuggestionItem[] {
  ensureLoaded();
  return [...memorySuggestions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function insertSuggestion(item: SuggestionItem): SuggestionItem {
  ensureLoaded();
  // Remove if duplicate exists
  memorySuggestions = memorySuggestions.filter((s) => s.id !== item.id);
  memorySuggestions.unshift(item);
  saveToFile(memorySuggestions);
  return item;
}

export function toggleSuggestionLike(
  id: string,
  currentlyLiked: boolean
): { success: boolean; newCount: number } {
  ensureLoaded();
  const target = memorySuggestions.find((s) => s.id === id);
  if (!target) {
    return { success: false, newCount: 0 };
  }
  const newCount = currentlyLiked ? Math.max(0, target.likeCount - 1) : target.likeCount + 1;
  target.likeCount = newCount;
  saveToFile(memorySuggestions);
  return { success: true, newCount };
}

export function addCommentToSuggestion(
  id: string,
  comment: SuggestionComment
): SuggestionItem | null {
  ensureLoaded();
  const target = memorySuggestions.find((s) => s.id === id);
  if (!target) return null;

  if (!target.comments) target.comments = [];
  target.comments.push(comment);
  saveToFile(memorySuggestions);
  return target;
}

export function addReplyToSuggestion(
  id: string,
  reply: { author: string; content: string; date: string },
  status: '검토중' | '답변완료' = '답변완료'
): SuggestionItem | null {
  ensureLoaded();
  const target = memorySuggestions.find((s) => s.id === id);
  if (!target) return null;

  target.status = status;
  target.reply = reply;
  saveToFile(memorySuggestions);
  return target;
}

export function deleteSuggestionItem(
  id: string,
  pin: string
): { success: boolean; message: string } {
  ensureLoaded();
  const target = memorySuggestions.find((s) => s.id === id);
  if (!target) {
    return { success: false, message: '해당 게시글을 찾을 수 없습니다.' };
  }

  const expectedPin = target.passwordHash;
  const isAdminPasskey = pin === 'sdjhsadminlogin';
  const isMatchingPin = !!(expectedPin && expectedPin === pin);

  if (!isAdminPasskey && !isMatchingPin) {
    return { success: false, message: '비밀번호(PIN)가 일치하지 않습니다.' };
  }

  memorySuggestions = memorySuggestions.filter((s) => s.id !== id);
  saveToFile(memorySuggestions);
  return { success: true, message: '게시글이 삭제되었습니다.' };
}
