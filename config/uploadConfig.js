//configuration for multer and cloudinary (uploading image to clouding host)

var multer = require('multer');
var cloudinaryStorage = require('multer-storage-cloudinary');


//cloudinary configuration
var cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'dn8hz1rah',
    api_key: '776357955844292',
    api_secret: 'IZ5h-pQUd--rTBiZw0IZONmFibw'
});

//defines the name of folder where image will be stored in cloudinary and allowed format
//bootstrap validation filters out image files but allowed formats are included for completeness
var storage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: 'event-image',
    allowedFormats: ['jpg', 'png'],
    filename: function (req, file, cb) {
        cb(undefined, 'my-file-name');
    }
});

var parser = multer({ storage: storage });

module.exports = {parser}