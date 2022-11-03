// eslint-disable

import styled from "styled-components";
import { useHistory } from "react-router-dom";

import * as userActions from "redux_actions/userActions";
import * as appActions from "redux_actions/appActions";
import * as formActions from "redux_actions/formActions";
import { useDispatch, useSelector } from "react-redux";

import { postDefaultValues, sectionDefaultValues } from "components/forms/defaultValues";

const actions = {
    ...userActions,
    ...appActions,
    ...formActions
}


const NewPostPopUpComponent = (props) => {
    // create later
    // const post = props.post

    const history = useHistory()

    // const app = useSelector((state) => state.app)
    const form = useSelector((state) => state.form)

    return (
        <NewPostPopUpComponentWrapper>
            <p>Do you want save your post before create a new one?</p>

            {!form.post.post_finished && <input 
                type="button"
                className="save-post-btn"
                value="Continue"
                // disabled={true}
                onClick={(() => {
                    history.push("/new/post/")
                    props.setPopUp(false)
                })} />}

            <input
                type="button"
                className="new-post-btn"
                value="New Post"
                onClick={(() => {
                    props.setTitlePopUp(true)
                    props.setPopUp(false)
                })} />

            <input
                type="button"
                className="cancel-post-btn"
                value="Cancel"
                onClick={(() => {props.setPopUp(false)})} />

        </NewPostPopUpComponentWrapper>
    )
}


const NewPostPopUpComponentWrapper = styled.div``


const SectionTitlePopUpComponent = (props) => {
    const dispatch = useDispatch()
    const form = useSelector((state) => state.form)

    return (
        <SectionTitlePopUpComponentWrapper>
            <p>Section Title</p>

            <input 
                type="text"
                className="post-title-input"
                value={form.section.section_title}
                onChange={(e) => {
                    dispatch(actions.handleSection({
                        ...form.section, 
                        section_title: e.target.value
                    }))
                }}
                placeholder="Section Title" />

            <div className="post-title-functions">
                <input
                    type="button"
                    name="set_btn"
                    value="Set Section Title"
                    onClick={() => {
                        props.handleCreateNewSection(form.section.section_title)
                        props.setSectionTitlePopUp(false)
                        props.setNewSectionBtn(false)
                        dispatch(actions.setOnProgress("section", true))
                    }} />

                <input
                    type="button"
                    name="cancel_btn"
                    value="Cancel"
                    onClick={() => {
                        props.setSectionTitlePopUp(false)
                        dispatch(actions.handleSection({...sectionDefaultValues}))
                        dispatch(actions.setOnProgress("section", false))
                    }} />
            </div>
        </SectionTitlePopUpComponentWrapper>
    )
}

const SectionTitlePopUpComponentWrapper = styled.div``

const PostTitlePopUpComponent = (props) => {
    const dispatch = useDispatch()
 
    const form = useSelector((state) => state.form)

    return (
        <PostTitlePopUpComponentWrapper>
            <p>Post Title</p>

            <input 
                type="text"
                className="post-title-input"
                value={form.post.post_title}
                onChange={(e) => {
                    dispatch(actions.handlePost({
                        ...postDefaultValues, 
                        post_title: e.target.value
                    }))
                }}
                placeholder="Post Title" />

            <div className="post-title-functions">
                <input
                    type="button"
                    name="set_btn"
                    value="Set Tittle"
                    onClick={props.resetPostState} />

                <input
                    type="button"
                    name="cancel_btn"
                    value="Cancel"
                    onClick={() => {
                        dispatch(actions.handlePost({...postDefaultValues}))
                        dispatch(actions.setPostEdit(true))
                        props.setTitlePopUp(false)
                    }} />
            </div>
        </PostTitlePopUpComponentWrapper>
    )
}

const PostTitlePopUpComponentWrapper = styled.div``

const DeletePopUpComponent = (props) => {
    return (
        <DeletePopUpComponentWrapper>
            <p>Do you really want to delete all posts?</p>
            <div className="post-title-functions">
                <input
                    type="button"
                    name="set_btn"
                    value="Yes" />

                <input
                    type="button"
                    name="cancel_btn"
                    value="No, I misclicked" />
            </div>
        </DeletePopUpComponentWrapper>
    )
}

const DeletePopUpComponentWrapper = styled.div``

export {
    NewPostPopUpComponent,
    PostTitlePopUpComponent,
    DeletePopUpComponent,
    SectionTitlePopUpComponent
}