import reducer from './auth';
import actionTypes from '../actions/actionsTypes';
import instance from '../../axios-orders';


describe('auth reducer', () => {
    it('should return the initial state', () => {
        // con undefined tomaría el initial stae
        expect(reducer(undefined, {})).toEqual({
            token: null,
            userId: null,
            error: null,
            loading: false,
            authRedirectPath: '/'
        })
    })
    it('should return the token upon login', () => {
        expect(reducer({
            token: null,
            userId: null,
            error: null,
            loading: false,
            authRedirectPath: '/'
        }, {
            type: actionTypes.AUTH_SUCCESS,
            idToken: 'some-idToken',
            userId: 'some-userId'
        })).toEqual({
            token: 'some-idToken',
            userId: 'some-userId',
            error: null,
            loading: false,
            authRedirectPath: '/'
        })
    })
})