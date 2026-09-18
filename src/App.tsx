import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import HomeDashboard from './components/HomeDashboard';
import MealSection from './components/MealSection';
import TimetableSection from './components/TimetableSection';
import ScheduleSection from './components/ScheduleSection';
import SuggestionBoardSection from './components/SuggestionBoardSection';
import { ClassChangeModal } from './components/ClassChangeModal';
import PasskeyAuthModal from './components/PasskeyAuthModal';
import AddScheduleModal from './components/AddScheduleModal';
import { Fingerprint, ShieldCheck, LogOut } from 'lucide-react';
import { isCurrentAdminSession, setAdminSession } from './services/passkeyService';
import {
  saveCustomAcademicEvent,
  deleteCustomAcademicEvent,
  mergeWithCustomEvents,
} from './services/customScheduleService';

import {
  fetchSeodaejeonMeals,
  fetchSeodaejeonTimetable,
  fetchSeodaejeonSchedule,
  getOfficialSeodaejeonTimetable,
  findTodayOrClosestMeal,
  getKSTDateString,
  OFFICIAL_SCHOOL_INFO,
} from './services/neisService';

import {
  subscribeToSuggestions,
  createSuggestion,
  toggleSuggestionLike,
  deleteSuggestion,
  addCommentToSuggestion,
  postOfficialReply,
  getLocalSuggestions,
} from './services/firebaseService';

import {
  UserProfile,
  MealItem,
  TimetableDay,
  AcademicEvent,
  SuggestionItem,
} from './types';

const DEFAULT_USER: UserProfile = {
  id: 'student-user',
  name: '서대전고 학생',
  role: 'student',
  grade: 2,
  classNum: 1,
  studentNumber: 1,
  badge: '서대전고 학생',
  department: '서대전고등학교 2학년 1반',
};

export default function App() {
  // 1. Current User State (Grade & Class for NEIS timetable lookup)
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('seodaejeon_portal_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // 이전 기본값이 2학년 3반이었던 경우 사용자의 컴시간 2학년 1반으로 기본 전환
        if (parsed.grade === 2 && parsed.classNum === 3) {
          parsed.classNum = 1;
          parsed.department = '서대전고등학교 2학년 1반';
        }
        return parsed;
      } catch (e) {
        console.error('Failed to parse saved user:', e);
      }
    }
    return DEFAULT_USER;
  });

  // 2. Active Tab
  const [activeTab, setActiveTab] = useState<string>('home');

  // 3. Modals & Admin State
  const [isClassChangeOpen, setIsClassChangeOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => isCurrentAdminSession());
  const [isPasskeyModalOpen, setIsPasskeyModalOpen] = useState(false);
  const [isAddScheduleOpen, setIsAddScheduleOpen] = useState(false);

  // 4. NEIS API Live Data State
  const [isNeisSyncing, setIsNeisSyncing] = useState(false);
  const [lastNeisSync, setLastNeisSync] = useState<string>('');
  const [meals, setMeals] = useState<MealItem[]>([]);
  const [timetable, setTimetable] = useState<Record<string, TimetableDay[]>>(() =>
    getOfficialSeodaejeonTimetable(currentUser.grade || 2, currentUser.classNum || 1)
  );
  const [events, setEvents] = useState<AcademicEvent[]>(() => mergeWithCustomEvents([]));

  const handlePasskeySuccess = () => {
    setIsAdmin(true);
    setAdminSession(true);
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setAdminSession(false);
  };

  const handleAddSchedule = (data: Omit<AcademicEvent, 'id' | 'dDay'>) => {
    saveCustomAcademicEvent(data);
    setEvents((prev) => mergeWithCustomEvents(prev));
  };

  const handleDeleteSchedule = (id: string) => {
    deleteCustomAcademicEvent(id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  // 5. Real-Name Suggestion Board State
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>(() => getLocalSuggestions());

  // Subscribe to real-time suggestions updates (Firestore + Local fallback)
  useEffect(() => {
    const unsub = subscribeToSuggestions((updated) => {
      setSuggestions(updated);
    });
    return () => unsub();
  }, []);

  const handleCreateSuggestion = async (data: Omit<SuggestionItem, 'id'>) => {
    const newItem = await createSuggestion(data);
    setSuggestions((prev) => {
      const exists = prev.some((s) => s.id === newItem.id);
      if (exists) return prev;
      return [newItem, ...prev];
    });
  };

  const handleToggleLike = async (id: string, currentlyLiked: boolean) => {
    const newCount = await toggleSuggestionLike(id, currentlyLiked);
    setSuggestions((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, likeCount: newCount, likedByMe: !currentlyLiked }
          : s
      )
    );
  };

  const handleDeleteSuggestion = async (id: string, pin: string) => {
    const res = await deleteSuggestion(id, pin);
    if (res.success) {
      setSuggestions((prev) => prev.filter((s) => s.id !== id));
    }
    return res;
  };

  const handleAddComment = async (
    suggestionId: string,
    comment: { authorName: string; grade: number; classNum: number; content: string }
  ) => {
    const newComment = await addCommentToSuggestion(suggestionId, comment);
    setSuggestions((prev) =>
      prev.map((s) =>
        s.id === suggestionId
          ? { ...s, comments: [...(s.comments || []), newComment] }
          : s
      )
    );
  };

  const handlePostReply = async (
    suggestionId: string,
    reply: { author: string; content: string; date: string },
    status: '검토중' | '답변완료'
  ) => {
    await postOfficialReply(suggestionId, reply, status);
    setSuggestions((prev) =>
      prev.map((s) =>
        s.id === suggestionId
          ? { ...s, status, reply }
          : s
      )
    );
  };

  // Cleanup any old mock storage keys from previous sessions
  useEffect(() => {
    const oldKeys = [
      'seodaejeon_schoolhub_posts',
      'seodaejeon_schoolhub_songs',
      'seodaejeon_schoolhub_polls',
      'seodaejeon_schoolhub_notices',
      'seodaejeon_schoolhub_meals',
      'seodaejeon_schoolhub_timetable',
      'seodaejeon_schoolhub_ddays',
      'schoolhub_user',
      'seodaejeon_realname_suggestions',
    ];
    oldKeys.forEach((k) => localStorage.removeItem(k));
  }, []);

  // Save current user settings to localStorage
  useEffect(() => {
    localStorage.setItem('seodaejeon_portal_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // NEIS API Live Data Fetching
  const syncNeisData = useCallback(async () => {
    setIsNeisSyncing(true);
    try {
      const now = new Date();
      const [fetchedMeals, fetchedTimetable, fetchedSchedule] = await Promise.all([
        fetchSeodaejeonMeals(now),
        fetchSeodaejeonTimetable(currentUser.grade, currentUser.classNum, now),
        fetchSeodaejeonSchedule(now),
      ]);

      if (fetchedMeals && fetchedMeals.length > 0) {
        setMeals(fetchedMeals);
      }

      if (fetchedTimetable && Object.keys(fetchedTimetable).length > 0) {
        setTimetable((prev) => ({
          ...prev,
          ...fetchedTimetable,
        }));
      }

      if (fetchedSchedule && fetchedSchedule.length > 0) {
        setEvents(mergeWithCustomEvents(fetchedSchedule));
      } else {
        setEvents(mergeWithCustomEvents([]));
      }

      setLastNeisSync(
        `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
      );
    } catch (err) {
      console.error('NEIS sync failed:', err);
    } finally {
      setIsNeisSyncing(false);
    }
  }, [currentUser.grade, currentUser.classNum]);

  // Initial fetch on mount & whenever grade/class changes
  useEffect(() => {
    syncNeisData();
  }, [syncNeisData]);

  // Handle changing grade and class
  const handleChangeClass = (grade: number, classNum: number, studentNumber?: number) => {
    setCurrentUser((prev) => ({
      ...prev,
      grade,
      classNum,
      studentNumber: studentNumber || prev.studentNumber,
      department: `서대전고등학교 ${grade}학년 ${classNum}반`,
    }));
    // 즉각적인 시간표 전환 (빈 화면 방지)
    setTimetable((prev) => ({
      ...prev,
      ...getOfficialSeodaejeonTimetable(grade, classNum),
    }));
  };

  const activeMeal = findTodayOrClosestMeal(meals);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7] text-slate-900 selection:bg-indigo-600 selection:text-white font-sans">
      {/* Top Fixed Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenClassChange={() => setIsClassChangeOpen(true)}
      />

      {/* Main Content Area - with mobile bottom bar padding */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 py-4 sm:py-8 pb-24 md:pb-8">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            >
              <HomeDashboard
                currentUser={currentUser}
                activeMeal={activeMeal}
                timetable={timetable}
                events={events}
                onNavigate={(tab) => setActiveTab(tab)}
                onOpenClassChange={() => setIsClassChangeOpen(true)}
              />
            </motion.div>
          )}

          {activeTab === 'meal' && (
            <motion.div
              key="meal"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            >
              <MealSection
                meals={meals}
                currentUser={currentUser}
                isNeisSyncing={isNeisSyncing}
                lastSyncTime={lastNeisSync}
                onRefreshNeis={syncNeisData}
              />
            </motion.div>
          )}

          {activeTab === 'timetable' && (
            <motion.div
              key="timetable"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            >
              <TimetableSection
                timetable={timetable}
                currentUser={currentUser}
                onChangeClass={handleChangeClass}
                isNeisSyncing={isNeisSyncing}
                onRefreshNeis={syncNeisData}
                lastSyncTime={lastNeisSync}
              />
            </motion.div>
          )}

          {activeTab === 'schedule' && (
            <motion.div
              key="schedule"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            >
              <ScheduleSection
                events={events}
                isNeisSyncing={isNeisSyncing}
                isAdmin={isAdmin}
                onOpenAddSchedule={() => setIsAddScheduleOpen(true)}
                onDeleteSchedule={handleDeleteSchedule}
              />
            </motion.div>
          )}

          {activeTab === 'board' && (
            <motion.div
              key="board"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            >
              <SuggestionBoardSection
                suggestions={suggestions}
                currentUser={currentUser}
                isAdmin={isAdmin}
                onCreateSuggestion={handleCreateSuggestion}
                onToggleLike={handleToggleLike}
                onDeleteSuggestion={handleDeleteSuggestion}
                onAddComment={handleAddComment}
                onPostReply={handlePostReply}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global Class Selector Modal */}
      <ClassChangeModal
        isOpen={isClassChangeOpen}
        onClose={() => setIsClassChangeOpen(false)}
        currentUser={currentUser}
        onChangeClass={handleChangeClass}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-black/[0.06] bg-white text-slate-500 text-xs py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left space-y-1">
            <p className="font-bold text-slate-900">
              {OFFICIAL_SCHOOL_INFO.name} ({OFFICIAL_SCHOOL_INFO.engName})
            </p>
            <p className="text-[11px] text-slate-400">
              {OFFICIAL_SCHOOL_INFO.address} · 대표전화: {OFFICIAL_SCHOOL_INFO.tel} · 팩스: {OFFICIAL_SCHOOL_INFO.fax}
            </p>
            <p className="text-[11px] text-slate-400">
              관할: {OFFICIAL_SCHOOL_INFO.officeOfEdu} | NEIS 학교코드: {OFFICIAL_SCHOOL_INFO.schoolCode}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 sm:gap-4 text-xs font-semibold">
            <a
              href={OFFICIAL_SCHOOL_INFO.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-indigo-600 transition"
            >
              공식 홈페이지
            </a>

            {/* Discreet Admin Passkey Trigger right next to official homepage */}
            {isAdmin ? (
              <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200/80 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="font-bold">관리자 모드</span>
                <button
                  type="button"
                  onClick={handleAdminLogout}
                  className="text-slate-400 hover:text-rose-600 ml-1 transition cursor-pointer"
                  title="관리자 로그아웃"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsPasskeyModalOpen(true)}
                className="text-slate-400 hover:text-slate-600 transition cursor-pointer text-[11px] font-medium flex items-center gap-1 opacity-70 hover:opacity-100"
                title="교무·학사 관리자 전용"
              >
                <Fingerprint className="w-3 h-3 text-slate-400 shrink-0" />
                <span>패스키 로그인(관리자)</span>
              </button>
            )}

            <span className="text-slate-300">|</span>
            <span className="text-slate-400">교육부 NEIS 공공데이터 API 연동</span>
          </div>
        </div>
      </footer>

      {/* Admin Passkey Authentication Modal */}
      <PasskeyAuthModal
        isOpen={isPasskeyModalOpen}
        onClose={() => setIsPasskeyModalOpen(false)}
        onSuccess={handlePasskeySuccess}
      />

      {/* Admin Add Academic Schedule Modal */}
      <AddScheduleModal
        isOpen={isAddScheduleOpen}
        onClose={() => setIsAddScheduleOpen(false)}
        onAddSchedule={handleAddSchedule}
      />
    </div>
  );
}
