import cloudinary from "../lib/cloudinary.js";
import { User } from "../models/userModel.js";
import { messageHandler } from "../utils/messageHandler.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"



export const signup = async (req, res) => {


    try {

        const { username, email, password, bio } = req.body;

        if (username === "", email === "", password === "", bio === "") {

            return messageHandler(res, 400, false, "All Fields are required");

        }


        const user = await User.findOne({ email })

        if (user) {

            return messageHandler(res, 400, false, "User already exists");

        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            email,
            password: hashPassword,
            bio

        });


        if (newUser) {

            const secretkey = process.env.JWT_SECRET_KEY;

            if (!secretkey) {
                return messageHandler(res, 500, false, "JWT secret key not configured");
            }

            const userId = newUser._id

            const token = jwt.sign({ userId }, secretkey, {
                expiresIn: "180d"
            })

        
           return res.status(201).json({success : true, userData : newUser, token, message : "User Cretaed Successfully" })

        } else {

            return res.status(500).json({ success: false, message: "User Creation Failed" })
        }

    } catch (error) {

        console.error("REGISTER ERROR:", error);
        return messageHandler(res, 500, false, "Server Error!");
    }

}




export const login = async (req, res) => {


    try {

        const { email, password } = req.body;

        if (!email || !password) {

            return messageHandler(res, 400, false, "All Fields Are Required");

        }



        const userData = await User.findOne({ email })

        if (!userData) {

            return messageHandler(res, 400, false, "User Not Found With This Email");
        }


        const isMatch = await bcrypt.compare(password, userData.password);
        if (!isMatch) {
            return messageHandler(res, 400, false, "Invalid Password");
        }

        const secretkey = process.env.JWT_SECRET_KEY;
        if (!secretkey) {
            return messageHandler(res, 500, false, "JWT secret key not configured");
        }

        const userId = userData._id;
        const token = jwt.sign({ userId }, secretkey, { expiresIn: "180d" });

       
        return res.status(200).json({success : true, userData, token, message : "Logged in Successfully"})



    } catch (error) {

        console.error("LOGIN ERROR:", error);
        return messageHandler(res, 500, false, "Server Error!");
    }
}


//Controller to check if user is authenticated
export const checkAuth = (req, res) => {
    res.status(200).json({ success: true, user: req.user })
}


//Controller to update user profile details
export const updateProfile = async (req, res) => {
    try {

        const { profilePic, bio, username } = req.body;

        const userId = req.user._id;
        let updatedUser;

        if (!profilePic) {

            updatedUser = await User.findByIdAndUpdate(userId, { bio, username }, { new: true });

        } else {

            const upload = await cloudinary.uploader.upload(profilePic);

            updatedUser = await User.findByIdAndUpdate(userId, { profilePic: upload.secure_url, bio, username }, { new: true });
        }

        res.status(200).json({ success: true, user: updatedUser })

    } catch (error) {
        console.error("UPDATE PROFILE ERROR:", error);
        res.status(500).json({ success: false, message: error.message })

    }
}