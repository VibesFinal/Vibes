const ImageKit = require("imagekit");
require("dotenv").config();

const imageKit = new ImageKit({

  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT

});

async function uploadFile(file, folder = "/postMedia") {

  const response = await imageKit.upload({

    file: file.buffer,
    fileName: file.originalname,
    folder

  });

  return response.url; // return the URL to store in DB
  
}

module.exports = { uploadFile };
