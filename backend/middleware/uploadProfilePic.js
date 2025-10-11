const pg = require("pg");
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const ImageKit = require("imagekit");
require("dotenv").config();


const imageKit = new ImageKit({

    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT

});

module.exports = async function uploadProfilePic(req , res) {
    
    try {
        
        const { userId } = req.params;
        const { fileName , fileData } = req.body;

        if(!fileData){

            return res.status(400).json({ error: "No Image Provided" });

        }

        const base64WithPrefix = fileData.startsWith('data:') 
            ? fileData 
            : `data:image/jpeg;base64,${fileData}`;


        // upload image to imagekit
        const uploadResponse = await imageKit.upload({

            file: base64WithPrefix, 
            fileName: fileName || "profile_pic.jpg",
            folder: `/profilePictures/user_${userId}`

        });

        // save the url of the photo in the database
        const updateQuery = `UPDATE users SET profile_pic = $1 WHERE id = $2 RETURNING profile_pic`;
        const result = await pool.query(updateQuery , [uploadResponse.url , userId]);

        res.status(200).json({

            message: "Profile picture uploaded sucessfully",
            profile_pic: result.rows[0].profile_pic,

        });

    } catch (error) {
        
        console.error("Upload failed" , error);
        res.status(500).json({ error: "Image upload failed" });
        
    }

};


