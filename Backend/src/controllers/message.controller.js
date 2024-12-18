import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "cloudinary";

// get All users except you
export const getUsersForSidebar = async (req, res) => {
    try {
        // current users id
        const loggedInUserId = req.user._id;
        console.log(loggedInUserId);
        // All users except the current one
        const filteredUsers = await User.find({_id: {$ne: loggedInUserId}}).select("-password");
        console.log(filteredUsers);

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("error in getUsersForSidebar", error.message);
        res.status(500).json({error: "Internal server error"});
    }
};

export const getMessages = async(req, res) => {
    try {
        // id of user you are talking to
        const {id: userToChatId} = req.params;
        // current user id: myId
        const senderId = req.user._id;
        // accessing all messages to be displayed
        const messages = await Message.find({
            $or:[
                {senderId: senderId, recieverId: userToChatId},
                {senderId: userToChatId, recieverId: senderId}
            ]
        });
        // sending messages to client
        res.status(200).json({messages});
    } catch (error) {
        console.log("error in getMessages", error.message);
        res.status(500).json({error: "Internal server error"});
    }
}

export const sendMessage = async(req, res) => {
    try {
        // accessing credentials from body 
        const { text, image } = req.body;
        const { id: recieverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;
        // if user sends an image upload it to cloudinary
        if(image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        // creating a message and saving it to Message model
        const newMessage = new Message({
            senderId,
            recieverId,
            text,
            image: imageUrl,
        });
        await newMessage.save();

        //  todo: realTime functionality goes here => socket.io

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("error in sendMessage controller", error.message);
        res.status(500).json({error: "Internal server error"});
    }
};