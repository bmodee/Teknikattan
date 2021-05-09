/** This file includes typed versions of redux hooks */

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from './store'

/** Typed version of useDispatch, this should be used every single time instead of useDispatch  */
export const useAppDispatch = () => useDispatch<AppDispatch>()
/** Typed version of useSelector, this should be used every single time instead of useSelector  */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
