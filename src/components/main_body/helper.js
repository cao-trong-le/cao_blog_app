import axiosInstance from "axios_instance/axios_instance";
import {store} from "store.js"
import * as form_actions from "redux_actions/formActions";
import * as app_actions from "redux_actions/appActions";

const actions = {
    ...form_actions,
    ...app_actions
}

const dispatch = store.dispatch
const state = store.getState()

// const fadingElement = async (element) => {
//     await new Promise(resovle => setTimeout((resolve) => {
//         console.log("hello")
//         element.classList.add("fading-effect")
//     }, 1100))
// }

export const deleteManyPosts = async (user_code, post_codes) => {
    let data = new FormData()

    data.append("event", "delete_many_posts")
    data.append("user_code", user_code)
    data.append("post_codes", JSON.stringify(post_codes))

    // const post_HTML_element = document.querySelector(`.post-${post_codes[0]}`)
    // post_HTML_element.classList.add("fading-effect")

    axiosInstance
    .post(`blog/posts/`, data)
    .then( async (res) => {
        console.log(res)
        dispatch(actions.removeFromSelectedList([...post_codes]))
        dispatch(actions.setSelecting(false)) 

        // remove post => create fading animation

        for (var post_code of post_codes) {
            const post_HTML_element = document.querySelector(`.post-${post_code}`)
            post_HTML_element.classList.add("fading-effect")

            // await fadingElement(post_HTML_element)
        }

        // send a request to fetch posts again for a certain page

        setTimeout( async () => {          
            if (store.getState().user !== undefined) {
                fetchPosts(
                    store.getState().user.info.code, 
                    "", 
                    "", 
                    "", 
                    "",
                    state.app.page,
                    false 
                )
            }
        }, 1100)
    })
    .catch((err) => {
        console.log(err)
    })
}

export const deleteAllPosts = (user_code) => {
    let data = new FormData()

    data.append("event", "delete_all_posts")
    data.append("user_code", user_code)

    axiosInstance
    .post(`blog/posts/`, data)
    .then((res) => {
        console.log(res)
        dispatch(actions.removeAllFromPostsList()) 
        dispatch(actions.setSelecting(false)) 

    })
    .catch((err) => {
        console.log(err)
    })
}

export const fetchPosts = (user_code, keyword, date, month, year, page, switch_page) => {
    console.log(page)

    let data = new FormData()
    // filter data

    data.append("event", "filter_posts_by")
    data.append("user_code", user_code)
    data.append("keyword", keyword)
    data.append("date", date)
    data.append("month", month)
    data.append("year", year)
    data.append("page_number", page.toString())

    axiosInstance
    .post(`blog/posts/`, data)
    .then((res) => {
        console.log(res.data)

        var listNums = []
        if (res.data.data.posts.length !== 0) {
            listNums = Array.from({length: res.data.data.num_pages}, (_, i) => i + 1)
            !switch_page && dispatch(actions.setPage(1))
        } else {
            !switch_page && dispatch(actions.setPage(0))
        }
            
        dispatch(actions.setNumPages([...listNums])) 
        dispatch(actions.setPosts([...res.data.data.posts]))
    })
    .catch((err) => {
        console.log(err)
    })
}