import io from 'socket.io-client'
import { setCurrentSlideByOrder, setPresentationTimer } from './actions/presentation'
import { TimerState } from './interfaces/Timer'
import store from './store'

interface SyncInterface {
  slide_order?: number
  timer?: TimerState
}

let socket: SocketIOClient.Socket

export const socketConnect = (role: 'Judge' | 'Operator' | 'Team' | 'Audience') => {
  if (socket) return

  const token = localStorage[`${role}Token`]
  socket = io('localhost:5000', {
    transportOptions: {
      polling: {
        extraHeaders: {
          Authorization: token,
        },
      },
    },
  })

  socket.on('sync', (data: SyncInterface) => {
    // The order of these is important, for some reason
    if (data.timer !== undefined) setPresentationTimer(data.timer)(store.dispatch)
    if (data.slide_order !== undefined) setCurrentSlideByOrder(data.slide_order)(store.dispatch, store.getState)
  })

  socket.on('end_presentation', () => {
    socket.disconnect()
  })
}

export const socketEndPresentation = () => {
  socket.emit('end_presentation')
}

export const socketSync = ({ slide_order, timer }: SyncInterface) => {
  socket.emit('sync', {
    slide_order,
    timer,
  })
}
