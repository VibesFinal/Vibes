import { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

export default function ProfileUpload({ userId, onUpload }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // Cleanup preview URL on unmount or when preview changes
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleUpload = async () => {
    if (!file) return alert("Please choose an image first");

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      try {
        // Send the full base64 string WITH the data URI prefix
        // If your backend strips it, you can keep your original code
        const fileData = reader.result; // Full: data:image/jpeg;base64,xxxxx
        // OR just the base64 part:
        // const fileData = reader.result.split(",")[1];

        const res = await axiosInstance.post(`/profile/profile-pic/${userId}`, {
          fileName: file.name,
          fileData: fileData,
        });

        alert("Profile picture uploaded successfully!");

        if (onUpload) onUpload(res.data.profile_pic);
        
        // Cleanup
        if (preview) URL.revokeObjectURL(preview);
        setFile(null);
        setPreview(null);
      } catch (error) {
        console.error("Upload failed", error);
        alert("Failed to upload image");
      }
    };

    reader.onerror = () => {
      alert("Failed to read file");
    };
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    
    if (!selectedFile) return;

    // Revoke old preview URL before creating new one
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 space-y-4">
      {/* Optional preview */}
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="w-24 h-24 rounded-full object-cover border border-gray-300"
        />
      )}

      <div className="flex items-center gap-3">
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <label
          htmlFor="fileInput"
          className="cursor-pointer px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow-md transition duration-200"
        >
          Choose File
        </label>

        <button
          onClick={handleUpload}
          disabled={!file}
          className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg shadow-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Upload
        </button>
      </div>
    </div>
  );
}