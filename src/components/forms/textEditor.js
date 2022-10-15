/* eslint-disable no-unused-vars */
/* eslint-disable */
import React, {useCallback, useEffect, useRef, useState} from "react"
import ReactQuill from 'react-quill';
import "quill/dist/quill.snow.css"

import styled from "styled-components"
import { Quill } from "react-quill";
// import { Parser } from "htmlparser2";
import Parser from "html-react-parser"

import { useSelector, useDispatch } from "react-redux";
import { handleFormStatus, handlePost, handleSection } from "redux_actions/formActions";
    
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

    const dispatch = useDispatch()
    const form = useSelector((state) => state.form)

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
            // ["link", "image", "video"],
            ["clean"],
        ],
    }

    const renderTextEditor = () => {
        return <ReactQuill 
            theme="snow"
            placeholder="Section Content...."
            onChange={(content) => {
                props.setFormSectionContent(content)

                // console.log({...form.section, section_content: content})
                // dispatch(handleSection(data))
                // dispatch(handleFormStatus("section", data))
            }}
            modules={modules}/>
    }

    const memoRecallTextEditor = useCallback(() => {
        return renderTextEditor()
        // else return renderTextEditor()
    }, [reactQuillRef])

    return <TextEditor ref={reactQuillRef}>
        {/* {console.log(value)} */}
        {/* <div>Hello</div> */}
        {/* <p>fsdfsdfsdfsddfsfsd<span style="color: rgb(255, 194, 102);">fsdfsdf fsdf </span></p> */}
        {/* <ReactQuill 
            theme="snow"
            placeholder="Section Content...."
            onChange={(content) => {
                console.log(content)
                dispatch(handleSection({...form.section, section_content: content}))
                dispatch(handleFormStatus("section", {...form.section, section_content: content}))
            }}
            modules={modules}/> */}

        {memoRecallTextEditor()}
    </TextEditor>
}

export {TextEditorComponent}

const TextEditor = styled.div`
    height: fit-content;
    width: 100%;

    p,
    li {
        font-size: 12pt;
    }
`;