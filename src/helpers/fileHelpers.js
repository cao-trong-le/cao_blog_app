import Compress from "compress.js"
// import { useSelector, useDispatch } from "react-redux";
import {store} from "store.js"

const state = store.getState()

export const extractFileNameFromAWSURL = (url, name_length) => {
    var file_name = url
    .toString()
    .split("/")
    .slice(-1)[0]
    .split(".")
    .slice(0)

    var name = file_name[0]
    var type = file_name[file_name.length - 1]

    file_name = name.slice(0, name_length).concat(`.${type}`)

    return file_name
}

export const extractFileTypeFromAWSURL = (url) => {
    const file_type = url
    .toString()
    .split("/")
    .slice(-1)[0]
    .split(".")
    .slice(-1)[0]
   
    return file_type
}

// return resized image
export const handleUploadedImageOnUpdate = async (
    e, 
    formErrors, 
    setFormErrors,
    accessFormValidation
    ) => {
    const files = Array.from(e.target.files)

    let resizedImages = []
    let isValidSize = true

    // for (let file of files) {
    //     isValidSize = await accessFormValidation().isValidImage(
    //         file.size, 
    //         "The uploaded image cannot be bigger than 5mb."
    //     )

    //     console.log(isValidSize)

    //     if (!isValidSize.status) break;
    // }

    if (isValidSize) {
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

                // console.log(`${state.form.section.section_id}_${img.alt}`)
                // convert blob => a file

                const file = new File([blob], img.alt, {
                    type: imgExt,
                    lastModified: new Date().getTime()
                })

                resizedImages.push(file)
            }
        })

        return resizedImages
    } 
    
    else {
        setFormErrors({ ...formErrors, [isValidSize.type]: isValidSize.message })
    }
}

export const handleUploadedImage = async (
        e, 
        ref, 
        formErrors,
        setFormErrors,
        formFiles,
        setFormFiles,
        accessFormValidation,
        from
    ) => {
    const files = Array.from(e.target.files)
   
    // clear input value from ref
    const postInputField = ref.current.querySelector("input[name='post_image']")
    postInputField.value = ""

    let resizedList = []
    let isValidSize = null

    for (let file of files) {
        isValidSize = await accessFormValidation().isValidImage(
            file.size, 
            "The uploaded image cannot be bigger than 5mb."
        )

        if (!isValidSize.status) break;
    }
    

    if (isValidSize.status) {
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

                // console.log(`${state.form.section.section_id}_${img.alt}`)

                let fileName = null

                if (from === "section") {
                    fileName = `section_${state.form.section.section_id}_${img.alt}`
                }

                else if (from === "post") {
                    fileName = `post_${img.alt}`
                }

                console.log(fileName)

                // convert blob => a file
                const file = new File([blob], fileName, {
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

    for (let file of resizedList) 
        data.push(file)

    // dispatch(handlePost({ ...post, post_image: data }))
    setFormFiles([...formFiles, ...data])
}

export const removeUploadedImage = (ref, setFormFiles) => {
    const postInputField = ref.current.querySelector("input[name='post_image']")
    postInputField.value = ""
    setFormFiles([])
}

export const renderImagesList = (formFiles, setFormFiles) => {
    let files = [...formFiles]

    if (files.length > 0) {
        return files.map((item, index) => {
            return (
                <div className="image-wrapper" key={index}>
                    <div className="image-hover">
                        <i 
                            id={index}
                            className="far fa-trash-alt" 
                            onClick={((e) => {
                                const idx = e.target.id
                                let copied = [...formFiles]
                                copied.splice(idx, 1)
                                setFormFiles([...copied])
                            })}/>
                    </div>
                    <div 
                        style={{backgroundImage: `url("${(() =>  URL.createObjectURL(item))()}")`}}
                        className="image-content">
                    </div>
                </div>
            )
        })
    }
}

export const renderImage = (
    multipleFiles,
    ref, 
    formErrors,
    setFormErrors, 
    formFiles,
    setFormFiles, 
    accessFormValidation,
    from) => {
    
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
                        const chooseImageBtn = ref.current.querySelector("input[name='post_image']")
                        chooseImageBtn.click()
                    })}/>

                {(() => {
                    if (formFiles !== undefined) {
                        if (formFiles.length > 0) {
                            return (
                                <input
                                    type="button"
                                    className="clear-btn"
                                    value="Clear"
                                    onClick={(e) => { removeUploadedImage(ref, setFormFiles) }} />
                            )
                        }
                    }
                })()}
            </div>
            
            <input
                hidden={true}
                type="file"
                name="post_image"
                id="post_image"
                onChange={ async (e) => {
                    await handleUploadedImage(
                        e, 
                        ref, 
                        formErrors,
                        setFormErrors, 
                        formFiles,
                        setFormFiles, 
                        accessFormValidation,
                        from
                    )
                }}
                accept="image/*" 
                multiple={multipleFiles} />

            <div className="preview-section-wrapper">
                <div className="preview-section">
                    {renderImagesList(formFiles, setFormFiles)}
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

export const convertImagesToBase64 = (images) => {
    // append images to form.formFiles.images
    var urls_list = []

    // formFiles will hold images temporarily
    for (var image of images) {
        var img_url = URL.createObjectURL(image)
        urls_list.push(img_url)
    }

    return urls_list
}

export const convertUrlToImage = async (url, image_name) => {
    let file = await fetch(url)
    .then( async (r) => await r.blob())
    .then( async (blobFile) => new File([blobFile], image_name, { type: "image/png" }))
    return file
}