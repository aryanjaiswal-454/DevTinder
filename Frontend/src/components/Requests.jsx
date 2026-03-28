/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addRequests } from "../utils/requestSlice";
import { removeRequest } from "../utils/requestSlice";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();

  const reviewRequest = async (status, _id) => {
    try {
      const res = axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        {
          withCredentials: true,
        },
      );
      dispatch(removeRequest(_id));
    } catch (err) {
      console.log(err);
    }
  };
  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });
      dispatch(addRequests(res?.data?.receivedRequests));
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return;
  if (requests.length === 0)
    return <h1 className="flex justify-center my-10">No requests found</h1>;
  return (
    <div className="text-center my-10">
      <h1 className="font-bold text-3xl mb-4">Connection Requests</h1>
      {requests.map((request) => {
        const { _id, firstName, lastName, age, gender, about, photoUrl } =
          request.fromUserId;
        return (
          <div key={_id} className="flex justify-center">
            <div className="flex items-center m-1 p-1 w-full max-w-xl bg-gray-800 rounded-xl shadow-md">
              <div className="flex-shrink-0">
                <img
                  alt="photo"
                  className="w-24 h-24 mx-1 my-1 rounded-xl object-cover border-2 border-gray-600"
                  src={photoUrl}
                />
              </div>

              <div className="ml-6 text-left">
                <h2 className="text-2xl font-bold text-white">
                  {firstName + " " + lastName}
                </h2>

                <h2 className="text-sm text-gray-300">
                  {age + " • " + gender}
                </h2>

                <h2 className="text-sm text-gray-400 mt-1 line-clamp-2">
                  {about}
                </h2>
              </div>
              <div className="flex flex-col items-end gap-2 ml-auto mr-2">
                <button
                  className="btn btn-sm btn-success bg-success w-20"
                  onClick={() => reviewRequest("accepted", request._id)}
                >
                  Accept
                </button>
                <button
                  className="btn btn-sm btn-error bg-error w-20"
                  onClick={() => reviewRequest("rejected", request._id)}
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Requests;
