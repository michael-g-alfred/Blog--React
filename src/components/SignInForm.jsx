import { useContext, useState } from "react";
import InputField from "../components/InputField";
import { AuthContext } from "../context/AuthProvider";
import Loader from "../components/Loader";
import { useNavigate } from "react-router";

const validateLoginForm = (formData) => {
  if (!formData.email || !formData.password) {
    return "Email and password are required.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    return "Please enter a valid email address.";
  }

  return null;
};

export default function SignInForm() {
  const { signin } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });

  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLocalError("");

    const errorMessage = validateLoginForm(formData);
    if (errorMessage) {
      setLocalError(errorMessage);
      setLoading(false);
      return;
    }

    try {
      await signin(formData.email, formData.password);
      navigate("/");
    } catch (error) {
      setLocalError(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLoginSubmit}>
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
      />

      <button
        type="submit"
        className={`w-full font-bold py-3 px-4 rounded-md mt-8 transition-colors duration-200 ${
          loading
            ? "bg-green-400 cursor-not-allowed"
            : "bg-green-700 hover:bg-green-500 text-green-50"
        }`}>
        {loading ? <Loader /> : "Login"}
      </button>

      {localError && <p className="w-full text-red-500 mt-2">{localError}</p>}
    </form>
  );
}
