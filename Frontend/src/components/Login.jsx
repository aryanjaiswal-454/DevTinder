import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        {
          emailId,
          password,
        },
        {
          withCredentials: true,
        },
      );
      dispatch(addUser(res.data));
      return navigate("/");
    } catch (err) {
      setError(err.response?.data || "Something went wrong");
    }
  };
  return (
    <div className="flex justify-center my-10">
      <div className="card bg-base-300 w-96 shadow-sm">
        <div className="card-body pt-3 pb-3">
          <h2 className="card-title text-3xl font-semibold justify-center">
            {isLoginForm ? "Login" : "Signup"}
          </h2>
          <div>
            {isLoginForm && (
              <>
                <fieldset className="fieldset my-3">
                  <legend className="fieldset-legend my-1 font-normal text-base">
                    First Name
                  </legend>
                  <input
                    type="text"
                    value={firstName}
                    className="input input-bordered w-full px-3"
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </fieldset>
                <fieldset className="fieldset my-3">
                  <legend className="fieldset-legend my-1 font-normal text-base">
                    Last Name
                  </legend>
                  <input
                    type="text"
                    value={lastName}
                    className="input input-bordered w-full px-3"
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </fieldset>
              </>
            )}
            <fieldset className="fieldset my-3">
              <legend className="fieldset-legend my-1 font-normal text-base">
                Email ID
              </legend>
              <input
                type="email"
                value={emailId}
                className="input input-bordered w-full px-3"
                onChange={(e) => setEmailId(e.target.value)}
              />
            </fieldset>
            <fieldset className="fieldset ">
              <legend className="fieldset-legend my-1 font-normal text-base">
                Password
              </legend>
              <input
                type="text"
                value={password}
                className="input input-bordered w-full px-3"
                onChange={(e) => setPassword(e.target.value)}
              />
            </fieldset>
          </div>
          <p className="text-red-500 text-center">{error}</p>
          <div className="card-actions justify-center py-3">
            <button
              className="px-4 py-2 rounded-lg bg-blue-500 text-white shadow-md shadow-blue-500/40 hover:bg-blue-600 transition"
              onClick={handleLogin}
            >
              {isLoginForm ? "Login" : "Signup"}
            </button>
          </div>

          <p
            className="m-auto cursor-pointer text-sm text-center"
            onClick={() => setIsLoginForm(!isLoginForm)}
          >
            {isLoginForm ? (
              <>
                New User?{" "}
                <span className="underline font-medium hover:text-blue-500">
                  SignUp
                </span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span className="underline font-medium hover:text-blue-500">
                  Login
                </span>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
