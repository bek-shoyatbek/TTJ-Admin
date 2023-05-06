const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');

require('dotenv').config();

const connectDB = () => {
    mongoose.connect(process.env.db_url)
        .then((result) => {
            console.log(`Conneted DB...`);
        }).catch((err) => {
            console.log(`Error in DB connection` + err);
            process.exit(1);
        });
}

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    fakultet: {
        type: String,
        required: true
    },
    kurs: {
        type: String,
        required: true
    },
    guruh: {
        type: String,
        required: true
    },
    ttj: {
        type: String,
        required: true
    },
});


const User = model("User", userSchema);
module.exports = {
    connectDB,
    User
}