import jwt from "jsonwebtoken"
import User from "../models/user.model.js";

const protectedRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) { return res.status(400).json({ error: "unauthorized" }) };

        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decode.userId).select("-password")
        req.user = user;
        next();



    } catch (err) {
        res.status(500).json({ error: "Internal server error" })
        console.log('from protected route')
    }


}

export default protectedRoute;