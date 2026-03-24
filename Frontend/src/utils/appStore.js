import {configureStore} from "@reduxjs/toolkit";
import useReducer from "./userSlice.js";
import feedReducer from "./feedSlice.js"
import connectionReducer from './connectionSlice.js'
import requestReducer from './requestSlice.js'
const appStore = configureStore({
    reducer: {
        user: useReducer,
        feed: feedReducer,
        connections: connectionReducer,
        requests: requestReducer,
    },
});

export default appStore;