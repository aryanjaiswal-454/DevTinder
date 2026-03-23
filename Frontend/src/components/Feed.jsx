import axios from "axios";
import {BASE_URL} from "../utils/constants.js";
import {useDispatch, useSelector} from "react-redux";
import {addFeed} from "../utils/feedSlice.js"
import {useEffect} from "react"

const Feed = ()=>{
    const feed = useSelector((store)=>store.feed);
    const dispatch = useDispatch();
    const getFeed = async()=>{
        if(feed) return;
        try{
            const res = await axios.get(BASE_URL+"/feed", {withCredentials:true});
        dispatch(addFeed(res.data))
        }
        catch(err){
            // TODO : Handle error
            console.log(err)
        }
    }
    useEffect(()=>{
        getFeed();
    },[])
    return (
        <div>Feed</div>
    )
}
export default Feed;