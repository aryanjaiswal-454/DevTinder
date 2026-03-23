import {configureStore} from "@reduxjs/toolkit";
import useReducer from "./userSlice";
import feedReducer from "./feedSlice.js"
const appStore = configureStore({
    reducer: {
        user: useReducer,
        feed: feedReducer,
    },
});

export default appStore;