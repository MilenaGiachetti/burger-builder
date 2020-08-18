import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import classes from './Auth.module.scss';
import * as actionCreators from '../../store/actions/index';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';

class Auth extends Component {
    state = {
        UserForm: {
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
        },
        formIsValid: false,
        isSignUp: true
    }

    componentDidMount() {
        if(!this.props.building && this.props.authRedirectPath !== '/' ) {
            this.props.onSetAuthRedirectPath('/')
        }
    }

    checkValidity(value, rules) {
        let isValid = true;
        if(!rules) {
            return true;
        }
        if(rules.required) {
            isValid = value.trim() !== '' && isValid;
        }

        if(rules.minLength) {
            isValid = value.length >= rules.minLength && isValid;
        }

        if(rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid;
        }

        if(rules.isEmail) {
            const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
            isValid = pattern.test(value) && isValid;
        }

        if(rules.isNumeric) {
            const pattern = /^\d+$/;
            isValid = pattern.test(value) && isValid;
        }

        return isValid;
    }

    inputChangedHandler = (event, inputIdentifier) => {
        const updatedUserForm = {
            ...this.state.UserForm,
            [inputIdentifier]: {
                ...this.state.UserForm[inputIdentifier],
                value: event.target.value,
                valid: this.checkValidity(event.target.value, this.state.UserForm[inputIdentifier].validation),
                touched: true
            }
        };
        this.setState({UserForm: updatedUserForm});
    };

    switchAuthModeHandler = () => {
        this.setState(prevState => {
            return {isSignUp: !prevState.isSignUp}
        })
    }

    submitHandler = (event) => {
        event.preventDefault();
        this.props.onAuth(this.state.UserForm.email.value, this.state.UserForm.password.value, this.state.isSignUp);
    };

    render () {
        const formElementsArray = [];
        for(let key in this.state.UserForm) {
            formElementsArray.push({
                id: key,
                config: this.state.UserForm[key]
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
                changed={(event) => this.inputChangedHandler(event, formElement.id)}
            />
        ));

        if( this.props.loading ) {
            form = <Spinner />;
        };
        
        let errorMessage = null;

        if(this.props.error) {
            errorMessage = (
                <p>{this.props.error.message}</p>
            )
        }

        let authRedirect = null;
        if(this.props.isAuth){
            console.log(this.props.authRedirectPath)
            authRedirect = <Redirect to={this.props.authRedirectPath}/>;
        } 

        return (
            <div className={classes.Auth}>
                {authRedirect}
                <h4>{this.state.isSignUp ? 'SIGNUP' : 'SIGNIN'}</h4>
                {errorMessage}
                <form onSubmit={this.submitHandler}>
                    {form}
                    <Button btnType="Success">Submit</Button>
                </form>
                <Button 
                    clicked={this.switchAuthModeHandler}
                    btnType="Danger">SWITCH TO {this.state.isSignUp ? 'SIGNIN' : 'SIGNUP'}</Button>                
            </div>
        );
    }
};

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