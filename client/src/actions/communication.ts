import Types from './types.js'

export function axiosPost(
  path: any,
  data: any,
  config = undefined,
  startCB = undefined,
  successCB = undefined,
  errorCB = undefined
) {
  return {
    type: Types.AXIOS_POST,
    path,
    data,
    config,
    startCB,
    successCB,
    errorCB,
  }
}

export function axiosPostSuccess(path: any, data: any, previousAction: any) {
  return {
    type: Types.AXIOS_POST_SUCCESS,
    path,
    data,
    previousAction,
  }
}

export function axiosPostError(path: any, data: any, previousAction: any) {
  return {
    type: Types.AXIOS_POST_ERROR,
    path,
    data,
    previousAction,
  }
}

export function axiosGet(
  path: any,
  data: any,
  config = undefined,
  startCB = undefined,
  successCB = undefined,
  errorCB = undefined
) {
  return {
    type: Types.AXIOS_GET,
    path,
    data,
    config,
    startCB,
    successCB,
    errorCB,
  }
}

export function axiosGetSuccess(path: any, data: any, previousAction: any) {
  return {
    type: Types.AXIOS_GET_SUCCESS,
    path,
    data,
    previousAction,
  }
}

export function axiosGetError(path: any, data: any, previousAction: any) {
  return {
    type: Types.AXIOS_GET_ERROR,
    path,
    data,
    previousAction,
  }
}
