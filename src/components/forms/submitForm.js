/* eslint-disable */

import {store} from "store.js"
import { postDefaultValues, sectionDefaultValues } from "./defaultValues"
import axiosInstance from "axios_instance/axios_instance";
import * as form_actions from "redux_actions/formActions";
import * as app_actions from "redux_actions/appActions";

const actions = {
    ...form_actions,
    ...app_actions
}


const state = store.getState()

var form_data = new FormData()


const setDataInDataForm = async (from, data, index) => {
    // first is to stringify string data

    var images = null
    images = data[`${from}_image`]
    // delete data[`${from}_image`]

    if (from === "post")
        delete data["post_section"]

    form_data.append(from, JSON.stringify(data))

    for (var i = 0; i < images.length; i++) {
        var image_name = null
        var url = images[i]

        if (index !== -1)
            image_name = `section_${index}_${i}`
        else
            image_name = `post_${i}`

        let file = await fetch(url)
        .then( async (r) => await r.blob())
        .then( async (blobFile) => new File([blobFile], image_name, { type: "image/png" }))

        form_data.append("images", file, file.name)
    }
}


const reorganizeData = async (post_data, section_data) => {
    // filter data

    // post_data
    // get post data source

    var post = {...post_data}

    await setDataInDataForm("post", post, -1)

    // sections data
    var sections = [...section_data]

    for (var i = 0; i < sections.length; i++) {
        await setDataInDataForm("section", sections[i], i)
    }
}

export const handleEdit = async (e, post_data, section_data, user_data) => {
    e.preventDefault()

    console.log(post_data, section_data, user_data)

    await reorganizeData(post_data, section_data, user_data)

    form_data.forEach((value, key) => {
        console.log(key, value)
    })

    form_data.append("event", "edit_post")
    form_data.append("code", user_data.code)
   

    axiosInstance
    .post("blog/create/post/", form_data)
    .then((res) => {
        console.log(res)
        form_data = new FormData()
        
        // clear all data from form and app 
        store.dispatch(actions.handlePost(postDefaultValues))
        store.dispatch(actions.handleSection(sectionDefaultValues))
        store.dispatch(actions.setDefaultProgressingSection())
        store.dispatch(actions.setOnProgress("post", false))
        store.dispatch(actions.setOnProgress("heading", true))
        store.dispatch(actions.setHomePageReload(true))
    })
    .catch((err) => {
        console.log(err)
    })
}

// pass in post data and section data
export const handleSubmit = async (e, post_data, section_data, user_data) => {
    e.preventDefault()

    console.log(post_data, section_data, user_data)

    await reorganizeData(post_data, section_data, user_data)

    form_data.forEach((value, key) => {
        console.log(key, value)
    })

    // console.log(form_data.getAll("images"))

    // section_form_data.forEach((value, key) => {
    //     console.log(key, value)
    // })

    form_data.append("event", "add_post")
    form_data.append("id", user_data.id.toString())
   

    axiosInstance
    .post("blog/create/post/", form_data)
    .then((res) => {
        console.log(res)
        form_data = new FormData()

        // clear all data from form and app 
        store.dispatch(actions.handlePost(postDefaultValues))
        store.dispatch(actions.handleSection(sectionDefaultValues))
        store.dispatch(actions.setDefaultProgressingSection())
        store.dispatch(actions.setOnProgress("post", false))
        store.dispatch(actions.setOnProgress("heading", true))
        store.dispatch(actions.setHomePageReload(true))

    })
    .catch((err) => {
        console.log(err)
    })
}


export const createPost = async () => {}

