/* eslint-disable no-unused-vars */
/* eslint-disable */
import React, {useCallback, useEffect, useRef, useState} from "react"
import ReactQuill from 'react-quill';
import "quill/dist/quill.snow.css"

import styled from "styled-components"
import { Quill } from "react-quill";
import { Parser } from "htmlparser2";


const TextEditorComponent = (props) => {
    const [value, setValue] = useState(null)
    const reactQuillRef = useRef()
   
    useEffect(() => {
        console.log(reactQuillRef.current.childNodes[0].childNodes)
        // hide the first toolbar
        const firstToolBar = reactQuillRef.current.childNodes[0].childNodes[0]
        if (firstToolBar !== undefined)
            firstToolBar.style.display = "none"

        // adjust font size 
        const containerTextBox = reactQuillRef.current.querySelector("p")
        if (containerTextBox !== undefined)
            containerTextBox.style.fontSize = "12pt"
    }, [])

    const  modules  = {
        toolbar: [
            [{ font: [] }],
            [{ size: [] }],
            [{ color: [] }, { background: [] }],
            ["bold", "italic", "underline", "strike"],
            [{ script:  "sub" }, { script:  "super" }],
            ["blockquote", "code-block"],
            [{ list:  "ordered" }, { list:  "bullet" }],
            [{ indent:  "-1" }, { indent:  "+1" }, { align: [] }],
            ["link", "image", "video"],
            ["clean"],
        ],
    };

    return <TextEditor ref={reactQuillRef}>
        {/* {console.log(value)} */}
        {/* <div>Hello</div> */}
        <ReactQuill 
            theme="snow"
            onChange={(content) => {
                console.log(content)
                props.setFormValues({...props.formValues, section_content: content})
            }}
            modules={modules}/>
    </TextEditor>
}

export {TextEditorComponent}

const TextEditor = styled.div`
    height: 300px;
    width: 100%;
`;