import * as actionTypes from "redux_actions/actionTypes"


const INITIAL_STATE = {
    homepage_reload: true,
    on_edit: false,
    posts: [],
    sections: [],
    progressing_sections: [],
    page: 1,
    num_pages: [],
    selecting: false,
    post_selected: [],
    section_selected: [], 
    post_on_progress: false,
    heading_on_progress: true,
    section_on_progress: false,
    
    // edit post
    post_edit: false, 
    section_edit: {
        status: false, 
        index: -1
    }
};

const appReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {  
        case actionTypes.SET_POST_EDIT:
            state.post_edit = action.payload
            return {...state}

        case actionTypes.SET_HOMEPAGE_RELOAD:
            state.homepage_reload = action.payload
            return {...state}

        case actionTypes.SET_SECTION_EDIT:
            if (state.section_edit === undefined) {
                state["section_edit"] = {
                    status: action.payload.status,
                    index: action.payload.index
                }
            } else {
                state.section_edit.status = action.payload.status
                state.section_edit.index = action.payload.index
            }

            return {...state}

        case actionTypes.SET_ON_PROGRESS:
            switch (action.payload.from) {
                case "post":
                    state.post_on_progress = action.payload.status
                    break
                case "section":
                    state.section_on_progress = action.payload.status
                    break
                case "heading":
                    state.heading_on_progress = action.payload.status
                    break
                default:
                    break
            }

            return {...state}

        case actionTypes.SET_DEFAULT_PROGRESSING_SECTIONS:
            state.progressing_sections = action.payload
            return {...state}

        case actionTypes.SET_PROGRESSING_SECTIONS:
            if (state.progressing_sections !== undefined) {
                if (action.payload["section_code"] !== undefined) {
                    // find section in progressing_sections
                    var idx = state.progressing_sections.findIndex((section) => {
                        return section["section_code"] === action.payload["section_code"]
                    })

                    if (idx !== -1) {
                        // update section from progressing sections
                        state.progressing_sections[idx] = {...action.payload}
                        return {...state}
                    }        
                } 

                state.progressing_sections = [
                    ...state.progressing_sections, 
                    action.payload
                ]
            }    

            else 
                state["progressing_sections"] = [action.payload]

            return {...state}

        case actionTypes.EDIT_PROGRESSING_SECTIONS:
            state.progressing_sections[action.payload.index] = action.payload.section
            return {...state}

        case actionTypes.SET_PAGE:
            state.page = action.payload
            return {...state}

        case actionTypes.SET_NUM_PAGES:
            state.num_pages = action.payload
            return {...state}

        case actionTypes.SET_POSTS:
            state.posts = [...action.payload]
            return {...state}

        case actionTypes.UPDATE_POST:
            // payload: section_code, post_code

            // find post by post code
            const post_index = state.posts.findIndex((post) => {
                return post.post_code === action.payload.post.post_code
            })

            state.posts.splice(post_index, 1, action.payload.post)

            // // find section by section code
            // const section_index = post.post_section.findIndex((section) => {
            //     return section.section_code === action.payload.section_code
            // })

            // // replace old section with updated section
            // post.post_section.splice(section_index, 1, action.payload.updated_section)

            return {...state}

        case actionTypes.ADD_POST:
            state.posts.push(action.payload)
            return {...state}

        case actionTypes.RESET_SELECTED_POST:
            state.post_selected = action.payload
            return {...state}

        case actionTypes.SET_SELECTING_STATUS:
            state.selecting = action.payload
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