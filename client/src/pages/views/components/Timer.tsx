import React, { useEffect } from 'react'
import { setPresentationTimer, setPresentationTimerDecrement } from '../../../actions/presentation'
import { useAppDispatch, useAppSelector } from '../../../hooks'
import store from '../../../store'

/* const mapStateToProps = (state: any) => {
  return {
    timer: state.presentation.timer,
    timer_start_value: state.presentation.slide.timer,
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    // tickTimer: () => dispatch(tickTimer(1)),
  }
} */

let timerIntervalId: NodeJS.Timeout

const Timer: React.FC = () => {
  const dispatch = useAppDispatch()
  const slide = store
    .getState()
    .presentation.competition.slides.find((slide) => slide.id === store.getState().presentation.activeSlideId)
  const timerStartValue = slide?.timer
  const timer = useAppSelector((state) => state.presentation.timer)
  useEffect(() => {
    if (!slide || !slide.timer) return
    dispatch(setPresentationTimer({ enabled: false, value: slide.timer }))
  }, [timerStartValue])

  useEffect(() => {
    if (timer.enabled) {
      timerIntervalId = setInterval(() => {
        dispatch(setPresentationTimerDecrement())
      }, 1000)
    } else {
      clearInterval(timerIntervalId)
    }
  }, [timer.enabled])

  return <div>{`Tid kvar: ${timer.value}`}</div>
}

export default Timer
