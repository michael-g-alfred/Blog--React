import { NavLink, Link } from "react-router-dom";
import PhotoName from "./PhotoName";

export default function CreatePostTrigger({ onClick, currentUser }) {
  return (
    <div className="w-full max-w-3xl mx-auto flex gap-1 rounded-xl p-4 shadow-sm bg-blue-50">
      <NavLink to={`/profile/${currentUser?.uid}`}>
        {currentUser.photoURL ? (
          <img
            src={currentUser.photoURL}
            alt="UserPhoto"
            className="min-w-12 h-12 rounded-full object-cover border-1 border-gray-700 cursor-pointer"
          />
        ) : (
          <div className="min-w-12 h-12 flex justify-center items-center bg-gray-300 border-1 border-gray-700 text-gray-700 text-sm rounded-full cursor-pointer">
            <PhotoName />
          </div>
        )}
      </NavLink>
      <button
        onClick={onClick}
        className="w-full flex items-center gap-2 px-3 md:px-4 py-3 md:py-3 bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm md:text-base rounded-full cursor-pointer>
        ">
        {`What's on your mind, ${currentUser?.displayName || "user"}?`}
      </button>
    </div>
  );
}
