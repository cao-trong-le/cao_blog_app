/* eslint-disable no-unused-vars */
/* eslint-disable */
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components"
import { useWindowDimensions } from "hooks";
import { useHistory } from "react-router-dom";

import * as userActions from "redux_actions/userActions";
import { useDispatch, useSelector } from "react-redux";

const HeaderComponent = (props) => {
    const [burger, setBurger] = useState(false)
    const { width } = useWindowDimensions()
    const [directionsList, setDirectionsList] = useState([])
    
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user)

    const history = useHistory()

    useEffect(() => {
        if (!user.login) {
            history.push("/login/")
        }
    }, [])

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

    useEffect(() => {
        let hide_lists = null
        let copied = [...directions]

        if (user.login) 
            hide_lists = ["log_in", "register"]
        else 
            hide_lists = ["log_out", "about_me", "home", "contact_me", "log_in"]

        for (let hide of hide_lists) {
            let find_item = (item) => item.name === hide
            let index = copied.findIndex(find_item)
            copied.splice(index, 1)
        }

        setDirectionsList(() => [...copied])

    }, [user.login])

    const renderListItemsInMenu = () => {
        return directionsList.map((item, index) => {
            return (
                <Link 
                    className="direct-link" 
                    onClick={(() => {
                        if (item.name === "log_out") 
                            dispatch(userActions.logoutUser())
                        if (item.name === "log_in") 
                            dispatch(userActions.loginUser())
                    })}
                    to={item.url}>
                    <DirectWrapper className="direct-wrapper" key={index}>
                        <Link to={item.url}>
                            {(() => {
                                if (item.name === "about_me")
                                    return <i 
                                        style={{
                                            height: "35px",
                                            width: "35px",
                                            backgroundImage: `url("${user.info.avatar}")`,
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
                        </Link>
                    </DirectWrapper>
                </Link>
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

    return (
        <HeaderWrapper login={user.login}>
            <LogoSection login={user.login}>
                <div className="logo"></div>
            </LogoSection>
            {(() => {
                if (user.login) {
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
                                
                                // else if (width < 768 && !burger) {
                                //     return <React.Fragment></React.Fragment>
                                // }
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
                }
            })()}
        </HeaderWrapper>
    )
}

export { HeaderComponent }


const HeaderWrapper = styled.div`
    display: grid;
    height: auto;
    min-height: 80px;
    width: 100%;
    grid-template-columns: ${props => (props.login) ? "15% 85%" : "100%"};
    grid-template-rows: auto;
    grid-template-areas: ${props => (props.login) ? '"logo desktop_nav"' : '"logo"'};
    grid-auto-flow: row;
    background-color: white;
    justify-content: center;
    align-content: center;

    @media only screen and (max-width: 600px) {
        grid-template-columns: ${
            props => (props.login) 
                ? "85% 15%" 
                : "100%"
            };
        grid-template-rows: ${
            props => (props.login) 
                ? "minmax(0, 1fr) minmax(0, auto)" 
                : "minmax(0, 1fr)"
            };
        grid-template-areas: ${
            props => (props.login) 
                ? '"logo mobile_nav" "desktop_nav desktop_nav"' 
                : '"logo"'
            };
    }
`;

const LogoSection = styled.div`
    grid-area: logo;
    height: 80px;
    width: 100%;
    display: flex;
    justify-content: ${props => (props.login) ? "flex-start" : "center"};
    
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
    background-color: white;
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
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;

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


