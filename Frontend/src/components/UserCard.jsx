/* eslint-disable no-unused-vars */
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user }) => {
  // if (!user) return null;
  const { _id, firstName, lastName, photoUrl, age, gender, about } = user;
  const dispatch = useDispatch();
  const handleSendRequest = async (status, userId) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true },
      );
      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      console.log(err.message);
    }
  };
  return (
    <div className="w-80 bg-gray-900 text-white shadow-lg shadow-green-500/10 rounded-xl overflow-hidden mx-auto border border-black-800 mx-3">
      {/* Image (Fixed rectangular) */}
      <div className="w-full h-80">
        {" "}
        <img
          src={photoUrl}
          alt="profile"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        {/* Name */}
        <h2 className="text-lg font-semibold">
          {firstName} {lastName}
        </h2>

        {/* Age + Gender */}
        {age && gender && (
          <p className="text-xs text-gray-400">
            {age} • {gender}
          </p>
        )}

        {/* About */}
        <p className="text-sm text-gray-500 line-clamp-2">
          {about || "No bio available"}
        </p>

        {/* Buttons */}
        <div className="flex gap-2 mt-3">
          <button
            className="flex-1 py-2 rounded-lg border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
            onClick={() => handleSendRequest("ignored", _id)}
          >
            Ignore
          </button>
          <button
            className="flex-1 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition"
            onClick={() => handleSendRequest("interested", _id)}
          >
            Interested
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
