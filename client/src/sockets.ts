/**
 * This is a comment on the module level, i.e. the entire file.
 *
 * For this to appear in the documentation this is needed at the bottom.
 * @module
 */

import io from 'socket.io-client'
import { setCurrentSlideByOrder, setPresentationTimer } from './actions/presentation'
import { Timer } from './interfaces/Timer'
import store from './store'

interface SetSlideInterface {
  slide_order: number
}

interface TimerInterface {
  value: number
  enabled: boolean
}

interface SetTimerInterface {
  timer: TimerInterface
}

let socket: SocketIOClient.Socket

/**
 * You can also comment functions, like usual. This will automatically appear
 * in the documentation, no more needed.
 */
export const socketConnect = () => {
  if (!socket) {
    const token = localStorage.competitionToken
    socket = io('localhost:5000', {
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: token,
          },
        },
      },
    })

    socket.on('set_slide', (data: SetSlideInterface) => {
      setCurrentSlideByOrder(data.slide_order)(store.dispatch)
    })

    socket.on('set_timer', (data: SetTimerInterface) => {
      setPresentationTimer(data.timer)(store.dispatch)
    })

    socket.on('end_presentation', () => {
      socket.disconnect()
    })
  }
}

export const socketStartPresentation = () => {
  socket.emit('start_presentation', { competition_id: store.getState().presentation.competition.id })
}

export const socketJoinPresentation = () => {
  socket.emit('join_presentation', { code: store.getState().presentation.code }) // TODO: Send code gotten from auth/login/<code> api call
}

export const socketEndPresentation = () => {
  socket.emit('end_presentation', { competition_id: store.getState().presentation.competition.id })
}

export const socketSetSlideNext = () => {
  socketSetSlide(store.getState().presentation.slide.order + 1) // TODO: Check that this slide exists
}

export const socketSetSlidePrev = () => {
  socketSetSlide(store.getState().presentation.slide.order - 1) // TODO: Check that this slide exists
}

/**
 * You can also comment a function like, adding more information to either
 * the paramters or the return value.
 *
 * @param slide_order This is a parameter to the function.
 * @returns This function returns nothing.
 */
export const socketSetSlide = (slide_order: number) => {
  if (slide_order < 0 || store.getState().presentation.competition.slides.length <= slide_order) {
    return
  }

  socket.emit('set_slide', {
    competition_id: store.getState().presentation.competition.id,
    slide_order: slide_order,
  })
}

export const socketSetTimer = (timer: Timer) => {
  socket.emit('set_timer', {
    competition_id: store.getState().presentation.competition.id,
    timer: timer,
  })
}

export const socketStartTimer = () => {
  socketSetTimer({ enabled: true, value: store.getState().presentation.timer.value })
}
