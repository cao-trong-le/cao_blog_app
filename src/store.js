import {createStore, compose, applyMiddleware} from "redux";
import { rootReducer } from "redux_reducers";
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import logger from "redux-logger";

const initialState = {};

const middleware = [logger, thunk]

const persistConfig = {
    key: 'root',
    storage
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
    persistedReducer,
    initialState,
    compose (
        applyMiddleware(...middleware),
    )
);

const persistor = persistStore(store);

export {  store,  persistor };