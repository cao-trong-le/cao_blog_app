import * as actionTypes from "./actionTypes"


export const handleRegister = (data) => dispatch => {
    dispatch({
        type: actionTypes.HANDLE_REGISTER,
        payload: data
    })
};

export const handlePost = (data) => dispatch => {
    dispatch({
        type: actionTypes.HANDLE_POST,
        payload: data
    })   
};

export const handleSection = (data) => dispatch => {
    dispatch({
        type: actionTypes.HANDLE_SECTION,
        payload: data
    })
}

export const updatePostForm = (data) => dispatch => {
    dispatch({
        type: actionTypes.UPDATE_POST_FORM,
        payload: data
    })
}

export const updateSectionForm = (data) => dispatch => {
    dispatch({
        type: actionTypes.UPDATE_SECTION_FORM,
        payload: data
    })
}

export const handleFormStatus = (form_name, data) => dispatch => {
    dispatch({
        type: actionTypes.HANDLE_FORM_STATUS,
        payload: {
            data: data, 
            form_name: form_name
        }
    })
}

export const handleFormImages = (from, images) => dispatch => {
    dispatch({
        type: actionTypes.HANDLE_FORM_IMAGES,
        payload: {
            from: from,
            images: images
        }
    })
}

export const updatePostSection = (index, section) => dispatch => {
    dispatch({
        type: actionTypes.UPDATE_POST_SECTION,
        payload: {
            index: index,
            section: section
        }
    })
}

export const setUnfinishedPost = (post) => dispatch => {
    dispatch({
        type: actionTypes.SET_UNFINISHED_POST,
        payload: post
    })
}