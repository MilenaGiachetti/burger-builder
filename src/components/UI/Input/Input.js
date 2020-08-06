import React from 'react'
import classes from './Input.module.scss';

const input = (props) => {
    let inputElement = null;
    const inputClasses = [classes.InputElement];

    if(props.invalid && props.shouldValidate && props.touched) {
        inputClasses.push(classes.Invalid);
    }

    //Con el switch hace mas dinamico el componente, solo hay que poner el inputType correcto
    switch (props.elementType) {
        case ('input'):
            //al hacer spread de props se pueden pasar como props los mismos atributos que usaria el elemento. Ej. type="mail" para el input
            inputElement = <input 
                className={inputClasses.join(" ")} 
                {...props.elementConfig} 
                value={props.value} 
                onChange={props.changed}
            />
            break;
        case ('textarea'):
            //en react textarea is self closing
            inputElement = <textarea   
                className={inputClasses.join(" ")}  
                {...props.elementConfig} 
                value={props.value} 
                onChange={props.changed}
            />
            break;
        case ('select'):
            inputElement = (
                <select   
                    className={inputClasses.join(" ")}  
                    value={props.value}
                    onChange={props.changed}
                >
                    {props.elementConfig.options.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.displayValue}
                        </option>
                    ))};
                </select>
            );
            break;
        default:
            inputElement = <input  
                className={inputClasses.join(" ")}  
                {...props.elementConfig} 
                value={props.value}  
                onChange={props.changed}
            />
    }

    let validationError = null;
    if (props.invalid && props.touched) {
        validationError = <p className={classes.ValidationError}>Please enter a valid value!</p>;
    }
 
    return (
        <div className={classes.Input}>
            <label>{props.label}</label>
            {inputElement}
            {validationError}
        </div>
    )
}

export default input;