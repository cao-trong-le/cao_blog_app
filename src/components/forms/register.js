/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { Link, matchPath } from "react-router-dom";
import styled from "styled-components";
import { FormValidation } from "helpers/formValidation";

const RegisterFormComponent = (props) => {
    // create later

    const intialValues = {
        email: "",
        password: "",
        re_password: "",
        first_name: "",
        last_name: "",
        username: ""
    }
    const [formValues, setFormValues] = useState(intialValues);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);


    // useEffect(() => {


    //     setFormValues(intialValues)
    //     // setFormErrors({})
    // }, [])

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
                validStatus = validator.checkPasswordField(8, 100, true)
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

        setFormErrors({ ...formErrors, [validStatus.type]: validStatus.message })
    };

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
        <RegisterFormWrapper>
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