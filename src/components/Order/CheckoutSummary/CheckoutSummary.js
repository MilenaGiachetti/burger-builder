import React from 'react';
import Burger from '../../Burger/Burger';
import Button from '../../UI/Button/Button';
import classes from './CheckoutSummary.module.scss';

const checkoutSummary = (props) => {
    return (
        <div className={classes.CheckoutSummary}>
            <h1>Buen provecho!</h1>
            <div style={{width: '100%', margin:"auto"}}>
                <Burger ingredients={props.ingredients} />
            </div>
            <Button btnType="Danger" clicked={props.checkoutCancelled}>CANCELAR</Button>
            <Button btnType="Success" clicked={props.checkoutContinued}>CONTINUAR</Button>
        </div>
    )
}

export default checkoutSummary;