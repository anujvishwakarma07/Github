const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    repositories: [
        {
            default: [],
            type: mongoose.Schema.Types.ObjectId,
            ref: "Repository",
        }
    ],
    followedUsers: [
        {
            default: [],
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    starRepos: [
        {
            default: [],
            type: mongoose.Schema.Types.ObjectId,
            ref: "Repository"
        }
    ]
})

const User = mongoose.model("User", UserSchema);
module.exports = User;