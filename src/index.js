import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
// importar saga middleware
import createSagaMiddleware from 'redux-saga';

import burgerBuilderReducer from './store/reducers/burgerBuilder';
import orderReducer from './store/reducers/order';
import authReducer from './store/reducers/auth';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
// importar saga a usar
import { watchAuth, watchBurgerBuilder, watchOrder } from './store/sagas/index';

// added redux devtools
const composeEnhancers = process.env.NODE_ENV === "development" ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__  : null || compose;

const rootReducer = combineReducers({
	burgerBuilder: burgerBuilderReducer,
	order: orderReducer,
	auth: authReducer
})

// se crea saga
const sagaMiddleware = createSagaMiddleware();

const store = createStore(
	rootReducer, composeEnhancers(
		// se agrega saga como middleware
		applyMiddleware(sagaMiddleware)
));

sagaMiddleware.run(watchAuth);
sagaMiddleware.run(watchBurgerBuilder);
sagaMiddleware.run(watchOrder);

ReactDOM.render(
	// Hay que tener en cuenta ciertas cosas para que Provider y Browser Router funcionen bien juntos
	<Provider store={store}> 
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</Provider>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
