import { useState, useContext } from "react";
import InputField from "../components/InputField";
import Loader from "../components/Loader";
import FormLayout from "../layout/FormLayout";
import TrashIcon from "../icons/TrashIcon";
import CloseIcon from "../icons/CloseIcon";
import { uploadImageToCloudinary } from "../services/cloudinary";

export default function PostForm({ onClose, onAddPost }) {
  const [newPost, setNewPost] = useState({
    title: "",
    details: "",
    files: [],
  });
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (field, value) => {
    setNewPost((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    if (!imageFiles.length) return;
    setError(null);

    setIsUploading(true);
    try {
      const uploadedFiles = await Promise.all(
        imageFiles.map(async (file) => {
          const url = await uploadImageToCloudinary(file);
          return {
            name: file.name,
            url,
          };
        })
      );

      setNewPost((prev) => ({
        ...prev,
        files: [...prev.files, ...uploadedFiles],
      }));
    } catch (uploadError) {
      console.error("Error uploading files:", uploadError);
      setError("Failed to upload files. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (index) => {
    setNewPost((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  };

  return (
    <FormLayout>
      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="p-2 text-red-700 hover:bg-red-500 hover:text-red-50 font-bold rounded-full focus:outline-none"
          aria-label="Close form">
          <CloseIcon />
        </button>
      </div>
      <InputField
        id="title"
        label="Title"
        value={newPost.title}
        onChange={(e) => handleInputChange("title", e.target.value)}
      />

      <InputField
        id="details"
        label="Details"
        value={newPost.details}
        onChange={(e) => handleInputChange("details", e.target.value)}
        type="textarea"
      />
      <div className="flex justify-between text-sm text-gray-700">
        <span>Minimum 100 characters required</span>
        <span className={newPost.details.length < 100 ? "text-red-600" : ""}>
          {newPost.details.length}/100
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <InputField
          id="files"
          label="Attach Images"
          type="file"
          onChange={handleFileUpload}
          accept="image/*"
        />

        {(newPost.files?.length > 0 || isUploading) && (
          <div className="flex flex-col gap-1 border-2 border-gray-900 p-2 rounded-lg">
            {isUploading && (
              <div className="w-full flex justify-center items-center text-blue-700 text-sm font-medium">
                <Loader />
              </div>
            )}
            {newPost.files.map((file) => (
              <div
                key={file.name}
                className="w-full px-3 py-2 border-2 border-dashed border-gray-700 text-gray-900 rounded-md flex justify-between items-center">
                <div className="text-sm text-gray-700 overflow-hidden overflow-ellipsis whitespace-nowrap max-w-xs">
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline">
                    {file.name}
                  </a>
                </div>
                <button
                  onClick={() => removeFile(newPost.files.indexOf(file))}
                  className="text-red-600 hover:text-red-500 text-md">
                  <TrashIcon />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && <div className="text-red-600 text-sm mb-2">{error}</div>}

      <div className="flex gap-2">
        <button
          onClick={() => onAddPost(newPost)}
          disabled={
            !newPost.title ||
            newPost.details.length < 100 ||
            newPost.files.length === 0
          }
          type="submit"
          className="flex-1 font-bold bg-blue-700 text-blue-50 py-3 px-4 rounded-md hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed  transition-colors duration-200 cursor-pointer">
          Post
        </button>
      </div>
    </FormLayout>
  );
}
