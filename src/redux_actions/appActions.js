import * as actionTypes from "./actionTypes"

export const setPage = (page) => dispatch => {
    dispatch({
        type: actionTypes.SET_PAGE,
        payload: page
    })
}

export const setPosts = (posts) => dispatch => {
    dispatch({
        type: actionTypes.SET_POSTS,
        payload: posts
    })
}

export const setSelecting = () => dispatch => {
    dispatch({
        type: actionTypes.SET_SELECTING_STATUS,
        payload: null
    })
}

// reset selected list state 
export const resetSelectedList = () => dispatch => {
    dispatch({
        type: actionTypes.RESET_SELECTED_POST,
        payload: []
    })
}

// add selected items to the list
export const appendToSelectedList = (selected_items) => dispatch => {
    dispatch({
        type: actionTypes.APPEND_TO_SELECTED_POST,
        payload: selected_items
    })
};

// remove targeted items from the list
export const removeFromSelectedList = (targeted_items) => dispatch => {
    dispatch({
        type: actionTypes.REMOVE_FROM_SELECTED_POST,
        payload: targeted_items
    })   
};

// remove all items from the posts list
export const removeAllFromPostsList = () => dispatch => {
    dispatch({
        type: actionTypes.REMOVE_ALL_FROM_POSTS_LIST,
        payload: []
    })   
};

// set sections
export const setProgressingSection = (sections) => dispatch => {
    dispatch({
        type: actionTypes.SET_PROGRESSING_SECTIONS,
        payload: sections
    })   
};

// set section on progress
export const setSectionOnProgress = (status) => dispatch => {
    dispatch({
        type: actionTypes.SET_SECTION_ON_PROGRESS,
        payload: status
    })   
};

export const setPostOnProgress = (status) => dispatch => {
    dispatch({
        type: actionTypes.SET_POST_ON_PROGRESS,
        payload: status
    })   
};

export const editSection = (index, section) => dispatch => {
    dispatch({
        type: actionTypes.EDIT_PROGRESSING_SECTIONS,
        payload: {
            index: index, 
            section: section
        }
    })   
};

