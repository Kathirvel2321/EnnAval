import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef } from 'react'

const PhaseOneEnding = ({ dialogue, dialogueIndex, onNextPhase }) => {
  const showSchoolBackdrop = dialogueIndex >= 5 && dialogueIndex <= 11
  const isSareePhase = dialogueIndex >= 19
  const isUnconciousPop = dialogueIndex === 22
  const isEmotionalPop = dialogueIndex >= 23
  const musicRef = useRef(null)
  const showModernRomanticTheme = dialogueIndex >= 12

  const mainImage =
    dialogueIndex >= 21
      ? '/projectimages/saree2.webp'
      : dialogueIndex >= 19
      ? '/projectimages/saree.webp'
      : dialogueIndex >= 12
      ? '/projectimages/hi1.webp'
      : dialogueIndex >= 5
      ? '/projectimages/schoolher.webp'
      : dialogueIndex >= 3
      ? '/projectimages/hi1.webp'
      : '/projectimages/hi.webp'

  const popImage =
    dialogueIndex >= 23
      ? '/projectimages/emotional.webp'
      : dialogueIndex >= 22
      ? '/projectimages/unconcious.webp'
      : dialogueIndex >= 19
      ? '/projectimages/popbeautiful.webp'
      : dialogueIndex >= 12
      ? ''
      : dialogueIndex >= 10
      ? '/projectimages/popmelted.webp'
      : dialogueIndex >= 6
      ? '/projectimages/popanswer.webp'
      : dialogueIndex >= 5
      ? '/projectimages/popguess.webp'
      : ''
  const popSizeClass = isEmotionalPop
    ? 'w-[232px] sm:bottom-12 sm:w-[330px] lg:bottom-4 lg:w-[470px]'
    : isUnconciousPop
    ? 'w-[184px] sm:bottom-12 sm:w-[260px] lg:bottom-4 lg:w-[360px]'
    : dialogueIndex >= 19 && dialogueIndex <= 21
    ? 'w-[132px] sm:bottom-18 sm:w-[186px] lg:bottom-8 lg:w-[268px]'
    : 'w-[132px] sm:bottom-18 sm:w-[186px] lg:bottom-8 lg:w-[230px]'
  const dialogueCardClass = showModernRomanticTheme
    ? 'relative max-h-[35svh] overflow-y-auto rounded-[1.4rem] border border-white/80 bg-white/78 px-4 py-3 shadow-[0_14px_26px_rgba(68,30,54,0.16)] backdrop-blur-xl sm:px-6 sm:py-5'
    : 'relative max-h-[35svh] overflow-y-auto rounded-[1.4rem] border border-white/35 bg-black/54 px-4 py-3 shadow-[0_14px_26px_rgba(0,0,0,0.45)] backdrop-blur-md sm:px-6 sm:py-5'
  const dialogueTextClass = showModernRomanticTheme
    ? 'text-center text-[1.04rem] font-semibold leading-[1.3] text-[#6b2449] sm:text-[1.9rem]'
    : 'text-center text-[1.04rem] font-semibold leading-[1.3] text-rose-50 sm:text-[1.9rem]'

  useEffect(() => {
    const audio = musicRef.current
    if (!audio) return

    if (!isSareePhase) {
      audio.pause()
      audio.currentTime = 0
      return
    }

    audio.loop = true
    audio.volume = 0.6
    audio.play().catch(() => {})

    return () => {
      audio.pause()
      audio.currentTime = 0
    }
  }, [isSareePhase])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
      className="absolute inset-0 z-[70] overflow-hidden bg-[#09090d]"
    >
      {onNextPhase ? (
        <button
          type="button"
          onPointerDown={(event) => {
            event.stopPropagation()
            onNextPhase()
          }}
          className="absolute right-3 top-[max(10px,calc(env(safe-area-inset-top)+8px))] z-[95] rounded-full border border-white/70 bg-white/85 px-3 py-1 text-xs font-semibold text-[#6b2449] shadow-[0_8px_20px_rgba(40,16,32,0.22)] backdrop-blur sm:right-4 sm:top-4"
        >
          Next Phase
        </button>
      ) : null}

      <AnimatePresence>
        {showSchoolBackdrop ? (
          <motion.img
            key="school-backdrop"
            src="/projectimages/schoolher.webp"
            alt=""
            initial={{ opacity: 0, scale: 1.1, filter: 'blur(16px) saturate(1.15)' }}
            animate={{ opacity: 0.5, scale: 1.02, filter: 'blur(12px) saturate(1.1)' }}
            exit={{ opacity: 0, scale: 1.08, filter: 'blur(16px)' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}
      </AnimatePresence>

      {showModernRomanticTheme ? (
        <>
          <div className="absolute inset-0 bg-[linear-gradient(152deg,#fff9fc_0%,#fff0f6_28%,#ffe7f2_58%,#ffe3ea_100%)]" />
          <motion.div
            aria-hidden
            animate={{ opacity: [0.32, 0.5, 0.32], scale: [1, 1.06, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -left-20 -top-16 h-[50vh] w-[50vh] rounded-full bg-[radial-gradient(circle,rgba(255,121,182,0.26)_0%,rgba(255,121,182,0)_72%)] blur-[52px]"
          />
          <motion.div
            aria-hidden
            animate={{ opacity: [0.28, 0.46, 0.28], scale: [1, 1.07, 1] }}
            transition={{ duration: 11.2, delay: 0.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-20 -right-16 h-[54vh] w-[54vh] rounded-full bg-[radial-gradient(circle,rgba(255,197,136,0.28)_0%,rgba(255,197,136,0)_74%)] blur-[56px]"
          />
          <div className="absolute inset-0 bg-[radial-gradient(72%_54%_at_50%_10%,rgba(255,255,255,0.92),rgba(255,255,255,0)_72%)]" />
          <div className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(circle_at_1px_1px,rgba(177,78,128,0.6)_1px,transparent_0)] [background-size:20px_20px]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(84,24,58,0.08)_66%,rgba(45,16,36,0.18)_100%)]" />
        </>
      ) : (
        <div
          className={`absolute inset-0 bg-[linear-gradient(160deg,#0c0c13_0%,#161325_42%,#27152a_100%)] ${
            showSchoolBackdrop ? 'opacity-72' : 'opacity-100'
          }`}
        />
      )}

      <AnimatePresence mode="wait">
        <motion.img
          key={mainImage}
          src={mainImage}
          alt="Story character"
          initial={{ opacity: 0, y: 42, scale: 0.94, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -10, scale: 0.97, filter: 'blur(5px)' }}
          transition={{ delay: 0.3, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-0 left-1/2 z-10 w-[min(96vw,760px)] -translate-x-1/2 object-contain lg:w-[min(58vw,500px)]"
        />
      </AnimatePresence>

      <audio ref={musicRef} src="/projectimages/sareemusic.mp3" preload="auto" />

      <AnimatePresence mode="wait">
        {popImage ? (
          <motion.img
            key={popImage}
            src={popImage}
            alt="Reaction character"
            initial={{ x: -120, opacity: 0, rotate: -5, scale: 0.95 }}
            animate={{ x: 0, opacity: 1, rotate: 0, scale: 1 }}
            exit={{ x: -90, opacity: 0, rotate: -4 }}
            transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
            className={`pointer-events-none absolute bottom-26 left-0 z-20 ${popSizeClass}`}
          />
        ) : null}
      </AnimatePresence>

      <div className="absolute bottom-[max(76px,calc(env(safe-area-inset-bottom)+58px))] left-1/2 z-20 w-[min(94vw,700px)] -translate-x-1/2 px-2 sm:bottom-8">
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.85, duration: 0.55, ease: 'easeOut' }}
          className={dialogueCardClass}
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={dialogue}
              initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className={dialogueTextClass}
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {dialogue}
            </motion.p>
          </AnimatePresence>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.1, 0.34, 0.1] }}
        transition={{ delay: 0.95, duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 z-0 bg-[radial-gradient(70%_50%_at_50%_50%,rgba(255,186,223,0.18),rgba(255,186,223,0)_74%)]"
      />
    </motion.div>
  )
}

export default PhaseOneEnding
