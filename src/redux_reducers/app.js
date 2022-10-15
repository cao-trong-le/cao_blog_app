import * as actionTypes from "redux_actions/actionTypes"


const INITIAL_STATE = {
    posts: [],
    sections: [],
    progressing_sections: [],
    page: 1,
    selecting: false,
    post_selected: [],
    section_selected: [], 
    post_on_progress: true,
    section_on_progress: false
};

const appReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case actionTypes.SET_POST_ON_PROGRESS:
            state.post_on_progress = action.payload
            return {...state}

        case actionTypes.SET_SECTION_ON_PROGRESS:
            state.section_on_progress = action.payload
            return {...state}

        case actionTypes.SET_PROGRESSING_SECTIONS:
            if (state.progressing_sections !== undefined) 
                state.progressing_sections = [...state.progressing_sections, action.payload]
            else 
                state["progressing_sections"] = [action.payload]
            return {...state}

        case actionTypes.EDIT_PROGRESSING_SECTIONS:
            state.progressing_sections[action.payload.index] = action.payload.section
            return {...state}

        case actionTypes.SET_PAGE:
            state.page = action.payload
            return {...state}

        case actionTypes.SET_POSTS:
            state.posts = [...action.payload]
            return {...state}

        case actionTypes.RESET_SELECTED_POST:
            state.post_selected = action.payload
            return {...state}

        case actionTypes.SET_SELECTING_STATUS:
            state.selecting = !state.selecting
            return {...state}

        case actionTypes.APPEND_TO_SELECTED_POST:
            // remove duplicate
            let payload = action.payload

            payload.forEach((code, idx) => {
                let post_selected_idx = state.post_selected.indexOf(code)

                if (post_selected_idx !== -1) {
                    payload.splice(idx, 1)
                    state.post_selected.splice(post_selected_idx, 1)
                }
            })

            state.post_selected = [...state.post_selected, ...payload]
            return {...state};

        case actionTypes.REMOVE_FROM_SELECTED_POST:
            action.payload.forEach((item) => {
                let idx = state.post_selected.findIndex((code) => code === item)
                state.post_selected.splice(idx, 1)
            })
            
            return {...state};

        case actionTypes.REMOVE_ALL_FROM_POSTS_LIST:
            state.posts = []
            
            return {...state};

        default:
            return state

    }

};

export {appReducer};