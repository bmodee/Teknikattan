/**
 * This file contains interfaces used by form models.
 */
export interface ServerResponse {
  code: number
  message: string
}
export interface FormModel<T> {
  model: T
  error?: string
}

//#region LOGIN
export interface AccountLoginModel {
  email: string
  password: string
}

export interface CompetitionLoginModel {
  code: string
}

//#endregion

////ADD////
export interface AddCompetitionModel {
  name: string
  city: string
  year: number
}

export interface AddUserModel {
  email: string
  password: string
  role: string
  city: string
  name?: string
}

export interface AddCityModel {
  name: string
}

////EDIT////
export interface EditUserModel {
  email: string
  role: string
  city: string
  name?: string
  password?: string
}
