import React, { useEffect, useState } from 'react'
import { setPresentationTimer } from '../../../actions/presentation'
import { useAppDispatch, useAppSelector } from '../../../hooks'

type TimerProps = {
  disableText?: boolean
}

const Timer = ({ disableText }: TimerProps) => {
  const dispatch = useAppDispatch()
  const timer = useAppSelector((state) => state.presentation.timer)
  const [remainingTimer, setRemainingTimer] = useState<number>(0)
  const [timerIntervalId, setTimerIntervalId] = useState<NodeJS.Timeout | null>(null)
  const slideTimer = useAppSelector(
    (state) =>
      state.presentation.competition.slides.find((slide) => slide.id === state.presentation.activeSlideId)?.timer
  )

  useEffect(() => {
    if (slideTimer) setRemainingTimer(slideTimer)
  }, [slideTimer])

  useEffect(() => {
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

  return <div>{`${!disableText ? 'Tid kvar:' : ''} ${Math.round(remainingTimer / 1000)}`}</div>
}

export default Timer
