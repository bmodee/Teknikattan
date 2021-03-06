const loggedInReducer = (state = false, action) => { // isLoggedIn has an initial state of false
  switch (action.type) {
    case 'SIGN_IN':
      return !state;
    default:
      return state;
  }
}
export default loggedInReducer
