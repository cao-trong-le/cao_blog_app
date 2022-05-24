import * as actionTypes from "./actionTypes"


export const updateUserInfo = (data) => dispatch => {
    dispatch({
        type: actionTypes.UPDATE_USER_INFO,
        payload: data
    })
};

export const loginUser = () => dispatch => {
    dispatch({
        type: actionTypes.LOGIN_USER,
        payload: true
    })   
};

export const logoutUser = () => dispatch => {
    dispatch({
        type: actionTypes.LOGOUT_USER,
        payload: false
    })
}