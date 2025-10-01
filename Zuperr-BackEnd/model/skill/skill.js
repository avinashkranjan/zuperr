const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    Name: { type: String, required: true }
}, {timestamps: true});

module.exports = mongoose.model('Skill', skillSchema)