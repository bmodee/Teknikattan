import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { useAppDispatch } from '../../../hooks'
import {
  socketEndPresentation,
  socketJoinPresentation,
  socketSetSlideNext,
  socketSetSlidePrev,
  socketStartPresentation,
  socketStartTimer,
  socket_connect,
} from '../../../sockets'

const mapStateToProps = (state: any) => {
  return {
    slide_order: state.presentation.slide.order,
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    // tickTimer: () => dispatch(tickTimer(1)),
  }
}

const SocketTest: React.FC = (props: any) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    socket_connect()
    // dispatch(getPresentationCompetition('1')) // TODO: Use ID of item_code gotten from auth/login/<code> api call
    // dispatch(getPresentationTeams('1')) // TODO: Use ID of item_code gotten from auth/login/<code> api call
  }, [])

  return (
    <>
      <button onClick={socketStartPresentation}>Start presentation</button>
      <button onClick={socketJoinPresentation}>Join presentation</button>
      <button onClick={socketEndPresentation}>End presentation</button>
      <button onClick={socketSetSlidePrev}>Prev slide</button>
      <button onClick={socketSetSlideNext}>Next slide</button>
      <button onClick={socketStartTimer}>Start timer</button>
      <div>Current slide: {props.slide_order}</div>
      {/* <div>Timer: {props.timer.value}</div>
      <div>Enabled: {props.timer.enabled.toString()}</div>
      <button onClick={syncTimer}>Sync</button>
      <button onClick={() => dispatch(setTimer(5))}>5 Sec</button>
      <button
        onClick={() => {
          dispatch(setTimer(5))
          dispatch(setTimerEnabled(true))
          syncTimer()
        }}
      >
        Sync and 5 sec
      </button> */}
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(SocketTest)
