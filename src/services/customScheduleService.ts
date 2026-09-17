import { AcademicEvent } from '../types';
import { getKSTDate, getKSTDateString } from './neisService';

const STORAGE_KEY = 'seodaejeon_custom_academic_events';

export function getCustomAcademicEvents(): AcademicEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const events: AcademicEvent[] = JSON.parse(raw);
    return recalculateDDays(events);
  } catch (err) {
    console.error('Failed to parse custom events', err);
    return [];
  }
}

export function saveCustomAcademicEvent(
  data: Omit<AcademicEvent, 'id' | 'dDay'>
): AcademicEvent {
  const currentList = getCustomAcademicEvents();
  const kstNow = getKSTDate(new Date());
  const todayTime = new Date(kstNow).setHours(0, 0, 0, 0);

  const [y, m, d] = data.date.split('-').map(Number);
  const eventTime = new Date(y, m - 1, d).getTime();
  const dDay = Math.ceil((eventTime - todayTime) / (1000 * 60 * 60 * 24));

  const newEvent: AcademicEvent = {
    id: `custom-event-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title: data.title.trim(),
    date: data.date,
    category: data.category,
    description: data.description?.trim() || '교무실 관리자 등록 학사일정',
    dDay,
    typeLabel: data.typeLabel || '교무학사',
    highlight: data.highlight ?? (dDay >= 0 && dDay <= 14),
    isCustom: true,
    createdBy: '교무실 관리자',
  };

  const updatedList = [newEvent, ...currentList].sort((a, b) => a.date.localeCompare(b.date));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));

  return newEvent;
}

export function deleteCustomAcademicEvent(id: string): boolean {
  try {
    const currentList = getCustomAcademicEvents();
    const filtered = currentList.filter((e) => e.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (err) {
    console.error('Failed to delete custom event', err);
    return false;
  }
}

export function recalculateDDays(events: AcademicEvent[]): AcademicEvent[] {
  const kstNow = getKSTDate(new Date());
  const todayTime = new Date(kstNow).setHours(0, 0, 0, 0);

  return events.map((evt) => {
    try {
      const [y, m, d] = evt.date.split('-').map(Number);
      const eventTime = new Date(y, m - 1, d).getTime();
      const dDay = Math.ceil((eventTime - todayTime) / (1000 * 60 * 60 * 24));
      return {
        ...evt,
        dDay,
      };
    } catch {
      return evt;
    }
  });
}

export function mergeWithCustomEvents(neisEvents: AcademicEvent[]): AcademicEvent[] {
  const customEvents = getCustomAcademicEvents();
  // Filter out any NEIS duplicates if a custom event exists with the same date and title
  const customKeys = new Set(customEvents.map((c) => `${c.date}_${c.title.replace(/\s+/g, '')}`));

  const filteredNeis = neisEvents.filter(
    (ne) => !customKeys.has(`${ne.date}_${ne.title.replace(/\s+/g, '')}`)
  );

  const combined = [...customEvents, ...filteredNeis];
  return recalculateDDays(combined).sort((a, b) => a.date.localeCompare(b.date));
}
