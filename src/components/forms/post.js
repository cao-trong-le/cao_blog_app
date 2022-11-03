/* eslint-disable no-unused-vars */
/* eslint-disable */
import React, { useState, useEffect, useRef, createElement, useMemo, memo } from "react";
import { Link, matchPath } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
// import axiosInstance from "axios_instance/axiosInstace";
import { FormValidation } from "helpers/formValidation";
import Compress from "compress.js";
import { SectionFormComponent } from "./section";
import axiosInstance from "axios_instance/axios_instance";

import { useSelector, useDispatch } from "react-redux";
import * as form_actions from "redux_actions/formActions";
import * as app_actions from "redux_actions/appActions";

const actions = {
    ...form_actions,
    ...app_actions
}

import * as fileHelpers from "helpers/fileHelpers";

const PostFormComponent = (props) => {
    // redux state
    const user = useSelector((state) => state.user)
    const form = useSelector((state) => state.form)
    const app = useSelector((state) => state.app)

    // const [formValues, setFormValues] = useState(intialValues)
    const [formFiles, setFormFiles] = useState([]);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [addSection, setAddSection] = useState(false)
    const [headingImage, setHeadingImage] = useState(form.post.post_image)
    const requiredList = ["post_title"]

    const dispatch = useDispatch()

    
    // useEffect(() => {
    //     console.log("image changed")
    //     setHeadingImage(form.post.post_image[0])
    // }, [form.post.post_image])

    const postFormRef = useRef()
    
    const accessFormValidation = () => {
        const formValidate = new FormValidation({ ...form })
        return formValidate
    }

    const handleFormError = (name, data) => {
        let errorMsg = {}

        const validator = new FormValidation({ ...data })
        let validStatus = null

        switch (name) {
            case "post_title":
                validStatus = validator.checkTitleField(0, 255)
                break
            default:
                break
        }

        if (validStatus !== null) {
            if (!validStatus.status)
                errorMsg[validStatus.type] = validStatus.message
            setFormErrors({ ...formErrors, [validStatus.type]: validStatus.message })
        }
    }

    const handleTick = (e) => {
        // dispatch(handlePost({ ...post, post_public: !post.post_public }))
        dispatch(actions.handlePost({ ...form.post, post_public: !form.post.post_public }))
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        const data = {...form.post, [name]: value}
        // setFormValues({...data})
        dispatch(actions.handlePost({...data}))

        // set errors
        handleFormError(name, data)
    }

    // to avoid rendering image component again
    const memorizeRenderImage = useMemo(() => {
        return fileHelpers.renderImage(
            false,
            postFormRef,
            formErrors,
            setFormErrors,
            formFiles,
            setFormFiles,
            accessFormValidation,
            "post"
        )
    }, [formFiles])

    const deleteHeadingImageOnUpdate = async (image_code) => {
        var form_data = new FormData()
        form_data.append("event", "delete_post_heading_image")
        form_data.append("image_code", image_code)
        
        axiosInstance
        .post("blog/posts/", form_data)
        .then((res) => {
            console.log(res)
        })
        .catch((err) => {
            console.log(err)
        })
    }

    const addHeadingImageOnUpdate = async (post_code, new_image) => {
        var form_data = new FormData()
        form_data.append("event", "add_post_heading_image")
        form_data.append("post_code", post_code)
        form_data.append("new_image", new_image, new_image.name)
        
        axiosInstance
        .post("blog/posts/", form_data)
        .then((res) => {
            console.log(res)
            dispatch(actions.handlePost({...form.post, post_image: res.data.image}))

        })
        .catch((err) => {
            console.log(err)
        })
    }

    const updateHeadingImageOnUpdate = async (image_code, new_image) => {
        var form_data = new FormData()
        form_data.append("event", "update_post_heading_image")
        form_data.append("image_code", image_code)
        form_data.append("new_image", new_image, new_image.name)
        
        axiosInstance
        .post("blog/posts/", form_data)
        .then((res) => {
            console.log(res)
            dispatch(actions.handlePost({...form.post, post_image: res.data.image}))

            // reupdate heading image url
            const heading_image_HTML_element = document.querySelector(".heading-image")
            heading_image_HTML_element.setAttribute("src", res.data.image.image_content)

            const preview_heading_image_HTML_element = document.querySelector(".preview-heading-image")
            preview_heading_image_HTML_element.setAttribute("src", res.data.image.image_content)
        })
        .catch((err) => {
            console.log(err)
        })
    }

    const handleHeadingSave = async (e) => {
        e.preventDefault()

        // setFormValues({...formValues, post_image: formFiles})

        // validate input values
        for (var require of requiredList) {
            handleFormError(require, {...form.post})

            console.log(formErrors)

            if (formErrors[require] !== "" && Object.keys(formErrors).length > 0) 
                return     
        }

        dispatch(actions.handlePost(form.post))
        // dispatch(actions.setOnProgress("heading", false))

        // add all images to redux store
        // converse images to base64
        // setFormFiles([])
        // var images = fileHelpers.convertImagesToBase64([...formFiles])
        // dispatch(actions.handlePost({...form.post, post_image: [...images]}))

        // if on_edit then just simply update value, no need to submit the whole form 
        if (app.post_edit && form.post["post_code"] !== undefined) {
            // update post content
            var form_data = new FormData()
            form_data.append("event", "update_post_heading")
            
            // collect all data => form_data
            for (var key of Object.keys(form.post)) {
                if (!key.includes("image")) {
                    form_data.append(key, form.post[key])
                }
            }

            axiosInstance
            .post("blog/posts/", form_data)
            .then((res) => {
                console.log(res)
                // dispatch(actions.handlePost(postDefaultValues))
                dispatch(actions.setOnProgress("heading", false))
            })
            .catch((err) => {
                console.log(err)
            })
        } 

        else if (!app.post_edit && form.post["post_code"] !== undefined) {
            // create a brand new post 
            var form_data = new FormData()
            form_data.append("event", "add_post_heading")
            
            // collect all data => form_data
            for (var key of Object.keys(form.post)) {
                if (!key.includes("image")) {
                    form_data.append(key, form.post[key])
                }
            }

            axiosInstance
            .post("blog/posts/", form_data)
            .then((res) => {
                console.log(res)
                // dispatch(actions.handlePost(postDefaultValues))
                dispatch(actions.setOnProgress("heading", false))
            })
            .catch((err) => {
                console.log(err)
            })
        }
    }

    return (
        <PostFormWrapper ref={postFormRef} enctype="multipart/form-data">
            <div className="form-title">
                <h1>New Post</h1>
            </div>

            <div className="form-content">
                <div className="form-field">
                    <legend className="post_title">
                        <p>Post Title</p>
                        <span className="required-sign">Required</span>
                    </legend>
                    <input
                        type="text"
                        name="post_title"
                        id="post_title"
                        value={form.post.post_title}
                        onChange={handleChange}
                    // onFocus={handleChange}
                    />
                    {formErrors.post_title && <span className="error-msg">{formErrors.post_title}</span>}
                </div>

                <div className="form-field">
                    <legend className="post_summary">
                        <p>Post Heading</p>
                    </legend>
                    <textarea
                        name="post_summary"
                        id="post_summary"
                        onChange={handleChange}
                        rows={20}
                        maxLength={200}
                        value={form.post.post_summary} />
                    {formErrors.post_summary && <span className="error-msg">{formErrors.post_summary}</span>}
                </div>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        // justifyContent: "center",
                        alignItems: "center",
                    }}
                    className="form-field">
                    <legend className="post_public">
                        <p>Public</p>
                    </legend>
                    <i
                        style={{
                            // width: "25px",
                            // height: "25px",
                            fontSize: "16pt",
                            color: "black",
                        }}
                        onClick={handleTick}
                        className={form.post.post_public ? "far fa-check-square" : "far fa-square"}></i>
                </div>

                {(() => {
                    return (
                        <div className="heading-image-wrapper">

                            {form.post.post_image !== null && <img 
                                className="heading-image"
                                src={form.post.post_image.image_content} 
                                alt="" />}

                            <div className="img-functions">
                                <input 
                                    className="update-heading-img-btn"
                                    type="button"
                                    value={(() => {
                                        if (form.post.post_image !== null) {
                                            return "Change"
                                        } else {
                                            return "Add"
                                        }
                                    })()}
                                    onClick={ async () => {
                                        // get file => turn it into object ur then save it to form
                                    
                                        // find input file and click it
                                        const file_input = document.querySelector(".file-on-update")
                                        file_input.click()
                                        
                                    }} />

                                {form.post.post_image !== null && <input
                                    className="delete-heading-img-btn"
                                    type="button"
                                    value="Remove"
                                    onClick={ async () => {
                                        
                                        // find input file and click it
                                        // const cur_post_code = form.post.post_code
                                        // const i = app.posts.findIndex((post) => post.post_code === cur_post_code)
                                        // const cur_post = app.posts[i]
                                        // const post_image_code = cur_post.post_image.image_code

                                        deleteHeadingImageOnUpdate(form.post.post_image.image_code)

                                        dispatch(actions.handlePost({...form.post, post_image: null}))
                                        
                                    }} />}
                            </div>

                            <input
                                className="file-on-update"
                                type="file"
                                multiple={false}
                                accept="image/*" 
                                hidden={true}
                                onChange={ async (e) => {
                                    // console.log(Array.from(e.target.files).length)
                                    if (Array.from(e.target.files).length > 0) {
                                        const files = await fileHelpers.handleUploadedImageOnUpdate(
                                            e, 
                                            formErrors,
                                            setFormErrors,
                                            accessFormValidation
                                        )
      
                                        // send code of image needed to update and new image to server
                                        // check if a 
                                       
                                        if (form.post.post_image !== null) {
                                            await updateHeadingImageOnUpdate(form.post.post_image.image_code, files[0])
                                        }
                                
                                        else {
                                            await addHeadingImageOnUpdate(form.post.post_code, files[0])
                                        }
                                            
    
                                        // const base64Url = fileHelpers.convertImagesToBase64(files)
                                        // console.log(base64Url)
    
                                        // dispatch(actions.handlePost({
                                        //     ...form.post, 
                                        //     post_image: [...base64Url]
                                        // }))
                                    }
                                }} />
                        </div>
                    ) 
                })()}
                
                {/* {!app.on_edit && memorizeRenderImage} */}

                <div className="save-btn-wrapper">
                    <button
                        onClick={async(e) => {
                           await handleHeadingSave(e)
                        }}
                        type="submit">Save Heading</button>
                </div>
            </div>
        </PostFormWrapper>
    )
}

export { PostFormComponent }

const PostFormWrapper = styled.form`
    display: flex;
    flex-direction: column;
    width: 600px;
    margin-bottom: 50px;
    font-family: Arial, Helvetica, sans-serif;

    @media only screen and (max-width: 600px) {
        width: 100%;
        padding: 15px;
    }

    textarea, 
    input[type="text"] {
        width: 100%;
        border-radius: 5px;
        outline: none;
        font-size: 12pt;
        padding: 5px;
        margin-bottom: 15px;
    }

    input[type="text"] {
        height: 35px;
    }

    span.error-msg {
        margin-left: 10px;
        font-size: 11pt;
        font-weight: 100;
        height: 25px;
    }

    .form-content {
        display: flex;
        flex-direction: column;
    }

    .form-field {
        display: flex;
        flex-direction: column;
    }

    input.choose-btn,
    input.clear-btn {
        height: 25px;
        margin-right: 10px;
        margin-bottom: 10px;
        border-radius: 5px;
        font-size: 10pt;
        padding: 2px;
        border: 3px solid rgb(125, 124, 124);
        outline: none;
        background-color: white;
        color: rgb(125, 124, 124);
        font-weight: 700;
        margin-left: 3px;
        /* font-stretch: 100%; */
        

        &:hover {
            background-color: rgb(125, 124, 124);
            color: white;
        }
    }

    div.submit-wrapper {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: right;
        align-items: center;
        padding-right: 10px;
        margin-top: 10px;
        /* background-color: aliceblue; */

        @media only screen and (max-width: 600px) {
            justify-content: center;
            padding-right: 0px;
        }

        button[type="submit"] {
            margin-top: 15px;
            height: 45px;
            width: 150px;
            border-radius: 5px;
            font-size: 13pt;
            border: 3px solid rgb(125, 124, 124);
            outline: none;
            background-color: white;
            color: rgb(125, 124, 124);
            font-weight: 700;
            font-stretch: 100%;
            

            &:hover {
                background-color: rgb(125, 124, 124);
                color: white;
            }

            @media only screen and (max-width: 600px) {
                width: 99%;
            }
        }
    }

    legend {
        margin-left: 2px;
        margin-bottom: 10px;
        margin-top: 10px;

        p {
            margin-right: 10px;
            font-size: 12pt;
        }
    }

    legend.post_title {
        display: flex;
        flex-direction: row;
        /* justify-content: center; */
        align-items: center;
    
        span.required-sign {
            font-size: 12px;
            font-weight: 700;
            border-radius: 6px;
            border: 1.5px solid black;
            padding: 2px;
            background-color: greenyellow;
        }
    }

    div.preview-section-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 5px;

        div.preview-section {
            width: 100%;
            height: auto;
            /* min-height: 150px; */
            /* border: 1px solid black; */
            display: flex;
            flex-wrap: wrap;

            div.image-wrapper {
                width: 150px;
                height: 150px;
                margin: 5px;
                position: relative;

                div.image-hover {
                    position: absolute;
                    height: 100%;
                    width: 100%;
                    top: 0;
                    left: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    i {
                        height: 40px;
                        width: 40px;
                        color: white;
                        background-color: rgba(98, 102, 99, 1);
                        justify-content: center;
                        align-items: center;
                        border-radius: 50%;
                        font-size: 16pt;
                        display: none;
                        /* display: flex; */

                        &:hover {
                            -webkit-box-shadow: 2px 1px 16px 1px white; 
                            box-shadow: 2px 1px 16px 1px white;
                        }
                    }
                    
                    &:hover {
                        background-color: rgba(98, 102, 99, 0.7);
                    }

                    &:hover > i {
                        display: flex;
                        cursor: pointer;
                        /* -webkit-box-shadow: 2px 1px 11px -2px white; 
                        box-shadow: 2px 1px 11px -2px white; */

                    }
                }

                div.image-content {
                    width: 100%;
                    height: 100%;
                    background-repeat: no-repeat;
                    background-position: center;
                }

                img {
                    display: none;
                }
            }
        }
    }
`