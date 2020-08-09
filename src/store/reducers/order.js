import actionTypes from '../actions/actionsTypes';
import { updateObject } from '../utility';

const intialState = {
    orders: [],
    loading: false,
    purchased: false
};

const purchaseBurgerInit = (state, action) => {
    return updateObject(state, {purchased: false});
};

const purchaseBurgerStart = (state, action) => {
    return updateObject(state, {loading: true});
};

const purchaseBurgerSuccess = (state, action) => {
    const newOrder = updateObject(action.orderData, { id: action.orderId });
    return updateObject(state, {
        loading: false,
        purchased: true,
        orders: state.orders.concat(newOrder)
    });
};

const purchaseBurgerFailed = (state, action) => {
    return updateObject(state, {loading: false});
};

const fetchOrdersStart = (state, action) => {
    return updateObject(state, {loading: true});
};

const fetchOrdersSuccess = (state, action) => {
    return updateObject(state, {
        orders: action.orders,
        loading: false
    });
};

const fetchOrdersFail = (state, action) => {
    return updateObject(state, {loading: false});
};


const reducer = (state = intialState, action) => {
    switch(action.type) {
        case actionTypes.PURCHASE_BURGER_INIT: return purchaseBurgerInit (state, action);
        case actionTypes.PURCHASE_BURGER_START: return purchaseBurgerStart (state, action);
        case actionTypes.PURCHASE_BURGER_SUCCESS: return purchaseBurgerSuccess (state, action);            
        case actionTypes.PURCHASE_BURGER_FAILED: return purchaseBurgerFailed (state, action);
        case actionTypes.FETCH_ORDERS_START: return fetchOrdersStart (state, action);
        case actionTypes.FETCH_ORDERS_SUCCESS: return fetchOrdersSuccess (state, action);            
        case actionTypes.FETCH_ORDERS_FAIL: return fetchOrdersFail (state, action);
        default: return state;
    }
};

export default reducer;