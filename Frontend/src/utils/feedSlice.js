/* eslint-disable no-unused-vars */
import {createSlice} from "@reduxjs/toolkit";

const feedSlice = createSlice({
    name:"feed",
    initialState: null,
    reducers: {
        addFeed: (state,action)=> action.payload,
        removeUserFromFeed: (state,action)=>{
            if (!state) return state;
            const newFeed = state.filter((user)=>user._id!==action.payload);
            return newFeed
        },
        removeFeed: () => null,
    },
})
 
export const {addFeed,removeUserFromFeed,removeFeed} = feedSlice.actions;
export default feedSlice.reducer;