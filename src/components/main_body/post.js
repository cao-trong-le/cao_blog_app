/* eslint-disable */
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "redux_actions/appActions";


const PostComponent = (props) => {
    // create later

    useEffect(() => {
        // console.log(props)
    }, [])

    const dateObj = new Date(props.post_date);

    const dispatch = useDispatch()
    const app = useSelector((state) => state.app)

    return (
        <PostComponentWrapper>
            <div className="select-box" hidden={app.selecting ? false : true}>
                <i 
                    class={(() => {
                        let selected_posts = [...app.post_selected]
                        let post_code = props.post_code
                        let idx = selected_posts.findIndex((post) => post === post_code)

                        if (idx === -1) {
                            return "fa fa-square-o"
                        } else {
                            return "fa fa-check-square-o"
                        }
                        
                    })()} 
                    onClick={(() => {
                        dispatch(actions.appendToSelectedList([props.post_code]))
                    })}
                    aria-hidden="true"></i>
            </div>

            <div className="post-image">

            </div>

            <div className="post-header">
                <p className="post-title">{props.post_title}</p>
                <p className="post-date">{dateObj.toLocaleDateString().toString()}</p>
                <div className="post-public"></div>
            </div>

            <div className="post-content">
                <div className="post-content-fucntions">
                    <div className="add-section-btn"></div>
                </div>

                <div className="content-wrapper">
                    <p className="content">
                        {props.post_summary}
                    </p>
                </div>
            </div>

            <div className="post-functions">
                <input type="button" value="Edit" />
                <input type="button" value="Delete" />
                <input type="button" value="View" />
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

    div.post-image {
        grid-area: post_image;
        height: 99%;
        width: 99%;
        background-color: blanchedalmond;
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
    }
`;




export { PostComponent }