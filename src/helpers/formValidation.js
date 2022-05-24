/* eslint-disable no-unused-vars */
/* eslint-disable */


class FormValidation {
    constructor(data) {
        this.data = data
        this.returnValue = {
            strenth: 0,
            type: "",
            status: false,
            message: "",
            backend_check: false
        }
        this.statuses = null
        this.validConditions = {
            empty_field: {
                status: true,
                message: "This field cannot be empty.",
                hind: ""
            },
            lower_char: {
                status: true,
                message: "Your password has to contain at least 1 lower character.",
                hind: ""
            },
            upper_char: {
                status: true,
                message: "Your password has to contain at least 1 upper character.",
                hind: ""
            },
            numeric_char: {
                status: true,
                message: "Your password has to contain at least 1 number.",
                hind: ""
            },
            special_char: {
                status: true,
                message: "Your password has to contain at least 1 special character.",
                hind: `!@#$%^&*()_+-=[]{};':"\|,.<>/?`
            },
            limit_char: {
                status: true,
                message: "The length of your password has to be at least in range from 6 to 50 characters",
                hind: ``
            }
        }
    }

    zip = (a, b) => Array(Math.max(b.length, a.length)).fill().map((_, i) => [a[i], b[i]])

    // findBoolean = (array) => {
    //     let i = 0
    //     while (i < array.length) {
    //         if (array[i])
    //             i += 1
    //         else
    //             break
    //     }
    //     return i
    // }

    setValidationType = (type) => {
        this.returnValue.type = type
    }

    isSimilarField = (origin_value, checked_value, message, error_type) => {
        this.setValidationType(error_type)
        if (origin_value === checked_value) {
            this.returnValue.status = true
            this.returnValue.message = ""
        } else {
            this.returnValue.status = false
            this.returnValue.message = message
        }
        return { ...this.returnValue }
    }

    isEmptyField = (value, message, error_type) => {
        console.log(value)
        this.setValidationType(error_type)
        if (value.toString().length === 0) {
            this.returnValue.status = false
            this.returnValue.message = message
        } else {
            this.returnValue.status = true
            this.returnValue.message = ""
        }
        return { ...this.returnValue }
    }

    isCertainLength = (min, max, value, message_min, message_max, error_type) => {
        this.setValidationType(error_type)
        if (value.length < min) {
            this.returnValue.status = false
            this.returnValue.message = message_min
        } else if (value.length > max) {
            this.returnValue.status = false
            this.returnValue.message = message_max
        } else {
            this.returnValue.status = true
            this.returnValue.message = ""
        }

        return { ...this.returnValue }
    }

    isSpecialChar = (value, message, error_type) => {
        this.setValidationType(error_type)
        const special_regex = /(?=.*[!@#$%^&*])/
        if (special_regex.test(value)) {
            this.returnValue.status = true
            this.returnValue.message = ""
        } else {
            this.returnValue.status = false
            if (message !== null)
                this.returnValue.message = message
            else
                this.returnValue.message = "must contain at least a special character"
        }
        return { ...this.returnValue }
    }

    isNumericChar = (value, message, error_type) => {
        this.setValidationType(error_type)
        const numeric_regex = /[0-9]+/
        if (numeric_regex.test(value)) {
            this.returnValue.status = true
            this.returnValue.message = ""
        } else {
            this.returnValue.status = false
            if (message !== null)
                this.returnValue.message = message
            else
                this.returnValue.message = "must contain at least a number"
        }
        return { ...this.returnValue }
    }

    isUpperChar = (value, message, error_type) => {
        this.setValidationType(error_type)
        const upper_regex = /[A-Z]+/
        if (upper_regex.test(value)) {
            this.returnValue.status = true
            this.returnValue.message = ""
        } else {
            this.returnValue.status = false
            if (message !== null)
                this.returnValue.message = message
            else
                this.returnValue.message = "must contain at least an upper character"
        }
        return { ...this.returnValue }
    }

    isLowerChar = (value, message, error_type) => {
        this.setValidationType(error_type)
        const lower_regex = /[a-z]+/
        if (lower_regex.test(value)) {
            this.returnValue.status = true
            this.returnValue.message = ""
        } else {
            this.returnValue.status = false
            if (message !== null)
                this.returnValue.message = message
            else
                this.returnValue.message = "must contain at least a lower character"
        }
        return { ...this.returnValue }
    }

    isValidPostal = (value, message, error_type) => {
        this.setValidationType(error_type)
        var regex = new RegExp(/^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ]( )?\d[ABCEGHJKLMNPRSTVWXYZ]\d$/i);
        this.setValidationType("postal")
        if (regex.test(value)) {
            this.returnValue.status = true
            this.returnValue.message = ""
        } else {
            this.returnValue.status = false
            this.returnValue.message = message
        }
        return { ...this.returnValue }
    }

    isValidEmail = (value, message, error_type) => {
        this.setValidationType(error_type)
        var email_regex = /\S+@\S+\.\S+/;
        if (email_regex.test(value)) {
            this.returnValue.status = true
            this.returnValue.message = ""
        } else {
            this.returnValue.status = false
            this.returnValue.message = message
        }
        return { ...this.returnValue }
    }

    isValidImage = (size, message, error_type) => {
        this.setValidationType(error_type)
        const _1mb = 1000000
        if (size > (5 * _1mb)) {
            this.returnValue.status = false
            this.returnValue.message = message
        } else {
            this.returnValue.status = true
            this.returnValue.message = ""
        }
        return { ...this.returnValue }
    }

    returnValueHandler = (status, message) => {
        this.returnValue.status = status
        this.returnValue.message = message

        return { ...this.returnValue }
    }

    checkFirstNameField = (min, max) => {
        const fieldName = "first_name"
        this.setValidationType(fieldName)

        // check stages
        let scanLists = [
            this.isEmptyField(
                this.data.first_name,
                "Your first name cannot be empty.",
                fieldName
            ),
            this.isCertainLength(
                min,
                max,
                this.data.first_name,
                `Your first name must contain more than ${min} character.`,
                `Your first name must contain less than ${max} character.`,
                fieldName
            )
        ]
        for (let scan of scanLists) {
            if (!scan.status)
                return { ...scan }
        }

        return { ...this.returnValue }
    }

    checkLastNameField = (min, max) => {
        const fieldName = "last_name"
        this.setValidationType(fieldName)
        let scanLists = [
            this.isEmptyField(
                this.data.last_name,
                "Oops! Your last name cannot be empty!",
                fieldName),
            this.isCertainLength(
                min,
                max,
                this.data.first_name,
                `Your last name must contain more than ${min} character.`,
                `Your last name must contain less than ${max} character.`,
                fieldName
            )
        ]
        for (let scan of scanLists) {
            if (!scan.status)
                return { ...scan }
        }

        return { ...this.returnValue }
    }

    checkUsernameField = (min, max) => {
        const fieldName = "username"
        this.setValidationType("username")
        let scanLists = [
            this.isEmptyField(
                this.data.username,
                "Oops! Your username cannot be empty!",
                fieldName),
            this.isCertainLength(
                min,
                max,
                this.data.username,
                `Your username must contain more than ${min} character(s).`,
                `Your username must contain less than ${max} characters.`,
                fieldName)
        ]
        for (let scan of scanLists) {
            if (!scan.status)
                return { ...scan }
        }

        return { ...this.returnValue }
    }

    // Email Validation
    checkEmailField = () => {
        const fieldName = "email"
        this.setValidationType(fieldName)
        let scanLists = [
            this.isEmptyField(
                this.data.email,
                "Oops! Your email cannot be empty!",
                fieldName),
            this.isValidEmail(
                this.data.email,
                "Your email is invalid.",
                fieldName)
        ]
        for (let scan of scanLists) {
            if (!scan.status)
                return { ...scan }
        }
        return { ...this.returnValue }
    }

    // Password Validate
    checkPasswordField = (min, max, special) => {
        const fieldName = "password"
        this.setValidationType(fieldName)

        let scanLists = [
            this.isEmptyField(
                this.data.password,
                "Oops! Your password is empty.",
                fieldName),
            this.isCertainLength(
                min,
                max,
                this.data.password,
                `Your password must contain more than ${min} character(s).`,
                `Your password must contain less than ${max} characters.`,
                fieldName),
            this.isLowerChar(
                this.data.password,
                "Oops! Your password must contains at least a lower character.",
                fieldName),
            this.isUpperChar(
                this.data.password,
                "Oops! Your password must contains at least a upper character.",
                fieldName),
            this.isNumericChar(
                this.data.password,
                "Oops! Your password must contains at least a number.",
                fieldName),
            this.isSpecialChar(
                this.data.password,
                "Oops! this password must contains at least a special character.",
                fieldName),
        ]

        if (!special)
            scanLists.splice(-1, 1)

        for (let scan of scanLists)
            if (!scan.status)
                return { ...scan }

        return { ...this.returnValue }
    }

    // Check Password Similarity
    checkConfirmPasswordField = () => {
        const fieldName = "re_password"
        this.setValidationType(fieldName)

        let scanLists = [
            this.isEmptyField(
                this.data.re_password,
                "Oops! Your confirm password is empty.",
                fieldName),
            this.isSimilarField(
                this.data.password,
                this.data.re_password,
                "Oops! Your confirm password must be the same as your password.",
                fieldName),
        ]

        for (let scan of scanLists) {
            if (!scan.status)
                return { ...scan }
        }

        return { ...this.returnValue }
    }

    // Title Validation
    checkTitleField = (min, max) => {
        const fieldName = "post_title"
        this.setValidationType(fieldName)

        // check stages
        let scanLists = [
            this.isEmptyField(
                this.data.post_title,
                "Title of the post cannot be empty.",
                fieldName
            ),
            this.isCertainLength(
                min,
                max,
                this.data.post_title,
                `Your first name must contain more than ${min} character.`,
                `Your first name must contain less than ${max} character.`,
                fieldName
            )
        ]
        for (let scan of scanLists) {
            if (!scan.status)
                return { ...scan }
        }

        return { ...this.returnValue }
    }
}

export { FormValidation }

