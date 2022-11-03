/* eslint-disable */
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "redux_actions/appActions";
import axiosInstance from "axios_instance/axios_instance";
import { useHistory } from "react-router-dom";
import { deleteManyPosts, deleteAllPosts } from "./helper";
import { DeleteButtonComponent, EditButtonComponent, ViewButtonComponent } from "./toolFunctions";

const PostComponent = (props) => {
    // create later
    const post = props.post

    useEffect(() => {
        console.log(post)
    }, [])

    const history = useHistory()

    const dateObj = new Date(post.post_date)

    const dispatch = useDispatch()
    const user = useSelector((state) => state.user)
    const app = useSelector((state) => state.app)

    return (
        <PostComponentWrapper className={`post-wrapper post-${post.post_code}`}>
            <div className="select-box" hidden={app.selecting ? false : true}>
                <i 
                    class={(() => {
                        let selected_codes = [...app.post_selected]
                        let post_code = post.post_code
                        let idx = selected_codes.findIndex((code) => code === post_code)

                        if (idx === -1) {
                            return "check-box-btn fa fa-square-o"
                        } else {
                            return "check-box-btn fa fa-check-square-o"
                        }
                        
                    })()} 
                    onClick={(() => {
                        dispatch(actions.appendToSelectedList([post.post_code]))
                    })}
                    aria-hidden="true"></i>
            </div>

            <div className="post-image">
                {post.post_image !== null && <img src={post.post_image.image_content} alt="" />}
            </div>

            <div className="post-header">
                <p className="post-title">{post.post_title}</p>
                <p className="post-date">{dateObj.toLocaleDateString().toString()}</p>
                <div className="post-public"></div>
            </div>

            <div className="post-content">
                <div className="post-content-fucntions">
                    <div className="add-section-btn"></div>
                </div>

                <div className="content-wrapper">
                    <p className="content">
                        {post.post_summary}
                    </p>
                </div>
            </div>

            <div className="post-functions">
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
                
                <ViewButtonComponent
                    view_url={`/home/posts/${post.post_code}/`} />
            </div>
        </PostComponentWrapper>
    )
}


const PostComponentWrapper = styled.div`
    display: grid;
    height: 150px;
    width: 99%;
    border: 1px solid black;
    margin-top: 10px;
    position: relative;
    grid-template-columns: 30% 70%;
    grid-template-rows: 20% 60% 20%;
    grid-template-areas: 
        "post_image post_header"
        "post_image post_content"
        "post_image post_functions";
    opacity: 1;
    transition: opacity 1s ease-out;

    div.post-image {
        grid-area: post_image;
        height: 99%;
        width: 99%;
        background-color: blanchedalmond;

        img {
            height: 100%;
            width: 100%;
        }
    }

    div.post-header {
        grid-area: post_header;
        height: 100%;
        width: 100%;
        background-color: burlywood;
        display: flex;
        flex-direction: row;
    }

    div.post-content {
        grid-area: post_content;
        height: 100%;
        width: 100%;
        background-color: bisque;
        display: flex;
        flex-direction: row;
    }

    div.post-functions {
        grid-area: post_functions;
        height: 100%;
        width: 100%;
        background-color: chartreuse;
        display: flex;
        flex-direction: row;
        justify-content: right;
        align-items: center;
        padding: 1px;

        input[type="button"] {
            height: 85%;
            width: 60px;
            margin-left: 5px;
            border: none;
            outline: none;
        }
    }

    div.select-box {
        position: absolute;
        top: 0px;
        z-index: 1;
        background-color: white;
    }

    div.fading-effect {
        display: none;
        height: 400px;
    }
`;




export { PostComponent }