/**
This file includes all redux action action types 
*/

/** Includes all actions types */
export default {
  // User login action types
  LOADING_UI: 'LOADING_UI',
  LOADING_USER: 'LOADING_USER',
  SET_ERRORS: 'SET_ERRORS',
  CLEAR_ERRORS: 'CLEAR_ERRORS',
  SET_ROLES: 'SET_ROLES',
  SET_USER: 'SET_USER',
  SET_UNAUTHENTICATED: 'SET_UNAUTHENTICATED',
  SET_AUTHENTICATED: 'SET_AUTHENTICATED',

  // Search user action types
  SET_SEARCH_USERS: 'SET_SEARCH_USERS',
  SET_SEARCH_USERS_FILTER_PARAMS: 'SET_SEARCH_USERS_FILTER_PARAMS',
  SET_SEARCH_USERS_COUNT: 'SET_SEARCH_USERS_COUNT',
  SET_SEARCH_USERS_TOTAL_COUNT: 'SET_SEARCH_USERS_TOTAL_COUNT',

  // Competition login action types
  LOADING_COMPETITION_LOGIN: 'LOADING_COMPETITION_LOGIN',
  SET_COMPETITION_LOGIN_DATA: 'SET_COMPETITION_LOGIN_DATA',
  SET_COMPETITION_LOGIN_UNAUTHENTICATED: 'SET_COMPETITION_LOGIN_UNAUTHENTICATED',
  SET_COMPETITION_LOGIN_ERRORS: 'SET_COMPETITION_LOGIN_ERRORS',
  CLEAR_COMPETITION_LOGIN_ERRORS: 'CLEAR_COMPETITION_LOGIN_ERRORS',

  // Competitions action types
  SET_COMPETITIONS: 'SET_COMPETITIONS',
  SET_COMPETITIONS_FILTER_PARAMS: 'SET_COMPETITIONS_FILTER_PARAMS',
  SET_COMPETITIONS_TOTAL: 'SET_COMPETITIONS_TOTAL',
  SET_COMPETITIONS_COUNT: 'SET_COMPETITIONS_COUNT',

  // Editor action types
  SET_EDITOR_COMPETITION: 'SET_EDITOR_COMPETITION',
  SET_EDITOR_SLIDE_ID: 'SET_EDITOR_SLIDE_ID',
  SET_EDITOR_VIEW_ID: 'SET_EDITOR_VIEW_ID',
  SET_EDITOR_LOADING: 'SET_EDITOR_LOADING',

  // Presentation action types
  SET_PRESENTATION_COMPETITION: 'SET_PRESENTATION_COMPETITION',
  SET_PRESENTATION_SLIDE_ID: 'SET_PRESENTATION_SLIDE_ID',
  SET_PRESENTATION_CODE: 'SET_PRESENTATION_CODE',
  SET_PRESENTATION_TIMER: 'SET_PRESENTATION_TIMER',

  // Cities action types
  SET_CITIES: 'SET_CITIES',
  SET_CITIES_TOTAL: 'SET_CITIES_TOTAL',
  SET_CITIES_COUNT: 'SET_CITIES_COUNT',

  // Types action types
  SET_TYPES: 'SET_TYPES',

  // Media action types
  SET_MEDIA_ID: 'SET_MEDIA_ID',
  SET_MEDIA_FILENAME: 'SET_MEDIA_ID',
  SET_MEDIA_TYPE_ID: 'SET_MEDIA_TYPE_ID',
  SET_MEDIA_USER_ID: 'SET_MEDIA_USER_ID',

  // Statistics action types
  SET_STATISTICS: 'SET_STATISTICS',
}
