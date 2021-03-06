const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
    nickname : {
        type: String,
        required: true,
        unique: true
    },
    email : {
        index: true,
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    },
    password: {
            type: String,
            required: true
    },
    is_admin: {
        type: Boolean,
        required: true,
        default: false
    },
    created_date: {
        type: Date,
        required: true
    },
    modified_date: {
        type: Date,
        required: true
    },
    age_rate: {
        type: Number,
        enum: [0, 1, 2]
    },
    active:{
        type: Boolean,
        default: true
    },
});

module.exports = mongoose.model("User", UserSchema);