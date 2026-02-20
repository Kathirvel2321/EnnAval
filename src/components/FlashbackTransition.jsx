import { motion } from 'framer-motion'

const FlashbackTransition = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="absolute inset-0 z-[80] overflow-hidden bg-[#07060a]"
    >
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.9, 0.18] }}
        transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 bg-white"
      />

      <motion.div
        aria-hidden
        initial={{ scale: 1.25, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 bg-[radial-gradient(70%_54%_at_50%_50%,rgba(179,164,255,0.26),rgba(179,164,255,0)_72%)]"
      />

      <motion.div
        aria-hidden
        animate={{ opacity: [0.08, 0.22, 0.08] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.8)_1px,transparent_0)] [background-size:16px_16px]"
      />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,6,10,0.15)_0%,rgba(5,6,10,0.7)_100%)]" />

      <motion.div
        initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
        className="absolute inset-0 z-10 flex items-center justify-center px-6"
      >
        <p
          className="text-center text-[1.45rem] font-semibold tracking-[0.08em] text-white/92 sm:text-[2.1rem]"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          FLASHBACK
        </p>
      </motion.div>
    </motion.div>
  )
}

export default FlashbackTransition
