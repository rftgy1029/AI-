import { useState, useEffect, useMemo } from 'react';
import {
  Utensils,
  AlertCircle,
  RefreshCw,
  Flame,
  Moon,
  Sun,
  Sparkles,
  Info,
} from 'lucide-react';
import { motion } from 'motion/react';
import { MealItem, UserProfile } from '../types';
import {
  getKSTDateString,
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
  const [mealType, setMealType] = useState<'lunch' | 'dinner'>('lunch');

  useEffect(() => {
    const timer = setInterval(() => {
      setMealStatus(getMealStatusInfo(new Date()));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const todayKst = getKSTDateString();

  // 고유한 월~금 날짜 목록 추출
  const uniqueDates = useMemo(() => {
    const list: { date: string; dayOfWeek: string }[] = [];
    meals.forEach((m) => {
      if (!list.some((item) => item.date === m.date)) {
        list.push({ date: m.date, dayOfWeek: m.dayOfWeek });
      }
    });
    return list;
  }, [meals]);

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const hasToday = meals.some((m) => m.date === todayKst);
    if (hasToday) return todayKst;
    return meals[0]?.date || todayKst;
  });

  // meals 업데이트 시 오늘 또는 첫 번째 날짜로 동기화
  useEffect(() => {
    if (uniqueDates.length > 0 && !uniqueDates.some((d) => d.date === selectedDate)) {
      const hasToday = uniqueDates.some((d) => d.date === todayKst);
      setSelectedDate(hasToday ? todayKst : uniqueDates[0].date);
    }
  }, [uniqueDates, todayKst, selectedDate]);

  // 선택된 날짜와 식사 구분(중식/석식)에 맞는 식단 산출
  const activeMeal = useMemo(() => {
    const exact = meals.find((m) => m.date === selectedDate && m.type === mealType);
    if (exact) return exact;
    // fallback: 해당 일자의 첫 식단
    const sameDate = meals.find((m) => m.date === selectedDate);
    if (sameDate) return sameDate;
    return meals[0] || null;
  }, [meals, selectedDate, mealType]);

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
              <span className="text-xs font-semibold text-orange-700 bg-orange-50 px-3 py-1 rounded-full border border-orange-200/60">
                NEIS 공공데이터 실시간 연동
              </span>

              {mealStatus.isLunchActive ? (
                <span className="text-xs font-bold text-white bg-orange-500 px-3 py-1 rounded-full shadow-2xs animate-pulse flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  현재 점심 배식 진행 중
                </span>
              ) : mealStatus.isBeforeLunch ? (
                <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60">
                  점심시간까지 {mealStatus.timeUntilLunch} 남음 (12:10)
                </span>
              ) : (
                <span className="text-xs font-semibold text-slate-600 bg-[#F5F5F7] px-3 py-1 rounded-full border border-black/[0.03]">
                  오늘 중식 종료 (석식 이용 가능)
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              서대전고등학교 공식 급식 식단표
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              중식 및 석식 영양 식단, 열량(Kcal), 식재료 원산지 및 알레르기 유발 식품 정보를 실시간으로 안내합니다.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {lastSyncTime && (
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                최근 동기화: {lastSyncTime}
              </span>
            )}

            {onRefreshNeis && (
              <button
                type="button"
                onClick={onRefreshNeis}
                disabled={isNeisSyncing}
                className="px-5 py-2.5 rounded-full text-sm font-bold bg-[#F5F5F7] hover:bg-slate-200/80 active:scale-95 text-slate-800 transition flex items-center gap-2 cursor-pointer disabled:opacity-50 border border-black/[0.04]"
              >
                <RefreshCw className={`w-4 h-4 ${isNeisSyncing ? 'animate-spin' : ''}`} />
                <span>{isNeisSyncing ? '동기화 중...' : '식단 새로고침'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Meal Type Toggle (중식 vs 석식) - Bold, High-Visibility Buttons */}
        <div className="mt-6 pt-5 border-t border-black/[0.04]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <span className="text-xs sm:text-sm font-bold text-slate-500">
              식사 종류 선택
            </span>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              석식 버튼을 누르면 서대전고 야간 자율학습 석식 식단표가 표시됩니다.
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 max-w-md">
            <button
              type="button"
              onClick={() => setMealType('lunch')}
              className={`py-3 px-5 rounded-2xl text-sm sm:text-base font-bold transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-95 border ${
                mealType === 'lunch'
                  ? 'bg-orange-500 text-white border-orange-600 shadow-sm ring-2 ring-orange-500/20'
                  : 'bg-[#F5F5F7] hover:bg-slate-200 text-slate-700 border-black/[0.03]'
              }`}
            >
              <Sun className="w-5 h-5" />
              <span>중식 (점심)</span>
            </button>

            <button
              type="button"
              onClick={() => setMealType('dinner')}
              className={`py-3 px-5 rounded-2xl text-sm sm:text-base font-bold transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-95 border ${
                mealType === 'dinner'
                  ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm ring-2 ring-indigo-600/20'
                  : 'bg-[#F5F5F7] hover:bg-slate-200 text-slate-700 border-black/[0.03]'
              }`}
            >
              <Moon className="w-5 h-5" />
              <span>석식 (저녁)</span>
            </button>
          </div>
        </div>

        {/* Weekly Day Selector Tabs - larger, high readability buttons */}
        {uniqueDates.length > 0 && (
          <div className="mt-5 pt-5 border-t border-black/[0.04]">
            <div className="grid grid-cols-5 gap-2 sm:gap-3">
              {uniqueDates.map((item) => {
                const isSelected = item.date === selectedDate;
                const isToday = item.date === todayKst;

                return (
                  <button
                    key={item.date}
                    type="button"
                    onClick={() => setSelectedDate(item.date)}
                    className={`py-3 px-2 sm:py-3.5 sm:px-4 rounded-2xl text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 border select-none active:scale-95 ${
                      isSelected
                        ? 'bg-black text-white border-black shadow-sm'
                        : 'bg-[#F5F5F7] hover:bg-slate-200/80 border-black/[0.02] text-slate-800'
                    }`}
                  >
                    <span className="text-sm sm:text-base font-bold">
                      {item.dayOfWeek}요일
                    </span>
                    <span
                      className={`text-xs sm:text-sm font-medium ${
                        isSelected ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      {item.date.slice(5)}
                    </span>
                    {isToday && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-black mt-0.5 ${
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
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full border ${
                        activeMeal.type === 'dinner'
                          ? 'text-indigo-800 bg-indigo-50 border-indigo-200'
                          : 'text-orange-800 bg-orange-50 border-orange-200'
                      }`}
                    >
                      {activeMeal.type === 'dinner' ? '석식 (저녁)' : '중식 (점심)'}
                    </span>
                    <span className="text-xs sm:text-sm text-slate-500 font-medium">
                      {activeMeal.date === todayKst ? '오늘의 식단' : `${activeMeal.dayOfWeek}요일`}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1.5 tracking-tight">
                    {activeMeal.date} ({activeMeal.dayOfWeek}요일) {activeMeal.type === 'dinner' ? '석식' : '중식'} 식단
                  </h3>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-2 text-sm text-slate-700 bg-[#F5F5F7] px-4 py-2 rounded-full border border-black/[0.04]">
                    <Flame className="w-4 h-4 text-rose-500" />
                    <span className="font-bold text-slate-900">{activeMeal.calories}</span> kcal
                  </div>
                </div>
              </div>

              {/* Menu Dishes Grid */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">
                  제공 메뉴 목록 ({activeMeal.type === 'dinner' ? '석식' : '중식'})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  {activeMeal.menu.map((dish, i) => (
                    <div
                      key={i}
                      className="p-3.5 sm:p-4 rounded-2xl bg-[#F5F5F7] border border-black/[0.02] flex items-center gap-3 text-sm sm:text-base font-semibold text-slate-900 hover:bg-orange-50/40 transition"
                    >
                      <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-white border border-black/[0.06] text-slate-500 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
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
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2 sm:mb-3">
                    식재료 원산지 표기
                  </h4>
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-[#F5F5F7] text-xs sm:text-sm text-slate-700 leading-relaxed border border-black/[0.02] grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeMeal.originInfo.map((orig, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                        <span className="truncate font-medium">{orig}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Allergy Warning */}
              <div className="pt-4 sm:pt-5 border-t border-black/[0.04]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 text-slate-700">
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="font-semibold truncate">
                      알레르기 정보: {activeMeal.allergies.length > 0 ? activeMeal.allergies.join(', ') : '해당 없음'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAllergyTable(!showAllergyTable)}
                    className="text-indigo-600 hover:text-indigo-800 font-bold cursor-pointer text-left sm:text-right shrink-0"
                  >
                    {showAllergyTable ? '기준표 닫기' : '19대 알레르기 번호 기준표'}
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
