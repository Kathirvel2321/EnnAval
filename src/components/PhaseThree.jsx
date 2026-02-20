import { AnimatePresence, motion } from 'framer-motion'

const PHASE_THREE_DIALOGUES = [
  'Evlo pesurene inga... ava kitta oru time achi nerla pesuren na...',
  'Kedaiyathu.',
  'Pesanum nu romba aasai, ava kitta.',
  'Naal kanakka pesanum la aasai.',
  'Aasai pada therinja enaku...',
  'Antha nerla panna thairiyam illa.',
  'Ava kitta ponaale enoda heart high rate la thudikkum.',
  'Na enna tha panna mudiyum?',
  'Ava kooda kai pudechi nadakanum aasai.',
  'Ava kooda badminton velayada aasai.',
  'Wait... badminton thana sonnen.',
  'Ungaleke theriyuma evlo alaga velayaduva nu?',
]

const PhaseThree = ({ dialogueIndex, onNextPhase }) => {
  const mainImage =
    dialogueIndex >= 11
      ? '/projectimages/smile2.webp'
      : dialogueIndex >= 10
      ? '/projectimages/wait.webp'
      : dialogueIndex >= 8
      ? '/projectimages/smile.webp'
      : dialogueIndex >= 1
      ? '/projectimages/sorry.webp'
      : '/projectimages/smile2.webp'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="absolute inset-0 z-[75] overflow-hidden"
    >
      {onNextPhase ? (
        <button
          type="button"
          onPointerDown={(event) => {
            event.stopPropagation()
            onNextPhase()
          }}
          className="absolute right-3 top-[max(10px,calc(env(safe-area-inset-top)+8px))] z-[95] rounded-full border border-white/75 bg-white/86 px-3 py-1 text-xs font-semibold text-[#21445f] shadow-[0_8px_20px_rgba(20,44,68,0.2)] backdrop-blur sm:right-4 sm:top-4"
        >
          Next Phase
        </button>
      ) : null}

      <motion.div
        aria-hidden
        animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 bg-[linear-gradient(130deg,#f8fcff_0%,#ebf6ff_30%,#e1f2ff_60%,#dcf4f0_100%)]"
        style={{ backgroundSize: '180% 180%' }}
      />
      <motion.div
        aria-hidden
        animate={{ opacity: [0.28, 0.44, 0.28], scale: [1, 1.08, 1] }}
        transition={{ duration: 9.4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -left-20 -top-16 h-[50vh] w-[54vh] rounded-full bg-[radial-gradient(circle,rgba(103,182,255,0.24)_0%,rgba(103,182,255,0)_74%)] blur-[54px]"
      />
      <motion.div
        aria-hidden
        animate={{ opacity: [0.24, 0.4, 0.24], scale: [1, 1.07, 1] }}
        transition={{ duration: 10.6, delay: 0.45, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-20 -right-14 h-[52vh] w-[52vh] rounded-full bg-[radial-gradient(circle,rgba(95,224,199,0.24)_0%,rgba(95,224,199,0)_72%)] blur-[56px]"
      />
      <div className="absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_12%,rgba(255,255,255,0.95),rgba(255,255,255,0)_72%)]" />
      <motion.div
        aria-hidden
        animate={{ opacity: [0.08, 0.16, 0.08] }}
        transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 [background-image:radial-gradient(circle_at_1px_1px,rgba(43,95,133,0.55)_1px,transparent_0)] [background-size:20px_20px]"
      />
      <motion.div
        aria-hidden
        animate={{ x: ['-10%', '110%'], opacity: [0, 0.34, 0] }}
        transition={{ duration: 5.8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-y-0 w-[36%] bg-gradient-to-r from-transparent via-white/50 to-transparent"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(29,61,84,0.12)_100%)]" />

      <AnimatePresence mode="wait">
        <motion.img
          key={mainImage}
          src={mainImage}
          alt="Smiling character"
          initial={{ opacity: 0, y: 38, scale: 0.95, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -8, scale: 0.98, filter: 'blur(5px)' }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-0 left-1/2 z-10 w-[min(94vw,760px)] -translate-x-1/2 object-contain lg:w-[min(58vw,420px)]"
        />
      </AnimatePresence>

      <div className="absolute bottom-[max(76px,calc(env(safe-area-inset-bottom)+58px))] left-1/2 z-20 w-[min(94vw,700px)] -translate-x-1/2 px-2 sm:bottom-8">
        <motion.div
          initial={{ opacity: 0, y: 14, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="relative max-h-[35svh] overflow-y-auto rounded-[1.4rem] border border-white/80 bg-white/78 px-4 py-3 shadow-[0_14px_26px_rgba(20,44,68,0.18)] backdrop-blur-xl sm:px-6 sm:py-5"
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={dialogueIndex}
              initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="text-center text-[1.02rem] font-semibold leading-[1.3] text-[#21445f] sm:text-[1.78rem]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {PHASE_THREE_DIALOGUES[dialogueIndex]}
            </motion.p>
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  )
}

export { PHASE_THREE_DIALOGUES }
export default PhaseThree
