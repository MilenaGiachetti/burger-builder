import React, { Component } from 'react';
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



export class BurgerBuilder extends Component {
    state = {
        purchasing: false
    }

    componentDidMount () {
        this.props.onInitIngredients();
    }
    updatePurchaseState (ingredients) {
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey]
            })
            .reduce((resultsum, el) => {
                return resultsum + el;
            }, 0);
        return sum > 0;
    }

    purchaseHandler = () => {
        if(this.props.isAuth) {
            this.setState({purchasing: true});
        } else {
            this.props.onSetAuthRedirectPath('/checkout')
            this.props.history.push("/auth");
        }
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing:false});
    }

    purchaseContinueHandler = () => {
        this.props.onInitPurchase();
        this.props.history.push('/checkout');
    }
    
    render(){
        const disabledInfo = {
            ...this.props.ings
        };
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0;
        }
        // quedaria cheese: true, meat: false...
        let orderSummary = null;

        let burger = this.props.error ? <p>Ingredients cant be loaded</p> : <Spinner />;
        
        if(this.props.ings) {
            orderSummary = <OrderSummary 
                                price={this.props.price} ingredients={this.props.ings}
                                purchaseCancelled={this.purchaseCancelHandler}
                                purchaseContinued={this.purchaseContinueHandler}/>
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ings}/>
                    <BuildControls 
                        ingredientAdded={this.props.onIngredientAdded}
                        ingredientRemoved={this.props.onIngredientRemoved}
                        disabled={disabledInfo}
                        price={this.props.price}
                        // funcion de purchasable se ejecuta con cada rerenderizacion de esta forma.
                        purchasable={this.updatePurchaseState(this.props.ings)}
                        order={this.purchaseHandler}
                        isAuth={this.props.isAuth}
                    />
                </Aux>
            );
        };

        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

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