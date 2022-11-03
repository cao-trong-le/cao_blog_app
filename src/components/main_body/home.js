/* eslint-disable no-unused-vars */
/* eslint-disable */
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useHistory, useParams } from "react-router-dom";
import styled from "styled-components";
import { PostComponent } from "./post";
import { ToolBarComponent } from "./toolBar";
import axiosInstance from "axios_instance/axios_instance";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "redux_actions/appActions";
import { PostViewComponent } from "./view";
import moment from "moment";
import { fetchPosts } from "./helper";


const HomeComponent = (props) => {
    const [paginatedPosts, setPaginatedPosts] = useState([])
    const [posts, setPosts] = useState([])
    const [makeJump, setMakeJump] = useState("")
    const [page, setPage] = useState(1)
    const [numPages, setNumPages] = useState([])

    const [date, setDate] = useState("")
    const [month, setMonth] = useState("")
    const [year, setYear] = useState("")
    const [query, setQuery] = useState("")

    const dispatch = useDispatch()

    const history = useHistory()
    const params = useParams()
    const user = useSelector((state) => state.user)
    const app = useSelector((state) => state.app)

    
    useEffect(() => {
        if (app.homepage_reload === undefined)
            dispatch(actions.setHomePageReload(true))
        
        if (app.homepage_reload !== undefined && app.homepage_reload) {
            if (user.info !== null) {
                fetchPosts(
                    user.info.code, 
                    query, 
                    date, 
                    month, 
                    year, 
                    1, 
                    false
                )
            } else {
                fetchPosts(
                    "", 
                    query, 
                    date, 
                    month, 
                    year, 
                    1, 
                    false
                )
            }

            
            dispatch(actions.setHomePageReload(false))
        }
            
    }, [app.homepage_reload])



    
    const windowEvent = () => {
        window.addEventListener("hashchange", (e) => {
            console.log("say hello")
        })
    }

    // pagination
    const pagination = (posts, num_each_page) => {
        // each page has 5 items
        // get numbers of pages

        var numPages = posts.length / num_each_page

        // console.log(numPages)

        if (!Number.isInteger(numPages)) 
            numPages = Math.floor(numPages) + 1

        const listNums = Array.from({length: numPages}, (_, i) => i + 1)
        setNumPages([...listNums])

        console.log(numPages)

        if (listNums.length !== 0)
            setPage(listNums[0])
        else
            setPage(0)

        // set paginated posts
        const nested = []

        for (var i = 0; i < numPages; i++) {
            const start = num_each_page * i
            const end = num_each_page * i + num_each_page

            const postEachPage = posts.slice(start, end)
            nested.push(postEachPage)
            setPaginatedPosts([...nested])
        }

        setPosts(nested[0])
    }

    // filtering items 
    // const filteredItems = useMemo(() => {
    //     var check = []

    //     const posts = app.posts.filter((post) => {
    //         if (date !== "" && date.length == 2) 
    //             check.push(moment(post.post_date).format("DD") === date)
    
    //         if (month !== "" && month.length == 2)
    //             check.push(moment(post.post_date).format("MM") === month)

    //         if (year !== "" && year.length == 4)
    //             check.push(moment(post.post_date).format("YYYY") === year)
            
    //         if (post.post_title.toLowerCase().includes(query.toLowerCase()))
    //             check.push(post.post_title.toLowerCase().includes(query.toLowerCase()))

    //         return (post.post_title.toLowerCase().includes(query.toLowerCase()) && check.every((value) => value))
    //     })

    //     return posts

    // }, [app.posts, date, month, year, query]) 

    const moveToPage = (value) => {
        fetchPosts(user.info.code, query, date, month, year, value, true)
        dispatch(actions.setPage(parseInt(value)))
    }
        
    return (
        <HomeComponentWrapper>
            {windowEvent()}
            <DirectorySection />
            <ToolBarComponent 
                query={query} 
                setQuery={setQuery}
                date={date}
                setDate={setDate}
                month={month}
                setMonth={setMonth}
                year={year}
                setYear={setYear}
                page={page} />
            {/* get all posts from the account */}
            <PostsWrapper>
                {(() => {
                    if (app.posts !== undefined) {
                        return app.posts.map((post) => {
                            return (
                                <PostComponent post={post} />
                            )
                        })
                    }
                })()}
            </PostsWrapper>

            <PaginationSection>
                <select 
                    name="page" 
                    value={app.page}
                    onChange={(e) => {
                        moveToPage(e.target.value)
                    }}>
                    {app.num_pages !== undefined && 
                    app.num_pages.map((page, idx) => {
                        return (
                            <option key={idx}>{page}</option>
                        )
                    })}

                </select>
                <p>{app.page}/{app.num_pages !== undefined && app.num_pages.length}</p>
                <div>
                    <input 
                        type="button" 
                        value="Go"
                        onClick={() => {
                            if (makeJump < numPages.slice(-1)) {
                                moveToPage(makeJump)
                            }
                                
                        }} />
                    <input 
                        type="text" 
                        value={makeJump}
                        onChange={(e) => {
                            setMakeJump(e.target.value)
                        }}
                        onKeyUp={(e) => {
                            if (e.key === "Enter") {
                                if (parseInt(e.target.value) <= app.num_pages.length) {
                                    moveToPage(e.target.value)
                                }   
                            }
                        }}
                        placeholder="Make a jump..." />
                </div>
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

    /* post wrapper - fading effect */
    .post-wrapper.fading-effect {
        opacity: 0;
    }
`;



export { HomeComponent }