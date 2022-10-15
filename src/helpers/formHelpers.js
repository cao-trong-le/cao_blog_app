import React from "react"
import { FormValidation } from "./formValidation"

class FormHelpers {
    constructor() {
        this.defaultNames = []
    }

    resizeImage = () => {

    }

    renderOptionList = (
        optionsList,
        inputType,
        commonName,
        sectionName,
        defaultNames = null,
        eventHandler = null) => {

        if (defaultNames !== null)
            this.defaultNames = [...defaultNames]

        return optionsList.map((option, index) => {
            return (
                <React.Fragment key={index}>
                    {/* <input
                        key={index}
                        data-option-name={option.name}
                        type={inputType}
                        name={inputType === "checkbox" ? option.name : commonName}
                        id={index}
                        defaultChecked={(() => {
                            if (this.defaultNames.indexOf(sectionName) !== -1)
                                return option.default
                            else
                                return false
                        })()}
                        onClick={((e) => { eventHandler(inputType, sectionName, e) })}
                    /> */}
                    <i
                        className={(this.defaultNames.indexOf(sectionName) !== -1) ? "fas fa-circle" : "far fa-circle"}
                        onClick={((e) => { eventHandler(inputType, sectionName, e) })}></i>
                    {/* <i className="far fa-circle"></i>
                    <i className="fas fa-circle"></i> */}
                    <label for={option.name}>{option.display}</label>
                </React.Fragment>
            )
        })
    }
}

class ValidationHelpers {
    constructor(
        validateTargets,
        updatedData,
        handleError,
        formValues,
        formErrors,
        setFormValues,
        setFormErrors) {
        this.validateTargets = validateTargets
        this.updatedData = updatedData
        this.handleError = handleError
        this.setFormValues = setFormValues
        this.setFormErrors = setFormErrors
        this.formValues = formValues
        this.formErrors = formErrors
    }

    handleSingleValidation = (data, name, value) => {
        const validationStatus = this.handleValidation(
            true,
            name,
            value,
            false,
            null)

        console.log(validationStatus)

        this.setFormErrors({
            ...this.formErrors,
            [validationStatus.type]: validationStatus.status ? "" : validationStatus.message
        })

    }

    handleMultiValidation = (data, name, value, mainKey) => {
        const validationStatus = this.handleValidation(
            true,
            name,
            value,
            true,
            mainKey)
        this.setFormErrors({
            ...this.formErrors,
            [mainKey]: {
                ...this.formErrors[mainKey],
                [validationStatus.type]: validationStatus.status ? "" : validationStatus.message
            }
        })
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setFormValues({ ...this.updatedData, [name]: value });
        this.handleSingleValidation({ ...this.updatedData, [name]: value }, name, value)
    };

    handleNestedChange = (e, mainKey, nestedKey) => {
        const { name, value } = e.target
        console.log(name, value)
        const data = {
            ...this.updatedData[mainKey],
            [nestedKey]: value
        }

        console.log(data)

        this.setFormValues({
            ...this.formValues,
            [mainKey]: data
        })

        const updatedData = { ...this.updatedData, [mainKey]: data }
        this.handleMultiValidation({ ...updatedData }, name, value, mainKey)
    }


    scanValidateTargets = (validator) => {
        let status = true
        for (let [key, value] of Object.entries(this.updatedData)) {
            console.log(key, value)
            const searchValidateCard = (card) => key === card.name
            const index = this.validateTargets.findIndex(searchValidateCard)
            console.log(index)

            if (index !== -1 && this.validateTargets[index].nested) {
                console.log("it's nested")
                for (let [nested_key, nested_value] of Object.entries(value)) {
                    this.handleMultiValidation(this.updatedData, nested_key, nested_value, key)
                    if (!this.handleError(nested_key, nested_value, validator, true, key).status)
                        status = false
                }
                break
            } else if (index !== -1 && !this.validateTargets[index].nested) {
                console.log("it's not nested")
                this.handleSingleValidation(this.updatedData, key, value)
                status = this.handleError(key, value, validator, false, null).status
                break
            }
        }
        return status
    }

    handleValidation = (
        onSingleField = false,
        fieldName = null,
        fieldValue = null,
        nested = false,
        m_key = null) => {

        const validator = new FormValidation({ ...this.updatedData })

        if (onSingleField) {
            console.log(this.handleError(fieldName, fieldValue, validator, nested, m_key))
            return this.handleError(fieldName, fieldValue, validator, nested, m_key)
        }
        else
            return this.scanValidateTargets(validator)
    }
}

export { FormHelpers, ValidationHelpers }