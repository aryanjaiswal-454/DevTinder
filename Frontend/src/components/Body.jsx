import React, { useEffect } from 'react'
import NavBar from "./NavBar.jsx"
import Footer from "./Footer.jsx"
import { useNavigate, Outlet } from 'react-router-dom'
import { BASE_URL } from '../utils/constants.js';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from "../utils/userSlice.js"

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((store)=>store.user);
  const fetchUser = async () => {
    if(userData) return;
    try {
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      })
      dispatch(addUser(res.data));
    }
    catch (err) {
      if(err.response?.status===401) navigate("/login");
      console.log(err);
    }

  }
  useEffect(() => {
    if(!userData)
      fetchUser();
  }, [])
  return (
    <div>
      <NavBar />
      <Outlet />
      <Footer />
    </div>
  )
}

export default Body