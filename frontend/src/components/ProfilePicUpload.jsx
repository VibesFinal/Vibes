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

        <div className="mt-4">

            <input type="file" onChange={(e) => setFile(e.target.files[0])}/>

            <button
            
                onClick={handleUpload}
                className="ml-2 px-4 py-2 bg-green-500 text-white rounded-lg"
            
            >

            Upload

            </button>

        </div>

    );

}