import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { trackChoice, trackMemoryMessage } from '../lib/tracker'

const PHASE_FOUR_DIALOGUES = ['interactive']
const INTRO_TEXT = 'Nanga badminton velayandu pathathu illala nenga...\nIpade chudu...'
const PHASE_FIVE_DIALOGUES = [
  "Na romba pesuren la? 😅",
  'I know yaar.',
  'Romba vala vala nu pesuren la',
  'If I’m boring you... should I just stop right here?',
  'Wait, honestly... bore adikkallaya unaku?',
  'Ok, let me ask you one thing.',
  'Have you ever asked me what my dreams are?',
  'Athu ethuke Naa kekanum, athu thana soluva thereyum.',
  'Analum na ne solleren.',
  'My dreams aren’t just one or two... they are endless.',
  'Aana ella kanavulayum neeye than irukka.',
  'Antha edathula vera yarayum ennala nenaithu kuda pakka mudeyala.',
  'Enaikachi Oru nal ...',
  'Morning illama, night illama, oru calm evening time pola...',
  'Apade vaanatha patha orange color la amaithiya erukum.',
  'While the whole world is silent...',
  'Unnai enoda scooty la vachu... just you and me ',
  'Apadeye scooty la poykede eruka pothu. kathaipoma padu kedukeday.',
  'Un azhagai rasichikkitte... getting lost in the moment.',
  'Uralam suthi kadanum asa.',
  'Maybe enaku route theriyaathu... I don’t know the way.',
  'Menna pinna poi palakam kedayathu. ',
  'Vali kaadiyaga kadise vara varuvaya?',
]
const PHASE_SIX_DIALOGUES = [
  'Enoda Alagee...',
  "Ippo naan panninathu… Unaku en mela love varanum nu oru intention la illa.",
  'unaku pudekumey nu panen.',
  "Idhu panna na konjam effort potten… Aana athu ellam scene katurathuke illa.",
  "Just unakage na panen. Aana enaku oru chinna doubt…",
  "Oru naalavadhu… Un manasula enakku konjam idam irundhucha?"
]
const PHASE_SIX_AFTER_Q1 = ['Ithye mari kelvi thana first website la unkeda kedain.']
const PHASE_SIX_YES_DIALOGUES = ['Apo ethuke paa ne evlo nal enkeda sollala ne.', 'Vanthu sollalam la.', 'Enaku varutham paa.😥']
const PHASE_SIX_NO_DIALOGUES = [
  'Ethuke ena love pannala nee.',
  'Panuren ne sollu.',
  'Ena love hey panna madeya ne.',
  'Avelothana.',
  'Summa masthi pannen paa.',
  'Hahaahaa.',
  'Enoda Kaushi penkutti.',
  'Love panerathuke yarachi force panuvangala.',
  'Unkeda summa velayanden.',
  'Ne love pannanum ne katayum illa.',
  'Na unna love pannuven atheve pothum.',
]
const PHASE_SEVEN_DIALOGUES = [
  'Ne epovum why only me? nu kekkala.',
  'Athuke pathil epo solleren... kellu.',
  'Romba ayede enaku.',
  'Ithuke mela na ethu pesa matten, ok?',
  'Ithu unaku than.',
  'Intha rose.',
  'Amma, rose la boring pa.',
  'Intha malli poo',
  'Intha teddy bear.',
  'Take this all.',
]

const easeInOut = (t) => 0.5 * (1 - Math.cos(Math.PI * t))

const quadPoint = (p0, p1, p2, t) => {
  const one = 1 - t
  return one * one * p0 + 2 * one * t * p1 + t * t * p2
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const PhaseFour = ({ onNextPhase, onStageChange }) => {
  const [stage, setStage] = useState('intro')
  const [leftPose, setLeftPose] = useState('bathit')
  const [rightPose, setRightPose] = useState('batherwait')
  const [dialogue, setDialogue] = useState(INTRO_TEXT)
  const [speaker, setSpeaker] = useState('boy')
  const [showCenterIntro, setShowCenterIntro] = useState(true)
  const [playersOpacity, setPlayersOpacity] = useState(1)
  const [blackOpacity, setBlackOpacity] = useState(0)
  const [busy, setBusy] = useState(false)
  const [shuttle, setShuttle] = useState({ visible: false, x: 0, y: 0, rotation: 0, opacity: 1, scale: 1 })
  const [showShadow, setShowShadow] = useState(false)
  const [phaseFiveIndex, setPhaseFiveIndex] = useState(0)
  const [phaseFiveChoiceOpen, setPhaseFiveChoiceOpen] = useState(false)
  const [phaseFiveStopMode, setPhaseFiveStopMode] = useState(false)
  const [phaseFiveStopStep, setPhaseFiveStopStep] = useState(0)
  const [phaseFiveFade, setPhaseFiveFade] = useState(0)
  const [phaseFiveTravelChoiceOpen, setPhaseFiveTravelChoiceOpen] = useState(false)
  const [phaseFiveEmotionalShow, setPhaseFiveEmotionalShow] = useState(false)
  const [phaseFiveAwaitRideExitTap, setPhaseFiveAwaitRideExitTap] = useState(false)
  const [phaseFiveBikeExit, setPhaseFiveBikeExit] = useState(false)
  const [phaseSixIndex, setPhaseSixIndex] = useState(0)
  const [phaseSixMode, setPhaseSixMode] = useState('intro')
  const [phaseSixQ1Open, setPhaseSixQ1Open] = useState(false)
  const [phaseSixQ2Open, setPhaseSixQ2Open] = useState(false)
  const [phaseSixNoUnlock, setPhaseSixNoUnlock] = useState(false)
  const [phaseSevenIndex, setPhaseSevenIndex] = useState(0)
  const [phaseSixNoHopIndex, setPhaseSixNoHopIndex] = useState(0)
  const [mindVoiceActive, setMindVoiceActive] = useState(false)
  const [mindVoiceVanishing, setMindVoiceVanishing] = useState(false)
  const [mindVoiceGone, setMindVoiceGone] = useState(false)
  const [endingInput, setEndingInput] = useState('')
  const [endingSubmitted, setEndingSubmitted] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [endingCountdown, setEndingCountdown] = useState(3)
  const [showClimax, setShowClimax] = useState(false)
  const [climaxReady, setClimaxReady] = useState(false)
  const [climaxTypedText, setClimaxTypedText] = useState('')
  const [endingModal, setEndingModal] = useState('')

  const rafRef = useRef(null)
  const mountedRef = useRef(true)
  const sunriseAudioRef = useRef(null)
  const sunrisePlayedRef = useRef(false)
  const mindVoiceTimerRef = useRef(null)
  const climaxIntervalRef = useRef(null)
  const climaxRevealTimerRef = useRef(null)
  const climaxTypeRef = useRef(null)

  useEffect(() => {
    return () => {
      mountedRef.current = false
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (sunriseAudioRef.current) {
        sunriseAudioRef.current.pause()
      }
      if (mindVoiceTimerRef.current) {
        clearTimeout(mindVoiceTimerRef.current)
      }
      if (climaxIntervalRef.current) clearInterval(climaxIntervalRef.current)
      if (climaxRevealTimerRef.current) clearTimeout(climaxRevealTimerRef.current)
      if (climaxTypeRef.current) clearInterval(climaxTypeRef.current)
    }
  }, [])

  const sendEvent = async ({ phase, question, choice, extra }) => {
    try {
      return await trackChoice({ phase, question, choice, extra })
    } catch (error) {
      console.error('Track event error:', error)
      return false
    }
  }

  useEffect(() => {
    if (typeof onStageChange === 'function') {
      const snapshot = `${stage}|p5:${phaseFiveIndex}|p6:${phaseSixMode}:${phaseSixIndex}|p7:${phaseSevenIndex}|submitted:${
        endingSubmitted ? 1 : 0
      }|climax:${climaxReady ? 1 : 0}`
      onStageChange(snapshot)
    }
  }, [climaxReady, endingSubmitted, onStageChange, phaseFiveIndex, phaseSevenIndex, phaseSixIndex, phaseSixMode, stage])

  const getPoints = () => {
    const w = window.innerWidth
    const h = window.innerHeight
    return {
      left: { x: w * 0.33, y: h * 0.57 },
      right: { x: w * 0.67, y: h * 0.53 },
      mid: { x: w * 0.5, y: h * 0.5 },
    }
  }

  const animateShuttle = ({ from, to, durationMs = 3800, drop = false, bounce = false }) =>
    new Promise((resolve) => {
      if (!mountedRef.current) return resolve()
      const start = performance.now()
      setShuttle({ visible: true, x: from.x, y: from.y, rotation: -10, opacity: 1, scale: 0.96 })
      setShowShadow(true)

      const controlY = drop ? Math.max(from.y, to.y) + 130 : Math.min(from.y, to.y) - 170
      const controlX = (from.x + to.x) / 2

      const frame = (now) => {
        const tRaw = Math.min((now - start) / durationMs, 1)
        const t = easeInOut(tRaw)
        const x = quadPoint(from.x, controlX, to.x, t)
        let y = quadPoint(from.y, controlY, to.y, t)
        if (bounce && tRaw > 0.82) {
          const bt = (tRaw - 0.82) / 0.18
          y -= Math.sin(bt * Math.PI * 2) * (1 - bt) * 20
        }
        const rotation = -10 + t * 15
        const scale = 0.96 + 0.06 * Math.sin(t * Math.PI)
        const opacity = drop && tRaw > 0.9 ? 1 - (tRaw - 0.9) / 0.1 : 1
        setShuttle({ visible: true, x, y, rotation, opacity, scale })

        if (tRaw < 1 && mountedRef.current) {
          rafRef.current = requestAnimationFrame(frame)
        } else {
          setShowShadow(false)
          setShuttle((s) => ({ ...s, visible: false }))
          resolve()
        }
      }

      rafRef.current = requestAnimationFrame(frame)
    })

  const startPhaseFiveWithCinematic = async () => {
    setBusy(true)
    try {
      const fadeInStart = performance.now()
      const fadeInDuration = 1800
      const fadeInFrame = (now) => {
        const t = Math.min((now - fadeInStart) / fadeInDuration, 1)
        setBlackOpacity(easeInOut(t))
        if (t < 1 && mountedRef.current) rafRef.current = requestAnimationFrame(fadeInFrame)
      }
      rafRef.current = requestAnimationFrame(fadeInFrame)
      await sleep(1400)

      setStage('phase5')
      setPhaseFiveIndex(0)
      setPhaseFiveChoiceOpen(false)
      setPhaseFiveStopMode(false)
      setPhaseFiveStopStep(0)
      setPhaseFiveTravelChoiceOpen(false)
      setPhaseFiveEmotionalShow(false)
      setPhaseFiveAwaitRideExitTap(false)
      setPhaseFiveBikeExit(false)
      setDialogue(PHASE_FIVE_DIALOGUES[0])
      setSpeaker('boy')
      setShowCenterIntro(false)
      setPlayersOpacity(1)
      setShuttle({ visible: false, x: 0, y: 0, rotation: 0, opacity: 1, scale: 1 })
      setPhaseFiveFade(0)

      const fadeOutStart = performance.now()
      const fadeOutDuration = 1900
      const fadeOutFrame = (now) => {
        const t = Math.min((now - fadeOutStart) / fadeOutDuration, 1)
        setBlackOpacity(1 - easeInOut(t))
        if (t < 1 && mountedRef.current) rafRef.current = requestAnimationFrame(fadeOutFrame)
      }
      rafRef.current = requestAnimationFrame(fadeOutFrame)
      await sleep(1000)
      setBlackOpacity(0)
    } finally {
      setBusy(false)
    }
  }

  const roundOne = async () => {
    setBusy(true)
    const p = getPoints()
    setLeftPose('bathit')
    setRightPose('batherwait')

    await sleep(220)
    setLeftPose('bathit1')
    await sleep(220)
    await animateShuttle({ from: p.left, to: p.right, durationMs: 4300 })

    setRightPose('bathither')
    await sleep(500)
    setRightPose('bathither1')
    await sleep(250)
    setRightPose('batherwait')

    await animateShuttle({
      from: p.right,
      to: { x: p.mid.x - 40, y: p.mid.y + 230 },
      durationMs: 3000,
      drop: true,
      bounce: true,
    })

    setRightPose('bathersmile')
    setLeftPose('batsmile')
    setSpeaker('boy')
    setDialogue('Nanga velayada pothu theriyama vera engayachi adicha...')
    setStage('r1_pre')
    setBusy(false)
  }

  const roundTwo = async () => {
    setBusy(true)
    const p = getPoints()
    setDialogue('')
    setLeftPose('bathit')
    setRightPose('batherwait')
    await sleep(300)

    setRightPose('bathither')
    await sleep(350)
    setRightPose('bathither1')
    await sleep(180)
    await animateShuttle({ from: p.right, to: p.left, durationMs: 4200 })

    setLeftPose('batwait')
    await sleep(260)
    setLeftPose('bathit')
    await sleep(140)
    setLeftPose('bathit1')
    await sleep(160)
    await animateShuttle({ from: p.left, to: p.right, durationMs: 4100 })

    setRightPose('bathither')
    await sleep(350)
    setRightPose('bathither1')
    await sleep(180)
    setRightPose('batherwait')

    setLeftPose('bathit')
    await sleep(180)
    setLeftPose('bathit1')
    await sleep(120)
    await animateShuttle({
      from: p.left,
      to: { x: p.left.x + 90, y: p.left.y + 230 },
      durationMs: 2500,
      drop: true,
      bounce: true,
    })

    setLeftPose('batsmile')
    setRightPose('bather')
    setSpeaker('boy')
    setDialogue('Ethey na enga yachi adicha avelo tha...')
    setStage('r2_pre')
    setBusy(false)
  }

  const finalRallyAndEnd = async () => {
    setBusy(true)
    const p = getPoints()
    setDialogue('')
    setLeftPose('bathit')
    setRightPose('batherwait')

    for (let i = 0; i < 3; i += 1) {
      setLeftPose('bathit')
      await sleep(140)
      setLeftPose('bathit1')
      await sleep(120)
      await animateShuttle({ from: p.left, to: p.right, durationMs: 2300 })
      setRightPose('bathither')
      await sleep(220)
      setRightPose('bathither1')
      await sleep(120)
      await animateShuttle({ from: p.right, to: p.left, durationMs: 2300 })
      setLeftPose('batwait')
      await sleep(180)
      setLeftPose('bathit')
      await sleep(120)
      setRightPose('batherwait')
    }

    // Extra short rally beat for cinematic handoff before transition.
    setLeftPose('bathit1')
    await sleep(120)
    await animateShuttle({ from: p.left, to: p.right, durationMs: 2800 })
    setRightPose('bathither')
    await sleep(260)
    setRightPose('bathither1')
    await sleep(140)
    await animateShuttle({ from: p.right, to: p.left, durationMs: 2600 })
    setLeftPose('batwait')
    await sleep(220)

    setLeftPose('batsmile')
    setRightPose('bathersmile')
    const mid = getPoints().mid
    setShuttle({ visible: true, x: mid.x, y: mid.y - 30, rotation: 0, opacity: 1, scale: 1 })
    setShowShadow(true)
    await sleep(240)

    const fadeStart = performance.now()
    const fadeDuration = 2000
    const fadeFrame = (now) => {
      const t = Math.min((now - fadeStart) / fadeDuration, 1)
      const eased = easeInOut(t)
      setShuttle((s) => ({ ...s, opacity: 1 - eased }))
      setPlayersOpacity(1 - eased * 0.2)
      if (t < 1 && mountedRef.current) {
        rafRef.current = requestAnimationFrame(fadeFrame)
      } else {
        setShuttle((s) => ({ ...s, visible: false }))
        setShowShadow(false)
      }
    }
    rafRef.current = requestAnimationFrame(fadeFrame)

    await sleep(700)
    await startPhaseFiveWithCinematic()
  }

  const startEveningTransition = () => {
    setPhaseFiveFade(1)
    setPhaseFiveIndex(12)
    setDialogue(PHASE_FIVE_DIALOGUES[12])
    setSpeaker('boy')
    window.setTimeout(() => {
      setPhaseFiveIndex(13)
      setDialogue(PHASE_FIVE_DIALOGUES[13])
      setPhaseFiveFade(0)
    }, 1400)
  }

  const startRideExit = async () => {
    setBusy(true)
    setPhaseFiveTravelChoiceOpen(false)
    setPhaseFiveEmotionalShow(false)
    setPhaseFiveAwaitRideExitTap(false)
    setDialogue('')
    setPhaseFiveBikeExit(true)

    await sleep(2300)

    const fadeStart = performance.now()
    const fadeDuration = 2400
    const frame = (now) => {
      const t = Math.min((now - fadeStart) / fadeDuration, 1)
      setBlackOpacity(easeInOut(t))
      if (t < 1 && mountedRef.current) rafRef.current = requestAnimationFrame(frame)
    }
    rafRef.current = requestAnimationFrame(frame)

    await sleep(2200)
    startPhaseSix()

    const fadeOutStart = performance.now()
    const fadeOutDuration = 1900
    const fadeOutFrame = (now) => {
      const t = Math.min((now - fadeOutStart) / fadeOutDuration, 1)
      setBlackOpacity(1 - easeInOut(t))
      if (t < 1 && mountedRef.current) rafRef.current = requestAnimationFrame(fadeOutFrame)
    }
    rafRef.current = requestAnimationFrame(fadeOutFrame)
    await sleep(450)
    setBusy(false)
  }

  useEffect(() => {
    if (stage !== 'phase5') return
    if (phaseFiveIndex < 17) return
    if (sunrisePlayedRef.current) return
    const audio = sunriseAudioRef.current
    if (!audio) return
    sunrisePlayedRef.current = true
    audio.loop = false
    audio.volume = 0.58
    audio.play().catch(() => {})
  }, [phaseFiveIndex, stage])

  useEffect(() => {
    if (stage !== 'phase6' && stage !== 'phase7') return
    // Ensure final phase never stays under transition overlays.
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    setBlackOpacity(0)
    setPhaseFiveFade(0)
    setBusy(false)
  }, [stage])

  const startPhaseSeven = () => {
    setStage('phase7')
    setPhaseSevenIndex(0)
    setMindVoiceActive(false)
    setMindVoiceVanishing(false)
    setMindVoiceGone(false)
    setDialogue(PHASE_SEVEN_DIALOGUES[0])
    setSpeaker('boy')
  }

  const startPhaseSix = () => {
    setStage('phase6')
    setPhaseSixMode('intro')
    setPhaseSixIndex(0)
    setPhaseSixQ1Open(false)
    setPhaseSixQ2Open(false)
    setPhaseSixNoUnlock(false)
    setPhaseSixNoHopIndex(0)
    setDialogue(PHASE_SIX_DIALOGUES[0])
    setSpeaker('boy')
  }

  const startEndingNote = () => {
    setStage('endingNote')
    setDialogue('')
    setEndingSubmitted(false)
    setEndingInput('')
    setShowClimax(false)
    setClimaxReady(false)
    setEndingCountdown(3)
    setEndingModal('')
  }

  const showEndingAlert = (text) => setEndingModal(text)

  const startEndingClimax = () => {
    setShowClimax(true)
    setClimaxReady(false)
    setClimaxTypedText('')
    setEndingCountdown(3)
    if (climaxIntervalRef.current) clearInterval(climaxIntervalRef.current)
    if (climaxRevealTimerRef.current) clearTimeout(climaxRevealTimerRef.current)
    climaxIntervalRef.current = setInterval(() => {
      setEndingCountdown((current) => {
        if (current <= 1) {
          clearInterval(climaxIntervalRef.current)
          climaxIntervalRef.current = null
          climaxRevealTimerRef.current = setTimeout(() => {
            setClimaxReady(true)
          }, 350)
          return 0
        }
        return current - 1
      })
    }, 1200)
  }

  useEffect(() => {
    if (!showClimax || !climaxReady) return
    const text = 'ipadike un avan'
    setClimaxTypedText('')
    let i = 0
    if (climaxTypeRef.current) clearInterval(climaxTypeRef.current)
    climaxTypeRef.current = setInterval(() => {
      i += 1
      setClimaxTypedText(text.slice(0, i))
      if (i >= text.length && climaxTypeRef.current) {
        clearInterval(climaxTypeRef.current)
        climaxTypeRef.current = null
      }
    }, 110)
    return () => {
      if (climaxTypeRef.current) {
        clearInterval(climaxTypeRef.current)
        climaxTypeRef.current = null
      }
    }
  }, [climaxReady, showClimax])

  useEffect(() => {
    if (stage !== 'phase7') return
    if (phaseSevenIndex === 0) {
      setMindVoiceActive(false)
      setMindVoiceVanishing(false)
      setMindVoiceGone(false)
      return
    }
    if (!mindVoiceGone) setMindVoiceActive(true)
  }, [stage, phaseSevenIndex, mindVoiceGone])

  const NO_HOP_POSITIONS = [
    { top: '56%', left: '56%' },
    { top: '8%', left: '8%' },
    { top: '70%', left: '8%' },
    { top: '8%', left: '72%' },
    { top: '64%', left: '72%' },
  ]

  const onForward = () => {
    if (busy) return

    if (stage === 'phase7') {
      if (phaseSevenIndex < PHASE_SEVEN_DIALOGUES.length - 1) {
        const next = phaseSevenIndex + 1
        setPhaseSevenIndex(next)
        setDialogue(PHASE_SEVEN_DIALOGUES[next])
      } else {
        startEndingNote()
      }
      return
    }

    if (stage === 'endingNote') {
      if (showClimax && climaxReady && onNextPhase) onNextPhase()
      else if (!endingInput.trim()) showEndingAlert('Hey cutiee, ethavuthu solanum thonichena anupe...')
      else showEndingAlert('Message send panni apram next ponga...')
      return
    }

    if (stage === 'phase6') {
      if (phaseSixQ1Open || phaseSixQ2Open) return

      if (phaseSixMode === 'intro') {
        if (phaseSixIndex < PHASE_SIX_DIALOGUES.length - 1) {
          const next = phaseSixIndex + 1
          setPhaseSixIndex(next)
          setDialogue(PHASE_SIX_DIALOGUES[next])
          if (next === PHASE_SIX_DIALOGUES.length - 1) setPhaseSixQ1Open(true)
        }
        return
      }

      if (phaseSixMode === 'after_q1') {
        setPhaseSixQ2Open(true)
        setPhaseSixMode('q2')
        setDialogue(PHASE_SIX_DIALOGUES[PHASE_SIX_DIALOGUES.length - 1])
        return
      }

      if (phaseSixMode === 'yes') {
        if (phaseSixIndex < PHASE_SIX_YES_DIALOGUES.length - 1) {
          const next = phaseSixIndex + 1
          setPhaseSixIndex(next)
          setDialogue(PHASE_SIX_YES_DIALOGUES[next])
        } else {
          startPhaseSeven()
        }
        return
      }

      if (phaseSixMode === 'no' || phaseSixMode === 'no_wait') {
        if (phaseSixMode === 'no_wait' && phaseSixNoUnlock) {
          startPhaseSeven()
        }
        return
      }
      return
    }

    if (stage === 'phase5') {
      if (phaseFiveAwaitRideExitTap) {
        startRideExit()
        return
      }

      if (phaseFiveTravelChoiceOpen) return

      if (phaseFiveStopMode) {
        if (phaseFiveStopStep === 0) {
          setPhaseFiveStopStep(1)
          setDialogue("Ithu tha last, i'll promise.")
          setSpeaker('boy')
          return
        }
        setPhaseFiveStopMode(false)
        startEveningTransition()
        return
      }

      if (phaseFiveChoiceOpen) return

      const next = Math.min(phaseFiveIndex + 1, PHASE_FIVE_DIALOGUES.length - 1)
      setPhaseFiveIndex(next)
      setDialogue(PHASE_FIVE_DIALOGUES[next])
      setSpeaker('boy')

      if (next === 3) setPhaseFiveChoiceOpen(true)
      if (next === 12) startEveningTransition()
      if (next === 22) setPhaseFiveTravelChoiceOpen(true)
      return
    }

    if (stage === 'intro') {
      setShowCenterIntro(false)
      setDialogue('')
      setStage('game_init')
      return
    }

    if (stage === 'game_init') {
      roundOne()
      return
    }

    if (stage === 'r1_pre') {
      setSpeaker('her')
      setDialogue('Sorry 😅')
      setStage('r1_dialog_1')
      return
    }

    if (stage === 'r1_dialog_1') {
      setSpeaker('boy')
      setDialogue('Parunga Ava seriche kavutherera 😄')
      setStage('r1_dialog_2')
      return
    }

    if (stage === 'r1_dialog_2') {
      roundTwo()
      return
    }

    if (stage === 'r2_pre') {
      setSpeaker('her')
      setDialogue('hello ! Mr Paramasivan haa anga erukaru 😌')
      setStage('r2_dialog_1')
      return
    }

    if (stage === 'r2_dialog_1') {
      setSpeaker('boy')
      setDialogue('pathengala Mamanareke ena oru mareyatha kudereka ne 😌')
      setStage('r2_dialog_2')
      return
    }

    if (stage === 'r2_dialog_2') {
      finalRallyAndEnd()
    }
  }

  const onBack = () => {
    if (busy) return

    if (stage === 'phase7') {
      if (phaseSevenIndex > 0) {
        const prev = phaseSevenIndex - 1
        setPhaseSevenIndex(prev)
        setDialogue(PHASE_SEVEN_DIALOGUES[prev])
      }
      return
    }

    if (stage === 'endingNote') {
      setStage('phase7')
      setPhaseSevenIndex(PHASE_SEVEN_DIALOGUES.length - 1)
      setDialogue(PHASE_SEVEN_DIALOGUES[PHASE_SEVEN_DIALOGUES.length - 1])
      return
    }

    if (stage === 'phase6') {
      if (phaseSixQ1Open || phaseSixQ2Open) return
      if (phaseSixIndex > 0 && phaseSixMode !== 'no_wait') {
        const prev = phaseSixIndex - 1
        setPhaseSixIndex(prev)
        if (phaseSixMode === 'intro') setDialogue(PHASE_SIX_DIALOGUES[prev])
        if (phaseSixMode === 'yes') setDialogue(PHASE_SIX_YES_DIALOGUES[prev])
        if (phaseSixMode === 'no') setDialogue(PHASE_SIX_NO_DIALOGUES[prev])
      }
      return
    }

    if (stage === 'phase5') {
      if (phaseFiveAwaitRideExitTap || phaseFiveTravelChoiceOpen) return

      if (phaseFiveStopMode) {
        if (phaseFiveStopStep === 1) {
          setPhaseFiveStopStep(0)
          setDialogue('Sorry, romba bore adichathuku.')
        } else {
          setPhaseFiveStopMode(false)
          setPhaseFiveChoiceOpen(true)
          setPhaseFiveIndex(3)
          setDialogue(PHASE_FIVE_DIALOGUES[3])
          setSpeaker('boy')
        }
        return
      }

      if (phaseFiveChoiceOpen) {
        setPhaseFiveChoiceOpen(false)
        return
      }

      if (phaseFiveIndex === 0) {
        setStage('r2_dialog_2')
        setSpeaker('boy')
        setDialogue('Mamanareke ena oru mareyatha...')
        setBlackOpacity(0)
        setPhaseFiveFade(0)
        return
      }

      const prev = Math.max(phaseFiveIndex - 1, 0)
      setPhaseFiveIndex(prev)
      setDialogue(PHASE_FIVE_DIALOGUES[prev])
      setSpeaker('boy')
      if (prev < 13) setPhaseFiveFade(0)
      return
    }

    if (stage === 'game_init') {
      setShowCenterIntro(true)
      setDialogue(INTRO_TEXT)
      setSpeaker('boy')
      setStage('intro')
      return
    }

    if (stage === 'r1_dialog_1') {
      setSpeaker('boy')
      setDialogue('Nanga velayada pothu theriyama Ava vera engayachi adicha...')
      setStage('r1_pre')
      return
    }

    if (stage === 'r1_pre') {
      setShowCenterIntro(false)
      setDialogue('')
      setLeftPose('bathit')
      setRightPose('batherwait')
      setStage('game_init')
      return
    }

    if (stage === 'r1_dialog_2') {
      setSpeaker('her')
      setDialogue('Sorry 😅')
      setStage('r1_dialog_1')
      return
    }

    if (stage === 'r2_dialog_1') {
      setSpeaker('boy')
      setDialogue('Ethey na enga yachi adicha avelo tha...')
      setStage('r2_pre')
      return
    }

    if (stage === 'r2_pre') {
      setSpeaker('boy')
      setDialogue('Parunga ava seriche kavutherera 😄')
      setStage('r1_dialog_2')
      return
    }

    if (stage === 'r2_dialog_2') {
      setSpeaker('her')
      setDialogue('hello ! Mr Paramasivan haa anga erukaru 😌')
      setStage('r2_dialog_1')
    }
  }

  const phaseFiveCenterImage = phaseFiveStopMode
    ? phaseFiveStopStep === 0
      ? '/projectimages/sorry.webp'
      : '/projectimages/smile.webp'
    : phaseFiveIndex <= 3
    ? '/projectimages/naa.webp'
    : phaseFiveIndex === 4
    ? '/projectimages/hismile.webp'
    : phaseFiveIndex === 5 || phaseFiveIndex === 6
    ? '/projectimages/hi1.webp'
    : phaseFiveIndex === 7
    ? '/projectimages/naa.webp'
    : phaseFiveIndex === 8 || phaseFiveIndex === 9
    ? '/projectimages/hi.webp'
    : phaseFiveIndex === 10 || phaseFiveIndex === 11 || phaseFiveIndex === 12
    ? '/projectimages/hismile.webp'
    : ''

  const phaseSevenImage =
    phaseSevenIndex <= 1
      ? '/projectimages/hi1.webp'
      : phaseSevenIndex <= 3
      ? '/projectimages/shutup.webp'
      : phaseSevenIndex === 4
      ? '/projectimages/hi1.webp'
      : phaseSevenIndex === 5
      ? '/projectimages/rose.webp'
      : phaseSevenIndex === 6
      ? '/projectimages/hismile.webp'
      : phaseSevenIndex === 7
      ? '/projectimages/flower.webp'
      : '/projectimages/manygift.webp'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="absolute inset-0 z-[82] overflow-hidden"
      onPointerDown={(event) => {
        event.stopPropagation()
        const rect = event.currentTarget.getBoundingClientRect()
        const mid = rect.left + rect.width / 2
        if (event.clientX < mid) onBack()
        else onForward()
      }}
    >
      <audio ref={sunriseAudioRef} src="/projectimages/sunrisemusic.mp3" preload="auto" />

      <button
        type="button"
        onPointerDown={(event) => {
          event.stopPropagation()
          if (busy) return
          if (stage === 'phase5') {
            startPhaseSix()
            return
          }
          if (stage === 'phase6') {
            startPhaseSeven()
            return
          }
          if (stage === 'phase7') {
            startEndingNote()
            return
          }
          if (stage === 'endingNote') {
            if (showClimax && climaxReady && onNextPhase) onNextPhase()
            else if (!endingInput.trim()) showEndingAlert('Hey cutiee, ethavuthu solanum thonichena anupe...')
            else showEndingAlert('Message send panni apram next ponga...')
            return
          }
          if (stage !== 'phase5' && stage !== 'phase6' && stage !== 'phase7' && stage !== 'endingNote') {
            setStage('phase5')
            setPhaseFiveIndex(0)
            setPhaseFiveChoiceOpen(false)
            setPhaseFiveStopMode(false)
            setPhaseFiveStopStep(0)
            setPhaseFiveTravelChoiceOpen(false)
            setPhaseFiveEmotionalShow(false)
            setPhaseFiveAwaitRideExitTap(false)
            setPhaseFiveBikeExit(false)
            setDialogue(PHASE_FIVE_DIALOGUES[0])
            setSpeaker('boy')
            setShowCenterIntro(false)
            setBlackOpacity(0)
            setPlayersOpacity(1)
            setShuttle({ visible: false, x: 0, y: 0, rotation: 0, opacity: 1, scale: 1 })
            return
          }
          if (onNextPhase) onNextPhase()
        }}
        className="absolute right-3 top-[max(10px,calc(env(safe-area-inset-top)+8px))] z-[96] rounded-full border border-white/75 bg-white/88 px-3 py-1 text-xs font-semibold text-[#234a67] shadow-[0_8px_20px_rgba(20,44,68,0.2)] backdrop-blur sm:right-4 sm:top-4"
      >
        Next Phase
      </button>

      <div
        className={`absolute inset-0 ${
          stage === 'phase6'
            ? 'bg-[linear-gradient(145deg,#edf6ff_0%,#d9ecff_36%,#d6e6ff_65%,#ffe9f4_100%)]'
            : stage === 'phase7'
            ? 'bg-[linear-gradient(152deg,#1d1238_0%,#3b1c5f_36%,#5a2682_66%,#6d2f8d_100%)]'
            : stage === 'endingNote'
            ? 'bg-[linear-gradient(155deg,#fff7fb_0%,#ffeef8_34%,#f8ecff_68%,#eef5ff_100%)]'
            : stage === 'phase5' && phaseFiveIndex >= 13
            ? 'bg-[linear-gradient(165deg,#fff3de_0%,#ffd8a8_34%,#ffb26d_68%,#ff9448_100%)]'
            : 'bg-[linear-gradient(165deg,#e7fbff_0%,#dff7ff_34%,#d2f0ff_68%,#cde8ff_100%)]'
        }`}
      />

      {stage === 'phase6' ? (
        <>
          <motion.div
            aria-hidden
            animate={{ opacity: [0.2, 0.45, 0.2], scale: [1, 1.08, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -left-20 -top-14 h-[54vh] w-[54vh] rounded-full bg-[radial-gradient(circle,rgba(132,197,255,0.28)_0%,rgba(132,197,255,0)_70%)] blur-[52px]"
          />
          <motion.div
            aria-hidden
            animate={{ opacity: [0.18, 0.4, 0.18], scale: [1, 1.06, 1] }}
            transition={{ duration: 9, delay: 0.4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-20 -right-14 h-[52vh] w-[52vh] rounded-full bg-[radial-gradient(circle,rgba(255,167,207,0.26)_0%,rgba(255,167,207,0)_70%)] blur-[54px]"
          />
          <img
            src={
              phaseSixMode === 'after_q1'
                ? '/projectimages/shocked.webp'
                : phaseSixMode === 'yes'
                ? '/projectimages/crying.webp'
                : phaseSixMode === 'no'
                ? phaseSixIndex <= 1
                  ? '/projectimages/naa.webp'
                  : phaseSixIndex <= 3
                  ? '/projectimages/crying.webp'
                  : phaseSixIndex === 4
                  ? '/projectimages/lol.webp'
                  : '/projectimages/hi1.webp'
                : phaseSixMode === 'no_wait'
                ? '/projectimages/hi1.webp'
                : '/projectimages/hi.webp'
            }
            alt=""
            className={`absolute left-1/2 z-[56] -translate-x-1/2 object-contain ${
              phaseSixQ1Open || phaseSixQ2Open
                ? 'bottom-[12%] w-[min(52vw,300px)] sm:w-[min(42vw,340px)]'
                : phaseSixMode === 'after_q1'
                ? 'bottom-[12%] w-[min(52vw,300px)] sm:w-[min(42vw,340px)]'
                : phaseSixMode === 'yes' || phaseSixMode === 'no'
                ? 'bottom-[8%] w-[min(82vw,560px)] sm:w-[min(70vw,620px)]'
                : 'bottom-[10%] w-[min(68vw,420px)]'
            }`}
          />
        </>
      ) : null}

      {stage === 'phase7' ? (
        <>
          <motion.div
            aria-hidden
            animate={{ opacity: [0.2, 0.44, 0.2], scale: [1, 1.1, 1] }}
            transition={{ duration: 8.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -left-20 -top-14 h-[54vh] w-[54vh] rounded-full bg-[radial-gradient(circle,rgba(195,134,255,0.4)_0%,rgba(195,134,255,0)_72%)] blur-[56px]"
          />
          <motion.div
            aria-hidden
            animate={{ opacity: [0.22, 0.4, 0.22], scale: [1, 1.07, 1] }}
            transition={{ duration: 9.5, delay: 0.4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-24 -right-16 h-[56vh] w-[56vh] rounded-full bg-[radial-gradient(circle,rgba(255,144,210,0.34)_0%,rgba(255,144,210,0)_72%)] blur-[58px]"
          />
          <div className="absolute inset-0 bg-[radial-gradient(80%_55%_at_50%_10%,rgba(255,228,255,0.25),rgba(255,228,255,0)_70%)]" />

          {mindVoiceActive && !mindVoiceGone ? (
            <>
              <motion.div
                className="absolute left-[58%] top-[44%] z-[68] h-3 w-3 rounded-full bg-white/80 shadow-[0_0_16px_rgba(255,255,255,0.5)]"
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.32 }}
              />
              <motion.div
                className="absolute left-[65%] top-[31%] z-[68] h-5 w-5 rounded-full bg-white/75 shadow-[0_0_20px_rgba(255,255,255,0.45)]"
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.14, duration: 0.35 }}
              />
              <motion.div
                className="absolute right-[2%] top-[4%] z-[70] w-[min(90vw,560px)] rounded-[2.5rem] border border-violet-200/55 bg-[#241344]/85 p-3 shadow-[0_24px_56px_rgba(10,4,24,0.55)] backdrop-blur-xl"
                initial={{ opacity: 0, scale: 0.7, y: 26, filter: 'blur(8px)' }}
                animate={
                  mindVoiceVanishing
                    ? { opacity: 0, scale: 1.12, y: -20, filter: 'blur(14px)' }
                    : { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }
                }
                transition={{ duration: mindVoiceVanishing ? 0.9 : 0.6, ease: 'easeOut' }}
              >
                <div className="relative z-10 overflow-hidden rounded-[2rem] border border-violet-100/35 bg-[#070411]">
                  <motion.div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-10"
                    animate={{ opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                      backgroundImage:
                        'linear-gradient(125deg, rgba(196,143,255,0.2) 0%, rgba(196,143,255,0) 32%, rgba(255,146,212,0.15) 66%, rgba(255,146,212,0) 100%)',
                    }}
                  />
                  <video
                    src="/projectimages/mindvoice.mp4"
                    autoPlay
                    playsInline
                    onEnded={() => {
                      if (mindVoiceVanishing) return
                      setMindVoiceVanishing(true)
                      if (mindVoiceTimerRef.current) clearTimeout(mindVoiceTimerRef.current)
                      mindVoiceTimerRef.current = setTimeout(() => {
                        setMindVoiceGone(true)
                        setMindVoiceActive(false)
                        setMindVoiceVanishing(false)
                      }, 900)
                    }}
                    className="h-[240px] w-full object-cover sm:h-[320px]"
                  />
                </div>
              </motion.div>
            </>
          ) : null}
          <img src={phaseSevenImage} alt="" className="absolute bottom-[10%] left-1/2 z-[56] w-[min(72vw,440px)] -translate-x-1/2 object-contain" />
        </>
      ) : null}

      {stage === 'endingNote' ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute inset-0 z-[75] flex items-center justify-center overflow-hidden"
        >
          <div className="absolute -left-20 -top-20 h-[50vh] w-[50vh] rounded-full bg-[radial-gradient(circle,rgba(255,184,219,0.4)_0%,rgba(255,184,219,0)_74%)] blur-[60px]" />
          <div className="absolute -bottom-16 -right-12 h-[44vh] w-[44vh] rounded-full bg-[radial-gradient(circle,rgba(187,191,255,0.3)_0%,rgba(187,191,255,0)_72%)] blur-[54px]" />

          {endingSubmitted && climaxReady ? (
            <>
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {Array.from({ length: 30 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: '100vh', opacity: [1, 1, 0], rotate: 360 }}
                    transition={{ duration: 3 + Math.random() * 2, delay: Math.random() * 0.5, repeat: Infinity, ease: 'linear' }}
                    className="absolute top-0 h-2.5 w-2.5 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      backgroundColor: ['#ffb7b2', '#ffdac1', '#e2f0cb', '#b5ead7', '#c7ceea'][i % 5],
                    }}
                  />
                ))}
              </div>
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {Array.from({ length: 15 }).map((_, i) => (
                  <motion.div
                    key={`heart-${i}`}
                    initial={{ y: '100vh', opacity: 0, scale: 0.5 }}
                    animate={{ y: '-10vh', opacity: [0, 1, 0], scale: [0.5, 1.2, 0.8] }}
                    transition={{ duration: 5 + Math.random() * 4, delay: Math.random() * 2, repeat: Infinity, ease: 'easeOut' }}
                    className="absolute text-xl text-rose-300/80"
                    style={{ left: `${Math.random() * 100}%` }}
                  >
                    ❤
                  </motion.div>
                ))}
              </div>
            </>
          ) : null}

          <div
            className={`relative z-[80] ${
              showClimax
                ? 'h-full w-full'
                : 'w-[min(90vw,420px)] rounded-[2rem] border border-white/60 bg-white/30 p-6 shadow-[0_8px_32px_rgba(31,38,135,0.15)] backdrop-blur-md'
            }`}
          >
            {showClimax ? (
              <div className="relative h-full w-full overflow-hidden bg-[radial-gradient(110%_85%_at_50%_20%,rgba(68,30,96,0.45)_0%,rgba(14,9,20,0.96)_56%,#08050d_100%)]">
                <motion.div
                  aria-hidden
                  initial={{ opacity: 0.2 }}
                  animate={{ opacity: [0.22, 0.42, 0.22] }}
                  transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-0 bg-[radial-gradient(50%_45%_at_50%_40%,rgba(199,141,255,0.26)_0%,rgba(199,141,255,0)_72%)]"
                />
                <AnimatePresence mode="wait">
                  {!climaxReady ? (
                    <motion.div
                      key={`count-${endingCountdown}`}
                      initial={{ opacity: 0, scale: 0.68, filter: 'blur(8px)' }}
                      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, scale: 1.24, filter: 'blur(10px)' }}
                      transition={{ duration: 0.7, ease: 'easeOut' }}
                      className="absolute inset-0 z-10 flex items-center justify-center"
                    >
                      <p className="text-[7.2rem] font-bold leading-none text-violet-200/95 drop-shadow-[0_0_32px_rgba(202,157,255,0.72)] sm:text-[10rem]">
                        {endingCountdown}
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="climax"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0 z-10 flex items-center justify-center px-4"
                    >
                      <p className="text-center text-5xl font-semibold text-violet-100 drop-shadow-[0_0_28px_rgba(194,132,252,0.66)] sm:text-7xl" style={{ fontFamily: "'Dancing Script', 'Brush Script MT', cursive" }}>
                        {climaxTypedText}
                        <span className="ml-1 inline-block h-[1.05em] w-[2px] animate-pulse bg-violet-200/95 align-middle" />
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
            <div className="mx-auto mb-6 h-40 w-40 overflow-hidden rounded-full border-4 border-white/80 shadow-lg">
              <img
                src="/projectimages/us.webp"
                alt="Us"
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.target.src = '/projectimages/hismile.webp'
                }}
              />
            </div>

            <h3 className="mb-2 text-center text-2xl font-bold text-[#5e2f78]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Our Memories
            </h3>

            <p className="mb-6 text-center text-sm font-medium text-[#7a4b85]">
              Ena thonutho athe enga pathevendungal... ❤️
            </p>

            <div className="relative mb-6">
              <textarea
                value={endingInput}
                onChange={(e) => setEndingInput(e.target.value)}
                onPointerDown={(e) => e.stopPropagation()}
                placeholder="Write your feelings here..."
                className="w-full resize-none rounded-xl border border-white/50 bg-white/50 p-4 text-[#4a2c55] placeholder-gray-500 outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-200/50"
                rows={4}
              />
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                disabled={isSending}
                onPointerDown={(event) => event.stopPropagation()}
                onClick={async () => {
                  if (!endingInput.trim()) {
                    showEndingAlert('Hey cutiee, ethavuthu solanum thonichena anupe...')
                    return
                  }
                  if (typeof window !== 'undefined') {
                    setIsSending(true)
                    const success = await trackMemoryMessage(endingInput)
                    setEndingSubmitted(true)
                    setEndingInput('')
                    startEndingClimax()
                    if (!success) {
                      showEndingAlert('Message send aagala... one more time try pannalama?')
                    }
                    setIsSending(false)
                  }
                }}
                className={`group relative w-full overflow-hidden rounded-2xl py-3.5 text-base font-bold text-white shadow-[0_14px_30px_rgba(106,44,94,0.25)] transition-all active:scale-[0.99] ${
                  endingSubmitted
                    ? 'bg-gradient-to-r from-emerald-400 to-green-400'
                    : isSending
                    ? 'bg-gradient-to-r from-[#f6a5c8] to-[#f7b3b2]'
                    : 'bg-gradient-to-r from-[#ff8bb0] via-[#ff9da2] to-[#f6b3c8] hover:scale-[1.015] hover:shadow-[0_18px_34px_rgba(106,44,94,0.3)]'
                }`}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isSending ? (
                    <>
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white" />
                      Sending...
                    </>
                  ) : endingSubmitted ? (
                    'Sent Smoothly ✨'
                  ) : (
                    'Send Message 💌'
                  )}
                </span>
                <div className="absolute inset-0 -z-0 bg-gradient-to-r from-[#fad0c4] to-[#ff9a9e] opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            </div>
              </>
            )}
          </div>

          {endingModal ? (
            <div className="absolute inset-0 z-[95] flex items-center justify-center bg-black/38 px-4 backdrop-blur-[2px]">
              <motion.div
                initial={{ opacity: 0, y: 18, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="w-[min(92vw,420px)] rounded-2xl border border-rose-200/80 bg-white/96 p-5 text-center shadow-[0_18px_42px_rgba(27,18,35,0.35)]"
                onPointerDown={(event) => event.stopPropagation()}
              >
                <p className="text-base font-semibold text-rose-700" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {endingModal}
                </p>
                <button
                  type="button"
                  className="mt-4 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-5 py-2 text-sm font-semibold text-white shadow"
                  onClick={() => setEndingModal('')}
                >
                  Okay
                </button>
              </motion.div>
            </div>
          ) : null}
        </motion.div>
      ) : null}
      
      {stage !== 'phase5' && stage !== 'phase6' && stage !== 'phase7' && stage !== 'endingNote' ? (
        <>
          <div className="absolute inset-x-[6%] bottom-[17%] top-[14%] rounded-[2.2rem] border border-white/65 bg-white/34 shadow-[0_22px_42px_rgba(13,65,93,0.18)] backdrop-blur-lg" />
          <div className="absolute inset-x-[9%] bottom-[20%] top-[17%] rounded-[1.9rem] border border-cyan-200/75 bg-[linear-gradient(180deg,rgba(198,247,255,0.8)_0%,rgba(175,238,255,0.7)_100%)]" />
          <div className="absolute left-1/2 top-[17%] h-[63%] w-[2px] -translate-x-1/2 bg-white/75" />
          <div className="absolute left-[9%] right-[9%] top-[48%] h-[2px] bg-white/75" />
        </>
      ) : null}

      {showCenterIntro ? (
        <img
          src="/projectimages/batvoice.webp"
          alt=""
          className="absolute bottom-[18%] left-1/2 z-30 w-[min(64vw,420px)] -translate-x-1/2 object-contain"
        />
      ) : null}

      {!showCenterIntro && stage !== 'phase5' && stage !== 'phase6' && stage !== 'phase7' && stage !== 'endingNote' ? (
        <>
          <img
            src={`/projectimages/${leftPose}.webp`}
            alt=""
            className="absolute bottom-[16%] left-[8%] z-30 w-[min(40vw,320px)] object-contain"
            style={{ opacity: playersOpacity }}
          />
          <img
            src={`/projectimages/${rightPose}.webp`}
            alt=""
            className="absolute bottom-[16%] right-[8%] z-30 w-[min(38vw,300px)] object-contain"
            style={{ opacity: playersOpacity }}
          />
        </>
      ) : null}

      {shuttle.visible && stage !== 'phase5' && stage !== 'phase6' && stage !== 'phase7' && stage !== 'endingNote' ? (
        <div
          className="pointer-events-none absolute z-[96] -translate-x-1/2 -translate-y-1/2"
          style={{
            left: shuttle.x,
            top: shuttle.y,
            opacity: shuttle.opacity,
            transform: `translate(-50%,-50%) rotate(${shuttle.rotation}deg) scale(${shuttle.scale})`,
          }}
        >
          <div className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/22 blur-[5px]" />
          <img
            src="/projectimages/cock.webp"
            alt=""
            className="relative z-10 w-[clamp(78px,8.4vw,132px)] object-contain drop-shadow-[0_6px_16px_rgba(0,0,0,0.45)]"
          />
          {showShadow ? <div className="mx-auto mt-1 h-2.5 w-9 rounded-full bg-black/35 blur-[1.5px]" /> : null}
        </div>
      ) : null}

      {stage === 'phase5' ? (
        <>
          {phaseFiveIndex >= 13 ? (
            <>
              <div className="absolute inset-0 z-[53] bg-[radial-gradient(84%_55%_at_50%_5%,rgba(255,247,212,0.8),rgba(255,247,212,0)_70%)]" />
              <motion.div
                aria-hidden
                animate={{ y: [0, -4, 0], opacity: [0.92, 1, 0.92] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute right-[14%] top-[14%] z-[54] h-24 w-24 rounded-full bg-gradient-to-b from-amber-100 via-amber-300 to-orange-400 shadow-[0_0_90px_rgba(255,167,81,0.7)] sm:h-32 sm:w-32"
              />
              <div
                className="absolute bottom-[24%] left-[-6%] z-[54] h-[34%] w-[58%] bg-[#6c5372]/78"
                style={{ clipPath: 'polygon(0% 100%, 16% 54%, 30% 38%, 45% 56%, 62% 44%, 78% 68%, 100% 100%)' }}
              />
              <div
                className="absolute bottom-[24%] right-[-8%] z-[54] h-[36%] w-[64%] bg-[#7a5b62]/76"
                style={{ clipPath: 'polygon(0% 100%, 14% 70%, 32% 46%, 50% 62%, 70% 42%, 86% 68%, 100% 100%)' }}
              />
            </>
          ) : null}

          <div
            className="absolute inset-0 z-[55] bg-black transition-opacity duration-[2000ms]"
            style={{ opacity: stage === 'phase6' ? 0 : phaseFiveFade }}
          />

          {phaseFiveCenterImage && phaseFiveFade < 0.9 ? (
            <img
              src={phaseFiveCenterImage}
              alt=""
              className="absolute bottom-[14%] left-1/2 z-[56] w-[min(64vw,420px)] -translate-x-1/2 object-contain"
            />
          ) : null}

          {phaseFiveIndex >= 16 ? (
            <>
              <motion.div
                initial={{ x: '-110%' }}
                animate={{ x: 0 }}
                transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-x-0 bottom-[4%] z-[57] h-[20%] overflow-hidden"
              >
                <div className="absolute inset-0 bg-[linear-gradient(180deg,#4a4a4a_0%,#2c2c2c_55%,#171717_100%)]" />
                <div className="absolute inset-y-0 left-0 w-[10%] bg-gradient-to-r from-[#7f8084]/65 to-transparent" />
                <div className="absolute inset-y-0 right-0 w-[10%] bg-gradient-to-l from-[#7f8084]/65 to-transparent" />
                <motion.div
                  className="absolute left-[12%] right-[12%] top-1/2 h-1.5 -translate-y-1/2 opacity-90"
                  animate={{ backgroundPositionX: ['0px', '-280px'] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                  style={{
                    backgroundImage: 'repeating-linear-gradient(to right, #ffe9a8 0 60px, transparent 60px 120px)',
                  }}
                />
              </motion.div>

              <motion.img
                src="/projectimages/bike.webp"
                alt=""
                initial={{ x: '-120vw' }}
                animate={{ x: phaseFiveBikeExit ? '120vw' : '20vw' }}
                transition={{ duration: phaseFiveBikeExit ? 4.8 : 3.3, ease: [0.22, 1, 0.36, 1] }}
                className="absolute bottom-[11.5%] z-[58] w-[min(58vw,520px)] object-contain"
              />
            </>
          ) : null}

          {phaseFiveEmotionalShow ? (
            <motion.img
              initial={{ opacity: 0, y: 14, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              src="/projectimages/emotional.webp"
              alt=""
              className="absolute bottom-[42%] left-1/2 z-[91] w-[min(52vw,360px)] -translate-x-1/2 object-contain"
            />
          ) : null}

          {phaseFiveChoiceOpen ? (
            <div className="absolute bottom-[46%] left-1/2 z-[92] flex w-[min(92vw,680px)] -translate-x-1/2 gap-4 px-4">
              <button
                type="button"
                onPointerDown={(event) => event.stopPropagation()}
                onClick={() => {
                  setPhaseFiveChoiceOpen(false)
                  setPhaseFiveIndex(4)
                  setDialogue(PHASE_FIVE_DIALOGUES[4])
                }}
                className="flex-1 rounded-2xl border border-sky-200/90 bg-sky-50/92 px-6 py-4 text-lg font-semibold text-sky-700 shadow"
              >
                Continue
              </button>
              <button
                type="button"
                onPointerDown={(event) => event.stopPropagation()}
                onClick={() => {
                  setPhaseFiveChoiceOpen(false)
                  setPhaseFiveStopMode(true)
                  setPhaseFiveStopStep(0)
                  setSpeaker('boy')
                  setDialogue('Sorry, romba bore adichathuku.')
                }}
                className="flex-1 rounded-2xl border border-rose-200/90 bg-rose-50/92 px-6 py-4 text-lg font-semibold text-rose-700 shadow"
              >
                Stop
              </button>
            </div>
          ) : null}

          {phaseFiveTravelChoiceOpen ? (
            <div className="absolute bottom-[46%] left-1/2 z-[92] flex w-[min(92vw,680px)] -translate-x-1/2 gap-4 px-4">
              <motion.button
                type="button"
                initial={{ opacity: 0, x: -40, rotate: -6, scale: 0.88 }}
                animate={{ opacity: 1, x: 0, rotate: 0, scale: 1 }}
                transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
                onPointerDown={(event) => event.stopPropagation()}
                onClick={() => {
                  setPhaseFiveTravelChoiceOpen(false)
                  setPhaseFiveEmotionalShow(true)
                  setSpeaker('her')
                  setDialogue('Unmayagava?')
                  setPhaseFiveAwaitRideExitTap(true)
                }}
                className="flex-1 rounded-2xl border border-sky-200/90 bg-sky-50/92 px-6 py-4 text-lg font-semibold text-sky-700 shadow"
              >
                Varuven
              </motion.button>
              <motion.button
                type="button"
                initial={{ opacity: 0, x: 40, rotate: 6, scale: 0.88 }}
                animate={{ opacity: 1, x: 0, rotate: 0, scale: 1 }}
                transition={{ duration: 0.58, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                onPointerDown={(event) => event.stopPropagation()}
                onClick={() => {
                  startRideExit()
                }}
                className="flex-1 rounded-2xl border border-rose-200/90 bg-rose-50/92 px-6 py-4 text-lg font-semibold text-rose-700 shadow"
              >
                Matten
              </motion.button>
            </div>
          ) : null}
        </>
      ) : null}

      {stage === 'phase6' && phaseSixQ1Open ? (
        <div className="absolute bottom-[46%] left-1/2 z-[92] flex w-[min(92vw,680px)] -translate-x-1/2 gap-4 px-4">
          <button
            type="button"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => {
              setPhaseSixQ1Open(false)
              setPhaseSixMode('after_q1')
              setPhaseSixIndex(0)
              sendEvent({
                phase: 'phase6',
                question: 'Ena oru time yachi love panerekaya?',
                choice: 'Pannereken',
              })
              setDialogue(PHASE_SIX_AFTER_Q1[0])
            }}
            className="flex-1 rounded-2xl border border-sky-200/90 bg-sky-50/92 px-6 py-4 text-lg font-semibold text-sky-700 shadow"
          >
            Pannereken
          </button>
          <button
            type="button"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => {
              setPhaseSixQ1Open(false)
              setPhaseSixMode('after_q1')
              setPhaseSixIndex(0)
              sendEvent({
                phase: 'phase6',
                question: 'Ena oru time yachi love panerekaya?',
                choice: 'Illa',
              })
              setDialogue(PHASE_SIX_AFTER_Q1[0])
            }}
            className="flex-1 rounded-2xl border border-rose-200/90 bg-rose-50/92 px-6 py-4 text-lg font-semibold text-rose-700 shadow"
          >
            Illa
          </button>
        </div>
      ) : null}

      {stage === 'phase6' && phaseSixQ2Open ? (
        <div className="absolute bottom-[40%] left-1/2 z-[92] h-[180px] w-[min(92vw,680px)] -translate-x-1/2 px-4">
          <button
            type="button"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => {
              setPhaseSixQ2Open(false)
              setPhaseSixMode('yes')
              setPhaseSixIndex(0)
              sendEvent({
                phase: 'phase6',
                question: 'Will you love me?',
                choice: 'Yes',
              })
              setDialogue(PHASE_SIX_YES_DIALOGUES[0])
            }}
            className="absolute left-[8%] top-[56%] w-[42%] rounded-2xl border border-sky-200/90 bg-sky-50/92 px-4 py-3 text-base font-semibold text-sky-700 shadow sm:text-lg"
          >
            Yes
          </button>
          <motion.button
            type="button"
            onPointerDown={(event) => event.stopPropagation()}
            animate={{
              top: NO_HOP_POSITIONS[phaseSixNoHopIndex % NO_HOP_POSITIONS.length].top,
              left: NO_HOP_POSITIONS[phaseSixNoHopIndex % NO_HOP_POSITIONS.length].left,
            }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            onClick={() => {
              if (phaseSixMode === 'no_wait' && phaseSixNoUnlock) {
                sendEvent({
                  phase: 'phase6',
                  question: 'Will you love me?',
                  choice: 'No (Final)',
                })
                startPhaseSeven()
                return
              }
              setPhaseSixNoHopIndex((current) => current + 1)
              if (phaseSixMode !== 'no') {
                setPhaseSixMode('no')
                setPhaseSixNoUnlock(false)
                sendEvent({
                  phase: 'phase6',
                  question: 'Will you love me?',
                  choice: 'No (First Attempt)',
                })
                setPhaseSixIndex(0)
                setDialogue(PHASE_SIX_NO_DIALOGUES[0])
                return
              }

              sendEvent({
                phase: 'phase6',
                question: 'Will you love me?',
                choice: `No (Hop ${phaseSixIndex + 2})`,
              })

              if (phaseSixIndex < PHASE_SIX_NO_DIALOGUES.length - 1) {
                const next = phaseSixIndex + 1
                setPhaseSixIndex(next)
                setDialogue(PHASE_SIX_NO_DIALOGUES[next])
              } else {
                setPhaseSixNoUnlock(true)
                setPhaseSixQ2Open(true)
                setPhaseSixMode('no_wait')
                setDialogue('Ipo No button click pannu.')
              }
            }}
            className="absolute w-[42%] rounded-2xl border border-rose-200/90 bg-rose-50/92 px-4 py-3 text-base font-semibold text-rose-700 shadow sm:text-lg"
          >
            No
          </motion.button>
        </div>
      ) : null}

      {dialogue ? (
        <div className="absolute bottom-[max(76px,calc(env(safe-area-inset-bottom)+58px))] left-1/2 z-[90] w-[min(94vw,760px)] -translate-x-1/2 px-2 sm:bottom-8">
          <div
            className={`relative max-h-[36svh] overflow-y-auto rounded-[1.4rem] border px-4 py-3 shadow-[0_14px_26px_rgba(13,45,76,0.2)] backdrop-blur-xl sm:px-6 sm:py-5 ${
              speaker === 'her' ? 'border-pink-200/80 bg-pink-50/86' : 'border-sky-200/80 bg-sky-50/88'
            }`}
          >
            <p
              className={`whitespace-pre-line text-center text-[1.02rem] font-semibold leading-[1.3] sm:text-[1.62rem] ${
                speaker === 'her' ? 'text-pink-600' : 'text-sky-700'
              }`}
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {dialogue}
            </p>
          </div>
        </div>
      ) : null}

      <div
        className="pointer-events-none absolute inset-0 z-[94] bg-black"
        style={{ opacity: stage === 'phase6' || stage === 'phase7' || stage === 'endingNote' ? 0 : blackOpacity }}
      />
    </motion.div>
  )
}

export { PHASE_FOUR_DIALOGUES }
export default PhaseFour
