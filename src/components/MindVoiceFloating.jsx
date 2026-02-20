import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'

const MindVoiceFloating = forwardRef(function MindVoiceFloating(
  { src = '/projectimages/mindvoice.mp4', label = 'Mind Voice...', onHidden },
  ref,
) {
  const [state, setState] = useState('hidden')
  const exitTimerRef = useRef(null)
  const videoRef = useRef(null)

  const showMindVoice = useCallback(() => {
    if (state !== 'hidden') return
    setState('visible')
  }, [state])

  useImperativeHandle(ref, () => ({ showMindVoice }), [showMindVoice])

  useEffect(() => {
    return () => {
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current)
    }
  }, [])

  useEffect(() => {
    if (state !== 'exiting') return
    exitTimerRef.current = setTimeout(() => {
      setState('hidden')
      if (onHidden) onHidden()
    }, 1500)
    return () => {
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current)
    }
  }, [state, onHidden])

  useEffect(() => {
    if (state !== 'visible') return
    const video = videoRef.current
    if (!video) return
    const tryPlay = () => {
      video.play().catch(() => {})
    }
    tryPlay()
    video.addEventListener('canplay', tryPlay)
    return () => {
      video.removeEventListener('canplay', tryPlay)
    }
  }, [state])

  if (state === 'hidden') return null

  return (
    <div className={`mind-voice-floating${state === 'exiting' ? ' exiting' : ''}`}>
      <div className="mind-voice-label">{label}</div>
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        defaultMuted
        playsInline
        poster="/projectimages/hi1.webp"
        preload="auto"
        onEnded={() => {
          if (state === 'visible') setState('exiting')
        }}
        className="mind-voice-video"
      />
    </div>
  )
})

export default MindVoiceFloating
