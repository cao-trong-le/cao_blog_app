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
import { postDefaultValues, sectionDefaultValues } from "components/forms/defaultValues";
import {PostFormComponent, SectionFormComponent} from "components/forms";


import { handleSubmit } from "components/forms/submitForm";
import { SectionTitlePopUpComponent } from "components/popups";

const CreatePostComponent = (props) => {
    const [posts, setPosts] = useState([])
    const [edit, setEdit] = useState(false)
    const [editId, setEditId] = useState(-1)
    const [newSectionBtn, setNewSectionBtn] = useState(true)
    // const [postImages, setPostImages] = useState([])
    // const [sectionImages, setSectionImages] = useState([])

    const dispatch = useDispatch()

    const history = useHistory()
    const form = useSelector((state) => state.form)
    const user = useSelector((state) => state.user)
    const app = useSelector((state) => state.app)

    const [sectionTitlePopup, setSectionTitlePopUp] = useState(false)

    useEffect(() => {
        
    }, [])

    // get all posts

    
    const handleCreateNewSection = (section_title) => {
        const formData = new FormData()
        formData.append("event", "create_new_section")
        formData.append("user_code", user.info.code)
        formData.append("post_code", form.post.post_code)
        formData.append("section_title", section_title)

        axiosInstance.post("blog/sections/", formData)
        .then((res) => {
            // console.log(res.data)

            const section = res.data.section
            const section_code = res.data.section.section_code
            dispatch(actions.setProgressingSection({...section}))
            dispatch(actions.handleSection({
                ...form.section, 
                section_code: section_code
            }))
            dispatch(actions.updatePostSection(-1, {...section}))
        })
        .catch((err) => {
            console.log(err)
        })
    }

    const handleDeleteSections = (sections) => {
        const formData = new FormData()
        formData.append("event", "delete_sections")
        
        for (var section of sections)
            formData.append("section_code", section.section_code)

        axiosInstance.post("blog/sections/", formData)
        .then((res) => {
            console.log(res.data)

        })
        .catch((err) => {
            console.log(err)
        })
    }

    const handleDeleteSection = (section) => {
        const formData = new FormData()
        formData.append("event", "delete_sections")
        formData.append("section_code", section.section_code)

        axiosInstance.post("blog/sections/", formData)
        .then((res) => {
            console.log(res.data.post)
            dispatch(actions.updatePosts())

            // find 
        })
        .catch((err) => {
            console.log(err)
        })
    }

    return (
        <CreatePostComponentWrapper>
            {/* preview for post header and sumary */}
            <Post>
                <PostPreview>
                    <div className="heading-preview-wrapper">
                        <div className="heading-image-wrapper">
                            {form.post.post_image !== null && 
                            <img 
                                className="preview-heading-image"
                                src={form.post.post_image.image_content} 
                                alt="" />} 
                        </div>
                        
                        <p className="preview-post-title">
                            {form.post.post_title}
                        </p>

                        <p className="preview-post-heading">
                            {form.post.post_summary}
                        </p>
                    </div>
                
                    {!app.heading_on_progress && <input 
                        type="button" 
                        className="edit-btn"
                        value="Edit Heading"
                        onClick={(() => {
                            dispatch(actions.setOnProgress("heading", true))
                        })} />}
                </PostPreview>
                
                {(() => {
                    if (app.heading_on_progress) 
                        return <PostFormComponent />
                })()}
            </Post>

            <Section>
                <SectionPreview>
                    {/* render all progressing sections */}
                    {(() => {
                        return form.post.post_section.map((section, index) => {
                            // image lookup
                            // loop through a list of section images and pick image base on section index
                            
                            return (
                                <div className="section-card" key={index}>
                                    {section.section_image.map((image) => {
                                        return <img key={index} src={image.image_content} alt="section_image" />
                                    })}
                                    
                                    <p>{section.section_title}</p>

                                    <input 
                                        className="edit-section" 
                                        name={index}
                                        type="button" 
                                        value="Edit"
                                        onClick={((e) => {
                                            var idx = parseInt(e.target.name)
                                            dispatch(actions.setSectionEdit(true, idx))
                                            dispatch(actions.setOnProgress("section", true))
                                            dispatch(actions.handleSection(form.post.post_section[idx]))
                                        })} />

                                    <input 
                                        className="delete-section" 
                                        type="button" 
                                        value="Delete"
                                        onClick={() => {handleDeleteSection(section)}} />
                                </div>
                            )
                        })
                    })()}

                </SectionPreview>

                {sectionTitlePopup && <SectionTitlePopUpComponent
                    setSectionTitlePopUp={setSectionTitlePopUp}
                    setNewSectionBtn={setNewSectionBtn}
                    handleCreateNewSection={handleCreateNewSection}
                />}

                {newSectionBtn && <input 
                    type="button" 
                    className="new-section-btn"
                    value="New Section" 
                    onClick={(() => {
                        // create a new section for the post
                        setSectionTitlePopUp(true)
                        dispatch(actions.handleSection({...sectionDefaultValues}))
                    })} />}

            </Section>

            {(() => {
                if (app.section_on_progress) {
                    return <SectionFormComponent 
                        setNewSectionBtn={setNewSectionBtn} />
                }
            })()}

            <div className="submit-btn-wrapper">
                <input
                    type="submit"
                    name={(() => {
                        if (!form.post.post_finished) {
                            return "save"
                        } else {
                            return "done"
                        }
                    })()}
                    value={(() => {
                        if (!form.post.post_finished) {
                            return "Save"
                        } else {
                            return "Done"
                        }
                    })()}
                    disabled={(() => {
                        if (!app.heading_on_progress && !app.section_on_progress)
                            return false
                        else
                            return true
                    })()}
                    onClick={(e) => {
                        if (!app.heading_on_progress && !app.section_on_progress) {
                            dispatch(actions.addPost(form.post))
                            dispatch(actions.handlePost({...postDefaultValues}))
                            dispatch(actions.handleSection({...sectionDefaultValues}))
                            dispatch(actions.setOnProgress("post", false))
                            dispatch(actions.setHomePageReload(true))

                            // send a request to save the post
                            // apply for new created post
                            // if user don't want to continue with the post and still have it on hold
                            // then the post will be removed after 3 days.

                            
                            if (!form.post.post_finished) {
                                const formData = new FormData()
                                formData.append("event", "save_new_post")
                                formData.append("post_code", form.post.post_code)
                                // formData.append("post_finished", true)

                                axiosInstance.post("blog/posts/", formData)
                                .then((res) => {
                                    // console.log(res.data)
                            
                                    dispatch(actions.handlePost({
                                        ...form.post, 
                                        ...res.data.post
                                    }))

                                })
                                .catch((err) => {
                                    console.log(err)
                                })
                            }

                            history.push("/home/posts")
                        }                    
                    }} />
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

const Section = styled.div``

const Post = styled.div``


export { CreatePostComponent }