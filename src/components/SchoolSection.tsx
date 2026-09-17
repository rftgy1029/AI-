import {
  GraduationCap,
  MapPin,
  Phone,
  Printer,
  Globe,
  Calendar,
  Building,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Compass,
  TreePine,
  Flower2,
  Bus,
  Train,
} from 'lucide-react';
import { motion } from 'motion/react';
import { OFFICIAL_SCHOOL_INFO, SEODAEJEON_NEIS } from '../services/neisService';

export default function SchoolSection() {
  const school = OFFICIAL_SCHOOL_INFO;

  return (
    <div className="space-y-6">
      {/* Top Overview Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[24px] sm:rounded-[28px] p-5 sm:p-8 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
          <div className="flex items-start gap-3.5 sm:gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 text-indigo-600 shadow-2xs">
              <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="text-[10px] sm:text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200/60">
                  사립 일반계 고등학교
                </span>
                <span className="text-[10px] sm:text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  교육부 NEIS 공인 ({school.schoolCode})
                </span>
              </div>

              <h2 className="text-xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {school.name}
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-400 font-medium">
                {school.engName} · 학교법인 대신학원
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 pt-1 sm:pt-0">
            <a
              href={school.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto justify-center px-4 py-2.5 rounded-2xl sm:rounded-full text-xs font-semibold bg-black text-white hover:bg-slate-800 transition flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <span>공식 홈페이지 바로가기</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </motion.div>

      {/* Grid: School Info Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Card 1: 기본 정보 & NEIS 코드 */}
        <div className="bg-white rounded-[24px] sm:rounded-[28px] p-5 sm:p-6 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-black/[0.04]">
            <Building className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-sm">학교 기본 현황</h3>
          </div>

          <dl className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <dt className="text-slate-400 font-medium">설립일자</dt>
              <dd className="font-semibold text-slate-800">{school.foundDate}</dd>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <dt className="text-slate-400 font-medium">개교기념일</dt>
              <dd className="font-semibold text-slate-800">{school.anniversaryDate}</dd>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <dt className="text-slate-400 font-medium">설립구분</dt>
              <dd className="font-semibold text-slate-800">{school.foundationType}</dd>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <dt className="text-slate-400 font-medium">남녀공학 구분</dt>
              <dd className="font-semibold text-slate-800">{school.coedu}</dd>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <dt className="text-slate-400 font-medium">관할 교육청</dt>
              <dd className="font-semibold text-slate-800">{school.officeOfEdu}</dd>
            </div>
            <div className="flex justify-between py-1">
              <dt className="text-slate-400 font-medium">NEIS 학교코드</dt>
              <dd className="font-semibold font-mono text-indigo-600">{school.schoolCode}</dd>
            </div>
          </dl>
        </div>

        {/* Card 2: 학교 상징 & 교훈 */}
        <div className="bg-white rounded-[28px] p-6 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-black/[0.04]">
            <Compass className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm">학교 상징 및 교육목표</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-[#F5F5F7] border border-black/[0.02]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">교훈</span>
              <p className="font-bold text-slate-900 text-sm mt-0.5">{school.motto}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F5F5F7] border border-black/[0.02] flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <TreePine className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400">교목</span>
                <p className="font-semibold text-slate-800 text-xs">{school.tree}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F5F5F7] border border-black/[0.02] flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <Flower2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400">교화</span>
                <p className="font-semibold text-slate-800 text-xs">{school.flower}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: 연락처 & 위치 */}
        <div className="bg-white rounded-[28px] p-6 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-black/[0.04]">
            <MapPin className="w-4 h-4 text-rose-600" />
            <h3 className="font-bold text-slate-900 text-sm">소재지 및 연락처</h3>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3.5 rounded-2xl bg-[#F5F5F7] border border-black/[0.02] space-y-1">
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>도로명 주소</span>
              </div>
              <p className="font-bold text-slate-900 leading-snug">{school.address}</p>
              <p className="text-[11px] text-slate-400 font-mono">우편번호 {school.zipCode}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F5F5F7] border border-black/[0.02] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  <Phone className="w-3 h-3" /> 대표 전화
                </span>
                <span className="font-bold font-mono text-slate-800">{school.tel}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  <Printer className="w-3 h-3" /> 행정실 팩스
                </span>
                <span className="font-bold font-mono text-slate-800">{school.fax}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Train className="w-4 h-4 text-indigo-600" />
                <span className="font-medium text-slate-700 text-[11px]">대전 도시철도 1호선 월평역/갈마역 인근</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
