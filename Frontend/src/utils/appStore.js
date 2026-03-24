import {configureStore} from "@reduxjs/toolkit";
import useReducer from "./userSlice.js";
import feedReducer from "./feedSlice.js"
import connectionReducer from './connectionSlice.js'
const appStore = configureStore({
    reducer: {
        user: useReducer,
        feed: feedReducer,
        connections: connectionReducer,
    },
});

export default appStore;