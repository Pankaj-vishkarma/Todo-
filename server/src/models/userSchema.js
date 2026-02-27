const mongoose = require('mongoose');


const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,

    },
    email: {
        type: String

    },
    password: {
        type: String
    },
    refreshToken: {
        type: String,
    },
}, {
    timestamps: true
})


module.exports = mongoose.model('User', userSchema);