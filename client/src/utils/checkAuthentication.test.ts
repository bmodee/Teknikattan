import mockedAxios from 'axios'
import Types from '../actions/types'
import store from '../store'
import { CheckAuthentication } from './checkAuthentication'

it('dispatches correct actions when auth token is ok', async () => {
  const userRes: any = {
    data: {
      name: 'username',
    },
  }

  ;(mockedAxios.get as jest.Mock).mockImplementation((path: string, params?: any) => {
    return Promise.resolve(userRes)
  })
  ;(mockedAxios.post as jest.Mock).mockImplementation((path: string, params?: any) => {
    return Promise.resolve({ data: {} })
  })
  const spy = jest.spyOn(store, 'dispatch')
  const testToken =
    'Bearer eyJ0eXAiOiJeyJ0eXAiOiJKV1QeyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2MTgzMDQ5MzksImV4cCI6MzI1MTI1MjU3NTcsImF1ZCI6Ind3dy5leGFtcGxlLmNvbSIsInN1YiI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJHaXZlbk5hbWUiOiJKb2hubnkiLCJTdXJuYW1lIjoiUm9ja2V0IiwiRW1haWwiOiJqcm9ja2V0QGV4YW1wbGUuY29tIiwiUm9sZSI6WyJNYW5hZ2VyIiwiUHJvamVjdCBBZG1pbmlzdHJhdG9yIl19.DrOOcCo5jMR-SNERE0uRp_kolQ2HjX8-hHXYEMnIxSceyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2MTgzMDQ5MzksImV4cCI6MzI1MTI1MjU3NTcsImF1ZCI6Ind3dy5leGFtcGxlLmNvbSIsInN1YiI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJHaXZlbk5hbWUiOiJKb2hubnkiLCJTdXJuYW1lIjoiUm9ja2V0IiwiRW1haWwiOiJqcm9ja2V0QGV4YW1wbGUuY29tIiwiUm9sZSI6WyJNYW5hZ2VyIiwiUHJvamVjdCBBZG1pbmlzdHJhdG9yIl19.DrOOcCo5jMR-SNERE0uRp_kolQ2HjX8-hHXYEMnIxSceyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2MTgzMDQ5MzksImV4cCI6MzI1MTI1MjU3NTcsImF1ZCI6Ind3dy5leGFtcGxlLmNvbSIsInN1YiI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJHaXZlbk5hbWUiOiJKb2hubnkiLCJTdXJuYW1lIjoiUm9ja2V0IiwiRW1haWwiOiJqcm9ja2V0QGV4YW1wbGUuY29tIiwiUm9sZSI6WyJNYW5hZ2VyIiwiUHJvamVjdCBBZG1pbmlzdHJhdG9yIl19.DrOOcCo5jMR-SNERE0uRp_kolQ2HjX8-hHXYEMnIxSceyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2MTgzMDQ5MzksImV4cCI6MzI1MTI1MjU3NTcsImF1ZCI6Ind3dy5leGFtcGxlLmNvbSIsInN1YiI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJHaXZlbk5hbWUiOiJKb2hubnkiLCJTdXJuYW1lIjoiUm9ja2V0IiwiRW1haWwiOiJqcm9ja2V0QGV4YW1wbGUuY29tIiwiUm9sZSI6WyJNYW5hZ2VyIiwiUHJvamVjdCBBZG1pbmlzdHJhdG9yIl19.DrOOcCo5jMR-SNERE0uRp_kolQ2HjX8-hHXYEMnIxSciLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2MTgzMDQ5MzksImV4cCI6MzI1MTI1MjU3NTcsImF1ZCI6Ind3dy5leGFtcGxlLmNvbSIsInN1YiI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJHaXZlbk5hbWUiOiJKb2hubnkiLCJTdXJuYW1lIjoiUm9ja2V0IiwiRW1haWwiOiJqcm9ja2V0QGV4YW1wbGUuY29tIiwiUm9sZSI6WyJNYW5hZ2VyIiwiUHJvamVjdCBBZG1pbmlzdHJhdG9yIl19.DrOOcCo5jMR-SNERE0uRp_kolQ2HjX8-hHXYEMnIxScKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2MTgzMDQ5MzksImV4cCI6MzI1MTI1MjU3NTcsImF1ZCI6Ind3dy5leGFtcGxlLmNvbSIsInN1YiI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJHaXZlbk5hbWUiOiJKb2hubnkiLCJTdXJuYW1lIjoiUm9ja2V0IiwiRW1haWwiOiJqcm9ja2V0QGV4YW1wbGUuY29tIiwiUm9sZSI6WyJNYW5hZ2VyIiwiUHJvamVjdCBBZG1pbmlzdHJhdG9yIl19.DrOOcCo5jMR-SNERE0uRp_kolQ2HjX8-hHXYEMnIxSc'
  localStorage.setItem('token', testToken)
  await CheckAuthentication()
  expect(spy).toBeCalledWith({ type: Types.LOADING_USER })
  expect(spy).toBeCalledWith({ type: Types.SET_AUTHENTICATED })
  expect(spy).toBeCalledWith({ type: Types.SET_USER, payload: userRes.data })
  expect(spy).toBeCalledTimes(3)
})

it('dispatches correct actions when getting user data fails', async () => {
  console.log = jest.fn()
  ;(mockedAxios.get as jest.Mock).mockImplementation((path: string, params?: any) => {
    return Promise.reject(new Error('failed getting user data'))
  })
  ;(mockedAxios.post as jest.Mock).mockImplementation((path: string, params?: any) => {
    return Promise.resolve({ data: {} })
  })
  const spy = jest.spyOn(store, 'dispatch')
  const testToken =
    'Bearer eyJ0eXAiOiJeyJ0eXAiOiJKV1QeyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2MTgzMDQ5MzksImV4cCI6MzI1MTI1MjU3NTcsImF1ZCI6Ind3dy5leGFtcGxlLmNvbSIsInN1YiI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJHaXZlbk5hbWUiOiJKb2hubnkiLCJTdXJuYW1lIjoiUm9ja2V0IiwiRW1haWwiOiJqcm9ja2V0QGV4YW1wbGUuY29tIiwiUm9sZSI6WyJNYW5hZ2VyIiwiUHJvamVjdCBBZG1pbmlzdHJhdG9yIl19.DrOOcCo5jMR-SNERE0uRp_kolQ2HjX8-hHXYEMnIxSceyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2MTgzMDQ5MzksImV4cCI6MzI1MTI1MjU3NTcsImF1ZCI6Ind3dy5leGFtcGxlLmNvbSIsInN1YiI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJHaXZlbk5hbWUiOiJKb2hubnkiLCJTdXJuYW1lIjoiUm9ja2V0IiwiRW1haWwiOiJqcm9ja2V0QGV4YW1wbGUuY29tIiwiUm9sZSI6WyJNYW5hZ2VyIiwiUHJvamVjdCBBZG1pbmlzdHJhdG9yIl19.DrOOcCo5jMR-SNERE0uRp_kolQ2HjX8-hHXYEMnIxSceyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2MTgzMDQ5MzksImV4cCI6MzI1MTI1MjU3NTcsImF1ZCI6Ind3dy5leGFtcGxlLmNvbSIsInN1YiI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJHaXZlbk5hbWUiOiJKb2hubnkiLCJTdXJuYW1lIjoiUm9ja2V0IiwiRW1haWwiOiJqcm9ja2V0QGV4YW1wbGUuY29tIiwiUm9sZSI6WyJNYW5hZ2VyIiwiUHJvamVjdCBBZG1pbmlzdHJhdG9yIl19.DrOOcCo5jMR-SNERE0uRp_kolQ2HjX8-hHXYEMnIxSceyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2MTgzMDQ5MzksImV4cCI6MzI1MTI1MjU3NTcsImF1ZCI6Ind3dy5leGFtcGxlLmNvbSIsInN1YiI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJHaXZlbk5hbWUiOiJKb2hubnkiLCJTdXJuYW1lIjoiUm9ja2V0IiwiRW1haWwiOiJqcm9ja2V0QGV4YW1wbGUuY29tIiwiUm9sZSI6WyJNYW5hZ2VyIiwiUHJvamVjdCBBZG1pbmlzdHJhdG9yIl19.DrOOcCo5jMR-SNERE0uRp_kolQ2HjX8-hHXYEMnIxSciLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2MTgzMDQ5MzksImV4cCI6MzI1MTI1MjU3NTcsImF1ZCI6Ind3dy5leGFtcGxlLmNvbSIsInN1YiI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJHaXZlbk5hbWUiOiJKb2hubnkiLCJTdXJuYW1lIjoiUm9ja2V0IiwiRW1haWwiOiJqcm9ja2V0QGV4YW1wbGUuY29tIiwiUm9sZSI6WyJNYW5hZ2VyIiwiUHJvamVjdCBBZG1pbmlzdHJhdG9yIl19.DrOOcCo5jMR-SNERE0uRp_kolQ2HjX8-hHXYEMnIxScKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2MTgzMDQ5MzksImV4cCI6MzI1MTI1MjU3NTcsImF1ZCI6Ind3dy5leGFtcGxlLmNvbSIsInN1YiI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJHaXZlbk5hbWUiOiJKb2hubnkiLCJTdXJuYW1lIjoiUm9ja2V0IiwiRW1haWwiOiJqcm9ja2V0QGV4YW1wbGUuY29tIiwiUm9sZSI6WyJNYW5hZ2VyIiwiUHJvamVjdCBBZG1pbmlzdHJhdG9yIl19.DrOOcCo5jMR-SNERE0uRp_kolQ2HjX8-hHXYEMnIxSc'
  localStorage.setItem('token', testToken)
  await CheckAuthentication()
  expect(spy).toBeCalledWith({ type: Types.LOADING_USER })
  expect(spy).toBeCalledWith({ type: Types.SET_UNAUTHENTICATED })
  expect(spy).toBeCalledTimes(2)
  expect(console.log).toHaveBeenCalled()
})

it('dispatches no actions when no token exists', async () => {
  ;(mockedAxios.post as jest.Mock).mockImplementation((path: string, params?: any) => {
    return Promise.resolve({ data: {} })
  })
  const spy = jest.spyOn(store, 'dispatch')
  await CheckAuthentication()
  expect(spy).not.toBeCalled()
})

it('dispatches correct actions when token is expired', async () => {
  ;(mockedAxios.post as jest.Mock).mockImplementation((path: string, params?: any) => {
    return Promise.resolve({ data: {} })
  })
  const testToken =
    'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2MTgzMDY1MTUsImV4cCI6MTU4Njc3MDUxNSwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.R5-oWGGumd-YWPoKyziJmVB8SdX6B9SsV6m7novIfgg'
  localStorage.setItem('token', testToken)
  const spy = jest.spyOn(store, 'dispatch')
  await CheckAuthentication()
  expect(spy).toBeCalledWith({ type: Types.SET_UNAUTHENTICATED })
  expect(spy).toBeCalledTimes(1)
})
