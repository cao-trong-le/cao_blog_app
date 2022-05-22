/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { PostComponent } from "./post";

const HomeComponent = (props) => {
    // create later

    return (
        <HomeComponentWrapper>
            <DirectorySection></DirectorySection>
            <PostComponent />
        </HomeComponentWrapper>
    )
}

const DirectorySection = styled.div`

`;

const HomeComponentWrapper = styled.div`
    height: auto;
    width: 100%;
    border: 1px solid black;
`;



export { HomeComponent }