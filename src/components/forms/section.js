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

import { useSelector, useDispatch } from "react-redux";
import * as form_actions from "redux_actions/formActions";
import * as app_actions from "redux_actions/appActions";

const actions = {
    ...form_actions,
    ...app_actions
}

import { TextEditorComponent } from "./textEditor";

import * as fileHelpers from "helpers/fileHelpers";

const SectionFormComponent = (props) => {
    // create later
    const sectionFormRef = useRef()

    const intialValues = {
        section_id: 0,
        section_title: "",
        section_content: "",
        section_image: [],
        section_public: true,
    }

    const [formFiles, setFormFiles] = useState([]);
    const [formValues, setFormValues] = useState(intialValues);
    const [formSectionTitle, setFormSectionTitle] = useState("")
    const [formSectionContent, setFormSectionContent] = useState("")
    const [formErrors, setFormErrors] = useState({});
    const [onProgess, setOnProgress] = useState(false)
    const [isSaved, setIsSaved] = useState(false);

    const requiredList = ["section_title"]

    useEffect(() => {
        // get the id of the last element in progress sections list
        dispatch(actions.handleSection({
            ...formValues, 
            section_content: formSectionContent
        }))
    }, [formValues, formSectionContent])

    const dispatch = useDispatch()
    const form = useSelector((state) => state.form)
    const app = useSelector((state) => state.app)

    const accessFormValidation = () => {
        const formValidate = new FormValidation({ ...formValues })
        return formValidate
    }

    const handleTick = (e) => {
        // setFormValues({ ...formValues, section_public: !formValues.section_public })
        dispatch(handleSection({...form.section, section_public: !form.section.section_public}))
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
        const data = { ...formValues, [name]: value }
        
        setFormValues({...data})

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

    const handleSubmit = (e) => {
        e.preventDefault()

        // validate values before save
        for (var require of requiredList) {
            handleFormError(require, formValues[require], {...formValues})

            if (formErrors[require] !== "") 
                return     
        }

        setFormValues({...formValues, section_content:formSectionContent})

        dispatch(actions.setProgressingSection(form.section))
        
        dispatch(actions.handleSection(data))
        setFormSectionTitle("")
        setFormSectionContent("")
        setOnProgress(false)

        // append images to form.formFiles.images
        var base_64_images_list = []

        for (var image of formFiles) {
            var base_64_img = URL.createObjectURL(image)
            base_64_images_list.push(base_64_img)
        }

        dispatch(actions.handleFormImages("section", [...base_64_images_list]))
        dispatch(actions.setSectionOnProgress(false))
    }

    return (
        <SectionFormWrapper ref={sectionFormRef} enctype="multipart/form-data">
            <div className="form-title">
                <h2>New Section</h2>
            </div>

            {/* <input 
                className="add-new-section-btn" 
                type="button" 
                value="Add New Section"
                onClick={() => {
                    setFormValues({...formValues, section_id: section_id + 1})
                    dispatch(actions.handleSection(formValues))
                    dispatch(app_actions.setProgressingSection(formValues))
                }} /> */}

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
                        value={formSectionTitle}
                        onChange={handleChange} />
                    {formErrors.section_title && <span className="error-msg">{formErrors.section_title}</span>}
                </div>

                <div className="form-field section_content">
                    <legend className="section_content">
                        <p>Section Content</p>
                    </legend>

                    {/* <div>{Parser(formSectionContent)}</div> */}

                    <div className="text-editor-wrapper">
                        <TextEditorComponent 
                            formSectionContent={formSectionContent} 
                            setFormSectionContent={setFormSectionContent} />
                    </div>
                </div>

                {/* {memorizeSectionContent} */}

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

                {memorizeRenderImage}

                <div 
                    className="submit-wrapper">
                    
                    {form.form_status.section && 
                    <button 
                        type="button"
                        value="Cancel"
                        onClick={() => {
                            setFormSectionTitle("")
                            setFormSectionContent("")
                            // dispatch(handleSection({...intialValues}))
                            // dispatch(handleFormStatus("section", { ...form.section }))
                            const element = sectionFormRef.current.querySelector("div.ql-editor")
                            element.innerHTML = '<p style="font-size: 12pt;"><br/></p>'
                            props.setAddSection(false)
                        }} >Cancel</button>}
                    

                    {(() => {
                        if (onProgess) {
                            return (
                                <input
                                    type="button"
                                    name="save_section"
                                    value="Save Section"
                                    onClick={((e) => {
                                        if (e.target.name === "save_section") {
                                            handleSubmit(e)
                                        } 
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