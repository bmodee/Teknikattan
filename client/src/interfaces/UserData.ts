export interface UserData {
  id: number
  name?: string
  email: string
  role_id: number
  city_id: number
}

export interface UserFilterParams {
  name?: string
  email?: string
  cityId?: number
  roleId?: number
  page: number
  pageSize: number
}
