import React from 'react';
import classes from './Modal.module.scss';
import Aux from '../../../hoc/Auxiliary/Auxiliary';
import Backdrop from '../Backdrop/Backdrop';


const Modal = props => {
    return(
        <Aux>
            <Backdrop show={props.show} clicked={props.modalClosed}/>
            <div 
                className={classes.Modal}
                style={{
                    transform: props.show ? 'translateY(0)' : 'translateY(-100vh)',
                    opacity: props.show ? '1' : '0',
                }}>
                {props.children}
            </div>
        </Aux>
    )        
}
    // shouldComponentUpdate (nextProps, nextState) {
    //     return nextProps.show !== this.props.show || nextProps.children !== this.props.children;
    // }


export default React.memo(Modal, (prevProps, nextProps) => 
    nextProps.show === prevProps.show && 
    nextProps.children === prevProps.children
);
