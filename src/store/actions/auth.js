import actionTypes from './actionsTypes';

const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
}
const authSuccess = (authData) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        authData: authData
    }
}
const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    }
}
export const auth = (email, password) => {
    return dispatch => {
        dispatch(authStart());
    };
};