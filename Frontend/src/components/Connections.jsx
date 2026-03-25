import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connections);
  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res?.data?.data));
    } catch (err) {
      console.log(err.message);
    }
  };
  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return;
  if (connections.length === 0) return <h1 className="flex justify-center my-10">No connections found</h1>;
  return (
    <div className="text-center my-10">
      <h1 className="font-bold text-3xl mb-4">Connections</h1>
      {connections.map((connection) => {
        const { _id, firstName, lastName, age, gender, about, photoUrl } =
          connection;
        return (
          <div key={_id} className="flex justify-center">
            <div className="flex items-center m-1 p-1 w-full max-w-lg bg-gray-800 rounded-xl shadow-md">
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
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Connections;
