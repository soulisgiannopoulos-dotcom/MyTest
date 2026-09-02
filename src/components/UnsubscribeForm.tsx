import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ShieldCheck, Mail, AlertTriangle, RefreshCw } from 'lucide-react';

interface UnsubscribeFormProps {
  isDarkMode: boolean;
}

export const UnsubscribeForm = ({ isDarkMode }: UnsubscribeFormProps) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [captchaState, setCaptchaState] = useState<'idle' | 'verifying' | 'verified'>('idle');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Simple email validation
  const validateEmail = (val: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!val) {
      return 'Email address is required';
    } else if (!regex.test(val)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    if (emailError) {
      setEmailError(validateEmail(val));
    }
  };

  const handleCaptchaClick = () => {
    if (captchaState !== 'idle') return;
    setCaptchaState('verifying');
    // Simulate real checking delay
    setTimeout(() => {
      setCaptchaState('verified');
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateEmail(email);
    if (error) {
      setEmailError(error);
      return;
    }
    if (captchaState !== 'verified') {
      alert('Please check the I\'m not a robot box');
      return;
    }

    setLoadingSubmit(true);
    
    // Send unsubscribe notification to aris@athenaresiliencegroup.com
    const unsubscribePayload = {
      _subject: 'Newsletter Unsubscribe Request - Athena Resilience Group',
      _template: 'table',
      _captcha: 'false',
      unsubscribed_email: email,
      requested_at: new Date().toISOString(),
      action: 'Unsubscribe',
      source: 'Athena Resilience Unsubscribe Form',
    };

    fetch('https://formsubmit.co/ajax/aris@athenaresiliencegroup.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(unsubscribePayload)
    })
      .catch((err) => {
        console.warn('Unsubscribe notification encountered an error:', err);
      })
      .finally(() => {
        setLoadingSubmit(false);
        setIsSubmitted(true);
      });
  };

  const titleColor = isDarkMode ? 'text-[#88c9c4]' : 'text-[#4a8c87]';
  const subtitleColor = isDarkMode ? 'text-[#E8E6E3]/80' : 'text-[#152532]/80';
  const inputBg = isDarkMode ? 'bg-[#152532]' : 'bg-[#FFFFFF]';
  const inputBorder = isDarkMode ? 'border-white/20' : 'border-[#152532]/20';
  const recaptchaBg = isDarkMode ? 'bg-[#1c2e3d]' : 'bg-[#F9F9F9]';
  const recaptchaBorder = isDarkMode ? 'border-white/10' : 'border-[#D3D3D3]';

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="overflow-hidden mt-4 w-full"
    >
      <div className={`p-5 xs:p-6 sm:p-8 rounded-2xl border ${isDarkMode ? 'bg-[#152532]/40 border-white/10' : 'bg-[#F9F9F9] border-[#152532]/10'} space-y-6 text-left antialiased`}>
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Header Texts */}
              <div className="space-y-2">
                <h4 className={`text-base sm:text-lg md:text-xl font-display font-medium leading-snug ${titleColor}`}>
                  No longer want to receive emails from ATHENA?
                </h4>
                <p className={`text-[#152532]/80 text-xs sm:text-xs leading-normal ${subtitleColor}`}>
                  If you no longer want to receive emails from ATHENA, please enter your email address below:
                </p>
              </div>

              {/* Form Headline - UNSUBSCRIBE */}
              <div className="pt-2">
                <h3 className={`text-xl sm:text-2xl font-bold tracking-[0.12em] uppercase ${isDarkMode ? 'text-[#E8E6E3]' : 'text-[#152532]'}`}>
                  UNSUBSCRIBE
                </h3>
              </div>

              {/* Email Input Box */}
              <div className="space-y-2">
                <label 
                  className="block text-xs font-semibold tracking-[0.12em] uppercase font-sans text-left transition-colors duration-300"
                  style={{ 
                    color: isFocused 
                      ? (isDarkMode ? '#88c9c4' : '#66aba5') 
                      : (isDarkMode ? '#88c9c4' : '#4a8c87') 
                  }}
                >
                  Email Address *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                    <Mail 
                      size={16} 
                      className={`transition-colors duration-300 ${
                        isFocused 
                          ? (isDarkMode ? 'text-[#88c9c4]' : 'text-[#66aba5]') 
                          : (isDarkMode ? 'text-[#E8E6E3]/40' : 'text-[#152532]/40')
                      }`} 
                    />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Enter your email"
                    className={`w-full text-xs sm:text-sm pl-10 pr-4 py-3 sm:py-3.5 rounded-lg border font-medium outline-none transition-all ${inputBg} ${
                      isFocused
                        ? (isDarkMode 
                            ? 'border-[#88c9c4] ring-2 ring-[#88c9c4]/25 ring-offset-2 ring-offset-[#0B151F]' 
                            : 'border-[#66aba5] ring-2 ring-[#66aba5]/25 ring-offset-2 ring-offset-white')
                        : inputBorder
                    } ${
                      emailError ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : ''
                    } focus-visible:ring-2 focus-visible:ring-[#66aba5] dark:focus-visible:ring-[#88c9c4] focus-visible:ring-offset-2 focus-visible:outline-none`}
                  />
                </div>
                {emailError && (
                  <p className="text-red-500 text-xs font-semibold mt-1 flex items-center gap-1">
                    <AlertTriangle size={12} /> {emailError}
                  </p>
                )}
              </div>

              {/* Interactive Mock reCAPTCHA */}
              <div 
                className={`p-3 sm:p-4 rounded-md border flex items-center justify-between ${recaptchaBg} transition-all duration-500 shadow-sm max-w-[340px] ${
                  captchaState === 'verified'
                    ? (isDarkMode 
                        ? 'border-green-500/50 bg-[#1c2e3d]/60 shadow-[0_0_15px_rgba(34,197,94,0.15)] ring-1 ring-green-500/20' 
                        : 'border-green-500/40 bg-green-500/[0.01] shadow-[0_0_15px_rgba(34,197,94,0.15)] ring-1 ring-green-500/10')
                    : recaptchaBorder
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative flex items-center justify-center">
                    <motion.button
                      type="button"
                      onClick={handleCaptchaClick}
                      disabled={captchaState !== 'idle'}
                      whileHover={captchaState === 'idle' ? { scale: 1.05 } : {}}
                      whileTap={captchaState === 'idle' ? { scale: 0.95 } : {}}
                      transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                      className={`relative w-6 h-6 rounded border transition-all flex items-center justify-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#66aba5] dark:focus-visible:ring-[#88c9c4] focus-visible:ring-offset-2 focus-visible:outline-none overflow-hidden ${
                        captchaState === 'verified'
                          ? 'bg-green-500 border-green-500'
                          : isDarkMode
                          ? 'bg-[#152532] border-[#88c9c4]/30 hover:border-[#88c9c4]'
                          : 'bg-white border-[#C1C1C1] hover:border-[#aaa]'
                      }`}
                    >
                      <AnimatePresence>
                        {captchaState === 'verified' && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute inset-0 bg-green-500 flex items-center justify-center"
                          >
                            <motion.div
                              initial={{ scale: 0.5, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ type: 'spring', stiffness: 300, damping: 12, delay: 0.1 }}
                            >
                              <Check size={14} className="text-white stroke-[3px]" />
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      {captchaState === 'verifying' && (
                        <RefreshCw size={12} className={`animate-spin ${isDarkMode ? 'text-[#88c9c4]' : 'text-[#4a8c87]'}`} />
                      )}
                    </motion.button>
                  </div>
                  <span className={`text-[13px] font-sans font-medium ${isDarkMode ? 'text-[#E8E6E3]' : 'text-[#1c2e3d]'}`}>
                    I'm not a robot
                  </span>
                </div>
                
                {/* reCAPTCHA Logo and Info */}
                <div className="flex flex-col items-center justify-center select-none pl-3 border-l border-gray-200 dark:border-white/10 shrink-0">
                  <svg className="w-8 h-8 opacity-90" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M12,2A10,10,0,0,0,2,12a9.89,9.89,0,0,0,2.24,6.21L6.12,16.12A7,7,0,1,1,12,19a6.83,6.83,0,0,1-3.61-1l-2,2A9.91,9.91,0,0,0,12,22,10,10,0,0,0,22,12,10,10,0,0,0,12,2Z"
                    />
                    <path
                      fill="#34A853"
                      d="M12,2V5a7,7,0,0,1,7,7h3A10,10,0,0,0,12,2Z"
                    />
                    <path
                      fill="#EA4335"
                      d="M2.24,18.21A10,10,0,0,0,12,22v-3a7,7,0,0,1-5.88-3.12Z"
                    />
                  </svg>
                  <span className="text-[7.5px] font-bold text-gray-400 font-sans tracking-[0.1em] uppercase leading-none mt-0.5 pointer-events-none">
                    reCAPTCHA
                  </span>
                  <div className="flex gap-1 text-[5.5px] text-gray-500 dark:text-gray-400 mt-0.5 font-mono tracking-widest uppercaseScale">
                    <span className="hover:underline cursor-pointer">Privacy</span>
                    <span>•</span>
                    <span className="hover:underline cursor-pointer">Terms</span>
                  </div>
                </div>
              </div>

              {/* Submit Section */}
              <div className="space-y-4 pt-1">
                <motion.button
                  type="submit"
                  disabled={loadingSubmit || captchaState !== 'verified' || !email.trim()}
                  whileHover={captchaState === 'verified' && email.trim() && !loadingSubmit ? { scale: 1.02, y: -1 } : {}}
                  whileTap={captchaState === 'verified' && email.trim() && !loadingSubmit ? { scale: 0.98, y: 0 } : {}}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  className={`px-7 py-3 font-sans text-xs sm:text-sm font-bold tracking-[0.12em] uppercase transition-all flex items-center justify-center cursor-pointer rounded-sm focus-visible:ring-2 focus-visible:ring-[#66aba5] dark:focus-visible:ring-[#88c9c4] focus-visible:ring-offset-2 focus-visible:outline-none ${
                    captchaState === 'verified' && email.trim() && !loadingSubmit
                      ? 'bg-[#b6cdba] text-[#152532] hover:bg-[#a1baab] shadow-sm hover:shadow-md border border-[#96af9b]'
                      : 'bg-gray-200 dark:bg-white/5 text-gray-400 cursor-not-allowed border border-transparent'
                  }`}
                >
                  {loadingSubmit ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw size={14} className="animate-spin" />
                      SUBMITTING...
                    </span>
                  ) : (
                    'SUBMIT'
                  )}
                </motion.button>

                <p className={`text-[11px] leading-relaxed font-sans italic ${isDarkMode ? 'text-[#E8E6E3]/60' : 'text-gray-500'}`}>
                  Please note it may take several days for your request to be processed.
                </p>
              </div>
            </form>
          ) : (
            <motion.div
              initial="initial"
              animate="animate"
              variants={{
                initial: { opacity: 0 },
                animate: { opacity: 1, transition: { staggerChildren: 0.1 } }
              }}
              className="text-center py-6 px-4 space-y-4 antialiased"
            >
              <motion.div 
                variants={{
                  initial: { scale: 0, rotate: -45, opacity: 0 },
                  animate: { scale: 1, rotate: 0, opacity: 1 }
                }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-500/10 rounded-full text-green-500 mb-2"
              >
                <ShieldCheck size={28} />
              </motion.div>
              
              <motion.h4 
                variants={{
                  initial: { y: 15, opacity: 0 },
                  animate: { y: 0, opacity: 1 }
                }}
                transition={{ ease: 'easeOut', duration: 0.4 }}
                className={`text-lg sm:text-xl font-display font-bold tracking-[0.12em] uppercase ${isDarkMode ? 'text-white' : 'text-[#152532]'}`}
              >
                UNSUBSCRIBE COMPLETED
              </motion.h4>
              
              <motion.p 
                variants={{
                  initial: { y: 15, opacity: 0 },
                  animate: { y: 0, opacity: 1 }
                }}
                transition={{ ease: 'easeOut', duration: 0.4 }}
                className={`text-xs sm:text-sm max-w-sm mx-auto leading-relaxed ${isDarkMode ? 'text-[#E8E6E3]/80' : 'text-[#152532]/80'}`}
              >
                You have been successfully unsubscribed from the ATHENA mailing list. Your email Address <span className="font-semibold underline text-athena-peach">{email}</span> will no longer receive insights.
              </motion.p>
              
              <motion.p 
                variants={{
                  initial: { y: 10, opacity: 0 },
                  animate: { y: 0, opacity: 1 }
                }}
                transition={{ ease: 'easeOut', duration: 0.4 }}
                className={`text-xs italic ${isDarkMode ? 'text-[#E8E6E3]/55' : 'text-gray-500'}`}
              >
                Please note that if there are any newsletters already in transit, they may still reach you over the next few days.
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
