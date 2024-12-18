import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getUsersForSidebar, getMessages, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

// get all contacts on sidebar except your
router.get("/users", protectRoute, getUsersForSidebar);

// get all Message history of 2 different users
// (/:id) = id of user we are messaging to
router.get("/:id", protectRoute, getMessages);

// post the message to user
// (/:id) = id of user that we would like to send the message to
router.post("/send/:id", protectRoute, sendMessage);

export default router;