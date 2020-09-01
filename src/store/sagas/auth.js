import { put, delay, call } from 'redux-saga/effects';
import * as actionCreators from '../actions/index';
import axios from 'axios';

export function* logoutSaga(action) {
    // keyword yield hace que espere hasta que termine este paso antes de ejecutar el siguiente código.
    // estos yields en realidad no son necesarios porque es sincrónico
    yield call([localStorage, 'removeItem'], 'token');
    yield call([localStorage, 'removeItem'], 'userId');
    yield call([localStorage, 'removeItem'], 'expirationDate');
    yield put(actionCreators.logoutSucceed());
};

export function* checkAuthTimeoutSaga(action) {
    yield delay(action.expirationTime * 1000);
    yield put(actionCreators.logout());
};

export function* authUserSaga(action) {
    yield put(actionCreators.authStart());
    const authData = {
        email: action.email,
        password: action.password,
        returnSecureToken: true
    }
    const apiKey = `${process.env.REACT_APP_API_KEY}`; //key
    let url = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" + apiKey;
    if(!action.isSignUp) {
        url = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" + apiKey;
    } 

    try {
        // Por el yield no se necesita el .then. Con el yield espera la respuesta sea error o exito
        const response = yield axios.post( url, authData);
    
        const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000);
        yield localStorage.setItem('token', response.data.idToken);
        yield localStorage.setItem('userId', response.data.localId);
        yield localStorage.setItem('expirationDate', expirationDate);
        yield put(actionCreators.authSuccess(response.data.idToken, response.data.localId));
        yield put(actionCreators.checkAuthTimeout(response.data.expiresIn));
    } catch (err) {
        yield put(actionCreators.authFail(err));
    }
};

export function* authCheckStateSaga(action) {
    const token = yield localStorage.getItem('token');
    if(!token){
        yield put(actionCreators.logout());
    } else {
        const expirationDate = yield new Date(localStorage.getItem('expirationDate'));
        if( expirationDate > new Date ()){
            const userId =  localStorage.getItem('userId');
            yield put(actionCreators.authSuccess(token, userId));

            yield put(actionCreators.checkAuthTimeout((expirationDate.getTime() - new Date().getTime())/1000));
        } else {
            yield put(actionCreators.logout());
        }
    }
}
