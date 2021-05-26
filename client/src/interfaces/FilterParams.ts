/**
 * This file contains interfaces used when filtering.
 */
export interface CompetitionFilterParams {
  name?: string
  year?: number
  cityId?: number
  styleId?: number
  page: number
  pageSize: number
}

export interface SearchUserFilterParams {
  name?: string
  year?: number
  cityId?: number
  styleId?: number
  page: number
  pageSize: number
}

export interface UserFilterParams {
  name?: string
  email?: string
  cityId?: number
  roleId?: number
  page: number
  pageSize: number
}
