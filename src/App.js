import React, {	useEffect,	Suspense} from 'react';
import Layout from './containers/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import { connect } from 'react-redux';
import { Route,	Switch,	Redirect } from 'react-router-dom';
import Logout from './containers/Auth/Logout/Logout';
import * as actionCreators from './store/actions/index';

const Checkout = React.lazy(() => import('./containers/Checkout/Checkout'));
const Orders = React.lazy(() => import('./containers/Orders/Orders'));
const Auth = React.lazy(() => import('./containers/Auth/Auth'));

const App = (props) => {

	const { onTryAutoSignup, isAuthenticated } = props;

	useEffect(() => {
		onTryAutoSignup();
	}, [onTryAutoSignup]);

	let routes = ( 
		<Switch>
			<Route path = "/auth" exact component = {Auth}/> 
			<Route path = "/" exact component = {BurgerBuilder}/> 
			<Redirect to = "/" />
		</Switch>
	);

	if (isAuthenticated) {
		routes = ( 
			<Switch>
				<Route path = "/orders"	exact component = {Orders}/> 
				<Route path = "/checkout" component = {Checkout} /> 
				<Route path = "/logout" component = {Logout}/> 
				<Route path = "/auth" exact component = {Auth}/> 
				<Route path = "/" exact component = {BurgerBuilder}/>
				<Redirect to = "/" />
			</Switch>
		);
	};

	return ( 
		<div>
			<Layout>
				<Suspense fallback = {<div> Loading... </div>}> 
					{routes} 
				</Suspense> 
			</Layout> 
		</div>
	);
}

const mapStateToProps = state => {
	return {
		isAuthenticated: state.auth.token !== null
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onTryAutoSignup: () => dispatch(actionCreators.authCheckState())
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);