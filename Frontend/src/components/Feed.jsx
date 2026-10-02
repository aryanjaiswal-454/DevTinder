import axios from "axios";
import { BASE_URL } from "../utils/constants.js";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice.js";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import UserCard from "./UserCard.jsx";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const user = useSelector((store) => store.user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const getFeed = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res?.data));
    } catch (err) {
      if (err?.response?.status === 401) {
        navigate("/login");
      } else {
        setError("Unable to load developers. Please try again.");
        console.error("Unable to load the developer feed:", err);
      }
    } finally {
      setLoading(false);
    }
  }, [dispatch, navigate]);

  useEffect(() => {
    if (user && feed === null) {
      getFeed();
    } else if (user && feed) {
      setLoading(false);
    } else if (!user) {
      setLoading(false);
    }
  }, [feed, getFeed, user]);

  if (loading) return <h1 className="text-center mt-10 text-2xl">Loading...</h1>;
  if (error)
    return (
      <div className="text-center mt-10">
        <p role="alert">{error}</p>
        <button className="btn btn-primary mt-4" onClick={getFeed}>
          Retry
        </button>
      </div>
    );
  if (!feed) return null;

  if (feed.length === 0)
    return <h1 className="flex justify-center my-10 text-2xl">No new users found</h1>;

  return (
    <div className="flex justify-center my-10">
      <UserCard user={feed[0]} />
    </div>
  );
};

export default Feed;