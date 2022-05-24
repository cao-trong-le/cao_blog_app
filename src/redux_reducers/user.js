import * as actionTypes from "redux_actions/actionTypes"


const INITIAL_STATE = {
    login: false,
    info: null
};

const userReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case actionTypes.UPDATE_USER_INFO:
            const user_info = {...action.payload}
            return {
                ...state, 
                info: user_info
            };

        case actionTypes.LOGIN_USER:
            return {
                ...state, 
                login: action.payload,
            };

        case actionTypes.LOGOUT_USER:
            return {
                ...state,
                login: action.payload
            }

        default:
            return state

    }

};

export {userReducer};