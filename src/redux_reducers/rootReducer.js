import { combineReducers } from 'redux';
import { userReducer } from './user';
import { formReducer } from './form';
import { appReducer } from './app';



const rootReducer = combineReducers({
    user: userReducer,
    form: formReducer,
    app: appReducer
});

export default rootReducer;