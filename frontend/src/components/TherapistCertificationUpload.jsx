import React, { useState } from "react";


export default function TherapistCertificationUpload( { onChange } ){

    const [ isTherapist , setIsTherapist ] = useState(false);
    const [ certification , setCertification ] = useState(null);

    const handleFileChange = (e) => {

        const file = e.target.files[0];
        setCertification(file);
        onChange(isTherapist , file);

    };

    const handleCheckboxChange = (e) => {

        const checked = e.target.checked;
        setIsTherapist(checked);
        onChange(checked , certification);

    };

    return (
        <div className="space-y-4">
            <label className="flex items-center space-x-2 text-gray-800 border-[#C05299] font-medium">
                <input
                type="checkbox"
                checked={isTherapist}
                onChange={handleCheckboxChange}
                className="accent-[#C05299] w-5 h-5 text-[#C05299] border-2 border-[#C05299] rounded focus:ring-2 focus:ring-[#C0529970] transition-all"
                />
                <span className=" text-[#C05299]">I am a certified therapist</span>
            </label>

            {isTherapist && (
                <label className="w-full flex flex-col items-center px-5 py-4 bg-purple-50/50 border-2 border-[#C05299] rounded-xl cursor-pointer hover:border-[#C05299] focus-within:border-[#C05299] focus-within:ring-2 focus-within:ring-[#C05299] transition-colors text-gray-800">
                <span className="text-gray-500 text-sm">
                    {certification
                    ? `File uploaded: ${certification.name}`
                    : "Click to upload your certification"}
                </span>
                <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleFileChange}
                    required
                    className="hidden"
                />
                </label>
            )}
        </div>

    );
}