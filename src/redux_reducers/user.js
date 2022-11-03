import * as actionTypes from "redux_actions/actionTypes"


const INITIAL_STATE = {
    login: false,
    info: null
};

const userReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case actionTypes.UPDATE_USER_INFO:
            state.info = {...action.payload}

            return {...state}

        case actionTypes.LOGIN_USER:
            state.login = action.payload
            return {...state}

        case actionTypes.LOGOUT_USER:
            state.info = null
            state.login = action.payload

            return {...state}

        default:
            return state

    }

};

export {userReducer};