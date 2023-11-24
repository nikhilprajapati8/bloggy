import express from "express"
import protectedRoute from "../middlewares/protectedRoute.js";
import { addComment, createBlog, deleteBlog, deleteComment, getAllBlogs, getBlog, getUserBlogs, likeBlog, likeComment, updateBlog, updateComment } from "../controllers/blogController.js";
const router = express.Router()

router.get("/:id",getBlog)
router.get("/",getAllBlogs)
router.get("/userBlogs/:id",protectedRoute,getUserBlogs)
router.post("/create",protectedRoute,createBlog)
router.put("/like/:id",protectedRoute,likeBlog)
router.put("/:id",protectedRoute,updateBlog)
router.put("/comment/:id",protectedRoute,addComment)
router.put("/likeComment/:id",protectedRoute,likeComment)
router.put("/updateComment/:id",protectedRoute,updateComment)
router.delete("/:id",protectedRoute,deleteBlog)
router.delete("/deleteComment/:id",protectedRoute,deleteComment)



export default router;