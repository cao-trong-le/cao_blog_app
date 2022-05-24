/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { Link, matchPath } from "react-router-dom";
import styled from "styled-components";
import { FormValidation } from "helpers/formValidation";

import axiosInstance from "axios_instance/axios_instance";
import Compress from "compress.js";

const RegisterFormComponent = (props) => {
    // create later

    const intialValues = {
        email: "",
        password: "",
        re_password: "",
        first_name: "",
        last_name: "",
        username: "",
        avatar: [],
    }
    const [formValues, setFormValues] = useState(intialValues);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);


    // useEffect(() => {


    //     setFormValues(intialValues)
    //     // setFormErrors({})
    // }, [])

    const registerFormRef = useRef()

    const accessFormValidation = () => {
        const formValidate = new FormValidation({ ...formValues })
        return formValidate
    }

    const handleUploadedImage = async (e) => {
        const files = Array.from(e.target.files)
       
        // clear input value
        const postInputField = registerFormRef.current.querySelector("input[name='avatar']")
        postInputField.value = ""

        let resizedList = []
        let isValidSize = null

        for (let file of files) {
            console.log(file)
            isValidSize = await accessFormValidation().isValidImage(
                file.size, 
                "The uploaded image cannot be bigger than 5mb.",
                "avatar"
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
        // for (let file of formValues.avatar) 
        //     data.push(file)

        // add files from resized list
        for (let file of resizedList) 
            data.push(file)
      
        setFormValues({ 
            ...formValues, 
            avatar: data })
    }

    const removeUploadedImage = (e) => {
        const postInputField = registerFormRef.current.querySelector("input[name='avatar']")
        postInputField.value = ""
        setFormValues({...formValues, avatar: []})
    }

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
                                    let copied = [...formValues.avatar]
                                    copied.splice(idx, 1)
                                    setFormValues({...formValues, avatar: [...copied]})

                                    // const postInputField = postFormRef.current.querySelector("input[name='avatar']")
                                    // postInputField.value = ""
                                })}/>
                        </div>
                        <div 
                            style={{backgroundImage: `url("${(() =>  URL.createObjectURL(item))()}")`}}
                            className="image-content">

                            <img 
                                key={index}
                                alt="avatar"
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
                <legend className="avatar">
                    <p>Avatar</p>
                </legend>

                <div className="control-buttons-wrapper">
                    <input 
                        type="button" 
                        className="choose-btn"
                        value="Choose Images"
                        onClick={(() => {
                            const chooseImageBtn = registerFormRef.current.querySelector("input[name='avatar']")
                            chooseImageBtn.click()
                        })}/>

                    {formValues.avatar.length > 0  && <input
                        type="button"
                        className="clear-btn"
                        value="Clear"
                        onClick={(e) => { removeUploadedImage(e) }} />}
                </div>
                
                <input
                    hidden={true}
                    type="file"
                    name="avatar"
                    id="avatar"
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

                {formErrors.avatar && 
                    <span 
                        className="error-msg">
                        {formErrors.avatar}
                    </span>}
            </div>
        )
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });

        // set errors

        let errorMsg = {}

        const validator = new FormValidation({ ...formValues, [name]: value })
        let validStatus = null

        switch (name) {
            case "first_name":
                validStatus = validator.checkFirstNameField(1, 100)
                break
            case "last_name":
                validStatus = validator.checkLastNameField(1, 100)
                break
            case "username":
                validStatus = validator.checkUsernameField(8, 100)
                break
            case "email":
                validStatus = validator.checkEmailField()
                break
            case "password":
                const scanList = [
                    validator.checkPasswordField(8, 100, true),
                    validator.checkConfirmPasswordField()
                ]

                console.log(scanList)

                let copied = {...formErrors}

                for (let scan of scanList) {
                    validStatus = scan
                    copied[validStatus.type] = validStatus.message
            
                    if (!scan.status) {
                        validStatus = scan
                        copied[validStatus.type] = validStatus.message
                        break
                    }
                }

                setFormErrors({ ...formErrors, ...copied })

                break
            case "re_password":
                validStatus = validator.checkConfirmPasswordField()
                break
            default:
                break
        }

        console.log(validStatus)

        if (!validStatus.status)
            errorMsg[validStatus.type] = validStatus.message
        // Object.assign(errorMsg, { [validStatus.type]: validStatus.message })

        if (name !== "password")
            setFormErrors({ ...formErrors, [validStatus.type]: validStatus.message })
    };

    const reorganizeData = () => {
        let data = new FormData()
        data.append("event", "register")
        for (let [key, value] of Object.entries(formValues))
            if (key === "avatar" && value.length > 0) {
                for (let image of value) 
                    data.append(key, image, image.name)
            } 

            else {
                data.append(key, value)
            }
            
        return data
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const data = reorganizeData()

        axiosInstance
            .post("/user/register/", data)
            .then((res) => {
                console.log(res.data)
            })
            .catch((err) => {
                console.log(err.response.data.error)
                const error = err.response.data.error
                setFormErrors({ ...formErrors, [error.type[0]]: error.message[0]})
            })
    }

    return (
        <RegisterFormWrapper ref={registerFormRef}>
            {console.log(formValues)}
            {console.log(formErrors)}

            <div className="form-title">
                <h1>Register</h1>
            </div>
            <div className="form-content">
                <div className="form-field">
                    <label htmlFor="first_name">First Name</label>
                    <input
                        type="text"
                        name="first_name"
                        id="first_name"
                        value={formValues.first_name}
                        onChange={handleChange}
                    // onFocus={handleChange}
                    />
                    {formErrors.first_name && <span>{formErrors.first_name}</span>}
                </div>

                <div className="form-field">
                    <label htmlFor="last_name">Last Name</label>
                    <input
                        type="text"
                        name="last_name"
                        id="last_name"
                        value={formValues.last_name}
                        onChange={handleChange}
                    />
                    {formErrors.last_name && <span>{formErrors.last_name}</span>}
                </div>

                <div className="form-field">
                    <label htmlFor="last_name">Username</label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        value={formValues.username}
                        onChange={handleChange}
                    />
                    {formErrors.username && <span>{formErrors.username}</span>}
                </div>

                <div className="form-field">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={formValues.email}
                        onChange={handleChange}
                    />
                    {formErrors.email && <span>{formErrors.email}</span>}
                </div>

                <div className="form-field">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        autoComplete=""
                        value={formValues.password}
                        onChange={handleChange}
                    />
                    {formErrors.password && <span>{formErrors.password}</span>}
                </div>

                <div className="form-field">
                    <label htmlFor="re_password">Confirm Password</label>
                    <input
                        type="password"
                        name="re_password"
                        id="re_password"
                        value={formValues.re_password}
                        onChange={handleChange}
                    />
                    {formErrors.re_password && <span>{formErrors.re_password}</span>}
                </div>

                {renderImage(formValues.avatar)}

                <button
                    onClick={handleSubmit}
                    type="submit">Submit</button>

                <Link to="/login/">Already have an account?</Link>
            </div>
        </RegisterFormWrapper>
    )
}

export { RegisterFormComponent }

const RegisterFormWrapper = styled.form`
    display: flex;
    flex-direction: column;

    .form-content {
        display: flex;
        flex-direction: column;
    }

    .form-field {
        display: flex;
        flex-direction: column;
    }
`