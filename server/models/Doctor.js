const mongoose = require('mongoose');
const Schema = mongoose.Schema

const DoctorSchema = new Schema({
    account: {
        type: Schema.Types.ObjectId,
        ref: 'accounts'
    },
    departments: {
        type: Schema.Types.ObjectId,
        ref: 'accounts'
    },
    description: {
        type: String
    },
    educationplace: {
        type: String
    },
    language: {
        type: String
    },
    degree: {
        type: String
    },
    workcertificate: {
        type: String
    },
    excellence: {
        type: String
    },
    level: {
        type: String
    },
    workhistory: {
        type: String
    },
    education: {
        type: String
    },
    ratings: new Schema({
        user: Schema.Types.ObjectId,
        content: String,
        star: Number,
        date: Date
    }),
    availables: new Schema({    
        date: Date,
        hour: String
    }),
    excellence: {
        type: String
    },
})

module.exports = mongoose.model('doctors', DoctorSchema)