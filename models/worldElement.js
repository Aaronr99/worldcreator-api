const mongoose = require('mongoose');
//require('dotenv').config();

const worldElementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    parent: {
        type: String,
        required: true,
        default: 'root'
    },
    imageUrl: {
        type: String,
        required: true,
        // default: `${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/public/${'questionMark.jpg'}`
        default: `${process.env.APP_NAME}:${process.env.PORT}/public/${'questionMark.jpg'}`
    },
    dateAdded: {
        type: Date,
        required: true,
        default: Date.now
    }
})

worldElementSchema.methods.setImgUrl = function setImgUrl(filename) {
    const p = process.env
    this.imageUrl = `${p.APP_NAME}:${p.PORT}/public/${filename}`
}

module.exports = mongoose.model('worldDB', worldElementSchema)