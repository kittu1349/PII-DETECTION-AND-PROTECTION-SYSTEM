// Import the required modules
import express from "express";
const router = express.Router();

// Import the required controllers and middleware functions
import { login, signup } from "../controllers/auth.js";
import { createDocument } from "../controllers/documents.js";
import { auth } from "../middlewares/auth.js";

// Routes for Login, Signup, and Authentication

// Route for user login
router.post("/login", login);

// Route for user signup
router.post("/signup", signup);

// Export the router for use in the main application
export default router;