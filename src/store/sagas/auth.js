import { put } from 'redux-saga/effects';
import actionTypes from '../actions/actionsTypes';


export function* logoutSaga(action) {
    // keyword yield hace que espere hasta que termine este paso antes de ejecutar el siguiente código.
    yield localStorage.removeItem('token');
    yield localStorage.removeItem('userId');
    yield localStorage.removeItem('expirationDate');
    yield put({
        type: actionTypes.AUTH_LOGOUT
    });
};
