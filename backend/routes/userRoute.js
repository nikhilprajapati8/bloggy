import express from "express"
import {signup,login, update, logout, getUser} from "../controllers/userController.js";
import protectedRoute from "../middlewares/protectedRoute.js"
const router = express.Router();


router.post("/signup",signup);
router.post("/login",login);
router.post("/logout",logout);
router.get("/getuser/:query",protectedRoute,getUser);
router.put("/update/:id",protectedRoute,update);



export default router;