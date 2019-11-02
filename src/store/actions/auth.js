import axios from 'axios';
import * as actionTypes from "./actionTypes";

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
}

export const authSuccess = (token, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: token,
        userId: userId
    };
}

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    };
}

export const logOut = () => {
    return {
        type: actionTypes.AUTH_LOGOUT
    };
}

export const checkAuthTimeOut = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logOut());
        }, expirationTime * 1000);
    };
}

export const auth = (email, password, isSignIn) => {
    return dispatch => {
        dispatch(authStart());
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        };
        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBxN8mzLWdP7wzTCIqwi2YC6C11J0Npfc0';
        if (isSignIn === false) {
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBxN8mzLWdP7wzTCIqwi2YC6C11J0Npfc0';
        }
        axios.post(url, authData)
            .then(response => {
                console.log(response.data);
                dispatch(authSuccess(response.data.idToken, response.data.localId));
                dispatch(checkAuthTimeOut(response.data.expiresIn));
            })
            .catch(err => {
                console.log(err);
                dispatch(authFail(err.response.data.error));
            });
    };
}

export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    };
}