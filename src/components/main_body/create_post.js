/* eslint-disable no-unused-vars */
/* eslint-disable */
import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { PostComponent } from "./post";
import { ToolBarComponent } from "./toolBar";
import axiosInstance from "axios_instance/axios_instance";
import { useSelector, useDispatch } from "react-redux";
import * as app_actions from "redux_actions/appActions";
import * as form_actions from "redux_actions/formActions";
const actions = {
    ...app_actions,
    ...form_actions
}
import {PostFormComponent, SectionFormComponent} from "components/forms";

const CreatePostComponent = (props) => {
    const [posts, setPosts] = useState([])
    const [edit, setEdit] = useState(false)
    const [editId, setEditId] = useState(-1)
    // const [postImages, setPostImages] = useState([])
    // const [sectionImages, setSectionImages] = useState([])

    const dispatch = useDispatch()

    const history = useHistory()
    const form = useSelector((state) => state.form)
    const user = useSelector((state) => state.user)
    const app = useSelector((state) => state.app)

    useEffect(() => {
        
    }, [])

    // get all posts
    const reorganizeData = () => {
        let data = new FormData()
        // filter data

        let _data = {...formValues}
        _data.post_image = [...formFiles]

        data.append("event", "add_post")
        data.append("id", user.info.id)
 
        for (let [key, value] of Object.entries(_data)) {
            if (key.includes("image") && value.length > 0) {
                for (let image of formFiles) 
                    data.append(key, image, image.name)
            }

            else if (key === "post_section") {
                value.map((section, index) => {
                    Object.entries(section).map(([s_key, s_value]) => {
                        if (s_key.includes("image") && s_value.length > 0) {
                            for (let s_image of s_value) 
                                data.append(`post_section_${s_key}_${index}`, s_image, s_image.name)
                        }

                        else 
                            data.append(`post_section_${s_key}_${index}`, s_value)
                    })
                })    
            }

            else
                data.append(key, value)
        }

        return data
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const data = reorganizeData()

        axiosInstance
        .post("blog/create/post/", data)
        .then((res) => {
            console.log(res)
            setFormValues({...intialValues})
            setFormFiles([])
        })
        .catch((err) => {
            console.log(err)
        })
    }

    const editSection = (index) => {
        var targetedSection = app.progressing_sections[index]
        // dispatch(actions.handleSection())
    }
    
    return (
        <CreatePostComponentWrapper>
            {/* preview for post header and sumary */}
            <PostPreview>
                <p className="preview-post-title">
                    {form.post.post_title}
                </p>
                <p className="preview-post-heading">
                    {form.post.post_summary}
                </p>

                {!app.post_on_progress && <input 
                    type="button" 
                    className="edit-btn"
                    value="Edit Heading"
                    onClick={(() => {
                        dispatch(actions.setPostOnProgress(true))
                    })} />}
            </PostPreview>
            
            {(() => {
                if (app.post_on_progress) 
                    return <PostFormComponent />
            })()}

            <SectionPreview>
                {/* render all progressing sections */}
                {(() => {
                    return app.progressing_sections.map((section, index) => {
                        return (
                            <div className="section-card" key={index}>
                                <p>{section.section_title}</p>

                                <input 
                                    className="edit-section" 
                                    name={index}
                                    type="button" 
                                    value="Edit"
                                    onClick={((e) => {
                                         e.target.name
                                    })} />

                                <input 
                                    className="delete-section" 
                                    type="button" 
                                    value="Delete" />
                            </div>
                        )
                    })
                })()}

            </SectionPreview>
            
            <input 
                type="button" 
                className="new-section-btn"
                value="New Section" 
                onClick={(() => {
                    dispatch(actions.setSectionOnProgress(true))
                })} />

            {(() => {
                if (app.section_on_progress) {
                    return <SectionFormComponent />
                }
            })()}

            <div className="submit-wrapper">
                <button
                    onClick={handleSubmit}
                    type="submit">Submit</button>
            </div>
        </CreatePostComponentWrapper>
    )
}


const CreatePostComponentWrapper = styled.div`
    height: auto;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    /* border: 1px solid black; */
`;

const PostPreview = styled.div``;

const SectionPreview = styled.div``;


export { CreatePostComponent }