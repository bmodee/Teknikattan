import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { setPresentationTimer, setPresentationTimerDecrement } from '../../../actions/presentation'
import { useAppDispatch } from '../../../hooks'
import store from '../../../store'

const mapStateToProps = (state: any) => {
  return {
    timer: state.presentation.timer,
    timer_start_value: state.presentation.slide.timer,
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    // tickTimer: () => dispatch(tickTimer(1)),
  }
}

let timerIntervalId: NodeJS.Timeout

const Timer: React.FC = (props: any) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(setPresentationTimer({ enabled: false, value: store.getState().presentation.slide.timer }))
  }, [props.timer_start_value])

  useEffect(() => {
    if (props.timer.enabled) {
      timerIntervalId = setInterval(() => {
        dispatch(setPresentationTimerDecrement())
      }, 1000)
    } else {
      clearInterval(timerIntervalId)
    }
  }, [props.timer.enabled])

  return (
    <>
      <div>Timer: {props.timer.value}</div>
      <div>Enabled: {props.timer.enabled.toString()}</div>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Timer)
