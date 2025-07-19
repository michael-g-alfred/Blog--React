import React, { useState, useContext } from "react";
import InputField from "../components/InputField";
import { AuthContext } from "../context/AuthProvider";
import Loader from "../components/Loader";
import { useNavigate } from "react-router";
import { uploadImageToCloudinary } from "../services/cloudinary";

export default function SignUpForm() {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    avatar: null,
  });

  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));

  const handleImageChange = (e) => {
    setFormData((prev) => ({ ...prev, avatar: e.target.files[0] }));
  };

  const validateForm = (formData) => {
    if (!formData.username || !formData.email || !formData.password) {
      return "Please fill in all fields.";
    }
    if (formData.password.length < 6) {
      return "Password must be at least 6 characters long.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return "Please enter a valid email address.";
    }
    return null;
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLocalError("");

    const errorMessage = validateForm(formData);
    if (errorMessage) {
      setLocalError(errorMessage);
      setLoading(false);
      return;
    }

    try {
      let avatarUrl = null;
      if (formData.avatar) {
        avatarUrl = await uploadImageToCloudinary(formData.avatar);
      }

      await signup(
        formData.email,
        formData.password,
        formData.username,
        avatarUrl
      );
      navigate("/");
    } catch (error) {
      setLocalError(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegisterSubmit}>
      <InputField
        id="username"
        label="Username"
        value={formData.username}
        onChange={handleChange}
        required
      />
      <InputField
        id="email"
        label="Email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <InputField
        id="password"
        label="Password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        required
        minLength={6}
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
        {loading ? <Loader /> : "Register"}
      </button>

      {localError && <p className="w-full text-red-500 mt-2">{localError}</p>}
    </form>
  );
}
