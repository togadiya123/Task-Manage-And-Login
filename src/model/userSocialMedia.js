const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    avatar: {
        type: String
    },
    providerName: {
        type: String,
        required: true
    },
    providerUserId: {
        type: Number,
        require: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        },
        tokenGenerateTime: {
            type: Date,
            default: Date.now()
        },
        tokenUsedTime: [{
            time: {
                type: Date,
                require: true
            }
        }]
    }]
},
    {
        timestamps: true
    }
)

const User = mongoose.model('socialMediaUser', userSchema)

module.exports = User;