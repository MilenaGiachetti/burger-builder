import React, { useState, useEffect, useCallback } from 'react';
import {  useSelector, useDispatch } from 'react-redux';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
//con minuscula porque no se usa con JSX
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
// se puede omitir el index y se apuntará a este igual
import * as actionCreators from '../../store/actions/index';


const BurgerBuilder = props => {

    const [ purchasing, setPurchasing ] = useState(false);

    const dispatch = useDispatch();
    const ings = useSelector(state => {
        return state.burgerBuilder.ingredients;
    });
    const price = useSelector(state => state.burgerBuilder.totalPrice);
    const error = useSelector(state => state.burgerBuilder.error);
    const isAuth = useSelector(state => state.auth.token !== null);

    const onIngredientAdded = (ingName) => dispatch(actionCreators.addIngredient(ingName));
    const onIngredientRemoved = (ingName) => dispatch(actionCreators.removeIngredient(ingName));
    const onInitIngredients = useCallback(() => dispatch (actionCreators.initIngredients()), [dispatch]);
    const onInitPurchase = () => dispatch(actionCreators.purchaseBurgerInit());
    const onSetAuthRedirectPath = (path) => dispatch(actionCreators.setAuthRedirectPath(path));

    useEffect(()=>{
        onInitIngredients();
    }, [onInitIngredients]);

    const updatePurchaseState = (ingredients) => {
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey]
            })
            .reduce((resultsum, el) => {
                return resultsum + el;
            }, 0);
        return sum > 0;
    }

    const purchaseHandler = () => {
        if(isAuth) {
            setPurchasing(true);
        } else {
            onSetAuthRedirectPath('/checkout')
            props.history.push("/auth");
        }
    }

    const purchaseCancelHandler = () => {
        setPurchasing(false);
    }

    const purchaseContinueHandler = () => {
        onInitPurchase();
        props.history.push('/checkout');
    }
    
    const disabledInfo = {
        ...ings
    };

    for (let key in disabledInfo) {
        disabledInfo[key] = disabledInfo[key] <= 0;
    }

    // quedaria cheese: true, meat: false...
    let orderSummary = null;

    let burger = error ? <p>Ingredients cant be loaded</p> : <Spinner />;
    
    if(ings) {
        orderSummary = <OrderSummary 
                            price={price} ingredients={ings}
                            purchaseCancelled={purchaseCancelHandler}
                            purchaseContinued={purchaseContinueHandler}/>
        burger = (
            <Aux>
                <Burger ingredients={ings}/>
                <BuildControls 
                    ingredientAdded={onIngredientAdded}
                    ingredientRemoved={onIngredientRemoved}
                    disabled={disabledInfo}
                    price={price}
                    // funcion de purchasable se ejecuta con cada rerenderizacion de esta forma.
                    purchasable={updatePurchaseState(ings)}
                    order={purchaseHandler}
                    isAuth={isAuth}
                />
            </Aux>
        );
    };

    return (
        <Aux>
            <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
                {orderSummary}
            </Modal>
            {burger}
        </Aux>
    );
};

export default withErrorHandler(BurgerBuilder, axios);