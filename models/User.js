const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    role: {
        type: String,
        default: "Customer"
    },
    firstname: {
        type: String,
    },
    lastname: {
        type: String,
    },
    bio: {
        type: String,
        default: "Just started surveying."
    },
    profilepic: {
        type: String,
        default: "https://www.w3schools.com/w3images/avatar2.png"
    },
    phone: {
        type: String,
    },

});

// make the model
const User = mongoose.model('User', userSchema);

// export the model
module.exports = User;