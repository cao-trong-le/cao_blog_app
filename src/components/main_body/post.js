/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";


const PostComponent = (props) => {
    // create later

    const dateObj = new Date();

    return (
        <PostComponentWrapper>
            <div className="post-header">
                <p className="post-title">Django Setup</p>
                <p className="post-date">{dateObj.toLocaleDateString().toString()}</p>
                <div className="post-public">

                </div>
            </div>
            <div className="post-content">
                <div className="post-content-fucntions">
                    <div className="add-section-btn"></div>
                </div>
                <div className="content-wrapper">
                    <p className="content">
                        Lorem Ipsum refers to a dummy block of text that is often used in publishing and graphic design to fill gaps in the page before the actual words are put into the finished product. Lorem ipsum resembles Latin but has no real meaning.

                        Insert Dummy Text in Microsoft Word
                        If you are working inside Microsoft Word and need some filler text to test the layout of fonts and other design elements of your document, there’s no need to hunt for an online generator as you can create “Lorem Ipsum” inside Word itself. Here’s how:

                        Just start a new paragraph in Word, type \=lorem() and hit Enter.

                        lorem ipsum in word

                        This will fill three paragraphs of Lorem Ipsum characters in the document but if you also control the amount of text that is generated through the above function as shown below:

                        \=lorem(Number of Paragraphs, Number of Lines)

                        For instance, =lorem(2,5) will create 2 paragraphs of Lorem Ipsum text and it will span across 5 lines (or sentences). The parameters are optional. If you omit the parameters the default number of paragraphs is three, and the default number of lines per paragraph is also three.



                        The lorem() function is available in Word 2007 but if you are using a previous version of Office, you may use the good old rand() function to insert any amount of random text in your Word Document.

                        If the lorem() generator is not working on your copy of Word, you probably have turned off the “Replace text as you type” option available under AutoCorrect.
                    </p>
                </div>
            </div>
        </PostComponentWrapper>
    )
}


const PostComponentWrapper = styled.div`
    height: auto;
    width: 100%;
    border: 1px solid black;
`;



export { PostComponent }