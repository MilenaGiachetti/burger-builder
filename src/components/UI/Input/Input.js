import React from 'react'
import classes from './Input.module.scss';

const input = (props) => {
    let inputElement = null;

    //Con el switch hace mas dinamico el componente, solo hay que poner el inputType correcto
    switch (props.elementType) {
        case ('input'):
            //al hacer spread de props se pueden pasar como props los mismos atributos que usaria el elemento. Ej. type="mail" para el input
            inputElement = <input 
                className={classes.InputElement} 
                {...props.elementConfig} 
                value={props.value} 
                onChange={props.changed}
            />
            break;
        case ('textarea'):
            //en react textarea is self closing
            inputElement = <textarea   
                className={classes.InputElement}  
                {...props.elementConfig} 
                value={props.value} 
                onChange={props.changed}
            />
            break;
        case ('select'):
            inputElement = (
                <select   
                    className={classes.InputElement}  
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
                className={classes.InputElement}  
                {...props.elementConfig} 
                value={props.value}  
                onChange={props.changed}
            />
    }
    return (
        <div className={classes.Input}>
            <label>{props.label}</label>
            {inputElement}
        </div>
    )
}

export default input;