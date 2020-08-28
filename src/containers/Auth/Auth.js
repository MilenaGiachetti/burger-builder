import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import classes from './Auth.module.scss';
import * as actionCreators from '../../store/actions/index';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import { updateObject, checkValidity } from '../../shared/utility';


const Auth = props => {

    const [ userForm, setUserForm ] = useState({
        email: {
            elementType: 'input',
            elementConfig: {
                type: 'email',
                placeholder: 'Your E-Mail'
            },
            value: '',
            validation: {
                required: true,
                isEmail: true
            },
            valid: false,
            touched: false
        },
        password: {
            elementType: 'input',
            elementConfig: {
                type: 'password',
                placeholder: 'Your Password'
            },
            value: '',
            validation: {
                required: true,
                minLength: 6
            },
            valid: false,
            touched: false
        }
    });
    const [ isSignUp, setIsSignUp ] = useState(true);


    const { building, authRedirectPath, onSetAuthRedirectPath } = props;

    useEffect(()=>{
        if(!building && authRedirectPath !== '/' ) {
            onSetAuthRedirectPath('/')
        }
    }, [ building, authRedirectPath, onSetAuthRedirectPath ])

    const inputChangedHandler = (event, inputIdentifier) => {
        const updatedUserForm = updateObject(userForm, {
            [inputIdentifier]: updateObject(userForm[inputIdentifier],{
                value: event.target.value,
                valid: checkValidity(event.target.value, userForm[inputIdentifier].validation),
                touched: true
            })
        });
        setUserForm(updatedUserForm);
    };

    const switchAuthModeHandler = () => {
        setIsSignUp(prevSignUp => !prevSignUp);
    }

    const submitHandler = (event) => {
        event.preventDefault();
        props.onAuth(userForm.email.value, userForm.password.value, isSignUp);
    };

    const formElementsArray = [];
    for(let key in userForm) {
        formElementsArray.push({
            id: key,
            config: userForm[key]
        });
    };

    let form = formElementsArray.map(formElement => (
        <Input
            key={formElement.id}
            elementType={formElement.config.elementType} 
            elementConfig={formElement.config.elementConfig} 
            value={formElement.config.value} 
            invalid={!formElement.config.valid}
            touched={formElement.config.touched}
            shouldValidate={formElement.config.validation}
            changed={(event) => inputChangedHandler(event, formElement.id)}
        />
    ));

    if( props.loading ) {
        form = <Spinner />;
    };
    
    let errorMessage = null;

    if(props.error) {
        errorMessage = (
            <p>{props.error.message}</p>
        )
    }

    let authRedirect = null;
    if(props.isAuth){
        authRedirect = <Redirect to={props.authRedirectPath}/>;
    } 

    return (
        <div className={classes.Auth}>
            {authRedirect}
            <h4>{isSignUp ? 'SIGNUP' : 'SIGNIN'}</h4>
            {errorMessage}
            <form onSubmit={submitHandler}>
                {form}
                <Button btnType="Success">Submit</Button>
            </form>
            <Button 
                clicked={switchAuthModeHandler}
                btnType="Danger">SWITCH TO {isSignUp ? 'SIGNIN' : 'SIGNUP'}</Button>                
        </div>
    );
}


const mapStateToProps = state => {
    return {
        isAuth: state.auth.token !== null,
        loading: state.auth.loading,
        error: state.auth.error,
        building: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirectPath
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, isSignUp) => dispatch(actionCreators.auth(email, password, isSignUp)),
        onSetAuthRedirectPath: (path) => dispatch(actionCreators.setAuthRedirectPath(path))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);