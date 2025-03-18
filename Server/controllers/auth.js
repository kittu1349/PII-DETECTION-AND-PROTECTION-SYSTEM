import {encrypt,decrypt} from "../utils/Hashing.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {uploadImageToCloudinary} from "../utils/imageUploader.js"
import crypto from "crypto"
dotenv.config();
const result = dotenv.config();
if (result.error) {
  console.log("Error loading .env file:", result.error);
} else {
  console.log(".env file loaded successfully");
}

// Signup Controller for Registering Users
const signup = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(403).json({
                success: false,
                message: "All fields are required",
            });
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format",
            });
        }

        // Validate password strength
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
            });
        }
        const emailHash = crypto.createHash('sha256').update(email).digest('hex');
        const existingUser = await User.findOne({ emailHash });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists. Please sign in to continue.",
            });
        }

        const avatarLocalPath = req.files?.avatar;
        if (!avatarLocalPath) {
            return res.status(400).json({
                success: false,
                message: "Please provide an avatar image",
            });
        }

        const avatar = await uploadImageToCloudinary(
            avatarLocalPath,
            process.env.FOLDER_NAME
        );

        if (!avatar) {
            return res.status(400).json({
                success: false,
                message: "Avatar upload failed",
            });
        }

        const secret = process.env.ENCRYPTION_SECRET;
        if (!secret) {
            throw new Error('ENCRYPTION_SECRET is not set in environment variables');
        }
        
        console.log(emailHash);
        const encryptedFirstName = encrypt(firstName, secret);
        const encryptedLastName = encrypt(lastName, secret);
        const encryptedEmail = encrypt(email, secret);
        const encryptedPassword = encrypt(password, secret);
        const encryptedAvatar = encrypt(avatar.url, secret);

        const user = await User.create({
            firstName: encryptedFirstName,
            lastName: encryptedLastName,
            email: encryptedEmail,
            emailHash:emailHash,
            password: encryptedPassword,
            avatar: encryptedAvatar
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                emailHash:emailHash,
                avatar: user.avatar,
            },
            
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "User cannot be registered. Please try again.",
        });
    }
};
// login Controller for Registered Users
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill up all the required fields",
            });
        }

        const secret = process.env.ENCRYPTION_SECRET;
        // const encryptedEmail = encrypt(email, secret);
        const emailHash = crypto.createHash('sha256').update(email).digest('hex');
        console.log("login", emailHash);
        const user = await User.findOne({ emailHash: emailHash });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User is not registered with us. Please sign up to continue.",
            });
        }

        const decryptedPassword = decrypt(user.password, secret);

        if (password !== decryptedPassword) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }
        const decryptedEmail= decrypt(user.email, secret)
        const token = jwt.sign(
            { email:decryptedEmail, id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "24h" },
        );
        
        user.token = token;
        user.password = undefined;

        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        };

        res.cookie("token", token, options).status(200).json({
            success: true,
            token,
            user: {
                _id: user._id,
                firstName: decrypt(user.firstName, secret),
                lastName: decrypt(user.lastName, secret),
                email: decrypt(user.email, secret),
                avatar: decrypt(user.avatar, secret)
            },
            message: "User login successful",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Login failure. Please try again.",
        });
    }
};

export { signup, login };