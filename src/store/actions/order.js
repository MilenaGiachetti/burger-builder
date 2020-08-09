import actionTypes from './actionsTypes';
import axios from '../../axios-orders';

const purchaseBurgerSuccess = (id,orderData) => {
    return {
        type: actionTypes.PURCHASE_BURGER_SUCCESS,
        orderId: id,
        orderData: orderData
    }
};

const purchaseBurgerFailed = (error) => {
    return {
        type: actionTypes.PURCHASE_BURGER_FAILED,
        error: error
    }
};

// Para setear el loading ya que purchaseBurger nunca llega al reducer al ser asincrono
const purchaseBurgerStart = () => {
    return {
        type: actionTypes.PURCHASE_BURGER_START
    }
};

export const purchaseBurger = (orderData) => {
    return dispatch => {
        // se envuelve en dispatch para que se despache al store
        dispatch(purchaseBurgerStart());
        axios.post('/orders.json', orderData)
        .then(response => {
            dispatch(purchaseBurgerSuccess(response.data.name, orderData));
        })
        .catch(error => {
            dispatch(purchaseBurgerFailed(error));
        });
    }
};

export const purchaseBurgerInit = () => {
    return {
        type: actionTypes.PURCHASE_BURGER_INIT
    }
};