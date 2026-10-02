import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants.js";
import { addUser } from "../utils/userSlice.js";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignup = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        BASE_URL + "/signup",
        { firstName, lastName, emailId, password },
        { withCredentials: true },
      );
      dispatch(addUser(response.data));
      navigate("/profile", { replace: true });
    } catch (err) {
      const message = err.response?.data;
      setError(
        typeof message === "string"
          ? message.replace(/^ERROR:\s*/i, "")
          : "Unable to create your account. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 py-8">
      <div className="card bg-base-300 w-full max-w-md shadow-2xl border border-white/5">
        <div className="card-body p-8">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold mb-2">Create your account</h1>
            <p className="text-gray-400 text-sm">
              Join DevTinder and connect with developers.
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <label className="form-control">
              <span className="label-text font-medium mb-2">First name</span>
              <input
                type="text"
                autoComplete="given-name"
                required
                maxLength={20}
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                className="input input-bordered w-full"
              />
            </label>
            <label className="form-control">
              <span className="label-text font-medium mb-2">Last name</span>
              <input
                type="text"
                autoComplete="family-name"
                required
                maxLength={20}
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                className="input input-bordered w-full"
              />
            </label>
            <label className="form-control">
              <span className="label-text font-medium mb-2">Email address</span>
              <input
                type="email"
                autoComplete="email"
                required
                maxLength={50}
                value={emailId}
                onChange={(event) => setEmailId(event.target.value)}
                className="input input-bordered w-full"
              />
            </label>
            <label className="form-control">
              <span className="label-text font-medium mb-2">Password</span>
              <input
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="input input-bordered w-full"
              />
              <span className="text-xs text-gray-500 mt-2">
                Use at least 8 characters, including uppercase, lowercase,
                number, and symbol.
              </span>
            </label>

            {error && (
              <p className="text-error text-center text-sm" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full rounded-xl text-lg mt-2"
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <p className="text-center text-sm mt-2">
            Already have an account?{" "}
            <Link className="link link-primary" to="/login">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
