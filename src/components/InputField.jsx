import React, { useState } from "react";
import EyeOffIcon from "../icons/EyeOffIcon";
import EyeIcon from "../icons/EyeIcon";

export default function InputField({
  id,
  label,
  type = "text",
  value,
  onChange,
  multiple,
  accept,
  placeholder,
}) {
  const [showPassword, setShowPassword] = useState(false);

  let inputElement;
  switch (type) {
    case "textarea":
      inputElement = (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full h-32 px-3 py-2 border-2 border-blue-700 text-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-[-5px]"
        />
      );
      break;
    case "file":
      inputElement = (
        <input
          type="file"
          id={id}
          onChange={onChange}
          multiple={multiple}
          accept={accept}
          placeholder={placeholder}
          className="w-full px-3 py-2 border-2 border-blue-700 text-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-700/10 border-dashed cursor-pointer"
        />
      );
      break;
    case "password":
      inputElement = (
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full px-3 py-2 border-2 border-blue-700 text-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-700">
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
      );
      break;
    default:
      inputElement = (
        <input
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-3 py-2 border-2 border-blue-700 text-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      );
  }

  return (
    <div className="flex flex-col gap-1 mb-4">
      <label htmlFor={id} className="block text-md font-bold text-blue-700">
        {label}
      </label>
      {inputElement}
    </div>
  );
}
