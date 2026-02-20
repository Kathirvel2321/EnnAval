import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FaHeart, FaChevronLeft, FaChevronRight, FaStepForward } from 'react-icons/fa'
import PhaseOneEnding from './PhaseOneEnding'
import PhaseThree, { PHASE_THREE_DIALOGUES } from './PhaseThree'
import PhaseFour, { PHASE_FOUR_DIALOGUES } from './PhaseFour'
import { trackProgress, trackSiteClose, trackSiteOpen } from '../lib/tracker'

const DIALOGUES = [
  'Hiii Alagee…',
  'Unakaga dhaan idha create panninen…',
  'Pidikum nu nambren…',
  'I want to tell you a story.',
  'This is where our story begins...',
]

const REVEAL_DIALOGUES = [
  "Every time I open the window of my heart...",
  "En kannu munnadi theriyura kaatchi idhu dhaan.",
  'Oru azhagana devathai ennaiye paathutu irukka.',
  'Wait... unaku nichayama theriyuma?',
  'Konjam zoom panni paaru...',
  'Innum konjam... close-up la paaru.',
  "Ippo theriyudha ava enga paakra nu?",
  "Left pakkam paakra.",
  "Right pakkam paakra.",
  'Ella pakkamum paapa, aana ennai thavira.',
  'Wait, I have a small doubt.',
  'Will you ever look at me... or not?',
  'Unmaiyava?',
  "At least ippo sonna... athuve podhum.",
  'Engayo ava pakkattum…',
  "Aana paaka romba alaga iruka la?",
  'Ethu ve alagu nu ne nenaithengana athu thapu',
  'Ungalukum pakanuma?',
  "Peacock dance paathirukiya?",
  'peacock aduna Antha mazhai hey pakka avelo alagaa irukum ',
  'Pakerengala?',
  'See, I told you... the rain makes everything beautiful.',
  "But it's only because of her... that even the rain looks this special",
  'Naa Alagaa Malaiya rasichikite irukapothu…',
  'Antha malai sound kulla…  Oru alagana kural enoda kathuku kekuthu…',
  'I searched everywhere... and suddenly, she was right there in front of me.',
  'Ava kuyil polla pattu padichekede eruntha.',
  'Athu varthaiyalla solla mudiyathu... Ava oru devathai maathiri iruntha.',
]
const FINAL_RAIN_INDEX = 21
const BEAUTIFUL_INDEX = 16
const MELTED_START_INDEX = 17
const RAIN_LOOK_INDEX = 22
const RAIN_POPMESSAGE_INDEX = 22
const POPMELTED_AFTER_RAIN_INDEX = 23
const POPHEARED_INDEX = 26
const SING_INDEX = 27
const SING2_INDEX = 28
const RAIN_START_INDEX = 21
const RAIN_END_INDEX = 28
const FINAL_REVEAL_INDEX = REVEAL_DIALOGUES.length - 1
const CHECKPOINT_KEY = 'love-story-checkpoint-v2'
const ENDING_DIALOGUES = [
   "So... how was it? Alaga irundhucha? 😌",
  "Ithula pakave ivlo alaga irukku la...",
   "Appo first time ava nerla paathapo en manasu epdi irundhirukum nu yosichu paaru.",
  "Andha first sight... , Innum en kannukulla appadiye irukku.",
  "Manja color chudidhar...",
  'Color color ah irukura oru shawl.',
  'Kathorama oru chinna lolakku',
  'Oru chinna pottu, kannuke mattum theriyura mathiri.',
  'Ellathayum thooki saapidura mathiri ava kangal... ayyo.',
  'Itha paathu thaanga naan vizhunthuten.',
  'First time eh periya puttu haa poduda manasuku.',
  'Aanalum ava romba mosam nga...',
  'manasatchi-ey kedaiyathu avaluku.',
  'Manusan ethuve samaleka mudiyathu; ethula ethavathu function vantha pothum...',
  'Atheleyum Pongal appo... ellarum Pongal vachitu irukum pothu...',
  'ellarum Pongal vachitu irukum pothu...',
  'Ava veliya varuva paarunga...',
  'Sevappu color saree la...',
  'Athu matching ah jacket thachi.',
  'Thala neraya malligappu vaithu...',
  'Ava nadanthu varuva paakanum....',
  'Thevathaiye nerla varam maathiri irukkum.',
  'Appadiye mind-kulla music odum paarunga...',
]

const STORY_TRIGGER_INDEX = DIALOGUES.length - 1
const CRITICAL_PRELOAD_IMAGES = [
  '/projectimages/hi.webp',
  '/projectimages/hi1.webp',
  '/projectimages/batvoice.webp',
  '/projectimages/building.webp',
  '/projectimages/window1.webp',
  '/projectimages/window2.webp',
  '/projectimages/window3.webp',
  '/projectimages/window4.webp',
  '/projectimages/cock.webp',
  '/projectimages/bathit.webp',
  '/projectimages/batherwait.webp',
  '/projectimages/bathither.webp',
  '/projectimages/bathither1.webp',
  '/projectimages/batsmile.webp',
  '/projectimages/bathersmile.webp',
]

const SECONDARY_PRELOAD_IMAGES = [
  '/projectimages/bathim.webp',
  '/projectimages/bathit1.webp',
  '/projectimages/batwait.webp',
  '/projectimages/batsmile1.webp',
  '/projectimages/bathersmile1.webp',
  '/projectimages/bathersmile2.webp',
  '/projectimages/bather.webp',
  '/projectimages/naa.webp',
  '/projectimages/hismile.webp',
  '/projectimages/sorry.webp',
  '/projectimages/smile.webp',
  '/projectimages/smile2.webp',
  '/projectimages/wait.webp',
  '/projectimages/shocked.webp',
  '/projectimages/crying.webp',
  '/projectimages/lol.webp',
  '/projectimages/flower.webp',
  '/projectimages/rose.webp',
  '/projectimages/manygift.webp',
  '/projectimages/shutup.webp',
  '/projectimages/saree.webp',
  '/projectimages/saree2.webp',
  '/projectimages/schoolher.webp',
  '/projectimages/popanswer.webp',
  '/projectimages/popbeautiful.webp',
  '/projectimages/popbeautiful2.webp',
  '/projectimages/popguess.webp',
  '/projectimages/popheared.webp',
  '/projectimages/popmelted.webp',
  '/projectimages/popmessage.webp',
  '/projectimages/popmessage2.webp',
  '/projectimages/poppredict.webp',
  '/projectimages/popshock.webp',
  '/projectimages/popsmile.webp',
  '/projectimages/popwrong.webp',
  '/projectimages/sing.webp',
  '/projectimages/sing2.webp',
  '/projectimages/unconcious.webp',
  '/projectimages/bike.webp',
]

const PRELOAD_AUDIO = [
  '/projectimages/rain.mp3',
  '/projectimages/thunder.mp3',
  '/projectimages/sareemusic.mp3',
  '/projectimages/sunrisemusic.mp3',
]

const getSavedCheckpoint = () => {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(CHECKPOINT_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    return parsed
  } catch {
    return null
  }
}

const clampNumber = (value, min, max, fallback) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return fallback
  return Math.min(Math.max(value, min), max)
}

const Background = () => {
  const [dialogueIndex, setDialogueIndex] = useState(0)
  const [storyPhase, setStoryPhase] = useState('idle')
  const [countdownValue, setCountdownValue] = useState(5)
  const [revealDialogueIndex, setRevealDialogueIndex] = useState(0)
  const [showWindowImage, setShowWindowImage] = useState(false)
  const [revealChoice, setRevealChoice] = useState(null)
  const [showChoiceReady, setShowChoiceReady] = useState(false)
  const [showRain, setShowRain] = useState(false)
  const [endingDialogueIndex, setEndingDialogueIndex] = useState(0)
  const [phaseThreeDialogueIndex, setPhaseThreeDialogueIndex] = useState(0)
  const [phaseFourDialogueIndex, setPhaseFourDialogueIndex] = useState(0)
  const [phaseFourStage, setPhaseFourStage] = useState('intro')
  const [showInstructions, setShowInstructions] = useState(true)
  const rainCanvasRef = useRef(null)
  const rainAudioRef = useRef(null)
  const thunderAudioRef = useRef(null)
  const didHydrateRef = useRef(false)
  const skipInitialCountdownRef = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const createdImages = []
    const createdAudio = []
    let idleId = null
    let timeoutId = null
    let released = false

    const preloadImages = (sources) => {
      sources.forEach((src) => {
        const image = new Image()
        image.decoding = 'async'
        image.src = src
        if (typeof image.decode === 'function') {
          image.decode().catch(() => {})
        }
        createdImages.push(image)
      })
    }

    preloadImages(CRITICAL_PRELOAD_IMAGES)

    const preloadSecondary = () => {
      if (released) return
      preloadImages(SECONDARY_PRELOAD_IMAGES)
      PRELOAD_AUDIO.forEach((src) => {
        const audio = new Audio()
        audio.preload = 'auto'
        audio.src = src
        audio.load()
        createdAudio.push(audio)
      })
      const video = document.createElement('video')
      video.preload = 'metadata'
      video.src = '/projectimages/mindvoice.mp4'
      video.load()
    }

    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(preloadSecondary, { timeout: 1200 })
    } else {
      timeoutId = window.setTimeout(preloadSecondary, 500)
    }

    return () => {
      released = true
      if (idleId && 'cancelIdleCallback' in window) window.cancelIdleCallback(idleId)
      if (timeoutId) window.clearTimeout(timeoutId)
      createdAudio.forEach((audio) => {
        audio.pause()
        audio.src = ''
      })
      createdImages.length = 0
    }
  }, [])

  useEffect(() => {
    trackSiteOpen()

    const buildClosePayload = () => {
      const topPhase =
        storyPhase === 'phase4'
          ? `phase4:${phaseFourStage}`
          : storyPhase === 'phase3'
          ? `phase3:${phaseThreeDialogueIndex}`
          : storyPhase === 'ending'
          ? `phase2:${endingDialogueIndex}`
          : storyPhase === 'reveal'
          ? `phase1:reveal:${revealDialogueIndex}`
          : storyPhase
      const completed = storyPhase === 'phase4' && phaseFourStage.includes('climax:1')
      return { phase: topPhase, completed }
    }

    const onBeforeUnload = () => {
      trackSiteClose(buildClosePayload())
    }
    const onPageHide = () => {
      trackSiteClose(buildClosePayload())
    }
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') trackSiteClose(buildClosePayload())
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    window.addEventListener('pagehide', onPageHide)
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload)
      window.removeEventListener('pagehide', onPageHide)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [endingDialogueIndex, phaseFourStage, phaseThreeDialogueIndex, revealDialogueIndex, storyPhase])

  useEffect(() => {
    const phase =
      storyPhase === 'phase4'
        ? `phase4:${phaseFourStage}`
        : storyPhase === 'phase3'
        ? `phase3:${phaseThreeDialogueIndex}`
        : storyPhase === 'ending'
        ? `phase2:${endingDialogueIndex}`
        : storyPhase === 'reveal'
        ? `phase1:reveal:${revealDialogueIndex}`
        : storyPhase
    const completed = storyPhase === 'phase4' && phaseFourStage.includes('climax:1')
    trackProgress({ phase, completed })
  }, [endingDialogueIndex, phaseFourStage, phaseThreeDialogueIndex, revealDialogueIndex, storyPhase])

  const resetRevealScene = useCallback(() => {
    setRevealDialogueIndex(0)
    setShowWindowImage(false)
    setRevealChoice(null)
  }, [])

  const showPreviousDialogue = useCallback(() => {
    setDialogueIndex((current) => Math.max(current - 1, 0))
  }, [])

  const showNextDialogue = useCallback(() => {
    setDialogueIndex((current) => Math.min(current + 1, DIALOGUES.length - 1))
  }, [])

  const handleBackTap = useCallback(() => {
    if (storyPhase === 'phase4') {
      if (phaseFourDialogueIndex > 0) {
        setPhaseFourDialogueIndex((current) => Math.max(current - 1, 0))
      } else {
        setStoryPhase('phase3')
        setPhaseThreeDialogueIndex(PHASE_THREE_DIALOGUES.length - 1)
      }
      return
    }

    if (storyPhase === 'phase3') {
      if (phaseThreeDialogueIndex > 0) {
        setPhaseThreeDialogueIndex((current) => Math.max(current - 1, 0))
      } else {
        setStoryPhase('ending')
        setEndingDialogueIndex(ENDING_DIALOGUES.length - 1)
      }
      return
    }

    if (storyPhase === 'ending') {
      if (endingDialogueIndex > 0) {
        setEndingDialogueIndex((current) => Math.max(current - 1, 0))
      } else {
        setStoryPhase('reveal')
        setRevealDialogueIndex(FINAL_REVEAL_INDEX)
      }
      return
    }

    if (storyPhase === 'idle') {
      showPreviousDialogue()
      return
    }

    if (storyPhase === 'countdown' || storyPhase === 'transition') {
      setStoryPhase('idle')
      setCountdownValue(5)
      setDialogueIndex((current) => Math.max(current - 1, 0))
      resetRevealScene()
      return
    }

    if (storyPhase === 'reveal') {
      if (revealDialogueIndex > 0) {
        setRevealDialogueIndex((current) => Math.max(current - 1, 0))
      } else {
        setStoryPhase('idle')
        setDialogueIndex(Math.max(STORY_TRIGGER_INDEX - 1, 0))
        setCountdownValue(5)
        resetRevealScene()
      }
    }
  }, [
    endingDialogueIndex,
    phaseFourDialogueIndex,
    phaseThreeDialogueIndex,
    revealDialogueIndex,
    resetRevealScene,
    showPreviousDialogue,
    storyPhase,
  ])

  const handleNextTap = useCallback(() => {
    if (storyPhase === 'phase4') {
      setPhaseFourDialogueIndex((current) => Math.min(current + 1, PHASE_FOUR_DIALOGUES.length - 1))
      return
    }

    if (storyPhase === 'phase3') {
      if (phaseThreeDialogueIndex >= PHASE_THREE_DIALOGUES.length - 1) {
        setPhaseFourDialogueIndex(0)
        setStoryPhase('phase4')
        return
      }
      setPhaseThreeDialogueIndex((current) => Math.min(current + 1, PHASE_THREE_DIALOGUES.length - 1))
      return
    }

    if (storyPhase === 'ending') {
      if (endingDialogueIndex >= ENDING_DIALOGUES.length - 1) {
        setPhaseThreeDialogueIndex(0)
        setStoryPhase('phase3')
        return
      }
      setEndingDialogueIndex((current) => Math.min(current + 1, ENDING_DIALOGUES.length - 1))
      return
    }

    if (storyPhase === 'idle') {
      showNextDialogue()
      return
    }

    if (storyPhase === 'reveal') {
      if (revealDialogueIndex === 11 && !revealChoice) return
      if (revealChoice === 'papen' && revealDialogueIndex === 13) {
        setRevealDialogueIndex(15)
        return
      }
      if (revealChoice === 'illaya' && revealDialogueIndex === 14) {
        setRevealDialogueIndex(15)
        return
      }
      if (revealDialogueIndex >= FINAL_REVEAL_INDEX) {
        setEndingDialogueIndex(0)
        setStoryPhase('ending')
        return
      }
      setRevealDialogueIndex((current) => Math.min(current + 1, REVEAL_DIALOGUES.length - 1))
    }
  }, [endingDialogueIndex, phaseThreeDialogueIndex, revealChoice, revealDialogueIndex, showNextDialogue, storyPhase])

  const handleScreenTap = useCallback(
    (event) => {
      const rect = event.currentTarget.getBoundingClientRect()
      const midX = rect.left + rect.width / 2

      if (event.clientX < midX) {
        handleBackTap()
      } else {
        handleNextTap()
      }
    },
    [handleBackTap, handleNextTap],
  )

  const jumpToNextPhase = useCallback(() => {
    if (storyPhase === 'phase3') {
      setPhaseFourDialogueIndex(0)
      setStoryPhase('phase4')
      return
    }

    if (storyPhase === 'ending') {
      setPhaseThreeDialogueIndex(0)
      setStoryPhase('phase3')
      return
    }

    if (storyPhase === 'reveal' || storyPhase === 'idle' || storyPhase === 'countdown' || storyPhase === 'transition') {
      setEndingDialogueIndex(0)
      setStoryPhase('ending')
    }
  }, [storyPhase])

  useEffect(() => {
    if (skipInitialCountdownRef.current) {
      skipInitialCountdownRef.current = false
      return
    }

    if (dialogueIndex !== STORY_TRIGGER_INDEX) {
      setStoryPhase('idle')
      setCountdownValue(5)
      resetRevealScene()
      return
    }

    setStoryPhase('countdown')
    setCountdownValue(5)
    resetRevealScene()

    let current = 5
    const countdownTimer = setInterval(() => {
      current -= 1
      if (current >= 1) {
        setCountdownValue(current)
      } else {
        clearInterval(countdownTimer)
      }
    }, 820)

    const transitionTimer = setTimeout(() => {
      setStoryPhase('transition')
    }, 4300)

    const revealTimer = setTimeout(() => {
      setStoryPhase('reveal')
    }, 5050)

    return () => {
      clearInterval(countdownTimer)
      clearTimeout(transitionTimer)
      clearTimeout(revealTimer)
    }
  }, [dialogueIndex, resetRevealScene])

  useEffect(() => {
    if (storyPhase !== 'reveal') {
      setShowWindowImage(false)
      return
    }

    // Keep building visible through "Zoom it more", then switch together
    // with the next dialogue + popsmile for a clean synced beat.
    setShowWindowImage(revealDialogueIndex >= 6)
  }, [revealDialogueIndex, storyPhase])

  useEffect(() => {
    if (revealDialogueIndex < 11) {
      setRevealChoice(null)
    }
  }, [revealDialogueIndex])

  useEffect(() => {
    const inRainRange =
      storyPhase === 'reveal' &&
      revealDialogueIndex >= RAIN_START_INDEX &&
      revealDialogueIndex <= RAIN_END_INDEX

    setShowRain(inRainRange)
  }, [revealDialogueIndex, storyPhase])

  useEffect(() => {
    if (!showRain) {
      if (rainAudioRef.current) {
        rainAudioRef.current.pause()
        rainAudioRef.current.currentTime = 0
      }
      return
    }

    const audio = rainAudioRef.current
    if (!audio) return
    audio.loop = true
    audio.volume = 0.42
    audio.play().catch(() => {})

    return () => {
      audio.pause()
      audio.currentTime = 0
    }
  }, [showRain])

  useEffect(() => {
    if (!showRain) return

    let timeoutId
    const playThunder = () => {
      const thunder = thunderAudioRef.current
      if (thunder) {
        thunder.currentTime = 0
        thunder.volume = 0.68
        thunder.play().catch(() => {})
      }
      const nextDelay = 3400 + Math.random() * 4200
      timeoutId = window.setTimeout(playThunder, nextDelay)
    }

    timeoutId = window.setTimeout(playThunder, 2400)
    return () => window.clearTimeout(timeoutId)
  }, [showRain])

  useEffect(() => {
    if (!showRain) return

    const canvas = rainCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const DPR = Math.min(window.devicePixelRatio || 1, 2)
    const drops = []
    const dropCount = 220
    let width = 0
    let height = 0
    let rafId

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.floor(width * DPR)
      canvas.height = Math.floor(height * DPR)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
    }

    const spawnDrop = () => ({
      x: Math.random() * width,
      y: Math.random() * -height,
      len: 14 + Math.random() * 24,
      speed: 9 + Math.random() * 10,
      drift: 1.6 + Math.random() * 1.4,
      alpha: 0.2 + Math.random() * 0.45,
      thick: 1 + Math.random() * 1.1,
    })

    resize()
    for (let i = 0; i < dropCount; i += 1) drops.push(spawnDrop())

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = 'rgba(10, 16, 30, 0.1)'
      ctx.fillRect(0, 0, width, height)

      for (let i = 0; i < drops.length; i += 1) {
        const d = drops[i]
        ctx.strokeStyle = `rgba(208,225,255,${d.alpha})`
        ctx.lineWidth = d.thick
        ctx.beginPath()
        ctx.moveTo(d.x, d.y)
        ctx.lineTo(d.x - d.drift * 3.2, d.y + d.len)
        ctx.stroke()

        d.x -= d.drift
        d.y += d.speed
        if (d.y > height + d.len || d.x < -30) {
          drops[i] = { ...spawnDrop(), x: Math.random() * (width + 120), y: -20 - Math.random() * 220 }
        }
      }

      rafId = window.requestAnimationFrame(draw)
    }

    draw()
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
      window.cancelAnimationFrame(rafId)
      ctx.clearRect(0, 0, width, height)
    }
  }, [showRain])

  useEffect(() => {
    if (storyPhase === 'reveal' && revealDialogueIndex === 11 && !revealChoice) {
      setShowChoiceReady(false)
      const timer = setTimeout(() => {
        setShowChoiceReady(true)
      }, 2000)
      return () => clearTimeout(timer)
    }

    setShowChoiceReady(false)
  }, [revealChoice, revealDialogueIndex, storyPhase])

  const characterImage = dialogueIndex >= 2 ? '/projectimages/hi1.webp' : '/projectimages/hi.webp'
  const showStoryReveal = storyPhase === 'reveal'
  const showPhaseOneEnding = storyPhase === 'ending'
  const showPhaseThree = storyPhase === 'phase3'
  const showPhaseFour = storyPhase === 'phase4'
  const showStoryCountdown = storyPhase === 'countdown'
  const showStoryTransition = storyPhase === 'transition'
  const showChoiceButtons = showStoryReveal && revealDialogueIndex === 11 && !revealChoice && showChoiceReady
  const isLegacyRevealBeat = revealDialogueIndex <= 6 && !revealChoice
  const sceneImage =
    revealDialogueIndex >= SING2_INDEX
      ? '/projectimages/sing2.webp'
      : revealDialogueIndex >= SING_INDEX
      ? '/projectimages/sing.webp'
      : revealDialogueIndex >= FINAL_RAIN_INDEX
      ? '/projectimages/window4.webp'
      : revealDialogueIndex >= 15
      ? '/projectimages/window1.webp'
      : revealChoice === 'papen' && revealDialogueIndex >= 12
      ? '/projectimages/window4.webp'
      : revealChoice === 'illaya' && revealDialogueIndex >= 14
      ? '/projectimages/window3.webp'
      : revealDialogueIndex >= 8
      ? '/projectimages/window3.webp'
      : revealDialogueIndex >= 7
      ? '/projectimages/window2.webp'
      : '/projectimages/window1.webp'

  const peekImage =
    revealDialogueIndex >= SING2_INDEX
      ? '/projectimages/popbeautiful.webp'
      : revealDialogueIndex >= SING_INDEX
      ? '/projectimages/popbeautiful2.webp'
      : revealDialogueIndex >= POPHEARED_INDEX
      ? '/projectimages/popheared.webp'
      : revealDialogueIndex >= POPMELTED_AFTER_RAIN_INDEX && revealDialogueIndex < POPHEARED_INDEX
      ? '/projectimages/popmelted.webp'
      : revealDialogueIndex >= RAIN_POPMESSAGE_INDEX && revealDialogueIndex < POPMELTED_AFTER_RAIN_INDEX
      ? '/projectimages/popmessage.webp'
      : revealDialogueIndex >= FINAL_RAIN_INDEX
      ? ''
      : revealDialogueIndex >= MELTED_START_INDEX && revealDialogueIndex < FINAL_RAIN_INDEX
      ? '/projectimages/popmelted.webp'
      : revealDialogueIndex === BEAUTIFUL_INDEX
      ? '/projectimages/popbeautiful2.webp'
      : revealDialogueIndex >= 15
      ? '/projectimages/popmessage.webp'
      : revealChoice === 'papen' && revealDialogueIndex >= 13
      ? '/projectimages/popmelted.webp'
      : revealChoice === 'papen' && revealDialogueIndex >= 12
      ? '/projectimages/popshock.webp'
      : revealChoice === 'illaya' && revealDialogueIndex >= 14
      ? '/projectimages/poppredict.webp'
      : revealDialogueIndex >= 10
      ? '/projectimages/popmessage2.webp'
      : revealDialogueIndex >= 6
      ? '/projectimages/popsmile.webp'
      : revealDialogueIndex >= 3
      ? '/projectimages/popmessage2.webp'
      : '/projectimages/popmessage.webp'
  const buildingScale = revealDialogueIndex >= 5 ? 1.62 : revealDialogueIndex >= 4 ? 1.35 : 1
  const buildingY = revealDialogueIndex >= 5 ? -26 : revealDialogueIndex >= 4 ? -12 : 0

  return (
    <main className="love-bg" aria-label="Soft love themed animated background">
      <div className="love-blob love-blob-a" />
      <div className="love-blob love-blob-b" />
      <div className="love-blob love-blob-c" />
      <div className="love-hearts" />
      <div className="love-haze" />
      <div className="love-vignette" />

      <AnimatePresence>
        {showInstructions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-md"
            >
              <div className="absolute -top-20 -left-20 h-40 w-40 rounded-full bg-rose-500/30 blur-3xl" />
              <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-purple-500/30 blur-3xl" />

              <h2 className="mb-8 text-center text-3xl font-bold text-white drop-shadow-md" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                How to Watch 💖
              </h2>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex flex-col items-center justify-center rounded-2xl bg-white/5 p-4 border border-white/10">
                  <FaChevronLeft className="text-3xl text-rose-300 mb-2" />
                  <span className="text-sm font-medium text-rose-100">Tap Left</span>
                  <span className="text-xs text-white/50">Go Back</span>
                </div>
                <div className="flex flex-col items-center justify-center rounded-2xl bg-white/5 p-4 border border-white/10">
                  <FaChevronRight className="text-3xl text-rose-300 mb-2" />
                  <span className="text-sm font-medium text-rose-100">Tap Right</span>
                  <span className="text-xs text-white/50">Continue</span>
                </div>
              </div>

              <div className="mb-8 rounded-2xl bg-white/5 p-4 border border-white/10 flex items-center gap-4">
                <div className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-full bg-white/10">
                  <FaStepForward className="text-lg text-rose-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-rose-100">Feel Boring?</p>
                  <p className="text-xs text-white/50">Click "Next Phase" at top right to skip.</p>
                </div>
              </div>

              <button
                onClick={() => setShowInstructions(false)}
                className="w-full rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 py-3.5 text-lg font-bold text-white shadow-lg transition-transform active:scale-95 hover:shadow-rose-500/25"
              >
                Start Journey ✨
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="relative z-10 min-h-screen overflow-hidden" onPointerDown={handleScreenTap}>
        {!showPhaseOneEnding && !showPhaseThree && !showPhaseFour ? (
          <button
            type="button"
            onPointerDown={(event) => {
              event.stopPropagation()
              jumpToNextPhase()
            }}
            className="absolute right-3 top-[max(10px,calc(env(safe-area-inset-top)+8px))] z-[95] rounded-full border border-white/75 bg-white/88 px-3 py-1 text-xs font-semibold text-rose-700 shadow-[0_8px_20px_rgba(62,23,49,0.2)] backdrop-blur sm:right-4 sm:top-4"
          >
            Next Phase
          </button>
        ) : null}

        <AnimatePresence>
          {!showStoryReveal && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{
                  opacity: 1,
                  y: [0, -4, 0],
                  scale: 1,
                  boxShadow: [
                    '0 16px 38px rgba(157,42,96,0.16)',
                    '0 20px 45px rgba(157,42,96,0.2)',
                    '0 16px 38px rgba(157,42,96,0.16)',
                  ],
                }}
                exit={{ opacity: 0, y: -16, scale: 0.92 }}
                transition={{
                  opacity: { delay: 0.18, duration: 0.75, ease: [0.22, 1, 0.36, 1] },
                  scale: { delay: 0.18, duration: 0.75, ease: [0.22, 1, 0.36, 1] },
                  y: { delay: 0.95, duration: 5.2, repeat: Infinity, ease: 'easeInOut' },
                  boxShadow: { delay: 0.95, duration: 5.2, repeat: Infinity, ease: 'easeInOut' },
                }}
                className="absolute left-1/2 top-4 z-20 w-[min(92vw,430px)] -translate-x-1/2 overflow-hidden rounded-[1.75rem] border border-white/90 bg-gradient-to-br from-white/88 via-rose-50/78 to-white/78 px-5 py-4 text-rose-700 backdrop-blur-xl md:left-auto md:right-[8%] md:top-[14%] md:translate-x-0 md:px-6 md:py-5"
              >
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-75"
                  animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    backgroundImage:
                      'linear-gradient(115deg, rgba(255,255,255,0) 18%, rgba(255,255,255,0.6) 36%, rgba(255,255,255,0) 56%)',
                    backgroundSize: '200% 200%',
                  }}
                />

                <div className="absolute -bottom-3 left-9 h-6 w-6 rotate-45 border-b border-r border-rose-100/90 bg-white/88 md:left-12" />

                <motion.span
                  aria-hidden
                  className="pointer-events-none absolute -right-2 top-2 text-base text-rose-300/70"
                  animate={{ y: [0, -8, 0], rotate: [0, 8, 0] }}
                  transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <FaHeart />
                </motion.span>
                <motion.span
                  aria-hidden
                  className="pointer-events-none absolute -left-1 bottom-2 text-sm text-rose-300/65"
                  animate={{ y: [0, -6, 0], rotate: [0, -10, 0] }}
                  transition={{ duration: 5.1, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <FaHeart />
                </motion.span>

                <div className="mb-2 flex items-center gap-1.5">
                  <motion.span
                    className="h-2.5 w-2.5 rounded-full bg-rose-300/80"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <motion.span
                    className="h-2.5 w-2.5 rounded-full bg-rose-200/80"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 1.4, delay: 0.2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <motion.span
                    className="h-2.5 w-2.5 rounded-full bg-rose-100/90"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 1.4, delay: 0.4, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </div>

                <div className="relative min-h-[100px] sm:min-h-[115px]">
                  <AnimatePresence mode="wait">
                    <motion.h1
                      key={dialogueIndex}
                      initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -8, filter: 'blur(5px)' }}
                      transition={{ duration: 0.42, ease: 'easeOut' }}
                      className="bg-gradient-to-r from-rose-700 via-fuchsia-600 to-rose-500 bg-clip-text text-[1.92rem] font-semibold leading-[1.08] text-transparent drop-shadow-[0_3px_8px_rgba(185,74,130,0.35)] sm:text-[2.35rem]"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {DIALOGUES[dialogueIndex]}
                    </motion.h1>
                  </AnimatePresence>
                </div>

                <div className="mt-2 flex items-center gap-2">
                  {DIALOGUES.map((_, index) => (
                    <span
                      key={index}
                      className={`h-1.5 rounded-full transition-all ${
                        index === dialogueIndex ? 'w-7 bg-rose-500/75' : 'w-3 bg-rose-200/85'
                      }`}
                    />
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 80, scale: 0.95 }}
                animate={{ opacity: 1, y: [0, -6, 0], scale: 1 }}
                exit={{ opacity: 0, y: 40, scale: 0.95 }}
                transition={{
                  opacity: { delay: 0.25, duration: 0.9, ease: [0.22, 1, 0.36, 1] },
                  y: { delay: 0.25, duration: 4.8, repeat: Infinity, ease: 'easeInOut' },
                  scale: { delay: 0.25, duration: 0.9, ease: [0.22, 1, 0.36, 1] },
                }}
                className="absolute bottom-0 left-1/2 z-10 w-[min(96vw,760px)] -translate-x-1/2"
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={characterImage}
                    src={characterImage}
                    alt="Boy character talking"
                    initial={{ opacity: 0, x: 34, scale: 0.975, rotate: -1.2, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, x: 0, scale: 1, rotate: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, x: -28, scale: 0.975, rotate: 1.2, filter: 'blur(4px)' }}
                    transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
                    className="mx-auto h-auto max-h-[74vh] w-full object-contain drop-shadow-[0_20px_36px_rgba(111,25,63,0.24)] sm:max-h-[78vh]"
                  />
                </AnimatePresence>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showStoryCountdown && (
            <motion.div
              key={`countdown-${countdownValue}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute right-3 top-3 z-40 sm:right-5 sm:top-5"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.4, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.25, filter: 'blur(8px)' }}
                transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl border border-white/75 bg-white/58 px-4 py-2 text-2xl font-semibold text-rose-700 shadow-[0_12px_26px_rgba(111,25,63,0.18)] backdrop-blur-xl sm:px-5 sm:py-2.5 sm:text-3xl"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                <span className="mr-2 text-xs font-medium uppercase tracking-[0.16em] text-rose-500/80 sm:text-[11px]">
                  Scene
                </span>
                {countdownValue}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showStoryTransition && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="pointer-events-none absolute inset-0 z-[45]"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 bg-gradient-to-b from-rose-200/40 via-rose-300/25 to-[#251724]/70 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, x: '-30%' }}
                animate={{ opacity: [0, 0.85, 0], x: '110%' }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                className="absolute inset-y-0 w-[28%] bg-gradient-to-r from-transparent via-white/70 to-transparent"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showStoryReveal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 z-50 overflow-hidden bg-[#1f1723]"
            >
              <motion.img
                aria-hidden
                src="/projectimages/building.webp"
                initial={{ scale: 1.4, opacity: 0.26, filter: 'blur(22px) saturate(1.35)' }}
                animate={{ scale: 1.1, opacity: 0.62, filter: 'blur(12px) saturate(1.35)' }}
                transition={{ duration: 8.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-[radial-gradient(80%_65%_at_50%_20%,rgba(255,227,197,0.52),rgba(255,227,197,0)_70%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(65%_48%_at_50%_98%,rgba(25,12,30,0.56),rgba(25,12,30,0)_72%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(26,17,34,0.35)_0%,rgba(26,17,34,0.06)_38%,rgba(26,17,34,0.42)_100%)]" />

              <div className="relative z-10 flex h-full w-full items-center justify-center px-3 pb-18 pt-12 sm:px-6 sm:pb-24">
                <AnimatePresence mode="wait">
                  {isLegacyRevealBeat && !showWindowImage ? (
                    <motion.img
                      key="building-main"
                      src="/projectimages/building.webp"
                      alt="Where our story begins"
                      initial={{ scale: 2.8, opacity: 0.78, y: 30, filter: 'blur(14px) saturate(0.86)' }}
                      animate={{ scale: buildingScale, opacity: 1, y: buildingY, filter: 'blur(0px) saturate(1.05)' }}
                      exit={{ scale: 1.95, opacity: 0, y: -26, filter: 'blur(12px)' }}
                      transition={{ duration: 1.35, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full w-full object-contain"
                    />
                  ) : isLegacyRevealBeat ? (
                    <motion.img
                      key="window-main"
                      src="/projectimages/window1.webp"
                      alt="Zoomed window view"
                      initial={{ scale: 2.05, opacity: 0, y: 18, filter: 'blur(12px)' }}
                      animate={{ scale: 1, opacity: 1, y: 0, filter: 'blur(0px)' }}
                      transition={{ duration: 1.42, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <motion.img
                      key={`${sceneImage}-${revealChoice ?? 'none'}`}
                      src={sceneImage}
                      alt="Story scene"
                      initial={{ scale: 2.05, opacity: 0, y: 18, filter: 'blur(12px)' }}
                      animate={{
                        scale: revealDialogueIndex >= FINAL_RAIN_INDEX ? 0.92 : 1,
                        opacity: 1,
                        y: 0,
                        filter: 'blur(0px)',
                      }}
                      exit={{ scale: 1.35, opacity: 0, y: -12, filter: 'blur(8px)' }}
                      transition={{ duration: 1.42, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full w-full object-contain"
                    />
                  )}
                </AnimatePresence>
              </div>

              <div className="pointer-events-none absolute bottom-24 left-0 z-20 flex items-end sm:bottom-4 lg:bottom-0">
                <AnimatePresence mode="wait">
                  {peekImage ? (
                    <motion.img
                      key={peekImage}
                      src={peekImage}
                      alt="Peeking popup"
                      initial={{ x: -220, opacity: 0, rotate: -6 }}
                      animate={{ x: 0, opacity: 1, rotate: 0, y: [0, -4, 0] }}
                      exit={{ x: -160, opacity: 0, rotate: -5 }}
                      transition={{
                        x: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
                        opacity: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
                        rotate: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
                        y: { duration: 4.2, repeat: Infinity, ease: 'easeInOut' },
                      }}
                      className="w-[142px] sm:w-[210px] lg:w-[285px]"
                    />
                  ) : null}
                </AnimatePresence>
              </div>

              {showRain ? (
                <div className="pointer-events-none absolute inset-0 z-20">
                  <canvas ref={rainCanvasRef} className="rain-canvas" />
                  <div className="rain-mist" />
                </div>
              ) : null}

              <audio ref={rainAudioRef} src="/projectimages/rain.mp3" preload="auto" />
              <audio ref={thunderAudioRef} src="/projectimages/thunder.mp3" preload="auto" />

              <div className="absolute bottom-[max(72px,calc(env(safe-area-inset-bottom)+56px))] left-1/2 z-30 w-[min(94vw,640px)] -translate-x-1/2 sm:bottom-6 lg:bottom-7 lg:w-[min(42vw,520px)]">
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="relative max-h-[36svh] overflow-y-auto rounded-[1.55rem] border border-white/55 bg-gradient-to-br from-[#fff9fc]/92 via-[#ffeef6]/88 to-[#fff7fb]/9 px-4 py-3 shadow-[0_14px_28px_rgba(33,10,37,0.24)] ring-1 ring-rose-200/45 backdrop-blur-xl sm:px-6 sm:py-5 lg:rounded-[1.45rem] lg:px-5 lg:py-4 lg:shadow-[0_14px_30px_rgba(33,10,37,0.22)]"
                >
                  <motion.div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-70"
                    animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                    transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                      backgroundImage:
                        'linear-gradient(120deg, rgba(255,255,255,0) 20%, rgba(255,255,255,0.65) 38%, rgba(255,255,255,0) 58%)',
                      backgroundSize: '220% 220%',
                    }}
                  />

                  <div className="absolute -left-2 bottom-4 h-4 w-4 rotate-45 border-b border-l border-white/65 bg-[#fff6fb]/92 sm:-left-1" />
                  <div className="pointer-events-none absolute -left-4 top-3 text-3xl text-rose-300/45 sm:text-4xl">
                    "
                  </div>

                  <div className="relative min-h-[82px] sm:min-h-[96px] lg:min-h-[78px]">
                    <AnimatePresence mode="wait">
                      <motion.h2
                        key={revealDialogueIndex}
                        initial={{ opacity: 0, y: 8, filter: 'blur(5px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -8, filter: 'blur(5px)' }}
                        transition={{ duration: 0.45, ease: 'easeOut' }}
                        className="bg-gradient-to-r from-[#6f1043] via-[#b52f78] to-[#6f1043] bg-clip-text text-[1.02rem] font-semibold leading-[1.28] text-transparent drop-shadow-[0_2px_8px_rgba(182,82,130,0.3)] sm:text-[1.95rem] lg:text-[1.5rem] lg:leading-[1.18]"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                      >
                        {REVEAL_DIALOGUES[revealDialogueIndex]}
                      </motion.h2>
                    </AnimatePresence>
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    {REVEAL_DIALOGUES.map((_, index) => (
                      <span
                        key={index}
                        className={`h-1.5 rounded-full transition-all ${
                          index === revealDialogueIndex ? 'w-8 bg-rose-500/90' : 'w-3 bg-rose-200/95'
                        }`}
                      />
                    ))}
                  </div>
                </motion.div>
              </div>

              <AnimatePresence>
                {showChoiceButtons && (
                  <motion.div
                    initial={{ opacity: 0, y: 26, scale: 0.82, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-x-0 bottom-[148px] z-40 flex items-center justify-center gap-3 px-4 sm:bottom-[168px]"
                  >
                    <motion.button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        setRevealChoice('papen')
                        setRevealDialogueIndex(12)
                      }}
                      initial={{ opacity: 0, x: -28, y: 24, rotate: -6, scale: 0.88 }}
                      animate={{ opacity: 1, x: [-28, 14, -8, 0], y: [24, -8, 5, 0], rotate: [-6, 3, -1, 0], scale: 1 }}
                      transition={{ delay: 0.08, duration: 0.72, ease: 'easeOut' }}
                      whileHover={{ y: -2, scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="rounded-full border border-rose-300/75 bg-white/92 px-5 py-2 text-sm font-semibold text-rose-700 shadow-[0_10px_24px_rgba(42,14,38,0.22)] transition hover:-translate-y-0.5 hover:bg-rose-50"
                    >
                      Papen
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        setRevealChoice('illaya')
                        setRevealDialogueIndex(14)
                      }}
                      initial={{ opacity: 0, x: 28, y: 24, rotate: 6, scale: 0.88 }}
                      animate={{ opacity: 1, x: [28, -14, 8, 0], y: [24, -8, 5, 0], rotate: [6, -3, 1, 0], scale: 1 }}
                      transition={{ delay: 0.16, duration: 0.72, ease: 'easeOut' }}
                      whileHover={{ y: -2, scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="rounded-full border border-white/65 bg-rose-500/82 px-5 py-2 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(42,14,38,0.22)] transition hover:-translate-y-0.5 hover:bg-rose-500"
                    >
                      Illaya
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showPhaseOneEnding && (
            <PhaseOneEnding
              dialogue={ENDING_DIALOGUES[endingDialogueIndex]}
              dialogueIndex={endingDialogueIndex}
              onNextPhase={() => {
                setPhaseThreeDialogueIndex(0)
                setStoryPhase('phase3')
              }}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showPhaseThree && (
            <PhaseThree
              dialogueIndex={phaseThreeDialogueIndex}
              onNextPhase={() => {
                setPhaseFourDialogueIndex(0)
                setStoryPhase('phase4')
              }}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showPhaseFour && <PhaseFour dialogueIndex={phaseFourDialogueIndex} onStageChange={setPhaseFourStage} />}
        </AnimatePresence>
      </section>
    </main>
  )
}

export default Background
