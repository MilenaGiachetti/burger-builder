import React from 'react';
import classes from './NavigationItem.module.scss';
import { NavLink } from 'react-router-dom';

const navigationItem = (props) => (
    <li className={classes.NavigationItem}>
        {/* Se cambia el active class para que funcione con modules */}
        <NavLink to={props.link} exact={props.exact}
                activeClassName={classes.active}>
            {props.children}
        </NavLink>
    </li>
)

export default navigationItem;