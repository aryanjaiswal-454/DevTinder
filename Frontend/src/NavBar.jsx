import React from 'react'
import { useSelector } from 'react-redux';
const NavBar = () => {
    const user = useSelector(store => store.user);
    console.log(user);
    return (
        <div className="navbar bg-base-300 shadow-sm">
            <div className="flex-1">
                <a className="btn btn-ghost text-xl">DevTinder 👨‍💻</a>
            </div>
            <div className="flex items-center gap-4">
                {user && (
                    <>
                        <p className="my-2 mx-4">Welcome, {user.firstName}</p>
                        <div className="dropdown dropdown-end mx-2 ">

                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full">
                                    <img
                                        alt="Tailwind CSS Navbar component"
                                        src={user.photoUrl} />
                                </div>
                            </div>
                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content bg-base-200/95 backdrop-blur-md rounded-2xl z-[1] mt-3 w-52 p-2 shadow-xl border border-white/10"
                            >
                                <li>
                                    <a className="justify-between rounded-lg hover:bg-base-300 transition-all duration-200 px-3 py-2">
                                        Profile
                                        <span className="badge badge-primary badge-sm">New</span>
                                    </a>
                                </li>

                                <li>
                                    <a className="rounded-lg hover:bg-base-300 transition-all duration-200 px-3 py-2">
                                        Settings
                                    </a>
                                </li>

                                <li>
                                    <a className="rounded-lg text-error hover:bg-error/10 transition-all duration-200 px-3 py-2">
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
}

export default NavBar