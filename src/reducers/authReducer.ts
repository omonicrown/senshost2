import { authActions } from "../actions";
import {
    RECEIVE_AUTH_USER,
    REQUEST_AUTH_USER,
    SIGNOUT_USER,
    LOG_AUTH_ERROR,
} from "../constants";
import { AuthState } from '../interfaces/states';

const initialState: AuthState = {
    isFetching: false,
    auth: null,
    error: null,
    isAuthenticated: false
};

export default (state: AuthState = initialState, action: authActions) => {
    switch (action.type) {
        case RECEIVE_AUTH_USER: {
            return {
                ...state,
                auth: action.auth,
                error: null,
                isAuthenticated: true,
                isFetching: false

            };
        }
        case LOG_AUTH_ERROR: {
            return { ...state, error: action.error, isFetching: false };
        }
        case REQUEST_AUTH_USER: {
            return { ...state, isFetching: true };
        }
        case SIGNOUT_USER: {
            return {
                ...state,
                isAuthenticated: false,
                auth: null,
                token: null,
                isFetching: false,
                user: false
            };
        }
        default: {
            return state;
        }

    }

}