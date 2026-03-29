/* eslint-disable no-unused-vars */
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice.js";
import { removeFeed } from "../utils/feedSlice";
const NavBar = () => {
  const user = useSelector((store) => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogoClick = (e) => {
    if (!user) {
      e.preventDefault(); // Stop the link from going to "/"
      navigate("/login");
    }
  };
  const handleLogout = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/logout",
        {},
        {
          withCredentials: true,
        },
      );
      dispatch(removeUser());
      dispatch(removeFeed());
      alert("You have been logged out");
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div
      onClick={handleLogoClick}
      style={{ backgroundColor: "#161921" }}
      className="navbar shadow-md border-b border-white/10 flex justify-between items-center"
    >
      <Link
        to="/"
        style={{ backgroundColor: "#161921" }}
        className="btn btn-ghost text-xl border-none hover:border-none hover:bg-error/10 outline-none focus:outline-none ring-0 focus:ring-0"
      >
        <img src="/DevTinderLogo.png" alt="logo" className="h-10 w-auto mr-4" />{" "}
        DevTinder
      </Link>
      <div className="flex items-center gap-4">
        {user && (
          <>
            <p className="my-2 mx-0">Welcome, {user.firstName}</p>
            <div className="dropdown dropdown-end mx-2 ">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src={user.photoUrl}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-300  rounded-2xl z-[1] mt-3 w-52 p-2 shadow-xl border border-white/10"
              >
                <li>
                  <Link
                    to="/profile"
                    className="rounded-lg hover:bg-error/10 transition-all duration-200 px-3 py-2"
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to="/connections"
                    className="rounded-lg hover:bg-error/10 transition-all duration-200 px-3 py-2"
                  >
                    Connections
                  </Link>
                </li>
                <li>
                  <Link
                    to="/requests"
                    className="rounded-lg hover:bg-error/10 transition-all duration-200 px-3 py-2"
                  >
                    Requests
                  </Link>
                </li>
                <li>
                  <a
                    onClick={handleLogout}
                    className="rounded-lg text-error hover:bg-error/10 transition-all duration-200 px-3 py-2"
                  >
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NavBar;
