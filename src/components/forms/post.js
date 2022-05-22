/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { Link, matchPath } from "react-router-dom";
import styled from "styled-components";
// import axiosInstance from "axios_instance/axiosInstace";
import { FormValidation } from "helpers/formValidation";
import Compress from "compress.js";
import { SectionFormComponent } from "./section";

const PostFormComponent = (props) => {
    // create later

    const intialValues = {
        post_title: "",
        post_summary: "",
        post_image: [],
        post_public: true,
        post_view: 0
    }
    const [formValues, setFormValues] = useState(intialValues);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const requiredList = ["post_title"]

    // useEffect(() => {


    //     setFormValues(intialValues)
    //     // setFormErrors({})
    // }, [])

    const postFormRef = useRef()

    const accessFormValidation = () => {
        const formValidate = new FormValidation({ ...formValues })
        return formValidate
    }

    const handleUploadedImage = async (e) => {
        const files = Array.from(e.target.files)
       
        // clear input value
        const postInputField = postFormRef.current.querySelector("input[name='post_image']")
        postInputField.value = ""

        let resizedList = []
        let isValidSize = null

        for (let file of files) {
            console.log(file)
            isValidSize = await accessFormValidation().isValidImage(
                file.size, 
                "The uploaded image cannot be bigger than 5mb."
            )

            if (!isValidSize.status) break;
        }
        

        if (isValidSize.status) {
            console.log("pass")
            // compress the uploaded image
            // Initialization
            const compress = new Compress()

            // Attach listener
            await compress.compress(files, {
                size: 4,
                quality: .75,
                maxWidth: 300,
                maxHeight: 300,
                resize: true,
                rotate: false,

            }).then( async (data) => {
                const imgs = data
                for (let img of imgs) {
                    const base64str = img.data
                    const imgExt = img.ext
                    // convert image into blob type
                    const blob = Compress.convertBase64ToFile(base64str, imgExt)
    
                    // convert blob => a file
                    const file = new File([blob], img.alt, {
                        type: imgExt,
                        lastModified: new Date().getTime()
                    })
    
                    resizedList.push(file)
                }
            })
        } else {
            setFormErrors({ ...formErrors, [isValidSize.type]: isValidSize.message })
        }

        // get initial data
        let data = []
        for (let file of formValues.post_image) 
            data.push(file)

        // add files from resized list
        for (let file of resizedList) {
            console.log(file)
            data.push(file)
        }
            
        setFormValues({ 
            ...formValues, 
            post_image: data })
    }

    const removeUploadedImage = (e) => {
        const postInputField = postFormRef.current.querySelector("input[name='post_image']")
        postInputField.value = ""
        setFormValues({...formValues, post_image: []})
    }

    const handleTick = (e) => {
        setFormValues({ ...formValues, post_public: !formValues.post_public })
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });

        // set errors

        let errorMsg = {}

        const validator = new FormValidation({ ...formValues, [name]: value })
        let validStatus = null

        switch (name) {
            case "post_title":
                validStatus = validator.checkTitleField(0, 255)
                break
            default:
                break
        }

        console.log(validStatus)

        if (!validStatus.status)
            errorMsg[validStatus.type] = validStatus.message
        // Object.assign(errorMsg, { [validStatus.type]: validStatus.message })

        setFormErrors({ ...formErrors, [validStatus.type]: validStatus.message })
    };

    const renderImagesList = (list) => {
        console.log(list)

        if (list.length > 0) {
            return list.map((item, index) => {
                return (
                    <div className="image-wrapper" key={index}>
                        <div className="image-hover">
                            <i 
                                id={index}
                                className="far fa-trash-alt" 
                                onClick={((e) => {
                                    const idx = e.target.id
                                    let copied = [...formValues.post_image]
                                    copied.splice(idx, 1)
                                    setFormValues({...formValues, post_image: [...copied]})

                                    // const postInputField = postFormRef.current.querySelector("input[name='post_image']")
                                    // postInputField.value = ""
                                })}/>
                        </div>
                        <div 
                            style={{backgroundImage: `url("${(() =>  URL.createObjectURL(item))()}")`}}
                            className="image-content">

                            <img 
                                key={index}
                                alt="post_image"
                                src={(() =>  URL.createObjectURL(item))()} />
                        </div>
                    </div>
                )
            })
        }
    }

    const renderImage = (list) => {
        return (
            <div className="form-field">
                <legend className="post_summary">
                    <p>Post Images</p>
                </legend>

                <div className="control-buttons-wrapper">
                    <input 
                        type="button" 
                        className="choose-btn"
                        value="Choose Images"
                        onClick={(() => {
                            const chooseImageBtn = postFormRef.current.querySelector("input[name='post_image']")
                            chooseImageBtn.click()
                        })}/>

                    {formValues.post_image.length > 0  && <input
                        type="button"
                        className="clear-btn"
                        value="Clear"
                        onClick={(e) => { removeUploadedImage(e) }} />}
                </div>
                
                <input
                    hidden={true}
                    type="file"
                    name="post_image"
                    id="post_image"
                    onChange={ async (e) => {
                        await handleUploadedImage(e)
                    }}
                    accept="image/*" 
                    multiple={true} />

                <div className="preview-section-wrapper">
                    <div className="preview-section">
                        {renderImagesList(list)}
                    </div>
                </div>

                {formErrors.post_image && 
                    <span 
                        className="error-msg">
                        {formErrors.post_image}
                    </span>}
            </div>
        )
    }

    const reorganizeData = () => {
        let data = new FormData()
        data.append("request_event", "register_user")
        for (let [key, value] of Object.entries(formValues))
            data.append(key, value)
        return data
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const data = reorganizeData()

        // axiosInstance
        //     .post("/user/register/", data)
        //     .then((res) => {
        //         console.log(res.data)
        //     })
    }

    return (
        <PostFormWrapper ref={postFormRef} enctype="multipart/form-data">
            {console.log(formValues)}
            {console.log(formValues.post_image.length)}
            {/* {console.log(formErrors)} */}

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
                        maxLength={500}
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

                <div className="section-preview">
                    <div className="created-section-preview">
                        <p>No Section Created</p>
                    </div>
                    <SectionFormComponent />
                </div>

                {renderImage(formValues.post_image)}


                {/* <div className="form-field">
                    <label htmlFor="base_price">Post Image</label>
                    {accessFormHelper().renderImage(
                        "post_image",
                        handleUploadedImage,
                        removeUploadedImage,
                        formValues.post_image)}
                    {formErrors.post_image && <span>{formErrors.post_image}</span>}
                </div> */}

                <div 
                    className="submit-wrapper">
                    <button
                        onClick={handleSubmit}
                        type="submit">Submit</button>
                </div>
            </div>
        </PostFormWrapper>
    )
}

export { PostFormComponent }

const PostFormWrapper = styled.form`
    display: flex;
    flex-direction: column;
    padding: 15px;
    width: 600px;
    margin-bottom: 50px;
    font-family: Arial, Helvetica, sans-serif;

    @media only screen and (max-width: 768px) {
        width: 100%;
    }

    textarea, 
    input[type="text"] {
        width: 100%;
        background-color: aliceblue;
        border: none;
        border-radius: 5px;
        outline: none;
        font-size: 12pt;
        padding: 5px;
        -webkit-box-shadow: -1px 2px 11px 2px rgba(0,0,0,0.5); 
        box-shadow: -1px 2px 9px 2px rgba(0,0,0,0.5);
        margin-bottom: 15px;
    }

    input[type="text"] {
        height: 35px;
    }

    textarea {
        background-color: aliceblue;
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