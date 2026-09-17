import { useState, type FormEvent } from 'react';
import {
  X,
  Fingerprint,
  KeyRound,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Smartphone,
  Laptop,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  authenticateWithPasskey,
  registerDevicePasskey,
  verifyMasterPasskey,
  isWebAuthnAvailable,
  getStoredPasskey,
  MASTER_PASSKEY_CODE,
} from '../services/passkeyService';

interface PasskeyAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PasskeyAuthModal({
  isOpen,
  onClose,
  onSuccess,
}: PasskeyAuthModalProps) {
  const [activeMode, setActiveMode] = useState<'passkey' | 'register' | 'code'>('passkey');
  const [masterCode, setMasterCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const storedPasskey = getStoredPasskey();
  const webAuthnSupported = isWebAuthnAvailable();

  const handlePasskeyAuth = async () => {
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await authenticateWithPasskey();
      if (res.success) {
        setSuccessMsg(res.message);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 800);
      } else {
        setErrorMsg(res.message);
      }
    } catch (err: any) {
      setErrorMsg(err.message || '인증 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterPasskey = async () => {
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await registerDevicePasskey();
      if (res.success) {
        setSuccessMsg(res.message);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1000);
      } else {
        setErrorMsg(res.message);
      }
    } catch (err: any) {
      setErrorMsg(err.message || '패스키 등록 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMasterCodeSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!masterCode.trim()) {
      setErrorMsg('관리자 마스터 패스키를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    setTimeout(() => {
      const res = verifyMasterPasskey(masterCode);
      if (res.success) {
        setSuccessMsg(res.message);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 600);
      } else {
        setErrorMsg(res.message);
      }
      setIsLoading(false);
    }, 300);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md bg-white rounded-[24px] shadow-2xl border border-black/[0.08] overflow-hidden z-10"
        >
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-black/[0.05] flex items-center justify-between bg-[#F5F5F7]/50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
                <Fingerprint className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  관리자 패스키 로그인
                </h3>
                <p className="text-[11px] text-slate-400 font-medium">
                  서대전고 교무·학사 관리 시스템
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-black/[0.05] text-slate-400 hover:text-slate-700 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4">
            {/* Mode Selector */}
            <div className="grid grid-cols-2 gap-1.5 bg-[#F5F5F7] p-1 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setActiveMode('passkey');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeMode === 'passkey'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Fingerprint className="w-3.5 h-3.5 text-indigo-600" />
                <span>기기 생체인식 패스키</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveMode('code');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeMode === 'code'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5 text-slate-600" />
                <span>보안 마스터 키</span>
              </button>
            </div>

            {/* Error & Success Messages */}
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2 font-medium"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMsg}</span>
              </motion.div>
            )}

            {/* Mode 1: Passkey / Biometrics */}
            {activeMode === 'passkey' && (
              <div className="space-y-4 pt-1">
                <div className="text-center py-4 bg-slate-50/70 rounded-2xl border border-black/[0.03]">
                  <div className="w-16 h-16 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto mb-3 shadow-inner">
                    <Fingerprint className="w-8 h-8 text-indigo-600 animate-pulse" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    {storedPasskey ? '등록된 패스키로 바로 로그인' : '기기 생체인식 패스키 인증'}
                  </h4>
                  <p className="text-[11px] text-slate-500 max-w-xs mx-auto mt-1 leading-relaxed">
                    스마트폰의 Touch ID/Face ID 또는 노트북의 지문/Windows Hello로 1초 만에 로그인합니다.
                  </p>
                </div>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={handlePasskeyAuth}
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-xl bg-black hover:bg-slate-800 active:scale-98 text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    <Fingerprint className="w-4 h-4" />
                    <span>{isLoading ? '생체인식 센서 확인 중...' : '지문 / Face ID로 패스키 로그인'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRegisterPasskey}
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 active:scale-98 text-slate-700 font-semibold text-xs transition border border-black/[0.08] flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>이 기기를 관리자 패스키로 등록하기</span>
                  </button>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setActiveMode('code')}
                    className="text-[11px] text-slate-400 hover:text-indigo-600 underline font-medium cursor-pointer"
                  >
                    생체인식 센서가 없거나 오류가 발생하나요? 보안 마스터 키로 로그인
                  </button>
                </div>
              </div>
            )}

            {/* Mode 2: Master Code (For iframe restrictions or non-biometric desktops) */}
            {activeMode === 'code' && (
              <form onSubmit={handleMasterCodeSubmit} className="space-y-4 pt-1">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-black/[0.04] space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                    <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
                    <span>교무실 관리자 보안 마스터 키</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    교무실 데스크톱 또는 공용 PC용 비상 마스터 키를 입력해주세요.
                    <span className="block text-[10px] text-slate-400 mt-0.5">
                      (기본 마스터 키: <code className="font-mono font-bold text-indigo-600">{MASTER_PASSKEY_CODE}</code>)
                    </span>
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    마스터 패스키
                  </label>
                  <input
                    type="password"
                    value={masterCode}
                    onChange={(e) => setMasterCode(e.target.value)}
                    placeholder="보안 마스터 키 입력 (예: sdjh1972)"
                    autoFocus
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F5F5F7] border border-black/[0.06] focus:border-indigo-500 focus:bg-white focus:outline-none transition font-mono tracking-wider"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !masterCode.trim()}
                  className="w-full py-3 px-4 rounded-xl bg-black hover:bg-slate-800 active:scale-98 text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isLoading ? '확인 중...' : '마스터 키로 관리자 로그인'}</span>
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
