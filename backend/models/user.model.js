import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim:true
        
    },
    email: {
        type: String,
        required: true,
        unique: true,
    }
    ,
    password: {
        type: String,
        required: true,
    }
    ,
    bio: {
        type: String,
        required: true,
        max: 250

    }
    ,
    profilePicture: {
        type: String,
        default: ""

    }
    ,
    facebook: {
        type: String,
        default: ""

    }
    ,
    twitter: {
        type: String,
        default: ""

    }
    ,
    instagram: {
        type: String,
        default: ""

    }
    ,
    youtube: {
        type: String,
        default: ""

    }
},{ timestamps: true })

const User = mongoose.model("User",userSchema);

export default User;