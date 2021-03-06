const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ImageSchema = new Schema({
    title : {
        type: String,
        required: true
    },
    timestamp : {
        type: String,
        required: true
    },
    collections: {
        type: String,
    },
    tags : [{
        type: String,
    }],
    slug : {
        type: String,
        required: true,
        unique: true
    },
    file_path : {
        type: String,
        required: true,
        unique: true
    },
    thumbnail_path : {
        type: String,
        required: true,
        unique: true
    },
    width : {
        type: Number,
        required: true
    },
    height : {
        type: Number,
        required: true
    },
    description : {
        type: String
    },
    age_rate:{
        type: Number,
        enum: [0, 1, 2]
    }
});

module.exports = mongoose.model("Image", ImageSchema);