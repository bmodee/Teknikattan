export interface AccountLoginModel {
  email: string
  password: string
}

export interface AddCompetitionModel {
  name: string
  city: string
  year: number
}

export interface CompetitionLoginModel {
  code: string
}

export interface AddUserModel {
  email: string
  password: string
  role: string
  city: string
  name?: string
}

export interface EditUserModel {
  email: string
  role: string
  city: string
  name?: string
}
