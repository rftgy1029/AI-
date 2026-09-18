import { useState, type FormEvent, useEffect } from 'react';
import {
  X,
  Fingerprint,
  KeyRound,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Lock,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  authenticateWithPasskey,
  registerDevicePasskey,
  verifyMasterPasskey,
  verifyAdminPassword,
  isWebAuthnAvailable,
  getStoredPasskey,
  removeStoredPasskey,
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
  // Determine initial mode based on whether a passkey already exists on this device
  const [activeMode, setActiveMode] = useState<'master' | 'passkey' | 'register'>('master');
  const [masterPassword, setMasterPassword] = useState('');
  const [initialPasswordForReg, setInitialPasswordForReg] = useState('');
  const [isRegUnlocked, setIsRegUnlocked] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [hasStoredPasskey, setHasStoredPasskey] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const stored = getStoredPasskey();
      const hasPass = Boolean(stored);
      setHasStoredPasskey(hasPass);
      // If device has a passkey already, open passkey tab by default. Otherwise open master key tab.
      setActiveMode(hasPass ? 'passkey' : 'master');
      setErrorMsg('');
      setSuccessMsg('');
      setMasterPassword('');
      setInitialPasswordForReg('');
      setIsRegUnlocked(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // 1. Master Key Login Handler (for users without passkey)
  const handleMasterLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!masterPassword.trim()) {
      setErrorMsg('관리자 마스터키 비밀번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    setTimeout(() => {
      const res = verifyMasterPasskey(masterPassword);
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
    }, 250);
  };

  // 2. Biometric Passkey Login Handler
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

  // 3. Register Passkey: Step 1 Password Gate Verification
  const handleVerifyPasswordForReg = (e: FormEvent) => {
    e.preventDefault();
    if (!initialPasswordForReg.trim()) {
      setErrorMsg('관리자 초기 비밀번호를 입력해주세요.');
      return;
    }

    if (verifyAdminPassword(initialPasswordForReg)) {
      setIsRegUnlocked(true);
      setErrorMsg('');
      setSuccessMsg('관리자 초기 비밀번호가 확인되었습니다. 이제 기기 생체인식 패스키를 등록할 수 있습니다.');
    } else {
      setIsRegUnlocked(false);
      setErrorMsg('초기 비밀번호가 일치하지 않습니다. 올바른 관리자 비밀번호를 입력해주세요.');
    }
  };

  // 4. Register Passkey: Step 2 Device Biometric Registration
  const handleExecutePasskeyRegistration = async () => {
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await registerDevicePasskey();
      if (res.success) {
        setHasStoredPasskey(true);
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

  const handleRemovePasskey = () => {
    if (confirm('이 기기에 등록된 관리자 패스키를 삭제하시겠습니까?')) {
      removeStoredPasskey();
      setHasStoredPasskey(false);
      setActiveMode('master');
      setSuccessMsg('기기 패스키가 삭제되었습니다.');
    }
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
          <div className="px-6 pt-6 pb-4 border-b border-black/[0.05] flex items-center justify-between bg-[#F5F5F7]/60">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
                <Fingerprint className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  교무실 관리자 로그인
                </h3>
                <p className="text-[11px] text-slate-400 font-medium">
                  서대전고 학사·일정 관리 시스템
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

          {/* Navigation Tabs */}
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-3 gap-1 bg-[#F5F5F7] p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setActiveMode('master');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`py-2 rounded-lg transition cursor-pointer flex items-center justify-center gap-1 ${
                  activeMode === 'master'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5 text-slate-700" />
                <span>마스터키</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveMode('passkey');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`py-2 rounded-lg transition cursor-pointer flex items-center justify-center gap-1 ${
                  activeMode === 'passkey'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Fingerprint className="w-3.5 h-3.5 text-indigo-600" />
                <span>패스키</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveMode('register');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className={`py-2 rounded-lg transition cursor-pointer flex items-center justify-center gap-1 ${
                  activeMode === 'register'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>기기 등록</span>
              </button>
            </div>

            {/* Notification Messages */}
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
                className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-start gap-2 font-medium"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </motion.div>
            )}

            {/* TAB 1: MASTER KEY LOGIN (Default for users without passkey) */}
            {activeMode === 'master' && (
              <form onSubmit={handleMasterLoginSubmit} className="space-y-4 pt-1">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-black/[0.04] space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
                    <span>패스키 미보유자 관리자 마스터키 로그인</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    패스키가 없는 경우 관리자 마스터키 비밀번호로 로그인할 수 있습니다.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    마스터키 비밀번호
                  </label>
                  <input
                    type="password"
                    value={masterPassword}
                    onChange={(e) => setMasterPassword(e.target.value)}
                    placeholder="마스터키 비밀번호 입력"
                    autoFocus
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F5F5F7] border border-black/[0.06] focus:border-indigo-500 focus:bg-white focus:outline-none transition font-mono tracking-wider"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !masterPassword.trim()}
                  className="w-full py-3 px-4 rounded-xl bg-black hover:bg-slate-800 active:scale-98 text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isLoading ? '확인 중...' : '마스터키로 관리자 로그인'}</span>
                </button>

                <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400">
                  <button
                    type="button"
                    onClick={() => setActiveMode('register')}
                    className="hover:text-indigo-600 underline font-medium cursor-pointer"
                  >
                    새 기기에 지문/Face ID 등록하기 →
                  </button>
                  {hasStoredPasskey && (
                    <button
                      type="button"
                      onClick={() => setActiveMode('passkey')}
                      className="hover:text-indigo-600 underline font-medium cursor-pointer"
                    >
                      등록된 패스키로 로그인
                    </button>
                  )}
                </div>
              </form>
            )}

            {/* TAB 2: BIOMETRIC PASSKEY LOGIN */}
            {activeMode === 'passkey' && (
              <div className="space-y-4 pt-1">
                {hasStoredPasskey ? (
                  <>
                    <div className="text-center py-4 bg-slate-50/80 rounded-2xl border border-black/[0.03]">
                      <div className="w-16 h-16 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto mb-3 shadow-inner">
                        <Fingerprint className="w-8 h-8 text-indigo-600 animate-pulse" />
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        기기 생체인식 패스키 로그인
                      </h4>
                      <p className="text-[11px] text-slate-500 max-w-xs mx-auto mt-1 leading-relaxed">
                        이 기기에 등록된 지문(Touch ID) 또는 안면인식(Face ID)으로 1초 만에 로그인합니다.
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

                      <div className="flex items-center justify-between pt-1">
                        <button
                          type="button"
                          onClick={() => setActiveMode('master')}
                          className="text-[11px] text-slate-400 hover:text-indigo-600 underline font-medium cursor-pointer"
                        >
                          마스터키로 로그인하기
                        </button>
                        <button
                          type="button"
                          onClick={handleRemovePasskey}
                          className="text-[11px] text-slate-400 hover:text-rose-600 flex items-center gap-1 font-medium cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>기기 패스키 삭제</span>
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-6 bg-slate-50/70 rounded-2xl border border-black/[0.03] space-y-3">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                      <Fingerprint className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-xs">
                        이 기기에는 아직 등록된 패스키가 없습니다
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
                        패스키가 없는 분은 <span className="font-bold text-slate-700">마스터키로 로그인</span>하시거나, 초기 비밀번호를 입력하여 새 패스키를 등록할 수 있습니다.
                      </p>
                    </div>

                    <div className="pt-2 flex flex-col gap-2 px-6">
                      <button
                        type="button"
                        onClick={() => setActiveMode('master')}
                        className="w-full py-2.5 rounded-xl bg-black hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
                      >
                        마스터키로 로그인하기
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveMode('register')}
                        className="w-full py-2.5 rounded-xl bg-white border border-black/[0.08] hover:bg-slate-50 text-slate-700 font-semibold text-xs transition cursor-pointer"
                      >
                        초기 비밀번호 입력 후 패스키 등록하기
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: REGISTER NEW PASSKEY (Protected by Initial Password Gate) */}
            {activeMode === 'register' && (
              <div className="space-y-4 pt-1">
                {!isRegUnlocked ? (
                  // Step 1: Password Gate
                  <form onSubmit={handleVerifyPasswordForReg} className="space-y-4">
                    <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                        <Lock className="w-3.5 h-3.5 text-amber-600" />
                        <span>관리자 초기 비밀번호 확인 필요</span>
                      </div>
                      <p className="text-[11px] text-amber-800/90 leading-relaxed">
                        보안을 위해 관리자 초기 비밀번호를 먼저 입력해야 새 기기 패스키 등록 화면이 열립니다.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        관리자 초기 비밀번호
                      </label>
                      <input
                        type="password"
                        value={initialPasswordForReg}
                        onChange={(e) => setInitialPasswordForReg(e.target.value)}
                        placeholder="초기 비밀번호 입력"
                        autoFocus
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F5F5F7] border border-black/[0.06] focus:border-indigo-500 focus:bg-white focus:outline-none transition font-mono tracking-wider"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!initialPasswordForReg.trim()}
                      className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                    >
                      <Lock className="w-4 h-4" />
                      <span>초기 비밀번호 확인</span>
                    </button>

                    <div className="text-center pt-1">
                      <button
                        type="button"
                        onClick={() => setActiveMode('master')}
                        className="text-[11px] text-slate-400 hover:text-indigo-600 underline font-medium cursor-pointer"
                      >
                        마스터키로 바로 로그인하기
                      </button>
                    </div>
                  </form>
                ) : (
                  // Step 2: Unlocked Biometric Registration
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4"
                  >
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-medium">
                        관리자 초기 비밀번호 확인 완료. 이제 이 기기에 패스키를 등록할 수 있습니다.
                      </span>
                    </div>

                    <div className="text-center py-4 bg-slate-50/80 rounded-2xl border border-black/[0.03]">
                      <div className="w-16 h-16 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto mb-3 shadow-inner">
                        <Sparkles className="w-8 h-8 text-indigo-600" />
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        기기 생체인식 패스키 등록
                      </h4>
                      <p className="text-[11px] text-slate-500 max-w-xs mx-auto mt-1 leading-relaxed">
                        아래 버튼을 누르면 기기의 지문인식(Touch ID) 또는 얼굴인식(Face ID) 등록 창이 실행됩니다.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleExecutePasskeyRegistration}
                      disabled={isLoading}
                      className="w-full py-3 px-4 rounded-xl bg-black hover:bg-slate-800 active:scale-98 text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                    >
                      <Fingerprint className="w-4 h-4" />
                      <span>{isLoading ? '패스키 등록 진행 중...' : '이 기기에 생체인식 패스키 등록'}</span>
                    </button>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setIsRegUnlocked(false);
                          setInitialPasswordForReg('');
                          setActiveMode('master');
                        }}
                        className="text-[11px] text-slate-400 hover:text-slate-600 underline font-medium cursor-pointer"
                      >
                        취소하고 마스터키 화면으로 돌아가기
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
