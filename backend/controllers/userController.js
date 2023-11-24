import mongoose from "mongoose";
import User from "../models/user.model.js";
import Blog from "../models/blog.models.js"
import bcrypt from "bcryptjs"
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";
import {v2 as cloudinary} from "cloudinary"

const signup = async (req, res) => {
    const { name, username, email, password, bio} = req.body;

    if (!name || !username || !email || !password || !bio) {
        return res.status(400).json({ error: "Please fill up all the mandatory fields" });
    }

    try {
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(409).json({ error: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name, username, email, password: hashedPassword, bio
        });

        const savedUser = await newUser.save();

        if (savedUser) {
            generateTokenAndSetCookie(savedUser._id, res);
            return res.status(200).json({
                _id: savedUser._id,
                name: savedUser.name,
                username: savedUser.username,
                email: savedUser.email,
                bio: savedUser.bio,
                profilePicture:savedUser.profilePicture,
                facebook:savedUser.facebook,
                twitter:savedUser.twitter,
                instagram:savedUser.instagram,
                youtube:savedUser.youtube,
            });
        } else {
            return res.status(400).json({ error: "Invalid user data" });
        }
    } catch (err) {
        return res.status(500).json("Internal server error");
    }
}

const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Please provide both username and password" });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ error: "Incorrect user credentials" });
        }

        generateTokenAndSetCookie(user._id, res);
        return res.status(200).json({
            _id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            bio: user.bio,
            profilePicture: user.profilePicture,
            facebook: user.facebook,
            twitter: user.twitter,
            instagram: user.instagram,
            youtube: user.youtube
        });
    } catch (err) {
        return res.status(500).json({ error: "Internal server error" });
    }
}

const logout = async (req, res) => {
    try {
        res.clearCookie("jwt")
        res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" })
    }

}

const update = async (req, res) => {
    const { name, username, email, password, bio, facebook, twitter, instagram, youtube } = req.body;
    let {profilePicture} = req.body;
    const userId = req.user._id;

    if (req.params.id !== userId.toString()) {
        return res.status(403).json({ error: "You can't update profile of other people" });
    }

    try {
        let user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user.password = hashedPassword;
        }

        if(profilePicture){
            
            const uploadedResponse = await cloudinary.uploader.upload(profilePicture)
            profilePicture = uploadedResponse.secure_url;

            if (user.profilePicture) {
				await cloudinary.uploader.destroy(user.profilePicture.split("/").pop().split(".")[0]);
			}

        }

        user.name = name || user.name;
        user.username = username || user.username;
        user.email = email || user.email;
        user.bio = bio || user.bio;
        user.profilePicture = profilePicture || user.profilePicture;
        user.facebook = facebook || user.facebook;
        user.twitter = twitter || user.twitter;
        user.instagram = instagram || user.instagram;
        user.youtube = youtube || user.youtube;
        const updatedUser = await user.save();

        await Blog.updateMany(
            { "comments.commentedBy": userId },
            {
                $set: {
                    "comments.$[comment].username": updatedUser.username,
                    "comments.$[comment].userProfilePicture": updatedUser.profilePicture,
                },
            },
            { arrayFilters: [{ "comment.commentedBy": userId }] }
        );



        updatedUser.password = undefined;
        return res.status(200).json(updatedUser);
    } catch (err) {
        return res.status(500).json({ error: "Internal server error" });
    }
}

const getUser = async (req, res) => {
    const { query } = req.params;
     
    
    try {
        let user;
        if (mongoose.Types.ObjectId.isValid(query)) {
              user = await User.findById(query).select("-password");
        }else{
            user = await User.findOne({username : query}).select("-password");
        }


        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        
        return res.status(200).json(user);

    } catch (err) {
        return res.status(500).json({ error: "Internal server error" });
    }
}

export { signup, login, logout, update, getUser }