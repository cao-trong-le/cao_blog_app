/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { Link, matchPath } from "react-router-dom";
import styled from "styled-components";
// import axiosInstance from "axios_instance/axiosInstace";
import { FormValidation } from "helpers/formValidation";
import Compress from "compress.js";

const SectionFormComponent = (props) => {
    // create later

    const intialValues = {
        section_title: "",
        section_content: "",
        section_image: [],
        section_public: true,
    }
    const [formValues, setFormValues] = useState(intialValues);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const requiredList = ["section_title"]

    const fullSize = () => {
        const sectionContent = sectionFormRef.current.querySelector("div.section_content")
        let style = sectionContent.style
        style.position = "fixed"
        style.top = "0px"
        style.left = "0px"
        style.width = "100%"
        style.height = "100vh"
        style.padding = "10px"
        style.backgroundColor = "white"
    }

    const compressSize = () => {
        const sectionContent = sectionFormRef.current.querySelector("div.section_content")
        sectionContent.style.position = "initial"
    }

    const sectionFunctions = [
        {
            name: "font_size",
            display: "Font Size",
            icon: null, 
            function: null
        },
        {
            name: "font_family",
            display: "Font Family",
            icon: <i class="far fa-font"></i>, 
            function: null
        },
        {
            name: "font_color",
            display: "Font Color",
            icon: <i class="far fa-paint-brush"></i>, 
            function: null
        },
        {
            name: "full_screen",
            display: "Full Screen",
            icon: <i class="fas fa-expand"></i>, 
            function: fullSize
        },
        {
            name: "minimize_screen",
            display: "Minimize Screen",
            icon: <i class="fas fa-compress"></i>, 
            function: compressSize
        },
    ]

    // useEffect(() => {


    //     setFormValues(intialValues)
    //     // setFormErrors({})
    // }, [])

    const sectionFormRef = useRef()

    const renderSectionFunctions = () => {
        return sectionFunctions.map((func, index) => {
            return (
                <div 
                    className={func.name} 
                    onClick={func.function}
                    key={index}>
                    {func.icon}
                    <p>{func.display}</p>
                </div>
            )
        })
    }

    const accessFormValidation = () => {
        const formValidate = new FormValidation({ ...formValues })
        return formValidate
    }

    const handleUploadedImage = async (e) => {
        const files = Array.from(e.target.files)
       
        // clear input value
        const sectionInputField = sectionFormRef.current.querySelector("input[name='section_image']")
        sectionInputField.value = ""

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

            // get initial data
            let data = []
            for (let file of formValues.section_image) 
                data.push(file)

            // add files from resized list
            for (let file of resizedList) {
                console.log(file)
                data.push(file)
            }
                
            setFormValues({ 
                ...formValues, 
                section_image: data })
        } 
        
        else {
            setFormErrors({ ...formErrors, [isValidSize.type]: isValidSize.message })
        }
    }

    const removeUploadedImage = (e) => {
        const sectionInputField = sectionFormRef.current.querySelector("input[name='section_image']")
        sectionInputField.value = ""
        setFormValues({...formValues, section_image: []})
    }

    const handleTick = (e) => {
        setFormValues({ ...formValues, section_public: !formValues.section_public })
    }

    const handleChange = async (e) => {
        const { name, value } = e.target;

        // set errors
        const validator = new FormValidation({ ...formValues, [name]: value })
        let validStatus = null

        switch (name) {
            case "section_title":
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

        setFormValues({ ...formValues, [name]: value });
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
                                    let copied = [...formValues.section_image]
                                    copied.splice(idx, 1)
                                    setFormValues({...formValues, section_image: [...copied]})

                                    // const sectionInputField = sectionFormRef.current.querySelector("input[name='section_image']")
                                    // sectionInputField.value = ""
                                })}/>
                        </div>
                        <div 
                            style={{backgroundImage: `url("${(() =>  URL.createObjectURL(item))()}")`}}
                            className="image-content">

                            <img 
                                key={index}
                                alt="section_image"
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
                <legend className="section_content">
                    <p>Section Images</p>
                </legend>

                <div className="control-buttons-wrapper">
                    <input 
                        type="button" 
                        className="choose-btn"
                        value="Choose Images"
                        onClick={(() => {
                            const chooseImageBtn = sectionFormRef.current.querySelector("input[name='section_image']")
                            chooseImageBtn.click()
                        })}/>

                    {formValues.section_image.length > 0  && <input
                        type="button"
                        className="clear-btn"
                        value="Clear"
                        onClick={(e) => { removeUploadedImage(e) }} />}
                </div>
                
                <input
                    hidden={true}
                    type="file"
                    name="section_image"
                    id="section_image"
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

                {formErrors.section_image && 
                    <span 
                        className="error-msg">
                        {formErrors.section_image}
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
        //     .section("/user/register/", data)
        //     .then((res) => {
        //         console.log(res.data)
        //     })
    }

    return (
        <SectionFormWrapper ref={sectionFormRef} enctype="multipart/form-data">
            {console.log(formValues)}
            {/* {console.log(formValues.section_image.length)} */}
            {console.log(formErrors)}
    
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
                        value={formValues.section_title}
                        onChange={handleChange}
                    // onFocus={handleChange}
                    />
                    {formErrors.section_title && <span className="error-msg">{formErrors.section_title}</span>}
                </div>

                <div className="form-field section_content">
                    <legend className="section_content">
                        <p>Section Content</p>
                    </legend>
                    <div className="section-function">
                        {renderSectionFunctions()}
                    </div>
                    <textarea
                        name="section_content"
                        id="section_content"
                        onChange={handleChange}
                        rows={20}
                        maxLength={500}
                        value={formValues.section_content} />
                    {formErrors.section_content && <span className="error-msg">{formErrors.section_content}</span>}
                </div>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        // justifyContent: "center",
                        alignItems: "center",
                    }}
                    className="form-field">
                    <legend className="section_public">
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
                        className={formValues.section_public ? "far fa-check-square" : "far fa-square"}></i>
                </div>

                {renderImage(formValues.section_image)}


                {/* <div className="form-field">
                    <label htmlFor="base_price">Section Image</label>
                    {accessFormHelper().renderImage(
                        "section_image",
                        handleUploadedImage,
                        removeUploadedImage,
                        formValues.section_image)}
                    {formErrors.section_image && <span>{formErrors.section_image}</span>}
                </div> */}

                <div 
                    className="submit-wrapper">
                    <button
                        onClick={handleSubmit}
                        type="submit">Submit</button>
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