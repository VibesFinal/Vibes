import { useState } from "react";
import axiosInstance from "../api/axiosInstance";

export default function ProfileUpload({ userId , onUpload }){

    const [file , setFile] = useState(null);
    

    const handleUpload = async () => {

        if(!file) return;

        const formData = new FormData();

        formData.append("profile_pic" , file);

        try {
            
            const res = await axiosInstance.post(`/profile/profile-pic/${userId}` , formData, {

                headers: {"Content-Type" : "multipart/form-data"},

            }); 

            alert("profile picture uploaded");

            if (onUpload) onUpload(res.data.profile_pic); // instant update profile picture without refresh
            setFile(null);

        } catch (error) {
            
            console.error("upload failed" , error);
            

        }

    }

    return (
        <div className="flex items-center justify-center py-10">
            <div className="flex items-center gap-3">
            {/* Hidden native file input */}
            <input
                id="fileInput"
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
            />

            {/* Custom button (label for file input) */}
            <label
                htmlFor="fileInput"
                className="cursor-pointer px-5 py-2 bg-blue-500 hover:bg-blue-600
                        text-white font-medium rounded-lg shadow-md 
                        transition duration-200"
            >
                Choose File
            </label>

            {/* Upload button */}
            <button
                onClick={handleUpload}
                className="px-5 py-2 bg-blue-500 hover:bg-blue-600 
                        text-white font-medium rounded-lg shadow-md 
                        transition duration-200"
            >
                Upload
            </button>
            </div>
        </div>
    );

}