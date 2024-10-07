const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        default: '',
    },
    industry: {
        type: String,
        default: '',
    },
    phoneNo: {
        type: String,
        default: '',
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
});

// Create a model based on the schema and export it
module.exports = mongoose.model('User', userSchema);
