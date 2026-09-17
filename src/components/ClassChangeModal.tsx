import React, { useState } from 'react';
import {
  X,
  GraduationCap,
  Check,
  Users,
} from 'lucide-react';
import { UserProfile } from '../types';

interface ClassChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onChangeClass: (grade: number, classNum: number, studentNumber?: number) => void;
}

export const ClassChangeModal: React.FC<ClassChangeModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onChangeClass,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<number>(currentUser.grade || 2);
  const [selectedClass, setSelectedClass] = useState<number>(currentUser.classNum || 3);
  const [selectedNumber, setSelectedNumber] = useState<number>(currentUser.studentNumber || 14);

  if (!isOpen) return null;

  const grades = [
    { grade: 1, label: '1학년', desc: '1학년 정규 과정' },
    { grade: 2, label: '2학년', desc: '2학년 정규 과정' },
    { grade: 3, label: '3학년', desc: '3학년 입시 과정' },
  ];

  const classList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const handleApply = () => {
    onChangeClass(selectedGrade, selectedClass, selectedNumber);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-t-[28px] sm:rounded-[28px] max-w-md w-full max-h-[90vh] shadow-2xl border border-black/[0.06] overflow-hidden flex flex-col pb-safe"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile handle indicator */}
        <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mt-3 sm:hidden" />

        {/* Header */}
        <div className="p-5 sm:p-6 pb-3 sm:pb-4 border-b border-black/[0.04] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">학년 및 학급 선택</h3>
              <p className="text-xs text-slate-400 font-medium">NEIS 시간표를 조회할 학년과 반을 선택하세요</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto">
          {/* Grade selection */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-2">
              학년 선택
            </label>
            <div className="grid grid-cols-3 gap-2">
              {grades.map((g) => (
                <button
                  key={g.grade}
                  type="button"
                  onClick={() => setSelectedGrade(g.grade)}
                  className={`p-2.5 sm:p-3 rounded-2xl border text-center transition cursor-pointer active:scale-95 ${
                    selectedGrade === g.grade
                      ? 'bg-black text-white border-black shadow-sm'
                      : 'bg-[#F5F5F7] border-black/[0.02] text-slate-700 hover:bg-slate-200/80'
                  }`}
                >
                  <span className="text-sm font-bold block">{g.label}</span>
                  <span className={`text-[10px] block mt-0.5 ${selectedGrade === g.grade ? 'text-slate-300' : 'text-slate-400'}`}>
                    {g.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Class selection */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-2">
              학급(반) 선택
            </label>
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
              {classList.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedClass(c)}
                  className={`py-2 sm:py-2.5 rounded-xl border text-center font-bold text-xs transition cursor-pointer active:scale-95 ${
                    selectedClass === c
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                      : 'bg-[#F5F5F7] border-black/[0.02] text-slate-700 hover:bg-slate-200/80'
                  }`}
                >
                  {c}반
                </button>
              ))}
            </div>
          </div>

          {/* Current Selection Summary */}
          <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between text-xs">
            <span className="text-indigo-900 font-medium">선택된 학급</span>
            <span className="font-bold text-indigo-700 text-sm">
              서대전고 {selectedGrade}학년 {selectedClass}반
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 sm:p-6 pt-3 border-t border-black/[0.04] flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold bg-black text-white hover:bg-slate-800 transition cursor-pointer shadow-sm flex items-center justify-center gap-1.5 active:scale-95"
          >
            <Check className="w-3.5 h-3.5" />
            <span>시간표 적용하기</span>
          </button>
        </div>
      </div>
    </div>
  );
};
