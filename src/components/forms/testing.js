// {/* <div className="form-field section_content">
//                     <legend className="section_content">
//                         <p>Section Content</p>
//                     </legend>
                
//                     <div 
//                         style={{
//                             height: "100px",
//                             width: "100%",
//                             border: "1px solid black",
//                         }}
//                         ref={sectionContentRef}
//                         className="section-content"
//                         onClick={() => {hiddenTextBoxRef.current.focus()}} >
//                         <p  
//                             style={{
//                                 whiteSpace: "normal",
//                                 border: "1px solid black",
//                                 padding: "3px",
//                                 display: "inline-block",
//                                 height: "100%",
//                                 width: "100%",
//                             }}
//                             ref={pSectionContentRef}
//                             onMouseUp={selectTextOnMouseUp}>
//                                 {/* {(() => {
//                                     return Parser(hiddenTextBox)
//                                 })()} */}
//                                 {/* {[hiddenTextBox]} */}
//                                 {hiddenTextBox}
//                             </p>
//                     </div>

//                     <textarea 
//                         ref={hiddenTextBoxRef}
//                         style={{
//                             opacity: "0",
//                             height: "0px",
//                             padding: "0px",
//                             margin: "0px",
//                         }}
//                         type="text"
//                         name="post_hidden"
//                         id="post_hidden"
//                         value={hiddenTextBox}
//                         onChange={(e) => {
//                             setHiddenTextBox(e.target.value)
//                         }} />

//                 </div> */}

// const boldText = () => {
    //     console.log(selectedText)
    //     let {head, selected_text, tail} = separateSelectedPart(selectedText)
    //     let HTMLhead = `<span>${head}</span>`
    //     let HTMLtail = `<span>${tail}</span>`
    //     let HTMLselectedtext = `<span style="font-weight: bold;">${selected_text}</span>`
    //     let HTMLtemplate = HTMLhead + HTMLselectedtext + HTMLtail
    //     let converted_HTML_temlate = Parser(HTMLtemplate)
    //     console.log(converted_HTML_temlate)
    //     setHiddenTextBox(HTMLtemplate)
    //     ReactDOM.createRoot(pSectionContentRef.current).render(converted_HTML_temlate)
    // }

    // const sectionFunctions = [
    //     {
    //         name: "font_size",
    //         display: "Font Size",
    //         icon: null, 
    //         function: null
    //     },
    //     {
    //         name: "font_family",
    //         display: "Font Family",
    //         icon: <i class="far fa-font"></i>, 
    //         function: null
    //     },
    //     {
    //         name: "font_color",
    //         display: "Font Color",
    //         icon: <i class="far fa-paint-brush"></i>, 
    //         function: null
    //     },
    //     {
    //         name: "full_screen",
    //         display: "Full Screen",
    //         icon: <i class="fas fa-expand"></i>, 
    //         function: fullSize
    //     },
    //     {
    //         name: "minimize_screen",
    //         display: "Minimize Screen",
    //         icon: <i class="fas fa-compress"></i>, 
    //         function: compressSize
    //     },
    // ]

    // useEffect(() => {


    //     setFormValues(intialValues)
    //     // setFormErrors({})
    // }, [])

    

    // const renderSectionFunctions = () => {
    //     return sectionFunctions.map((func, index) => {
    //         return (
    //             <div 
    //                 className={func.name} 
    //                 onClick={func.function}
    //                 key={index}>
    //                 {func.icon}
    //                 <p>{func.display}</p>
    //             </div>
    //         )
    //     })
    // }

    // const separateSelectedPart = (text) => {
    //     let origin_text = hiddenTextBox
    //     let selected_text = text

    //     // find location of substring
    //     let start = origin_text.indexOf(text)
    //     let end = start + text.length

    //     let head = origin_text.slice(0, start)
    //     let tail = origin_text.slice(end)

    //     return {head, selected_text, tail}
    // }

    // const selectTextOnMouseUp = () => {
    //     const text = window.getSelection().toString()

    //     if (text.length !== 0) {
    //         setSelectedText(text)
    //         highlightSelectedText(text)
    //     }
    // }

    // text functions


    // const highlightSelectedText = (text) => {
    //     let {head, selected_text, tail} = separateSelectedPart(text)
    //     let HTMLselectedtext = `<span style="background-color: yellow;">${selected_text}</span>`
    //     let HTMLtemplate = head + HTMLselectedtext + tail
    //     let converted_HTML_temlate = Parser(HTMLtemplate)
    //     console.log(converted_HTML_temlate)
    //     setHiddenTextBox(HTMLtemplate)
    //     // setFormValues({...formValues, section_content: HTMLtemplate})
    //     // ReactDOM.createRoot(pSectionContentRef.current).render(converted_HTML_temlate)
    // }

// const fullSize = () => {
    //     const sectionContent = sectionFormRef.current.querySelector("div.section_content")
    //     let style = sectionContent.style
    //     style.position = "fixed"
    //     style.top = "0px"
    //     style.left = "0px"
    //     style.width = "100%"
    //     style.height = "100vh"
    //     style.padding = "10px"
    //     style.backgroundColor = "white"
    // }

    // const compressSize = () => {
    //     const sectionContent = sectionFormRef.current.querySelector("div.section_content")
    //     sectionContent.style.position = "initial"
    // }