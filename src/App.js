/* eslint-disable no-unused-vars */
// import react functions
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { BrowserRouter as Router, Switch, Route, Redirect, matchPath } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import * as userActions from "redux_actions/userActions";
import { useSelector } from "react-redux";

// import components
import { 
  HomeComponent,
  HeaderComponent,
  PostFormComponent,
  LoginFormComponent,
  RegisterFormComponent,
  CreatePostComponent
} from "./components";


const App = (props) => {
  const user = useSelector((state) => state.user)

  const router = () => {
    return (
      <AnimatePresence>
        <Switch>
          {/* How to set default index page */}
          <Route
            exact
            path="/"
            render={() => {
              return <Redirect to="/home/posts/" />
            }}
          />
          <Route exact path="/home/posts/" component={HomeComponent} />
          <Route exact path="/new/post/" component={CreatePostComponent} />
          <Route exact path="/register/" component={RegisterFormComponent} />
          <Route exact path="/login/" component={LoginFormComponent} />
        </Switch>
      </AnimatePresence>
    )
  }

  return (
    <AppComponent className="App">
      <HeaderComponent/>
      <MainBodyComponent className="main-body">
        {router()}
      </MainBodyComponent>
      <footer></footer>
    </AppComponent>
  );
}

const AppComponent = styled.div`
  width: 75%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;

  @media only screen and (max-width: 768px) {
      width: 100%;
  }

  @media only screen and (max-width: 600px) {
      width: 100%;
  }
`;

const MainBodyComponent = styled.div`
  width: 80%;
  display: flex;
  justify-content: center;
  align-items: center;

  @media only screen and (max-width: 600px) {
      width: 100%;
  }
`;

export default App;
