/* eslint-disable no-unused-vars */
/* eslint-disable */
import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { PostComponent } from "./post";
import { ToolBarComponent } from "./toolBar";
import axiosInstance from "axios_instance/axios_instance";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "redux_actions/appActions"

const HomeComponent = (props) => {
    const [posts, setPosts] = useState([]);

    const dispatch = useDispatch()


    const history = useHistory()
    const user = useSelector((state) => state.user)
    const app = useSelector((state) => state.app)

    // send request to server to get posts
    useEffect(() => {
        // dispatch(handlePost({...intialValues}))
        if (!user.login) {
            history.push("/login/")
        } else {
            handleGetAll()
        } 
    }, [])

    // get all posts
    const handleGetAll = () => {
        // extract user data 
        // console.log(user.info.code)
        // console.log(`blog/posts/all/${user.info.code}/`)

        let data = new FormData()
        // filter data

        data.append("event", "get_user_posts")
        data.append("code", user.info.code)
        data.append("page_number", 1)

        axiosInstance
        .post(`blog/posts/`, data)
        .then((res) => {
            dispatch(actions.setPosts([...res.data.data.posts]))
        })
        .catch((err) => {
            console.log(err)
        })
    }

    return (
        <HomeComponentWrapper>
            <DirectorySection />
            <ToolBarComponent />
            {/* get all posts from the account */}
            <PostsWrapper>
                {(() => {
                    if (app.posts !== undefined) {
                        return app.posts.map((post) => {
                            return (
                                <PostComponent 
                                    post_code={post.post_code}
                                    post_image={post.post_image}
                                    post_date={post.post_date}
                                    post_title={post.post_title}
                                    post_summary={post.post_summary}>
                                </PostComponent>
                            )
                        })
                    }
                })()}
            </PostsWrapper>

            <PaginationSection>

            </PaginationSection>

        </HomeComponentWrapper>
    )
}

const DirectorySection = styled.div`

`;

const PostsWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const PaginationSection = styled.div``;

const HomeComponentWrapper = styled.div`
    height: auto;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    /* border: 1px solid black; */
`;



export { HomeComponent }