import React, { useEffect, useState } from 'react'
import { setPresentationTimer } from '../../../actions/presentation'
import { useAppDispatch, useAppSelector } from '../../../hooks'

type TimerProps = {
  variant: 'editor' | 'presentation'
}

const Timer = ({ variant }: TimerProps) => {
  const dispatch = useAppDispatch()
  const timer = useAppSelector((state) => state.presentation.timer)
  const [remainingTimer, setRemainingTimer] = useState<number>(0)
  const remainingSeconds = remainingTimer / 1000
  const remainingWholeSeconds = Math.floor(remainingSeconds % 60)
  // Add a 0 before the seconds if it's lower than 10
  const remainingDisplaySeconds = `${remainingWholeSeconds < 10 ? '0' : ''}${remainingWholeSeconds}`

  const remainingMinutes = Math.floor(remainingSeconds / 60) % 60
  // Add a 0 before the minutes if it's lower than 10
  const remainingDisplayMinutes = `${remainingMinutes < 10 ? '0' : ''}${remainingMinutes}`

  const displayTime = `${remainingDisplayMinutes}:${remainingDisplaySeconds}`
  const [timerIntervalId, setTimerIntervalId] = useState<NodeJS.Timeout | null>(null)
  const slideTimer = useAppSelector((state) => {
    if (variant === 'presentation')
      return state.presentation.competition.slides.find((slide) => slide.id === state.presentation.activeSlideId)?.timer
    return state.editor.competition.slides.find((slide) => slide.id === state.editor.activeSlideId)?.timer
  })

  useEffect(() => {
    if (slideTimer) setRemainingTimer(slideTimer * 1000)
  }, [slideTimer])

  useEffect(() => {
    if (variant === 'editor') return
    if (!timer.enabled) {
      if (timerIntervalId !== null) clearInterval(timerIntervalId)

      if (timer.value !== null) {
        setRemainingTimer(0)
      } else if (slideTimer) {
        setRemainingTimer(slideTimer * 1000)
      }

      return
    }

    setTimerIntervalId(
      setInterval(() => {
        if (timer.value === null) return
        if (timer.enabled === false && timerIntervalId !== null) clearInterval(timerIntervalId)

        if (timer.value - Date.now() < 0) {
          setRemainingTimer(0)
          dispatch(setPresentationTimer({ ...timer, enabled: false }))
          if (timerIntervalId !== null) clearInterval(timerIntervalId)
          return
        }

        setRemainingTimer(timer.value - Date.now())
      }, 500)
    )
  }, [timer.enabled, slideTimer])

  return <>{slideTimer && displayTime}</>
}

export default Timer
