//setting up database

const mongoose = require("mongoose");
require('./event.js');
require('./user.js');
require('./organization.js')



const dbURI =
    "mongodb+srv://violetlee:XOxq6DxmiHgcj0E1@voluntia-xyuqn.mongodb.net/test?retryWrites=true";

const options = {
    useNewUrlParser: true,
    dbName: "INFO30005"
};

mongoose.connect(dbURI, options).then(
    () => {
        console.log("Database connection established!");
    },
    err => {
        console.log("Error connecting Database instance due to: ", err);
    }
);



