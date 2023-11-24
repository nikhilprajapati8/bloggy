import mongoose from "mongoose";
import Blog from "../models/blog.models.js"
import User from "../models/user.model.js";
import {v2 as cloudinary} from "cloudinary"


const createBlog = async (req, res) => {
    const { postedBy, title, description, category } = req.body;
    let {blogImg} = req.body;
    const loggedInUser = req.user._id;

    if (!postedBy || !title || !description || !category || !blogImg) {
        return res.status(400).json({ error: "Please fill up all the fields" });
    }

    try {
        const user = await User.findById(postedBy);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (postedBy.toString() !== loggedInUser.toString()) {
            return res.status(403).json({ error: "You can't create a blog for other people" });
        }
        if(blogImg){
            const uploadedResponse = await cloudinary.uploader.upload(blogImg);
            blogImg = uploadedResponse.secure_url;
        }

        const blog = new Blog({
            postedBy,
            title,
            description,
            category,
            blogImg
        });

        await blog.save();

        return res.status(200).json(blog);
    } catch (err) {
        return res.status(500).json({ error: "Internal server error" });
    }
}

const updateBlog = async (req, res) => {
    const { id } = req.params;
    const { title, description, category } = req.body;
    let {blogImg} = req.body;

    try {
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }

        if (blog.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "You can't update blogs of other people" });
        }

        if(blogImg){
            
            const uploadedResponse = await cloudinary.uploader.upload(blogImg)
            blogImg = uploadedResponse.secure_url;
            
            if (blog.blogImg) {
				await cloudinary.uploader.destroy(blog.blogImg.split("/").pop().split(".")[0]);
			}
        }


        const updatedBlog = await Blog.findByIdAndUpdate(id, {
            $set: {
                title: title || blog.title,
                description: description || blog.description,
                category: category || blog.category,
                blogImg: blogImg || blog.blogImg,
            },
        }, { new: true });

        return res.status(200).json(updatedBlog);
    } catch (err) {
        return res.status(500).json({ error: "Internal server error" });
    }
}

const deleteBlog = async (req, res) => {
    const { id } = req.params;
    const loggedInUser = req.user._id;


    try {
        const blog = await Blog.findById(id);
        if (!blog) { return res.status(404).json({ error: "Blog not found" }) }

        if (blog.postedBy.toString() !== loggedInUser.toString()) { return res.status(403).json({ error: "You can't delete blogs of other people" }) }

        await Blog.findByIdAndDelete(id);
        return res.status(200).json({ message: "Blog deleted successfully" })


    } catch (err) {
        return res.status(500).json({ error: "Internal server error" });

    }

}

const likeBlog = async (req, res) => {
    const { id } = req.params;
    const { _id: userId } = req.user

    try {
        const blog = await Blog.findById(id);
        if (!blog) { return res.status(404).json({ error: "Blog not found" }) };

        const userLiked = blog.likes.includes(userId);

        if (userLiked) {
            await Blog.updateOne({ _id: id }, { $pull: { likes: userId } });
            return res.status(200).json({ message: "Blog Unliked successfully" })

        } else {
            blog.likes.push(userId);
            blog.save();
            return res.status(200).json({ message: "Blog liked successfully" })
        }

    } catch (err) {
        return res.status(500).json({ error: "Internal server error" });

    }

}


const getBlog = async (req, res) => {
    const { id } = req.params;
    try {
        const blog = await Blog.findById(id);
        if (!blog) { return res.status(404).json({ error: "Blog not found" }) };

        return res.status(200).json(blog);


    } catch (err) {
        return res.status(500).json({ error: "Internal server error" });

    }
}

const getAllBlogs = async (req, res) => {
    try {
        const allBlogs = await Blog.find({}).sort({createdAt:-1});
        return res.status(200).json(allBlogs);

    } catch (err) {
        return res.status(500).json({ error: "Internal server error" });
    }
}

const getUserBlogs = async(req,res) =>{
    const {id} = req.params;
    try {
        const blogs = await Blog.find({postedBy:id})
        if(!blogs){return res.status(404).json("Blogs not found")}

        res.status(200).json(blogs);
        
    } catch (err) {
        res.status(400).json("Internal server error")
        
    }
}

const addComment = async (req, res) => {
    const { id } = req.params;
    const { _id: commentedBy, profilePicture: userProfilePicture, username } = req.user;
    const { commentText } = req.body;

    if (!commentText) {
        return res.status(400).json({ error: "Comment can't be empty" });
    }

    try {
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }

        const comment = { commentedBy, username, userProfilePicture, commentText };
        blog.comments.push(comment);
        await blog.save();

        const commentWithId = blog.comments[blog.comments.length - 1];
        return res.status(200).json(commentWithId);
    } catch (err) {
        return res.status(500).json({ error: "Internal server error" });
    }
};

const likeComment = async (req, res) => {
    const { commentId } = req.body;
    const { _id: userId } = req.user;
    const { id: blogId } = req.params;

    try {
        let blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }

        const comment = blog.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        const userLiked = comment.commentLikes.includes(userId)

        if (userLiked) {
            comment.commentLikes = comment.commentLikes.filter((like) => like.toString() !== userId.toString());
            await blog.save();
            return res.status(200).json({ message: "Comment unliked successfully" });
        } else {
            comment.commentLikes.push(userId);
            await blog.save();
            return res.status(200).json({ message: "Comment liked successfully" });
        }
    } catch (err) {
        return res.status(500).json({ error: "Internal server error" });
    }
};

const deleteComment = async (req, res) => {
    const { commentId } = req.body;
    const { _id: userId } = req.user;
    const { id: blogId } = req.params;
    try {
        const blog = await Blog.findById(blogId);
        if (!blog) { return res.status(404).json({ error: "Blog not found" }) };

        const comment = blog.comments.id(commentId)
        if (!comment) { return res.status(404).json({ error: "Comment not found" }) };

        if (comment.commentedBy.toString() !== userId.toString()) { return res.status(403).json({ error: "You can't delete comment of other people" }) }

        blog.comments.pull(commentId);
        await blog.save()
        res.status(200).json(blog.comments)


    } catch (err) {
        return res.status(500).json({ error: "Internal server error" });

    }
}

const updateComment = async (req, res) => {
    const { commentId, updatedCommentText } = req.body;
    const { _id: userId } = req.user;
    const { id: blogId } = req.params;
    try {
        const blog = await Blog.findById(blogId);
        if (!blog) { return res.status(404).json({ error: "Blog not found" }) };

        const comment = blog.comments.id(commentId);
        if (!comment) { return res.status(404).json({ error: "Comment not found" }) };

        if (comment.commentedBy.toString() !== userId.toString()) { return res.status(403).json({ error: "You can't update comments of other people" }) }

        comment.commentText = updatedCommentText;
        await blog.save()
        res.status(200).json(blog)



    } catch (err) {
        return res.status(500).json({ error: "Internal server error" });
    }
}

export { createBlog, updateBlog, deleteBlog, likeBlog, getBlog, getAllBlogs,getUserBlogs, addComment, likeComment, deleteComment, updateComment };