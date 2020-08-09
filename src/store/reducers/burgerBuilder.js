import actionTypes from '../actions/actionsTypes';

const initialState = {
    ingredients: null,
    totalPrice: 50,
    error: false
};

const INGREDIENT_PRICES = {
    salad: 1.5,
    cheese: 5,
    bacon: 15,
    meat: 20
}

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.ADD_INGREDIENT:
            return{
                ...state,
                // se distribuye también ingredients en un nuevo objeto
                ingredients: {
                    ...state.ingredients,
                    [action.ingredientName]: state.ingredients[action.ingredientName] + 1
                },
                totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientName]
            };
        case actionTypes.REMOVE_INGREDIENT:
            return{
                ...state,
                ingredients: {
                    ...state.ingredients,
                    [action.ingredientName]: state.ingredients[action.ingredientName] - 1
                },
                totalPrice: state.totalPrice - INGREDIENT_PRICES[action.ingredientName]
            };
        case actionTypes.SET_INGREDIENTS:
            return {
                ...state,
                // se ordena a mano los ingredientes dados por la db. Sólo soportaría estos 4 elementos, no conveniente de ser más dinámico
                ingredients: {
                    salad: action.ingredients.salad,
                    bacon: action.ingredients.bacon,
                    cheese: action.ingredients.cheese,
                    meat: action.ingredients.meat
                },
                totalPrice: 50,
                // se resetea el error por si acaso.
                error: false
            };
        case actionTypes.FETCH_INGREDIENTS_FAILED:
            return {
                ...state,
                error: true
            };
        default:
            return state;
    };
};

export default reducer;