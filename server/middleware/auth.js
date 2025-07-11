import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken"

//Middleware to protect routes
export const protectRoute = async (req, res, next) => {
    try {
        const token = req.headers.token;

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

        const user = await User.findById(decoded.userId).select("-password");

        if(!user) return res.status(404).json({ success : false, message : "User not found"});

        req.user = user;
        next();
        
    } catch (error) {
        console.log(error.message)
        return res.status(498).json({ success : false, message : "Invalid token" }); 

    }
}