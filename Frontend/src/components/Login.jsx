import { useState, useEffect } from "react";
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
  const [isLoginForm, setIsLoginForm] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);

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
  const sendOtp = async () => {
    try {
      setLoading(true);
      setOtp("");
      if (!emailId || !firstName || !lastName || !password) {
        setLoading(false);
        return setError("All fields are required");
      }

      await axios.post(BASE_URL + "/send-otp", {
        emailId,
        firstName,
        lastName,
        password,
      });

      setStep(2);
      setMessage("OTP sent to your email");
      setError("");
    } catch (err) {
      setError(err?.response?.data || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };
  const verifyOtp = async () => {
    if (!otp || otp.length < 6) {
      return setError("Please enter valid OTP");
    }
    try {
      setLoading(true);
      if (otp === "") throw new Error("OTP is required!");
      const res = await axios.post(
        BASE_URL + "/verify-otp",
        {
          emailId,
          password,
          firstName,
          lastName,
          otp,
        },
        { withCredentials: true },
      );

      dispatch(addUser(res?.data?.data));
      setMessage("");
      navigate("/profile");
    } catch (err) {
      setError(err?.response?.data || "Invalid OTP");
      setMessage("");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (step === 2 && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [step, timer]);
  return (
    <div className="flex justify-center my-10 pb-10">
      <div className="card bg-base-300 w-96 shadow-sm ">
        <div className="card-body pt-3 pb-3">
          <h2 className="card-title text-3xl font-semibold justify-center">
            {isLoginForm ? "Login" : "SignUp"}
          </h2>
          <div>
            {!isLoginForm && (
              <>
                <fieldset className="fieldset my-3">
                  <legend className="fieldset-legend my-1 font-normal text-base">
                    First Name
                  </legend>
                  <input
                    type="text" required
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
                    type="text" required
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
                type="email" required
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
                type="password" required
                value={password}
                className="input input-bordered w-full px-3"
                onChange={(e) => setPassword(e.target.value)}
              />
            </fieldset>
            {!isLoginForm && step === 2 && (
              <fieldset className="fieldset my-3 py-3">
                <legend className="fieldset-legend">Enter OTP</legend>
                <input
                  type="text"
                  autoFocus
                  maxLength="6"
                  value={otp}
                  className="input input-bordered w-full px-3"
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setError("")
                    setMessage("")
                    setOtp(value);
                  }}
                />
              </fieldset>
            )}
            {!isLoginForm &&
              step === 2 &&
              (timer > 0 ? (
                <p className="text-gray-400 text-sm text-center">
                  Resend OTP in {timer}s
                </p>
              ) : (
                <p
                  className="text-blue-500 text-sm cursor-pointer text-center"
                  onClick={() => {
                    sendOtp();
                    setTimer(30);
                  }}
                >
                  Resend OTP
                </p>
              ))}
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
          {!error && message && (
            <p className="text-green-500 text-center">{message}</p>
          )}
          <div className="card-actions justify-center py-3">
            <button
              disabled={loading}
              className={`px-4 py-2 rounded-lg text-white shadow-md transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 cursor-pointer"
              }`}
              onClick={
                isLoginForm ? handleLogin : step === 1 ? sendOtp : verifyOtp
              }
            >
              {loading
                ? "Please wait..."
                : isLoginForm
                  ? "Login"
                  : step === 1
                    ? "Send OTP"
                    : "Verify & Signup"}
            </button>
          </div>
          <p
            className="m-auto cursor-pointer text-sm text-center"
            onClick={() => {
              setIsLoginForm(!isLoginForm);
              setError("");
              setMessage("");
              setStep(1);
            }}
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
