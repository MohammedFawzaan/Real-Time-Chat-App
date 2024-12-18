import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
    try {
        // Access token from cookies
        const token = req.cookies.jwt;
        // If token doesn't exist, return Unauthorized
        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No token provided" });
        }
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Attach user info from the token payload to the req object
        req.user = decoded;
        // Call next middleware
        next();
    } catch (err) {
        console.error("Error in protectRoute middleware:", err.message);
        // Handle specific JWT errors
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Unauthorized - Token expired" });
        }
        if (err.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Unauthorized - Invalid token" });
        }
        // Generic server error
        return res.status(500).json({ message: "Server error" });
    }
};