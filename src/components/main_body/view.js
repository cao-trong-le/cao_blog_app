/* eslint-disable */
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "redux_actions/appActions";
import axiosInstance from "axios_instance/axios_instance";
import { useHistory, useParams } from "react-router-dom";
import {DeleteButtonComponent, EditButtonComponent} from "./toolFunctions";

import DocViewer, {DocViewerRenderers, PDFRenderer, } from "react-doc-viewer";
// import { Document, Page } from 'react-pdf';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack'

import * as fHelper from "helpers/fileHelpers"

const PostViewComponent = (props) => {
    // create later
    // const post = props.post
    const [post, setPost] = useState(null)
    const [files, setFiles] = useState([])

    const app = useSelector((state) => state.app)
    const user = useSelector((state) => state.user)

    // pdf setting
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    useEffect(() => {
        const i = app.posts.findIndex((post) => post.post_code === props.match.params.post_code)
        setPost({...app.posts[i]})
        console.log(app.posts[i])
    }, [])

    return (
        <PostViewComponentWrapper className="post-view-component-wrapper">
            {post != null && 
            <React.Fragment>
                <PostViewHeader>
                    <div className="user-avatar-wrapper">
                        <img 
                            src={user.info.avatar} 
                            alt="user avatar" />
                    </div>
                    <p className="post-title">{post.post_author.username}</p>
                    <p className="post-date">
                        {(() => {
                            const post_date = new Date(post.post_date)
                            return post_date.toLocaleString()
                        })()}
                    </p>
                    <div className="">
                        {(() => {
                            if (user.info !== null) {
                                if (user.info.code === post.post_author.code) {
                                    return (
                                        <React.Fragment>
                                            <EditButtonComponent
                                                post={post} />
                                            <DeleteButtonComponent 
                                                user_code={user.info.code}
                                                post_codes={[post.post_code]} />
                                        </React.Fragment>
                                    )
                                }
                            } 
                        })()}
                    </div>
                </PostViewHeader>

                <PostHeading>
                    <div className="post-img-wrapper">
                        {post.post_image !== null && <img src={post.post_image.image_content} alt="post image" />}
                    </div>
                    <p>{post.post_title}</p>
                    <p>{post.post_summary}</p>
                    <p>----------------------------------------</p>
                </PostHeading>
                
                <PostSection>
                    {post.post_section.map((section, idx) => {
                        return (
                            <Section key={idx}>
                                <div className="section-images-wrapper">
                                    {section.section_image.map((image, idx) => {
                                        return <img 
                                            key={idx} 
                                            src={image.image_content} 
                                            alt="section image" />
                                    })}
                                </div>
                                <p>{section.section_title}</p>
                                <p>{section.section_content}</p>
                                
                                <div className="section-files-wrapper">
                                    {section.section_file.map((file, idx) => {
                                        if (fHelper.extractFileTypeFromAWSURL(file.file_content) !== "pdf") {
                                            const _file = [{uri: file.file_content}]

                                            return <DocViewer 
                                                pluginRenderers={DocViewerRenderers}
                                                documents={_file}
                                                style={{
                                                    width: "100%", 
                                                    height: 800
                                                }}
                                                theme={{
                                                    primary: "#5296d8",
                                                    secondary: "#ffffff",
                                                    tertiary: "#5296d899",
                                                    text_primary: "#ffffff",
                                                    text_secondary: "#5296d8",
                                                    text_tertiary: "#00000099",
                                                    disableThemeScrollbar: false,
                                                }}
                                                config={{
                                                    header: {
                                                        disableFileName: true,
                                                    }
                                                }} />
                                        }

                                        else {
                                            return (
                                                <iframe 
                                                    style={{
                                                        height: "800px",
                                                        width: "100%",
                                                    }}
                                                    src={file.file_content} />
                                            )
                                        }
                                    })}           
                                </div>
                            </Section>
                        )
                    })}
                </PostSection>
            </React.Fragment>}
        </PostViewComponentWrapper>
    )
}


const PostViewComponentWrapper = styled.div`
    height: fit-content;
    width: 100%;
    background-color: aquamarine;
`;

const PostHeading = styled.div``

const PostSection = styled.div``

const Section = styled.div``;

const PostViewHeader = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    background-color: bisque;

    div.user-avatar-wrapper {
        height: 50px;
        width: 50px;

        img {
            width: 100%;
            height: 100%;
        }
    }

    p {
        width: fit-content;
        border: 1px solid black;
    }
`;

export { PostViewComponent }