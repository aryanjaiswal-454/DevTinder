import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // --- STANDARD EMAIL LOGIN ---
  const handleLogin = async (e) => {
    e.preventDefault(); 
    try {
      setLoading(true);
      setError("");
      const res = await axios.post(
        BASE_URL + "/login",
        { emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      navigate("/");
    } catch (err) {
      setError(err.response?.data || "Invalid credentials. Please try again.");
      setTimeout(() => setError(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  // --- GOOGLE OAUTH LOGIN ---
  const handleGoogleLogin = () => {
    window.location.href = `${BASE_URL}/auth/google`;
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <div className="card bg-base-300 w-full max-w-md shadow-2xl border border-white/5">
        <div className="card-body p-8">
          
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold mb-2">Welcome to DevTinder</h2>
            <p className="text-gray-400 text-sm">Log in to your account</p>
          </div>

          {/* TRADITIONAL LOGIN FORM (Moved to Top) */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-medium text-gray-300">Email ID</span>
              </label>
              <input
                type="email"
                required
                placeholder="developer@code.com"
                maxLength={50}
                value={emailId}
                className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary/50 px-2"
                onChange={(e) => setEmailId(e.target.value)}
              />
            </div>
            
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-medium text-gray-300">Password</span>
              </label>
              <input
                type="password"
                required
                value={password}
                className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary/50 px-2"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Error Message Display */}
            <div className="min-h-[24px]">
              {error && <p className="text-error text-center text-sm font-medium animate-pulse">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`btn btn-primary w-full rounded-xl text-lg mt-2 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {loading ? <span className="loading loading-spinner loading-sm"></span> : "Login"}
            </button>
          </form>

          <div className="divider text-gray-500 text-xs font-semibold my-6 uppercase">
            OR
          </div>

          {/* GOOGLE LOGIN BUTTON (Moved to Bottom) */}
          <button 
            type="button"
            onClick={handleGoogleLogin} 
            className="btn btn-outline w-full hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-3 h-12 text-base rounded-xl"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default Login;