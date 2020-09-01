import { put } from 'redux-saga/effects';
import axios from '../../axios-orders';
import * as actionCreators from '../actions/index';

export function *  initIngredientsSaga (action) {
    try {
        const response = yield axios.get('/ingredients.json');
        yield put(actionCreators.setIngredients(response.data));
    } catch (error) {
        yield put(actionCreators.fetchIngredientsFailed());
    }
}