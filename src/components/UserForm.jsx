import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "../services/firebase";
import { updateProfile } from "firebase/auth";
import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthProvider";
import InputField from "./InputField";
import Loader from "./Loader";
import { uploadImageToCloudinary } from "../services/cloudinary";
import PhotoName from "./PhotoName";

export default function UserForm() {
  const { currentUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: currentUser?.displayName,
    avatar: currentUser?.photoURL,
  });
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, avatar: e.target.files[0] });
  };

  const handleSaveSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLocalError(null);

    const user = auth.currentUser;

    if (!user) {
      setLocalError("No authenticated user found.");
      setLoading(false);
      return;
    }

    try {
      let avatarUrl = user?.photoURL;

      if (formData.avatar) {
        avatarUrl = await uploadImageToCloudinary(formData.avatar);
      }

      await updateProfile(user, {
        displayName: formData.username,
        photoURL: avatarUrl,
      });

      // Update posts authored by the user with new userPosted info
      const postsRef = collection(db, "posts");
      const q = query(postsRef, where("authorId", "==", user.uid));
      const querySnapshot = await getDocs(q);

      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data();
        if (data?.userPosted) {
          await updateDoc(docSnap.ref, {
            userPosted: {
              ...data.userPosted,
              displayName: formData.username,
              photoURL: avatarUrl,
            },
          });
        }
      }

      // Update the userPosted info inside the posts collection
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        displayName: formData.username,
        photoURL: avatarUrl,
      });

      window.location.reload();
    } catch (error) {
      console.error("Update error:", error.message);
      setLocalError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSaveSubmit}>
      <div className="w-full flex justify-center items-center">
        {formData.avatar ? (
          <img
            src={
              typeof formData.avatar === "string"
                ? formData.avatar
                : URL.createObjectURL(formData.avatar)
            }
            alt="UserPhoto"
            className="w-40 h-40 rounded-full object-cover border-1 border-gray-700"
          />
        ) : (
          <div className="w-40 h-40 flex justify-center items-center bg-gray-300 border-1 border-gray-700 text-gray-700 text-5xl rounded-full">
            <PhotoName />
          </div>
        )}
      </div>
      <InputField
        id="username"
        label="Username"
        value={formData.username}
        onChange={handleInputChange}
        required
        placeholder={currentUser?.displayName}
      />

      <InputField
        id="avatar"
        label="Profile Picture"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />

      <button
        type="submit"
        className="w-full flex justify-center items-center font-bold py-3 px-4 rounded-md mt-8 transition-colors duration-200 bg-blue-700 hover:bg-blue-500 text-blue-50">
        {loading ? <Loader /> : "Save"}
      </button>

      {localError && <p className="w-full text-red-500 mt-2">{localError}</p>}
    </form>
  );
}
