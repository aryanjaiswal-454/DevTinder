const UserCard = ({ user }) => {
  if (!user) return null;

  const { firstName, lastName, photoUrl, age, gender, about } = user;

  return (
    <div className="w-80 bg-gray-900 text-white shadow-lg shadow-green-500/10 rounded-xl overflow-hidden mx-auto border border-gray-700">
      
      {/* Image (Fixed rectangular) */}
      <div className="w-full h-60">
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
          <button className="flex-1 py-2 rounded-lg border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition">
            Ignore
          </button>
          <button className="flex-1 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition">
            Interested
          </button>
        </div>

      </div>
    </div>
  );
};

export default UserCard