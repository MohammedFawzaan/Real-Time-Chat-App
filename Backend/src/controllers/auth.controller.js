import User from "../models/user.model.js"
import bcrypt from "bcryptjs";
import generateToken from "../lib/utils.js";

const signup = async (req, res) => {
    // acquiring data from req.body 
    const { fullName, email, password } = req.body;
    try {
        if (!password || !email || !fullName) {
            return res.status(400).json({ message: "All fields are Mandatory" });
        }
        // checking for invalid password
        if (password < 6) {
            return res.status(400).json({ message: "Password must be atleast of 6 characters" });
        }
        // accessing current user
        const user = await User.findOne({ email });
        // if user already exists
        if (user) {
            return res.status(400).json({ message: "email already registered" });
        }
        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // create new user
        const newUser = new User({
            fullName: fullName,
            email: email,
            password: hashedPassword
        });
        // newUser exists
        if (newUser) {
            // generate jwt token 
            // while sending the current user id and response
            let token = generateToken(newUser._id, res);
            // newUser saved
            await newUser.save();
            // sending the data to client
            res.status(201).json({
                token: token
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (err) {
        console.log("Error in signup", err.message);
        res.status(400).json({ message: "sever error" });
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // accessing user details
        const user = await User.findOne({ email });
        // if user not exists
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        // comparing the password of user to password which user entered on site
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        // if password is incorrect
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid password" });
        }
        // generate token
        let token = generateToken(user._id, res);
        // sending data to client
        res.status(200).json({
            token: token
        });
    } catch (err) {
        console.log("Error in login", err.message);
        res.status(400).json({ message: "Internal server error" });
    }
}

const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out success" });
    } catch (error) {
        console.log("Error in logout", err.message);
    }
}

const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        // access user's id
        const userId = req.user._id;
        if (!profilePic) {
            return res.status(400).json({ message: "Profile Pic Is Required" });
        }
        // upload to cloudinary
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        // Update user
        const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true });
        // send to client
        res.status(200).json(updatedUser);
    } catch (err) {
        console.log("Error in update profile", err);
    }
}

// current route
const checkAuth = (req, res) => {
    try {
        // send req.user to client
        res.status(200).json(req.user);
    } catch (err) {
        console.log("Error in checkauth control", err);
        res.status(500).json({message: "Internal server error"});
    }
};

export { signup, login, logout, updateProfile, checkAuth };