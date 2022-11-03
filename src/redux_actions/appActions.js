import * as actionTypes from "./actionTypes"

export const setHomePageReload = (status) => dispatch => {
    dispatch({
        type: actionTypes.SET_HOMEPAGE_RELOAD,
        payload: status
    })
}

export const setPage = (page) => dispatch => {
    dispatch({
        type: actionTypes.SET_PAGE,
        payload: page
    })
}

export const setNumPages = (num_pages) => dispatch => {
    dispatch({
        type: actionTypes.SET_NUM_PAGES,
        payload: num_pages
    })
}

export const setPosts = (posts) => dispatch => {
    dispatch({
        type: actionTypes.SET_POSTS,
        payload: posts
    })
}

export const addPost = (post) => dispatch => {
    dispatch({
        type: actionTypes.ADD_POST,
        payload: post
    })
}

export const setSelecting = (status) => dispatch => {
    dispatch({
        type: actionTypes.SET_SELECTING_STATUS,
        payload: status
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

// set all to default
export const setDefaultProgressingSection = () => dispatch => {
    dispatch({
        type: actionTypes.SET_DEFAULT_PROGRESSING_SECTIONS,
        payload: []
    })   
};

// set sections
export const setProgressingSection = (section) => dispatch => {
    dispatch({
        type: actionTypes.SET_PROGRESSING_SECTIONS,
        payload: section
    })   
};

// set on progress
export const setOnProgress = (from, status) => dispatch => {
    dispatch({
        type: actionTypes.SET_ON_PROGRESS,
        payload: {
            from: from, 
            status: status
        }
    })   
};


// set edit

export const editSection = (index, section) => dispatch => {
    dispatch({
        type: actionTypes.EDIT_PROGRESSING_SECTIONS,
        payload: {
            index: index, 
            section: section
        }
    })   
};

export const setSectionEdit = (status, index) => dispatch => {
    dispatch({
        type: actionTypes.SET_SECTION_EDIT,
        payload: {
            status: status,
            index: index
        }
    })   
}

export const setPostEdit = (status) => dispatch => {
    dispatch({
        type: actionTypes.SET_POST_EDIT,
        payload: status,
    })   
}

export const updatePosts = (post) => dispatch => {
    dispatch({
        type: actionTypes.UPDATE_POST,
        payload: {
            post: post
        }
    })   
}

