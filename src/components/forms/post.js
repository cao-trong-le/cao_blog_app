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
    // create later

    const intialValues = {
        post_title: "",
        post_summary: "",
        post_image: [],
        post_public: true,
        post_edited: false,
        post_view: 0,
        post_section: []
    }
    
    const [formValues, setFormValues] = useState(intialValues)
    const [formFiles, setFormFiles] = useState([]);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [addSection, setAddSection] = useState(false)
    const requiredList = ["post_title"]

    const dispatch = useDispatch()

    const user = useSelector((state) => state.user)
    const post = useSelector((state) => state.form.post)
    const app = useSelector((state) => state.app)

    useEffect(() => {
        // dispatch(actions.handlePost({...formValues}))

        // if (!app.post_on_progress) {
        //     dispatch(actions.setPostOnProgress(true))
        // }

        // console.log(props.postImages)

    }, [formValues])

    const postFormRef = useRef()
    
    const accessFormValidation = () => {
        const formValidate = new FormValidation({ ...post })
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
        setFormValues({ ...formValues, post_public: !formValues.post_public })
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        const data = {...formValues, [name]: value}
        setFormValues({...data})

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

    const handlePostSave = (e) => {
        e.preventDefault()

        // setFormValues({...formValues, post_image: formFiles})

        // validate input values
        // console.log(formErrors)
        for (var require of requiredList) {
            handleFormError(require, {...formValues})

            if (formErrors[require] !== "") 
                return     
        }

        dispatch(actions.handlePost(formValues))
        dispatch(actions.setPostOnProgress(false))

        // add all images to redux store
        // converse images to base64
        var base_64_images_list = []

        for (var image of formFiles) {
            var base_64_img = URL.createObjectURL(image)
            base_64_images_list.push(base_64_img)
        }

        dispatch(actions.handleFormImages("post", [...base_64_images_list]))
    }

    return (
        <PostFormWrapper ref={postFormRef} enctype="multipart/form-data">
            {/* {console.log(post)} */}

            {/* {console.log(formValues)} */}

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
                        value={formValues.post_title}
                        onChange={handleChange}
                    // onFocus={handleChange}
                    />
                    {formErrors.post_title && <span className="error-msg">{formErrors.post_title}</span>}
                </div>

                <div className="form-field">
                    <legend className="post_summary">
                        <p>Post Summary</p>
                    </legend>
                    <textarea
                        name="post_summary"
                        id="post_summary"
                        onChange={handleChange}
                        rows={20}
                        maxLength={200}
                        value={formValues.post_summary} />
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
                        className={formValues.post_public ? "far fa-check-square" : "far fa-square"}></i>
                </div>

                {memorizeRenderImage}

                <div className="save-btn-wrapper">
                    <button
                        onClick={handlePostSave}
                        type="submit">Save</button>
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