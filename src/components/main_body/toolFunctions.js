/* eslint-disable */
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import axiosInstance from "axios_instance/axios_instance";
import { useHistory, useParams } from "react-router-dom";
import { deleteManyPosts, deleteAllPosts } from "./helper";
import * as app_actions from "redux_actions/appActions";
import * as form_actions from "redux_actions/formActions";
import { postDefaultValues, sectionDefaultValues } from "components/forms/defaultValues";

const actions = {
    ...app_actions,
    ...form_actions
}

const EditButtonComponent = (props) => {
    // create later
    // const post = props.post
    const post = props.post
    const history = useHistory()
    const dispatch = useDispatch()
    const app = useSelector((state) => state.app)

    return (
        <EditButtonComponentWrapper 
            className="edit-btn"
            type="button"
            value="Edit"
            onClick={() => {
                // insert post data to post form
                // remove some fields
                var post_data = {...post}
                var section_data = []
                if (post.post_image !== null) {
                    post_data["post_image"] = post.post_image
                } else {
                    post_data["post_image"] = null
                }
                
                const targeted_fields_for_post = [
                    "id",
                    "post_date", 
                    "post_author"
                ]

                const targeted_fields_for_section = [
                    "id",
                    "section_post",
                    "section_author"
                ]

                for (var section of post.post_section) {
                    var _section = {...section}
                    var image_urls = []

                    for (var section_field of targeted_fields_for_section) {
                        delete _section[section_field]
                    }

                    for (var image of section.section_image) {
                        image_urls.push(image.image_content)
                    }

                    _section["section_image"] = [...image_urls]

                    dispatch(actions.setProgressingSection(_section))
                }

                for (var post_field of targeted_fields_for_post) {
                    delete post_data[post_field]
                }

                console.log(post_data, section_data)

                dispatch(actions.handlePost({...post_data}))
                dispatch(actions.setOnProgress("heading", false))
                dispatch(actions.setOnProgress("section", false))
                dispatch(actions.setOnProgress("post", true))
                dispatch(actions.setPostEdit(true))
                history.push("/new/post/")
            }}/>
    )
}

const DeleteButtonComponent = (props) => {
    // create later
    // const post = props.post
    const [post, setPost] = useState(null)

    const app = useSelector((state) => state.app)
    const dispatch = useDispatch()

    return (
        <DeleteButtonComponentWrapper
            className="delete-btn"
            type="button"
            value="Delete"
            onClick={() => {
                // insert post data to post form
                deleteManyPosts(props.user_code, props.post_codes)
                dispatch(actions.updatePostForm({...postDefaultValues}))
                dispatch(actions.updateSectionForm({...sectionDefaultValues}))
            }} />
    )
}

const ViewButtonComponent = (props) => {
    // create later
    // const post = props.post
    const [post, setPost] = useState(null)
    const history = useHistory()
    const app = useSelector((state) => state.app)

    return (
        <ViewButtonComponentWrapper
            className="view-btn"
            type="button"
            value="View"
            onClick={() => {
                // insert post data to post form
                history.push(props.view_url)
            }} />
    )
}

const EditButtonComponentWrapper = styled.input``;

const DeleteButtonComponentWrapper = styled.input``;

const ViewButtonComponentWrapper = styled.input`
    height: fit-content;
    width: fit-content;
    background-color: aquamarine;
`;


export { EditButtonComponent, DeleteButtonComponent, ViewButtonComponent }