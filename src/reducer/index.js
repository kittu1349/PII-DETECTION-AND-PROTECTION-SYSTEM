// import { combineReducers } from "@reduxjs/toolkit";
// import authReducer from "../slices/authSlice";
// import profileReducer from "../slices/profileSlice";
// import adminReducer from "../slices/adminSlice";
// const rootReducer = combineReducers({
//     auth: authReducer,
//     profile: profileReducer,
//     admin: adminReducer,
// })

// export default rootReducer;

// reducers/index.js

import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import profileReducer from "../slices/profileSlice";
import adminReducer from "../slices/adminSlice";

const rootReducer = combineReducers({
    auth: authReducer,
    profile: profileReducer,
    admin: adminReducer,
});

export default rootReducer;
