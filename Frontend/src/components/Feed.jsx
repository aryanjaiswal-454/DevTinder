import axios from "axios";
import { BASE_URL } from "../utils/constants.js";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice.js";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import UserCard from "./UserCard.jsx";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const getFeed = async () => {
    if (feed) {
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res?.data));
    } catch (err) {
      // TODO : Handle error

      console.log(err);
      if (err?.response?.status === 401) {
        navigate("/login");
      }
    } finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);
  if (loading) return <h1 className="text-center mt-10">Loading...</h1>;
  if (!feed) return null;

  if (feed.length === 0)
    return <h1 className="flex justify-center my-10">No new users found</h1>;

  return (
    <div className="flex justify-center my-10">
      <UserCard user={feed[0]} />
    </div>
  );
};
export default Feed;
