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
});

// make the model
const User = mongoose.model('User', userSchema);

// export the model
module.exports = User;