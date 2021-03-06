
export const login = () => {
    return{
        type: 'SIGN_IN'
    };
};




/*
// Old code that can be used for comparison 

export function login(name, email, id, token) {
    return {
        type: Types.USER_LOGIN,
        name,
        email,
        id,
        token
    }
}

export function logout() {
    return {
        type: Types.USER_LOGOUT,
    }
}
*/