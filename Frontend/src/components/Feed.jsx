import axios from "axios";
import { BASE_URL } from "../utils/constants.js";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice.js";
import { useEffect } from "react";
import UserCard from "./UserCard.jsx";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const getFeed = async () => {
    if (feed) return;
    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res?.data));
    } catch (err) {
      // TODO : Handle error
      console.log(err);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);
  if (!feed) return <h1>Loading...</h1>;

  if (feed.length === 0) return <h1>No users found</h1>;

  return (
    <div className="flex justify-center my-10">
      {feed.map((user) => (
        <UserCard user={user} />
      ))}
    </div>
  );
};
export default Feed;
