/* eslint-disable no-unused-vars */
/* eslint-disable */
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components"
import { useWindowDimensions } from "hooks";
import { useHistory } from "react-router-dom";

import axiosInstance from "axios_instance/axios_instance";
import * as userActions from "redux_actions/userActions";
import * as appActions from "redux_actions/appActions";
import * as formActions from "redux_actions/formActions";
import { postDefaultValues, sectionDefaultValues } from "components/forms/defaultValues";

import { NewPostPopUpComponent, PostTitlePopUpComponent } from "components/popups";

const actions = {
    ...userActions,
    ...appActions,
    ...formActions
}


import { useDispatch, useSelector } from "react-redux";

const HeaderComponent = (props) => {
    const [burger, setBurger] = useState(false)
    const { width } = useWindowDimensions()
    const [directionsList, setDirectionsList] = useState([])
    const [popUp, setPopUp] = useState(false)
    const [titlePopUp, setTitlePopUp] = useState(false)
    
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user)
    const form = useSelector((state) => state.form)
    const app = useSelector((state) => state.app)

    const history = useHistory()

    // useEffect(() => {
    //     if (!user.login) {
    //         history.push("/login/")
    //     }
    // }, [])

    let directions = [
        {
            title: "Home",
            name: "home",
            icon: <i className="fas fa-home"></i>,
            url: "/home/posts/"
        },
        {
            title: "New Post",
            name: "new_post",
            icon: <i className="far fa-edit"></i>,
            url: "/new/post/"
        },
        {
            title: "About Me",
            name: "about_me",
            icon: <i className="fas fa-user"></i>,
            url: "/about/"
        },
        {
            title: "Contact Me",
            name: "contact_me",
            icon: <i className="fas fa-mobile-alt"></i>,
            url: "/contact/"
        },
        {
            title: "Sign Up",
            name: "register",
            icon: <i className="fas fa-user-plus"></i>,
            url: "/register/"
        },
        {
            title: "Log In",
            name: "log_in",
            icon: <i className="fas fa-sign-in-alt"></i>,
            url: "/login/"
        },
        {
            title: "Log Out",
            name: "log_out",
            icon: <i className="fas fa-sign-out-alt"></i>,
            url: "/login/"
        },
    ]

    // useEffect(() => {
    //     console.log("user login status has changed")

    //     let hide_lists = null
    //     let copied = [...directions]

    //     if (user.login) 
    //         hide_lists = ["log_in", "register"]
    //     else 
    //         hide_lists = ["log_out", "about_me", "contact_me", "new_post"]

    //     for (let hide of hide_lists) {
    //         let find_item = (item) => item.name === hide
    //         let index = copied.findIndex(find_item)
    //         copied.splice(index, 1)
    //     }

    //     setDirectionsList(() => [...copied])

    // }, [user.login])

    const renderListItemsInMenu = () => {
        let hide_lists = null
        let copied = [...directions]

        if (user.login) 
            hide_lists = ["log_in", "register"]
        else 
            hide_lists = ["log_out", "about_me", "contact_me", "new_post"]

        for (let hide of hide_lists) {
            let find_item = (item) => item.name === hide
            let index = copied.findIndex(find_item)
            copied.splice(index, 1)
        }

        return copied.map((item, index) => {
            return (
                <div 
                    className="direct-link" 
                    onClick={(() => {
                        switch (item.name) {
                            case "home":
                                dispatch(actions.setHomePageReload(true))
                                history.push(item.url)
                                break

                            case "log_out":
                                dispatch(actions.logoutUser())
                                history.push(item.url)
                                break

                            case "log_in":
                                history.push(item.url)
                                break

                            case "new_post":
                                // make a pop up ask user for saving on-progressing post or not
                                // check recent state before asking

                                if (!form.post.post_finished && form.post.post_finished !== undefined) {
                                    setPopUp(true)
                                }
                                    
                                else {
                                    dispatch(actions.handlePost({...postDefaultValues}))
                                    setTitlePopUp(true)
                                }
                                    
                               
                                // if not: reset post state 
                                // if do: save old state and bring user to new state
                                break
                            
                            default:
                                history.push(item.url)
                        }
                    })}>

                    <DirectWrapper className="direct-wrapper" key={index}>
                        {(() => {
                            if (item.name === "about_me")
                                return <i 
                                    style={{
                                        height: "35px",
                                        width: "35px",
                                        backgroundImage: `url("${(() => {
                                            if (user.info !== null)
                                                return user.info.avatar
                                            else
                                                return "https://cao-blog-bucket.s3.us-east-2.amazonaws.com/default_files/default.png"
                                        })()}")`,
                                        backgroundRepeat: "no-repeat",
                                        backgroundPosition: "center",
                                        backgroundSize: "100% 100%",
                                        backgroundColor: "black",
                                        borderRadius: "50%",
                                    }}/>
                            else 
                                return item.icon
                        })()}
                        <p>{item.title}</p>
                    </DirectWrapper>
                </div>
            )
        })
    }

    const renderDesktopNav = () => {
        return (
            <DesktopNavSection>
                {renderListItemsInMenu()}
            </DesktopNavSection>
        )
    }

    const resetPostState = (e) => {
        dispatch(actions.handleSection({...sectionDefaultValues}))
        dispatch(actions.setSectionEdit(false, -1))
        dispatch(actions.setDefaultProgressingSection())
        dispatch(actions.setOnProgress("post", true))
        dispatch(actions.setOnProgress("heading", true))
        dispatch(actions.setOnProgress("section", false))
        dispatch(actions.resetSelectedList())
        setTitlePopUp(false)

        // send a request to create a new post from post title
        const formData = new FormData()
        formData.append("event", "create_new_post")
        formData.append("user_code", user.info.code)
        formData.append("post_title", form.post.post_title)
        axiosInstance.post("blog/posts/", formData)
        .then((res) => {
            // if (res.data.)
            console.log(res)
            if (res.status === 201) {
                const post = res.data.post
                dispatch(actions.addPost({...post}))
                dispatch(actions.handlePost({...form.post, ...post}))
                dispatch(actions.setPostEdit(true))
                history.push("/new/post/")
            }
        })
        .catch((err) => {console.log(err)})
    }

    return (
        <HeaderWrapper login={user.login}>
            {titlePopUp && <PostTitlePopUpComponent
                resetPostState={resetPostState}
                setTitlePopUp={setTitlePopUp} />}
            
            {popUp && <NewPostPopUpComponent
                setPopUp={setPopUp}
                setTitlePopUp={setTitlePopUp} />}

            <LogoSection login={user.login}>
                <div className="logo"></div>
            </LogoSection>
            {(() => {
                return (
                    <React.Fragment>
                        {(width > 600) && renderDesktopNav()}

                        {(() => {
                            if (width > 600) {
                                return renderDesktopNav()
                            } 
                            
                            else if (width < 600 && burger) {
                                return renderDesktopNav()
                            } 
                        })()}

                        {(width < 600) && <MobileNavSection>
                            <i  
                                className={`${burger ? "fas fa-times" : "fas fa-bars"} burger-icon-wapper`}
                                onClick={() => {
                                    setBurger(!burger)
                                }} />

                        </MobileNavSection>}
                    </React.Fragment>
                )
            })()}
        </HeaderWrapper>
    )
}

export { HeaderComponent }

const NewPostTitlePopup = styled.div``;

const NewPostPopUpWrapper = styled.div`
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0px;
    left: 0px;
    background-color: rgba(0, 0, 0, 0.1);
    padding-top: 200px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-content: center;
    z-index: 1;

    div.new-post-popup {
        height: 350px;
        width: 350px;
        background-color: khaki;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-content: center;
    }
`;

const HeaderWrapper = styled.div`
    display: grid;
    height: auto;
    min-height: 80px;
    width: 100%;
    grid-template-columns: "5% 15% 75% 5%";
    grid-template-rows: auto;
    grid-template-areas: ". logo desktop_nav .";
    grid-auto-flow: row;
    background-color: white;
    /* justify-content: center;
    align-content: center; */
    /* position: relative; */

    @media only screen and (max-width: 600px) {
        grid-template-columns: "85% 15%";
        grid-template-rows: "minmax(0, 1fr) minmax(0, auto)"; 
        grid-template-areas: "logo mobile_nav" "desktop_nav desktop_nav";
    }
`;

const LogoSection = styled.div`
    grid-area: logo;
    height: 80px;
    width: 100%;
    display: flex;
    padding: 5px;
    justify-content: "flex-start";
    
    div.logo {
        width: 100px;
        height: 100%;
        background-color: red;
    }
`;

const DesktopNavSection = styled.div`
    grid-area: desktop_nav;
    display: flex;
    height: 100px;
    width: 100%;
    background-color: honeydew;
    align-items: center;
    justify-content: right;
    margin-bottom: 10px;

    a.direct-link {
        text-decoration: none;
    }

    div.direct-wrapper {
        width:  40px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 2px solid black;
        margin: 10px;
        border-radius: 50%;
        pointer-events: none;

        @media only screen and (max-width: 600px) {
            margin: 0;
            width: 200px;
            margin-top: 5px;
            margin-right: 2px;
            border-radius: 5px;
            padding: 5px;
        }

        a {
            width: auto;
            display: flex;
            justify-content: center;
            align-items: center;
            text-decoration: none;

            &:hover {
                position: relative;
            }

            &:hover > p {
                position: absolute;
                top: 40px;
                right: -1px;
                width: 95px;
                display: flex;
                justify-content: flex-end;
                align-items: center;
                padding: 5px;
                border: 1px solid black;
                border-radius: 5px;
            }

            @media only screen and (max-width: 600px) {
                &:hover > p {
                    position: initial;
                    width: 100px;
                    display: initial;
                    padding: 0px;
                    border: none;
                    border-radius: 0px;
                }
            }

            i {
                width: 35px;
                height: 35px;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 15pt;

                @media only screen and (max-width: 600px) {
                    margin-right: 10px;
                    width: 35px;
                }
            }

            p {
                width: auto;
                display: none;

                @media only screen and (max-width: 600px) {
                    width: 100px;
                    display: initial;
                }
            }
        }
    }
    
    @media only screen and (max-width: 600px) {
        flex-direction: column;
        height: auto;
        justify-content: center;
        align-items: flex-end;
    }
`;

const MobileNavSection = styled.div`
    grid-area: mobile_nav;
    height: auto;
    width: 100%;
    background-color: blue;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-right: 5px;

    .burger-icon-wapper {
        height: 45px;
        width: 45px;
        border-radius: 5px;
        border: none;
        background-color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16pt;
        border: 2px solid black;
        border-radius: 5px;
    }
`;



// const NavigatorWrapper = styled.div`
//     display: flex;
//     flex-direction: row;
//     border: 2px solid black;
//     /* display: none; */
//     /* visibility: hidden;
//     max-height: 0; */
//     width: 100%;

//     @media only screen and (max-width: 768px) {
//         flex-direction: column;
//         width: ${props => (props.burger && props.windowWidth <= 768) ? "300px" : "0"};
//         height: ${props => (props.burger && props.windowWidth <= 768) ? "auto" : "0"};
//         visibility: ${props => (props.burger && props.windowWidth <= 768) ? "visible" : "hidden"};
//     }
// `;

const DirectWrapper = styled.div`
    width: 100px;
`


