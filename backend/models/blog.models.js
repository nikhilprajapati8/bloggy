import mongoose, { mongo } from "mongoose";

const blogSchema = new mongoose.Schema({
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: [true, "Please add a Title"],
        maxLength:100
    },
    description: {
        type: String,
        required: [true, "Please add description"],
        maxLength:1000
    }
    ,
    category: {
        type: String,
        required: [true, "Please add a category"],
        maxLength:15
    }
    ,
    blogImg: {
        type: String,
        required: [true, "Please add an image"]
    },
    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: []
    },
    comments: [
        {
            commentedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            username: {
                type: String,
            },
            userProfilePicture: {
                type: String,
            },
            commentText: {
                type: String,
                required: true
            },
            commentLikes: {
                type: [mongoose.Schema.Types.ObjectId],
                ref: "User",
                default: []
            }

        }

    ]


}, { timestamps: true })


const Blog = mongoose.model("Blog", blogSchema)

export default Blog;