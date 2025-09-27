const multer = require("multer");
const path = require("path");

//storage configurations

const storage = multer.diskStorage({

    destination: function (req , file , cb) {

        cb(null , "uploads/profilePictures");  //save the files inside the uplods inside the profilePictures

    },

    filename: function (req , file , cb) {

        cb(null , Date.now() + path.extname(file.originalname));

    }

});

//only allow images
const fileFilter = (req , file , cb) => {

    const allowed = ["image/jpeg" , "image/png" , "image/jpg" , "image/webp"]; //all kind of images upload

    if(allowed.includes(file.mimetype)){

        cb(null , true);

    } else {

        cb(new Error("only images are allowed") , false);

    }

};

const upload = multer( { storage , fileFilter } );


module.exports = upload;