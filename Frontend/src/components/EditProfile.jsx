/* eslint-disable no-unused-vars */
import { useState } from "react";
import { BASE_URL } from "../utils/constants";
import UserCard from "./UserCard.jsx";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const [skills, setSkills] = useState(user.skills || []);
  const [skillInput, setSkillInput] = useState("");
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const dispatch = useDispatch();
  const saveProfile = async () => {
    setError("");
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        {
          firstName,
          lastName,
          age,
          gender,
          about,
          photoUrl,
          skills,
        },
        {
          withCredentials: true,
        },
      );
      dispatch(addUser(res?.data?.data));
      setShowToast(true);
      const i = setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (err) {
      setError(err.response?.data || err.message);
    }
  };

  const handleAddSkill = () => {
    if (!skillInput.trim()) return;

    if (skills.length >= 10) return; // limit

    if (skills.includes(skillInput.trim().toLowerCase())) return; // no duplicates

    setSkills([...skills, skillInput.trim().toLowerCase()]);
    setSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };
  return (
    <>
      <div className="min-h-screen flex justify-center items-center px-6 py-10 bg-base-200 mb-20">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-16">
          <div className="flex justify-center">
            <div className="card bg-base-300 w-96 shadow-sm mb-20">
              <div className="card-body ">
                <h2 className="card-title text-3xl font-semibold justify-center">
                  Edit Profile
                </h2>
                <div>
                  <fieldset className="fieldset my-3">
                    <legend className="fieldset-legend my-1 font-normal text-base">
                      First Name*
                    </legend>
                    <input
                      type="text"
                      value={firstName}
                      className="input input-bord ered w-full px-3"
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </fieldset>
                  <fieldset className="fieldset my-3">
                    <legend className="fieldset-legend my-1 font-normal text-base">
                      Last Name*
                    </legend>
                    <input
                      type="text"
                      value={lastName}
                      className="input input-bordered w-full px-3"
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </fieldset>
                  <fieldset className="fieldset my-3">
                    <legend className="fieldset-legend my-1 font-normal text-base">
                      Age
                    </legend>
                    <input
                      type="number" min="0" max="100" 
                      value={age}
                      className="input input-bordered w-full px-3"
                      onChange={(e) => setAge(e.target.value)}
                    />
                  </fieldset>
                  <fieldset className="fieldset my-3">
                    <legend className="fieldset-legend my-1 font-normal text-base">
                      Gender*
                    </legend>

                    <select
                      value={gender || ""}
                      onChange={(e) => setGender(e.target.value)}
                      className="select select-bordered w-full  pl-3"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </fieldset>
                  <fieldset className="fieldset my-3">
                    <legend className="fieldset-legend my-1 font-normal text-base">
                      Skills
                    </legend>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={skillInput}
                        placeholder="Enter a skill (e.g. React)"
                        className="input input-bordered w-full px-3"
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddSkill();
                          }
                        }}
                      />
                      <button
                        type="button"
                        className="px-3 rounded-lg bg-green-500 text-white hover:bg-green-600"
                        onClick={handleAddSkill}
                      >
                        Add
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {skills.map((skill, index) => (
                        <span
                          key={index}
                          className="flex items-center gap-1 px-3 py-1 text-xs rounded-full 
        bg-gray-800 text-green-400 border border-green-500/30"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="text-red-400 hover:text-red-600 ml-1"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>

                    {skills.length >= 10 && (
                      <p className="text-xs text-red-400 mt-1">
                        Maximum 10 skills allowed
                      </p>
                    )}
                  </fieldset>
                  <fieldset className="fieldset my-3">
                    <legend className="fieldset-legend my-1 font-normal text-base">
                      About
                    </legend>
                    <input
                      type="text"
                      value={about}
                      className="input input-bordered w-full px-3"
                      onChange={(e) => setAbout(e.target.value)}
                    />
                  </fieldset>
                  <fieldset className="fieldset my-3">
                    <legend className="fieldset-legend my-1 font-normal text-base">
                      Photo URL
                    </legend>
                    <input
                      type="text"
                      value={photoUrl}
                      className="input input-bordered w-full px-3"
                      onChange={(e) => setPhotoUrl(e.target.value)}
                    />
                  </fieldset>
                </div>
                <p className="text-red-500 text-center">{error}</p>
                <div className="card-actions justify-center py-3">
                  <button
                    className="px-4 py-2 rounded-lg bg-blue-500 text-white shadow-md shadow-blue-500/40 hover:bg-blue-600 transition"
                    onClick={saveProfile}
                  >
                    Save Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <UserCard
              user={{
                _id: user._id,
                firstName,
                lastName,
                age,
                gender,
                about,
                photoUrl,
                skills,
              }}
            />
          </div>
        </div>
      </div>
      {showToast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>Profile updated successfully.</span>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;
