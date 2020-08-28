import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
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

    const {onInitIngredients} = props;

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
        if(props.isAuth) {
            setPurchasing(true);
        } else {
            props.onSetAuthRedirectPath('/checkout')
            props.history.push("/auth");
        }
    }

    const purchaseCancelHandler = () => {
        setPurchasing(false);
    }

    const purchaseContinueHandler = () => {
        props.onInitPurchase();
        props.history.push('/checkout');
    }
    
    const disabledInfo = {
        ...props.ings
    };

    for (let key in disabledInfo) {
        disabledInfo[key] = disabledInfo[key] <= 0;
    }

    // quedaria cheese: true, meat: false...
    let orderSummary = null;

    let burger = props.error ? <p>Ingredients cant be loaded</p> : <Spinner />;
    
    if(props.ings) {
        orderSummary = <OrderSummary 
                            price={props.price} ingredients={props.ings}
                            purchaseCancelled={purchaseCancelHandler}
                            purchaseContinued={purchaseContinueHandler}/>
        burger = (
            <Aux>
                <Burger ingredients={props.ings}/>
                <BuildControls 
                    ingredientAdded={props.onIngredientAdded}
                    ingredientRemoved={props.onIngredientRemoved}
                    disabled={disabledInfo}
                    price={props.price}
                    // funcion de purchasable se ejecuta con cada rerenderizacion de esta forma.
                    purchasable={updatePurchaseState(props.ings)}
                    order={purchaseHandler}
                    isAuth={props.isAuth}
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

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuth: state.auth.token !== null
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch(actionCreators.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(actionCreators.removeIngredient(ingName)),
        onInitIngredients: () => dispatch (actionCreators.initIngredients()),
        onInitPurchase: () => dispatch(actionCreators.purchaseBurgerInit()),
        onSetAuthRedirectPath: (path) => dispatch(actionCreators.setAuthRedirectPath(path))
    }
}

// no da problemas tener varios hocs, siempre que se pasen los props de uno a otro
// No importa que el request a axios ocurre en otro lugar, se sigue podiendo manejar el error desde acá
export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));