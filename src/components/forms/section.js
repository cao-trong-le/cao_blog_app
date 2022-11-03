/* eslint-disable no-unused-vars */
/* eslint-disable */
import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, matchPath } from "react-router-dom";
import styled from "styled-components";
// import axiosInstance from "axios_instance/axiosInstace";
import { FormValidation } from "helpers/formValidation";
import Compress from "compress.js";
import ReactDOM from "react-dom/client";
import Parser from "html-react-parser";
import axiosInstance from "axios_instance/axios_instance";
import { useSelector, useDispatch } from "react-redux";
import * as form_actions from "redux_actions/formActions";
import * as app_actions from "redux_actions/appActions";
import * as fHelper from "helpers/fileHelpers";

const actions = {
    ...form_actions,
    ...app_actions
}

// import { TextEditorComponent } from "./textEditor";

import * as fileHelpers from "helpers/fileHelpers";
import { Axios } from "axios";

const SectionFormComponent = (props) => {
    // create later
    const sectionFormRef = useRef()

    const [formFiles, setFormFiles] = useState([]);
    // const [formValues, setFormValues] = useState(intialValues);
    const [formSectionTitle, setFormSectionTitle] = useState("")
    const [formSectionContent, setFormSectionContent] = useState("")
    const [formErrors, setFormErrors] = useState({});
    const [onProgess, setOnProgress] = useState(false)
    const [isSaved, setIsSaved] = useState(false)
    const [files, setFiles] = useState([])

    const requiredList = ["section_title"]

    // useEffect(() => {
    //     // get the id of the last element in progress sections list
    //     dispatch(actions.handleSection({...formValues}))
    // }, [formValues, formSectionContent])

    const dispatch = useDispatch()
    const form = useSelector((state) => state.form)
    const user = useSelector((state) => state.user)
    const app = useSelector((state) => state.app)

    const ref = useRef()

    const accessFormValidation = () => {
        const formValidate = new FormValidation({ ...form.section })
        return formValidate
    }

    const handleTick = (e) => {
        // setFormValues({ ...formValues, section_public: !formValues.section_public })
        dispatch(actions.handleSection({ 
            ...form.section, 
            section_public: !form.section.section_public }))
    }

    const handleFormError = (name, value, data) => {
        const validator = new FormValidation({ ...data })
        let validStatus = null

        switch (name) {
            case "section_title":
                setFormSectionTitle(value)

                const scanList = [
                    validator.isEmptyField(
                        value,
                        "Section title cannot be emptied.",
                        "section_title"
                    ),
                    validator.isCertainLength(
                        1,
                        255,
                        value,
                        "",
                        "Section title cannot exceed 255 characters.",
                        "section_title"
                    )
                ]

                for (let scan of scanList) {
                    if (!scan.status) {
                        validStatus = scan
                        break
                    }

                    validStatus = scan
                }
                break
            default:
                break
        }

        // setFormValues({ ...formValues, [name]: value });

        if (validStatus !== null)
            setFormErrors({ ...formErrors, [validStatus.type]: validStatus.message })
    }

    const handleChange = async (e) => {
        if (!onProgess) {setOnProgress(true)}

        const { name, value } = e.target;
        const data = { ...form.section, [name]: value }
        
        // setFormValues({...data})

        dispatch(actions.handleSection({...data}))

        // set errors
        handleFormError(name, value, data)
    };

    const memorizeRenderImage = useMemo(() => {
        return fileHelpers.renderImage(
            true,
            sectionFormRef,
            formErrors,
            setFormErrors,
            formFiles,
            setFormFiles,
            accessFormValidation,
            "section"
        )
    }, [formFiles])

    const renderPreviewSectionFiles = useMemo(() => {
        return (
            <div className="preview-section-files">
                {files.map((file) => {
                    return (
                        <div className="preview-file-wrapper">
                            <img
                                alt="preview-file"
                                src={(() => {
                                    const file_type = file.type
                                    switch (file_type) {
                                        case "application/pdf":
                                            return "https://cao-blog-bucket.s3.us-east-2.amazonaws.com/default_files/pdf.png"

                                        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                                            return "https://cao-blog-bucket.s3.us-east-2.amazonaws.com/default_files/doc.png"

                                        case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                                            return "https://cao-blog-bucket.s3.us-east-2.amazonaws.com/default_files/xlsx.png"
                                        
                                        default:
                                            break
                                    }
                                })()} />

                            <p className="file-name">{file.name}</p>
                        </div>
                    )
                })}
            </div>
        )
    }, [files])

    const renderPreviewSectionImages = useMemo(() => {
        return (
            <PreviewImagesWrapper className="preview-image-wrapper">
                {(() => {
                    var section_images = form.section.section_image

                    return section_images.map((image, idx) => {
                        var copied = [...section_images]

                        return (
                            <div 
                                key={idx} 
                                className={`section-image-wrapper-form-${image.image_code}`}>
                                <img 
                                    className={`section-image-${image.image_code}`}
                                    data-image-code={image.image_code}
                                    src={image.image_content} 
                                    alt="section image" />

                                <input
                                    className="change-image-btn"
                                    type="button" 
                                    value="Change"
                                    onClick={ async (e) => {
                                        // handleDeleteImageOnUpdate(e, idx)
                                        const fileBtn = document.querySelector(`.change-section-img-btn-${image.image_code}`)
                                        fileBtn.click()
                    
                                    }} />

                                <input
                                    type="file"
                                    multiple={false}
                                    hidden={true}
                                    className={`change-section-img-btn-${image.image_code}`}
                                    onChange={ async (e) => {
                                        const image = await fHelper.handleUploadedImageOnUpdate(
                                            e, 
                                            formErrors,
                                            setFormErrors,
                                            accessFormValidation
                                        )

                                        // send a add section image request
                                        await handleUpdateImageOnUpdate(idx, image[0])
                                        
                                        // clear all data when it's done!!!
                                        e.target.value = ""
                                    }} />
                                
                                <input 
                                    className="remove-image-btn"
                                    type="button" 
                                    value="Remove"
                                    onClick={(e) => {
                                        handleDeleteImageOnUpdate(e, idx)
                                    }} />
                            </div>
                        )
                    })
                })()}
            </PreviewImagesWrapper>
        )
    }, [form.section.section_image])

    const reorganizeData = () => {
        let data = new FormData()
        data.append("event", "add_section")
        for (let [key, value] of Object.entries(formValues))
            if (key.includes("image") && value.length > 0) {
                for (let image of value) 
                    data.append(key, image, image.name)
            }
            else
                data.append(key, value)

        return data
    }


    // handle files
    const handleAddFiles = async () => {
        const formData = new FormData()
        formData.append("event", "add_section_files")
        formData.append("section_code", form.section.section_code)
        
        for (var file of files) {
            formData.append("section_file", file, file.name)
        }

        axiosInstance.post("blog/sections/", formData)
        .then((res) => {
            console.log(res)
            setFiles([])

            // post
            const post = res.data.post
            dispatch(actions.handlePost({...form.post, ...post}))
            
            // section
            const section = res.data.section
            dispatch(actions.handleSection({...form.section, ...section}))

        })
        .catch((err) => {
            console.log(err)
        })
    }

    const handleUpdateFile = async (file, file_code) => {
        console.log(file, file_code)

        const formData = new FormData()
        formData.append("event", "update_section_file")
        formData.append("file_code", file_code)
        formData.append("new_file", file, file.name)

        axiosInstance.post("blog/sections/", formData)
        .then((res) => {
            // post
            const post = res.data.post
            dispatch(actions.handlePost({...form.post, ...post}))
            
            // section
            const section = res.data.section
            dispatch(actions.handleSection({...form.section, ...section}))
        })
        .catch((err) => {
            console.log(err)
        })
    }

    const handleDeleteFile = async (file_code) => {
        const formData = new FormData()
        formData.append("event", "delete_section_file")
        formData.append("file_code", file_code)

        axiosInstance.post("blog/sections/", formData)
        .then((res) => {
            // post
            const post = res.data.post
            dispatch(actions.handlePost({...form.post, ...post}))
            
            // section
            const section = res.data.section
            dispatch(actions.handleSection({...form.section, ...section}))

        })
        .catch((err) => {
            console.log(err)
        })
    }

    const handleUpdateImageOnUpdate = async (idx, image) => {
        console.log("update on progress")
        // get section code
        const section_code = form.section.section_code

        // get image code by idx
        const image_code = form.section.section_image[idx].image_code
        console.log(image_code)

        // get new image
        const new_image = image
        console.log(new_image)

        const formData = new FormData()
        formData.append("event", "update_section_image")
        formData.append("section_code", section_code)
        formData.append("image_code", image_code)
        formData.append("new_image", new_image, new_image.name)

        // send request to update image
        axiosInstance.post("blog/sections/", formData)
        .then((res) => {
            // dispatch(actions.handleSection({...res.data.section}))

            // dispatch(actions.updatePosts(res.data.post))
            // dispatch(actions.handlePost({...res.data.post}))

            dispatch(actions.updatePostForm({...res.data.post}))

            // update section form
            // dispatch(actions.handleSection({...res.data.section}))
            dispatch(actions.updateSectionForm({...res.data.section}))

            dispatch(actions.updatePosts({...res.data.post}))

            // replace HTML element
            const sectionImage = document.querySelector(`.section-image-${image_code}`)
            sectionImage.setAttribute("src", res.data.image.image_content)
        })
        .catch((err) => {
            console.log(err)
        })
    }

    const handleAddImageOnUpdate = async (images) => {
        const formData = new FormData()
        formData.append("event", "add_section_images")
        formData.append("post_code", form.post.post_code)
        formData.append("section_code", form.section.section_code)

        for (var image of images) {
            formData.append("section_image", image, image.name)
        }
    
        axiosInstance.post("blog/sections/", formData)
        .then((res) => {
            console.log(res)
            dispatch(actions.handleSection({
                ...form.section, 
                section_image: res.data.section.section_image
            }))

            dispatch(actions.handlePost({
                ...form.post,
                ...res.data.post
            }))

            // handle animation
        })
        .catch((err) => {
            console.log(err)
        })
    }

    const handleDeleteImageOnUpdate = async (e, imageIdx) => {
        // remove section request
        var form_data = new FormData()
        form_data.append("event", "delete_section_image")
        form_data.append("section_code", form.section.section_code)

        // find image code => app.posts
        // find post code => find section by post code

        const image = form.section.section_image[imageIdx]
        const image_code = image.image_code
        
        form_data.append("image_code", image_code)

        axiosInstance
        .post("blog/sections/", form_data)
        .then((res) => {
            console.log(res.data)
            // update post 
            
            // update post form
            // dispatch(actions.handlePost({...res.data.post}))
            dispatch(actions.updatePostForm({...res.data.post}))

            // update section form
            // dispatch(actions.handleSection({...res.data.section}))
            dispatch(actions.updateSectionForm({...res.data.section}))

            dispatch(actions.updatePosts({...res.data.post}))

            // remove HTML element
            // const image_wrapper_HTML_element = document.querySelector(`.section-image-wrapper-form-${image_code}`)
            // image_wrapper_HTML_element.style.display = "none"
        })
        .catch((err) => {
            console.log(err)
        })
    }

    const handleUpdateSectionContent = async (e) => {
        e.preventDefault()

        // validate values before save
        // for (var require of requiredList) {
        //     handleFormError(
        //         require, 
        //         form.section[require], 
        //         {...form.section}
        //     )

        //     if (formErrors[require] !== "") 
        //         return     
        // }

        // update post section in the post as well
        
        var form_data = new FormData()
        form_data.append("event", "update_section_content")
        form_data.append("section_code", form.section.section_code)
        form_data.append("section_title", form.section.section_title)
        form_data.append("section_content", form.section.section_content)
        form_data.append("section_public", form.section.section_public)

        axiosInstance
        .post("blog/sections/", form_data)
        .then((res) => {
            console.log(res.data)
            dispatch(actions.setOnProgress("section", false))
            if (res.status === 202) {
                dispatch(actions.updatePostSection(app.section_edit.index, form.section))
                props.setNewSectionBtn(true)
                dispatch(actions.setSectionEdit(false, -1))

                dispatch(actions.updatePostForm({...res.data.post}))

                // update section form
                dispatch(actions.handleSection({
                    ...form.section, 
                    ...res.data.section
                }))
                // dispatch(actions.updateSectionForm({...res.data.section}))

                dispatch(actions.updatePosts({...res.data.post}))
            }
            // Add new section to queue right away
            
            return
        })
        .catch((err) => {
            console.log(err)
        })
    }

    // html
    return (
        <SectionFormWrapper ref={sectionFormRef} enctype="multipart/form-data">
            <div className="form-title">
                <h2>New Section</h2>
            </div>

            <div className="form-content">
                <div className="form-field">
                    <legend className="section_title">
                        <p>Section Title</p>
                        <span className="required-sign">Required</span>
                    </legend>
                    <input
                        type="text"
                        name="section_title"
                        id="section_title"
                        value={form.section.section_title}
                        onChange={handleChange} />
                    {formErrors.section_title && <span className="error-msg">{formErrors.section_title}</span>}
                </div>

                <div className="form-field section_content">
                    <legend className="section_content">
                        <p>Section Content</p>
                    </legend>
                    <textarea
                        type="text"
                        name="section_content"
                        id="section_content"
                        value={form.section.section_content}
                        onChange={handleChange} />
                </div>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                    className="form-field">
                    <legend className="section_public">
                        <p>Public</p>
                    </legend>
                    <i
                        style={{
                            fontSize: "16pt",
                            color: "black",
                        }}
                        onClick={handleTick}
                        className={form.section.section_public ? "far fa-check-square" : "far fa-square"}></i>
                </div>

                {/* render preview images */}

                
                {/* {memorizeRenderImage} */}

                <div className="form-field section_content">
                    <legend className="section_content">
                        <p>Section Images</p>
                    </legend>
                    
                    {renderPreviewSectionImages}

                    <input
                        type="button"
                        value="Add Images"
                        onClick={() => {
                            const fileBtn = document.querySelector(".section-img-file")
                            fileBtn.click()
                        }} />
                 
                    <input
                        type="file"
                        multiple={true}
                        className="section-img-file"
                        accept="image/*"
                        hidden={true}
                        onChange={ async (e) => {
                            const images = await fHelper.handleUploadedImageOnUpdate(
                                e, 
                                formErrors,
                                setFormErrors,
                                accessFormValidation
                            )

                            // send a add section image request
                            await handleAddImageOnUpdate(images)

                            e.target.value = ""
                        }} />

                    <input
                        type="button"
                        value="Clear"
                        onClick={() => {
                            const fileBtn = document.querySelector(".section-img-file")
                            // fileBtn.setAttribute("value", "")
                            fileBtn.value = ""
                        }} />
                </div>

                <div className="form-field section_content">
                    <legend className="section_content">
                        <p>Section Files</p>
                    </legend>
                    
                    {/* {renderPreviewSectionImages} */}

                    <div 
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            width: "100%",
                            height: "150px"
                        }}
                        className="preview-existed-files">

                        {form.section.section_file.map((file) => {
                            // extract file type
                            // display file icon based on file type
                            return (
                                <div 
                                    className="existing-file-wrapper"
                                    style={{
                                        width: "80px",
                                        height: "80px",
                                        margin: "5px"
                                    }}>
                                    <img 
                                        alt="existing-file"
                                        style={{
                                            width: "100%",
                                            height: "100%"
                                        }}
                                        src={(() => {
                                            switch(fHelper.extractFileTypeFromAWSURL(file.file_content)) {
                                                case "pdf":
                                                    return "https://cao-blog-bucket.s3.us-east-2.amazonaws.com/default_files/pdf.png"
                
                                                case "docx":
                                                    return "https://cao-blog-bucket.s3.us-east-2.amazonaws.com/default_files/doc.png"
                
                                                case "xlsx":
                                                    return "https://cao-blog-bucket.s3.us-east-2.amazonaws.com/default_files/xlsx.png"
                                                
                                                default:
                                                    break
                                            }
                                        })()} 
                                    />
                                    <p className="existing-file-name">
                                        {fHelper.extractFileNameFromAWSURL(file.file_content, 5)}
                                    </p>

                                    <div className="existing-file-functions">
                                        <input
                                            type="button"
                                            data-file-code={file.file_code}
                                            className="change-btn"
                                            value="Change File"
                                            onClick={(e) => {
                                                const target = document.querySelector(".existing-file-input")
                                                target.click()
                                            }} />

                                        <input
                                            type="file"
                                            data-file-code={file.file_code}
                                            multiple={false}
                                            accept=".docx,.doc,.pdf,.xlsx"
                                            className="existing-file-input"
                                            hidden={true}
                                            onChange={ async (e) => {
                                                if (e.target.files.length == 0) 
                                                    return

                                                const file = e.target.files[0]
                                                const file_code = e.target.getAttribute("data-file-code")

                                                // console.log(file_code)

                                                await handleUpdateFile(file, file_code)

                                                e.target.value = ""
                                            }} />

                                        <input
                                            type="button"
                                            data-file-code={file.file_code}
                                            className="delete-btn"
                                            value="Delete"
                                            onClick={ async (e) => {
                                                const file_code = e.target.getAttribute("data-file-code")
                                                await handleDeleteFile(file_code)
                                            }} />
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {renderPreviewSectionFiles}

                    <input
                        type="button"
                        value="Add Files"
                        onClick={() => {
                            const fileBtn = document.querySelector(".section-file-input")
                            fileBtn.click()
                        }} />
                 
                    <input
                        type="file"
                        multiple={true}
                        accept=".docx,.doc,.pdf,.xlsx"
                        className="section-file-input"
                        hidden={true}
                        onChange={ async (e) => {
                            if (e.target.files.length == 0) 
                                return

                            // send a add section image request
                           
                            // add files to files state

                            setFiles([...files, ...e.target.files])

                            e.target.value = ""
                        }} />

                    <input
                        type="button"
                        value="Upload"
                        onClick={() => {
                            if (files.length > 0) {
                                handleAddFiles()
                            }
                        }} />

                    <input
                        type="button"
                        value="Clear"
                        onClick={() => {
                            const fileBtn = document.querySelector(".section-img-file")
                            // fileBtn.setAttribute("value", "")
                            // fileBtn.value = ""
                            setFiles([])
                        }} />
                </div>

                <div 
                    className="submit-wrapper">
                    
                    {form.form_status.section && 
                    <button 
                        type="button"
                        value="Cancel"
                        onClick={() => {
                            // setFormSectionTitle("")
                            // setFormSectionContent("")
                            // dispatch(handleSection({...intialValues}))
                            // dispatch(handleFormStatus("section", { ...form.section }))
                            // const element = sectionFormRef.current.querySelector("div.ql-editor")
                            // element.innerHTML = '<p style="font-size: 12pt;"><br/></p>'
                            // props.setAddSection(false)
                        }} >Cancel</button>}
                    

                    {(() => {
                        if (app.section_on_progress) {
                            return (
                                <input
                                    type="button"
                                    name="save_section"
                                    value="Save Section"
                                    onClick={( async (e) => {
                                        await handleUpdateSectionContent(e)
                                        if (app.section_edit.status) 
                                            props.setNewSectionBtn(false)
                                    })} />
                            )
                        }
                    })()}
                    
                </div>
            </div>
        </SectionFormWrapper>
    )
}


export { SectionFormComponent }

const PreviewImagesWrapper = styled.div`

`;

const SectionFormWrapper = styled.form`
    display: flex;
    flex-direction: column;
    /* padding: 15px; */
    width: 600px;
    margin-bottom: 50px;
    /* position: relative; */
    font-family: Arial, Helvetica, sans-serif;

    @media only screen and (max-width: 768px) {
        width: 100%;
    }

    textarea, 
    input[type="text"] {
        width: 100%;
        /* background-color: aliceblue; */
        /* border: none; */
        border-radius: 5px;
        outline: none;
        font-size: 12pt;
        padding: 5px;
        /* -webkit-box-shadow: -1px 2px 11px 2px rgba(0,0,0,0.5); 
        box-shadow: -1px 2px 9px 2px rgba(0,0,0,0.5); */
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

    legend.section_title {
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