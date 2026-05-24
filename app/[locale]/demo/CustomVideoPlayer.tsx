'use client'

import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'

interface Props {
  src: string
  autoPlay?: boolean
  videoClassName?: string
  className?: string
}

function formatTime(seconds: number) {
  if (!isFinite(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function CustomVideoPlayer({ src, autoPlay = false, videoClassName = '', className = '' }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const onTimeUpdate = () => setCurrentTime(video.currentTime)
    const onLoadedMetadata = () => setDuration(video.duration)
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    const onVolumeChange = () => setMuted(video.muted)

    video.addEventListener('timeupdate', onTimeUpdate)
    video.addEventListener('loadedmetadata', onLoadedMetadata)
    video.addEventListener('play', onPlay)
    video.addEventListener('pause', onPause)
    video.addEventListener('volumechange', onVolumeChange)

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate)
      video.removeEventListener('loadedmetadata', onLoadedMetadata)
      video.removeEventListener('play', onPlay)
      video.removeEventListener('pause', onPause)
      video.removeEventListener('volumechange', onVolumeChange)
    }
  }, [])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) video.play()
    else video.pause()
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
  }

  const seekFromEvent = (clientX: number, target: HTMLDivElement) => {
    const video = videoRef.current
    if (!video || !duration) return
    const rect = target.getBoundingClientRect()
    const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1)
    video.currentTime = ratio * duration
  }

  const handleBarMouseDown = (e: ReactMouseEvent<HTMLDivElement>) => {
    const bar = e.currentTarget
    seekFromEvent(e.clientX, bar)
    const onMove = (ev: globalThis.MouseEvent) => seekFromEvent(ev.clientX, bar)
    const onUp = () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  const scheduleHide = () => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
    if (!playing) return
    hideTimeoutRef.current = setTimeout(() => setShowControls(false), 2500)
  }

  const onMouseMove = () => {
    setShowControls(true)
    scheduleHide()
  }

  useEffect(() => {
    if (playing) scheduleHide()
    else setShowControls(true)
    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing])

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div
      className={`relative group/player ${className}`}
      onMouseMove={onMouseMove}
      onMouseLeave={() => playing && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        autoPlay={autoPlay}
        onClick={togglePlay}
        className={`block cursor-pointer ${videoClassName}`}
        playsInline
      />

      <div
        className={`absolute inset-x-0 bottom-0 px-3 pb-2 pt-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-200 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <div
          role="slider"
          aria-label="Progreso"
          aria-valuemin={0}
          aria-valuemax={duration || 0}
          aria-valuenow={currentTime}
          onMouseDown={handleBarMouseDown}
          className="group/bar relative w-full h-1.5 hover:h-2 bg-white/40 rounded-full cursor-pointer transition-[height] shadow-[0_1px_3px_rgba(0,0,0,0.6)]"
        >
          <div
            className="absolute inset-y-0 left-0 bg-primary rounded-full"
            style={{ width: `${progress}%` }}
          />
          <div
            className="absolute top-1/2 w-3.5 h-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_0_2px_rgba(0,0,0,0.4)] opacity-0 group-hover/bar:opacity-100 transition-opacity"
            style={{ left: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2 text-white">
          <div className="flex items-center gap-3">
            <button onClick={togglePlay} aria-label={playing ? 'Pausar' : 'Reproducir'} className="hover:opacity-80 transition-opacity">
              {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
            </button>
            <button onClick={toggleMute} aria-label={muted ? 'Activar sonido' : 'Silenciar'} className="hover:opacity-80 transition-opacity">
              {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <span className="text-xs tabular-nums text-white/90">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
