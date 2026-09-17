import { useState, useEffect } from 'react';
import {
  Utensils,
  AlertCircle,
  RefreshCw,
  Flame,
  Check,
  Clock,
  ChevronRight,
  Info,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MealItem, UserProfile } from '../types';
import {
  getKSTDate,
  getKSTDateString,
  getKSTDayOfWeek,
  getMealStatusInfo,
  MealStatusInfo,
} from '../utils/datetime';
import { ALLERGY_MAP } from '../services/neisService';

interface MealSectionProps {
  meals: MealItem[];
  currentUser: UserProfile;
  isNeisSyncing?: boolean;
  lastSyncTime?: string;
  onRefreshNeis?: () => void;
}

export default function MealSection({
  meals,
  currentUser,
  isNeisSyncing,
  lastSyncTime,
  onRefreshNeis,
}: MealSectionProps) {
  const [mealStatus, setMealStatus] = useState<MealStatusInfo>(() => getMealStatusInfo());
  const [showAllergyTable, setShowAllergyTable] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setMealStatus(getMealStatusInfo(new Date()));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const todayKst = getKSTDateString();

  const getInitialIndex = () => {
    const idx = meals.findIndex((m) => m.date === todayKst);
    return idx >= 0 ? idx : 0;
  };

  const [selectedMealIndex, setSelectedMealIndex] = useState<number>(getInitialIndex);

  // Sync index when meals array updates
  useEffect(() => {
    const idx = meals.findIndex((m) => m.date === todayKst);
    if (idx >= 0) setSelectedMealIndex(idx);
  }, [meals, todayKst]);

  const activeMeal = meals[selectedMealIndex] || meals[0];

  return (
    <div className="space-y-6">
      {/* Top Banner with Real-time Clock & Status */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[28px] p-6 sm:p-8 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-orange-700 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200/60">
                NEIS 공공데이터 실시간 연동
              </span>

              {mealStatus.isLunchActive ? (
                <span className="text-xs font-bold text-white bg-orange-500 px-2.5 py-0.5 rounded-full shadow-2xs animate-pulse flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  현재 급식 배식 중
                </span>
              ) : mealStatus.isBeforeLunch ? (
                <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60">
                  {mealStatus.timeUntilLunch} 후 배식 시작
                </span>
              ) : (
                <span className="text-xs font-semibold text-slate-600 bg-[#F5F5F7] px-2.5 py-0.5 rounded-full border border-black/[0.03]">
                  오늘 중식 배식 종료
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              서대전고등학교 공식 급식 식단표
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              교육부 NEIS에서 실시간 전송받은 영양 식단, 열량(Kcal), 원산지 및 알레르기 유발 식품 정보입니다.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {lastSyncTime && (
              <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                최근 동기화: {lastSyncTime}
              </span>
            )}

            {onRefreshNeis && (
              <button
                type="button"
                onClick={onRefreshNeis}
                disabled={isNeisSyncing}
                className="px-4 py-2 rounded-full text-xs font-semibold bg-[#F5F5F7] hover:bg-slate-200/80 text-slate-700 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isNeisSyncing ? 'animate-spin' : ''}`} />
                <span>{isNeisSyncing ? '동기화 중...' : '식단 새로고침'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Weekly Day Selector Tabs - horizontal scrollable on mobile, comfortable touch targets */}
        {meals.length > 0 && (
          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-black/[0.04]">
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
              {meals.map((m, idx) => {
                const isSelected = idx === selectedMealIndex;
                const isToday = m.date === todayKst;

                return (
                  <button
                    key={m.id || idx}
                    type="button"
                    onClick={() => setSelectedMealIndex(idx)}
                    className={`py-2 px-1 sm:p-3 rounded-xl sm:rounded-2xl text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 sm:gap-1 border select-none active:scale-95 ${
                      isSelected
                        ? 'bg-black text-white border-black shadow-sm'
                        : 'bg-[#F5F5F7] hover:bg-slate-200/70 border-black/[0.02] text-slate-700'
                    }`}
                  >
                    <span className="text-[11px] sm:text-xs font-bold">
                      {m.dayOfWeek}
                    </span>
                    <span className={`text-[10px] sm:text-[11px] font-medium ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                      {m.date.slice(5)}
                    </span>
                    {isToday && (
                      <span
                        className={`text-[8px] sm:text-[9px] px-1 sm:px-1.5 py-0.2 rounded-full font-bold mt-0.5 ${
                          isSelected ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-700'
                        }`}
                      >
                        오늘
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>

      {/* Main Meal Content Display */}
      {activeMeal ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Main Menu Dish List (2 Cols) */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <motion.div
              key={activeMeal.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[24px] sm:rounded-[28px] p-5 sm:p-8 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-5 sm:space-y-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 sm:pb-5 border-b border-black/[0.04]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] sm:text-xs font-bold text-orange-700 bg-orange-50 px-2 sm:px-2.5 py-0.5 rounded-full">
                      {activeMeal.type === 'dinner' ? '석식' : '중식'}
                    </span>
                    <span className="text-[11px] sm:text-xs text-slate-400 font-medium">
                      {activeMeal.date === todayKst ? '오늘의 식단' : `${activeMeal.dayOfWeek}요일`}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1 tracking-tight">
                    {activeMeal.date} ({activeMeal.dayOfWeek}요일) 식단
                  </h3>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-700 bg-[#F5F5F7] px-3 py-1.5 rounded-full border border-black/[0.03]">
                    <Flame className="w-3.5 h-3.5 text-rose-500" />
                    <span className="font-bold text-slate-900">{activeMeal.calories}</span> kcal
                  </div>
                </div>
              </div>

              {/* Menu Dishes Grid */}
              <div>
                <h4 className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wide mb-2.5 sm:mb-3">
                  제공 메뉴 목록
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {activeMeal.menu.map((dish, i) => (
                    <div
                      key={i}
                      className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#F5F5F7] border border-black/[0.02] flex items-center gap-2.5 sm:gap-3 text-xs font-semibold text-slate-900 hover:bg-orange-50/50 transition"
                    >
                      <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg sm:rounded-xl bg-white border border-black/[0.06] text-slate-500 flex items-center justify-center font-bold text-[10px] sm:text-[11px] shrink-0 shadow-2xs">
                        {i + 1}
                      </span>
                      <span className="truncate">{dish}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Origin of Ingredients */}
              {activeMeal.originInfo && activeMeal.originInfo.length > 0 && (
                <div className="pt-4 sm:pt-5 border-t border-black/[0.04]">
                  <h4 className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 sm:mb-3">
                    식재료 원산지 표기
                  </h4>
                  <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#F5F5F7] text-[11px] sm:text-xs text-slate-600 leading-relaxed border border-black/[0.02] grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                    {activeMeal.originInfo.map((orig, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                        <span className="truncate">{orig}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Allergy Warning */}
              <div className="pt-4 sm:pt-5 border-t border-black/[0.04]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] sm:text-xs">
                  <div className="flex items-center gap-2 text-slate-700">
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="font-semibold truncate">
                      알레르기: {activeMeal.allergies.length > 0 ? activeMeal.allergies.join(', ') : '해당 없음'}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowAllergyTable(!showAllergyTable)}
                    className="text-indigo-600 hover:underline font-semibold cursor-pointer text-left sm:text-right shrink-0"
                  >
                    {showAllergyTable ? '번호 기준표 닫기' : '19대 알레르기 번호 기준표'}
                  </button>
                </div>

                {showAllergyTable && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 p-3 sm:p-4 bg-[#F5F5F7] rounded-xl sm:rounded-2xl text-[10px] sm:text-[11px] text-slate-600 border border-black/[0.03] leading-relaxed grid grid-cols-2 sm:grid-cols-4 gap-2"
                  >
                    {Object.entries(ALLERGY_MAP).map(([num, name]) => (
                      <div key={num} className="flex items-center gap-1">
                        <span className="font-bold text-slate-900">{num}.</span>
                        <span>{name}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right: Nutrition Breakdown Bento */}
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-[24px] sm:rounded-[28px] p-5 sm:p-8 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2 pb-2.5 sm:pb-3 border-b border-black/[0.04]">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-slate-900 text-sm">영양 성분 분석표</h3>
              </div>

              {activeMeal.nutritionInfo ? (
                <dl className="space-y-2 text-xs">
                  {activeMeal.nutritionInfo.carbs && (
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <dt className="text-slate-500">탄수화물</dt>
                      <dd className="font-bold text-slate-900">{activeMeal.nutritionInfo.carbs}</dd>
                    </div>
                  )}
                  {activeMeal.nutritionInfo.protein && (
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <dt className="text-slate-500">단백질</dt>
                      <dd className="font-bold text-slate-900">{activeMeal.nutritionInfo.protein}</dd>
                    </div>
                  )}
                  {activeMeal.nutritionInfo.fat && (
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <dt className="text-slate-500">지방</dt>
                      <dd className="font-bold text-slate-900">{activeMeal.nutritionInfo.fat}</dd>
                    </div>
                  )}
                  {activeMeal.nutritionInfo.calcium && (
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <dt className="text-slate-500">칼슘</dt>
                      <dd className="font-bold text-slate-900">{activeMeal.nutritionInfo.calcium}</dd>
                    </div>
                  )}
                  {activeMeal.nutritionInfo.iron && (
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <dt className="text-slate-500">철분</dt>
                      <dd className="font-bold text-slate-900">{activeMeal.nutritionInfo.iron}</dd>
                    </div>
                  )}
                  {activeMeal.nutritionInfo.vitaminA && (
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <dt className="text-slate-500">비타민 A</dt>
                      <dd className="font-bold text-slate-900">{activeMeal.nutritionInfo.vitaminA}</dd>
                    </div>
                  )}
                  {activeMeal.nutritionInfo.vitaminC && (
                    <div className="flex justify-between py-1">
                      <dt className="text-slate-500">비타민 C</dt>
                      <dd className="font-bold text-slate-900">{activeMeal.nutritionInfo.vitaminC}</dd>
                    </div>
                  )}
                </dl>
              ) : (
                <div className="py-6 sm:py-8 text-center text-slate-400 text-xs font-medium">
                  상세 영양성분 정보 준비 중입니다.
                </div>
              )}
            </div>

            {/* School Lunch Guidelines Notice */}
            <div className="p-5 sm:p-6 rounded-[24px] sm:rounded-[28px] bg-[#F5F5F7] border border-black/[0.03] space-y-1.5 sm:space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <Info className="w-4 h-4 text-indigo-600" />
                <span>학교급식 위생 및 영양 관리</span>
              </div>
              <p className="leading-relaxed text-[11px] text-slate-500">
                서대전고등학교 급식실은 교육부 및 대전광역시교육청 학교급식 기본방향에 의거하여 친환경 농산물 및 HACCP 인증 식재료를 사용합니다.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[24px] sm:rounded-[28px] p-8 sm:p-12 border border-black/[0.04] text-center text-slate-400 space-y-2">
          <Utensils className="w-8 h-8 mx-auto text-slate-300" />
          <p className="text-sm font-medium">등록된 급식 식단이 없습니다 (휴업일 또는 미실시).</p>
        </div>
      )}
    </div>
  );
}
