/**
 * Handles everything that has to do with syncing active competitions.
 *
 * @module
 */

import io from 'socket.io-client'
import { setCurrentSlideByOrder, setPresentationShowScoreboard, setPresentationTimer } from './actions/presentation'
import { TimerState } from './interfaces/Timer'
import store from './store'

/**
 * The values that can be synced between clients connected to the same presentation.
 */
interface SyncInterface {
  slide_order?: number
  timer?: TimerState
  show_scoreboard?: boolean
}

let socket: SocketIOClient.Socket

/**
 * Connect to server, setup authorization header and listen to some events.
 *
 * @param role The role the connecting client has
 */
export const socketConnect = (role: 'Judge' | 'Operator' | 'Team' | 'Audience') => {
  if (socket) return

  // The token is the JWT returned from the login/code API call.
  const token = localStorage[`${role}Token`]
  socket = io('/', {
    transportOptions: {
      polling: {
        extraHeaders: {
          Authorization: token,
        },
      },
    },
  })

  socket.on('sync', (data: SyncInterface) => {
    // The order of these is important, for some reason, so dont change it
    if (data.timer !== undefined) setPresentationTimer(data.timer)(store.dispatch)
    if (data.slide_order !== undefined) setCurrentSlideByOrder(data.slide_order)(store.dispatch, store.getState)
    if (data.show_scoreboard !== undefined) setPresentationShowScoreboard(data.show_scoreboard)(store.dispatch)
  })

  socket.on('end_presentation', () => {
    socket.disconnect()
  })
}

/**
 * Disconnect all clients.
 */
export const socketEndPresentation = () => {
  socket.emit('end_presentation')
}

/**
 * Sync data between all connected clients.
 *
 * @param syncData The data to sync between all clients connected to the same presentation
 */
export const socketSync = (syncData: SyncInterface) => {
  socket.emit('sync', syncData)
}
