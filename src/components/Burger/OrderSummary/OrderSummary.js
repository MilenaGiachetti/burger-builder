import React from 'react';
import Aux from '../../../hoc/Auxiliary';
import Button from '../../UI/Button/Button';

const orderSummary = (props) => {
    const ingredientSummary = Object.keys(props.ingredients)
        .map(igKey => {
            return <li key={igKey}>
                <span style={{textTransform: 'capitalize'}}>{igKey}</span>: {props.ingredients[igKey]}
            </li>
        })
    return (
        <Aux>
            <h3>Su orden:</h3>
            <p>Una hamburguesa personalizada con los siguientes ingredientes:</p>
            <ul>
                {ingredientSummary}
            </ul>
            <p>Precio total: <strong>{props.price.toFixed(2)}</strong></p>
            <p>Continuar con el pedido?</p>
            <Button clicked={props.purchaseCancelled} btnType="Danger">CANCELAR</Button>
            <Button clicked={props.purchaseContinued} btnType="Success">CONTINUAR</Button>
        </Aux>
    )
};

export default orderSummary;