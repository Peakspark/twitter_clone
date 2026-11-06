import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

// ================= SIGNUP =================

export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        // Validate input types
        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid input"
            });
        }

        // Validate name and email
        const normalizedName = name.trim();
        const normalizedEmail = email.trim().toLowerCase();

        if (!normalizedName || normalizedName.length > 100) {
            return res.status(400).json({
                success: false,
                message: "Name must be between 1 and 100 characters"
            });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email"
            });
        }

        // Password length
        if (password.length < 8 || password.length > 72) {
            return res.status(400).json({
                success: false,
                message: "Password must be between 8 and 72 characters"
            });
        }

        // Password complexity
        const strongPassword =
            /[A-Z]/.test(password) &&
            /[a-z]/.test(password) &&
            /[0-9]/.test(password) &&
            /[^A-Za-z0-9\s]/.test(password);

        if (!strongPassword) {
            return res.status(400).json({
                success: false,
                message: "Password must contain uppercase, lowercase, number and special character"
            });
        }

        // Check existing user
        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const user = await User.create({
            name: normalizedName,
            email: normalizedEmail,
            password: hashedPassword
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        // Handle duplicate email race conditions
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        }

        console.error("Signup error:", error.name);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// LOGIN 

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        if (email.length > 254 || password.length > 72) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Find user
        const user = await User.findOne({
            email: normalizedEmail
        }).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Compare password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Check JWT configuration
        if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
            throw new Error("JWT_SECRET is missing or too short");
        }

        // Generate JWT
        const token = jwt.sign(
            {
                userId: user._id.toString(),
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d",
                algorithm: "HS256"
            }
        );

        // Set secure cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production"
                ? "none"
                : "lax",
            maxAge: 24 * 60 * 60 * 1000,
            path: "/"
        });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login error:", error.name);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


 //LOGOUT 

export const logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production"
            ? "none"
            : "lax",
        path: "/"
    });

    return res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
};