import actionTypes from './actionsTypes';
import axios from 'axios';

const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
}
const authSuccess = (token, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: token,
        userId: userId
    }
}
const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    }
}
export const auth = (email, password, isSignUp) => {
    return dispatch => {
        dispatch(authStart());
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        }
        const apiKey = ""; //key
        let url = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" + apiKey;
        if(!isSignUp) {
            url = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" + apiKey;
        } 
        axios.post( url, authData)
            .then( response => {
                dispatch(authSuccess(response.data.idToken, response.data.localId));
            })
            .catch(err =>{
                dispatch(authFail(err.response.data.error));
            });
    };
};

