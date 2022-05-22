/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { Link, matchPath } from "react-router-dom";
import styled from "styled-components";
// import axiosInstance from "axios_instance/axiosInstace";
import { FormValidation } from "helpers/formValidation";

const LoginFormComponent = (props) => {
    // create later

    const intialValues = { email: "", password: "" };
    const [formValues, setFormValues] = useState(intialValues);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setFormValues({ email: "", password: "" })
        setFormErrors({})
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });

        // set errors

        // let errorMsg = {}

        // const validator = new FormValidation({ ...formValues, [name]: value })
        // const emailStatus = validator.isValidEmail()
        // const passwordStatus = validator.isValidPassword()
        // const statuses = [
        //     emailStatus,
        //     passwordStatus
        // ]

        // console.log(statuses)

        // statuses.forEach((status, index) => {
        //     if (!status.status)
        //         Object.assign(errorMsg, { [status.type]: status.message })
        // })

        // setFormErrors({ ...errorMsg })

        // console.log(formErrors)

    };

    const handleSubmit = (e) => {
        e.preventDefault()

        // axiosInstance
        //     .post("api/token/", formValues)
        //     .then((res) => {
        //         console.log(res.data)
        //     })
    }

    return (
        <LoginFormWrapper autoComplete="off">
            {console.log(formValues)}

            <div className="form-title">
                <h1>Login</h1>
            </div>
            <div className="form-content">
                <div className="form-field">
                    <legend className="email">
                        <p>Email</p>
                    </legend>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={formValues.email}
                        autoComplete="off"
                        onChange={handleChange}
                    />
                    {formErrors.email && <span>{formErrors.email}</span>}
                </div>

                <div className="form-field">
                    <legend className="password">
                        <p>Password</p>
                    </legend>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        value={formValues.password}
                        autoComplete="off"
                        onChange={handleChange}
                    />
                    {formErrors.password && <span>{formErrors.password}</span>}
                </div>

                <div class="submit-wrapper">
                    <button
                        onClick={handleSubmit}
                        type="submit">Sign In</button>
                </div>
                
                <Link to="/register/">Don't have an account yet?</Link>
            </div>
        </LoginFormWrapper>
    )
}

export { LoginFormComponent }

const LoginFormWrapper = styled.form`
    display: flex;
    flex-direction: column;
    padding: 15px;
    width: 600px;
    margin-bottom: 50px;
    font-family: Arial, Helvetica, sans-serif;

    @media only screen and (max-width: 600px) {
        width: 100%;
    }

    div.form-content {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
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

    textarea, 
    input[type="email"],
    input[type="password"],
    input[type="text"] {
        height: 45px;
        width: 100%;
        background-color: white;
        border: 1px solid black;
        border-radius: 5px;
        outline: none;
        font-size: 12pt;
        padding-left: 5px;
        margin-bottom: 15px;

        /* @media only screen and (max-width: 600px) {
            width: 90%;
        } */
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

    .form-field {
        display: flex;
        width: 100%;
        flex-direction: column;
    }

    div.submit-wrapper {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: right;
        align-items: center;
        padding-right: 10px;
        padding-bottom: 10px;
        /* background-color: aliceblue; */

        @media only screen and (max-width: 600px) {
            justify-content: center;
            padding-right: 0px;
        }

        button[type="submit"] {
            margin-top: 5px;
            height: 40px;
            width: 150px;
            border-radius: 2px;
            font-size: 13pt;
            border: 3px solid rgb(66, 66, 66);
            outline: none;
            background-color: white;
            color: rgb(66, 66, 66);
            font-weight: 700;
            font-stretch: 100%;
            

            &:hover {
                background-color: rgb(66, 66, 66);
                color: white;
            }

            @media only screen and (max-width: 600px) {
                width: 95%;
            }
        }
    }
`