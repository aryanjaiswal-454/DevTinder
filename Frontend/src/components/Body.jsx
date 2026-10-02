import { useEffect, useState } from 'react'
import NavBar from "./NavBar.jsx"
import Footer from "./Footer.jsx"
import { useLocation, useNavigate, Outlet } from 'react-router-dom'
import { BASE_URL } from '../utils/constants.js';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addUser, removeUser } from "../utils/userSlice.js"

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userData = useSelector((store)=>store.user);
  const [authAttempt, setAuthAttempt] = useState(0);
  const [failedAuthAttempt, setFailedAuthAttempt] = useState(null);
  const isPublicRoute = ["/login", "/signup"].includes(location.pathname);

  useEffect(() => {
    if (userData || isPublicRoute) return;
    let isCurrent = true;
    const controller = new AbortController();

    axios.get(BASE_URL + "/profile/view", {
      withCredentials: true,
      signal: controller.signal,
    })
      .then((res) => {
        if (isCurrent) {
          dispatch(addUser(res.data));
        }
      })
      .catch((err) => {
        if (!isCurrent || axios.isCancel(err)) return;
        if (err.response?.status === 401) {
          dispatch(removeUser());
          navigate("/login", { replace: true });
          return;
        }
        console.error("Unable to verify the current session:", err);
        setFailedAuthAttempt(authAttempt);
      });

    return () => {
      isCurrent = false;
      controller.abort();
    };
  }, [authAttempt, dispatch, isPublicRoute, location.pathname, navigate, userData]);

  const retryAuthCheck = () => {
    setAuthAttempt((attempt) => attempt + 1);
  };

  const authCheckFailed = failedAuthAttempt === authAttempt;

  return (
    <div>
      <NavBar />
      {isPublicRoute ? (
        <Outlet />
      ) : userData ? (
        <Outlet />
      ) : authCheckFailed ? (
        <div className="text-center mt-10">
          <p role="alert">We could not connect to the server. Please try again.</p>
          <button className="btn btn-primary mt-4" onClick={retryAuthCheck}>
            Retry
          </button>
        </div>
      ) : (
        <p className="text-center mt-10 text-2xl" role="status">Checking your session...</p>
      )}
      <Footer />
    </div>
  )
}

export default Body