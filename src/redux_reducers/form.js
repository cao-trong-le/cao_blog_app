/* eslint-disable */

import * as actionTypes from "redux_actions/actionTypes"
import { OverwriteObject } from "helpers/overwrite"
import { isEmptyObject } from "helpers/objectHelper";

const INITIAL_STATE = {
    form_status: {
        post: false,
        section: false,
        register: false
    },
    post: {
        post_title: "",
        post_summary: "",
        post_image: [],
        post_public: true,
        post_edited: false,
        post_view: 0,
        post_section: []
    },
    section: {
        section_title: "",
        section_content: "",
        section_image: [],
        section_public: true
    },
    register: {
        email: "",
        password: "",
        re_password: "",
        first_name: "",
        last_name: "",
        username: "",
        avatar: [],
    },
    form_files: {
        post_images: [],
        section_images: [],
        files: []
    }
};

const formReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case actionTypes.HANDLE_FORM_IMAGES:
            if (state["form_files"] === undefined) {
                state["form_files"] = {
                    post_images: [],
                    section_images: [],
                    files: []
                }
            } 

            if (action.payload.from === "post") 
                    state.form_files.post_images = [...action.payload.images]
                else 
                    state.form_files.section_images = [...action.payload.images]

            return {...state}

        case actionTypes.HANDLE_REGISTER:
            state.register = {...state.register, ...action.payload}
            return {...state};

        case actionTypes.HANDLE_POST:
            state.post = {...state.post, ...action.payload}
            return {...state};

        case actionTypes.HANDLE_SECTION:
            state.section = {...state.section, ...action.payload}
            return {...state}

        case actionTypes.HANDLE_FORM_STATUS:
            if (isEmptyObject(action.payload.data)) 
                state.form_status[action.payload.form_name] = false
            else 
                state.form_status[action.payload.form_name] = true

            return {...state}
            
        default:
            return state

    }

};

export {formReducer};