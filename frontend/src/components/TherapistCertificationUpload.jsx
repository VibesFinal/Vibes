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

        <div>

            <label className="flex items-center space-x-2">

                <input 
                
                    type="checkbox"
                    checked={isTherapist}
                    onChange={handleCheckboxChange}
                
                />

                <span>I am a certified therapist</span>

            </label>

            {isTherapist && (

                <input 
                
                    type="file"
                    accept=".jpg , .jpeg , .png , .pdf"
                    onChange={handleFileChange}
                    required
                    className="w-full px-5 py-4 border-2 border-cyan-200 rounded-xl"
                
                />

            )}

        </div>

    );

}