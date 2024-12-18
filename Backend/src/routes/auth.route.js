import express from "express"; // importing
import { login, logout, signup, updateProfile, checkAuth } from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router(); // creating router

router.get('/', (req, res) => {
    res.send("Hello");
});

// post route for signup, login, logout 
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// update profile route
router.put("/update-profile", protectRoute, updateProfile);

// current route
router.get("/check", protectRoute, checkAuth);

export default router;