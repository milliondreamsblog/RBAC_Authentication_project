const { Router } = require("express");
const adminRouter = Router();
const jwt = require("jsonwebtoken");
const { userModel, courseModel } = require("../db");
const { JWT_SECRET } = require("../config");
const { adminAuth } = require("../middleware/user");
const bcrypt = require("bcrypt");

const blacklist = new Set();  // A simple blacklist (consider using Redis for production)

// Admin Signup Route
adminRouter.post("/signup", async (req, res) => {
    try {
        const { email, password, firstname, lastname } = req.body;
        //check for duuplicate emails
        const existingAdmin = await userModel.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({
                message: "Email already exists. Please use a different email address.",
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        //create an admin user
        await userModel.create({
            email,
            password: hashedPassword, // Save hashed password
            firstname,
            lastname,
            role: "admin", // Role --> admin
        });

        res.json({
            message: "Admin signup successful",
        });
    } catch (error) {
        console.error("Error during admin signup:", error);
        res.status(500).json({
            message: "An error occurred during signup",
            error: error.message,
        });
    }
});

// Admin Signin Route
// Admin Signin Route
adminRouter.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find admin by email and role
        const admin = await userModel.findOne({ email, role: "admin" });

        if (!admin) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: admin._id, role: admin.role },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            token,
            message: "Signin successful",
        });
    } catch (error) {
        console.error("Error during admin signin:", error);
        res.status(500).json({
            message: "An error occurred during signin",
            error: error.message,
        });
    }
});


// Upload Course Route (Admin Only)
adminRouter.post("/course/upload", adminAuth, async (req, res) => {
    try {
        const creatorId = req.userId;
        const { title, description, imageURL, price } = req.body;

        await courseModel.create({
            title,
            description,
            imageURL,
            price,
            createrId: creatorId,
        });

        res.json({
            message: "Course uploaded",
        });
    } catch (error) {
        console.error("Error uploading course:", error);
        res.status(500).json({
            message: "An error occurred while uploading the course",
            error: error.message,
        });
    }
});

// Update Course Route (Admin Only)
adminRouter.put("/update", adminAuth, async (req, res) => {
    try {
        const creatorId = req.userId;
        const { courseId, title, description, imageURL, price } = req.body;

        const course = await courseModel.findOneAndUpdate(
            { _id: courseId, createrId: creatorId },
            { title, description, imageURL, price },
            { new: true }
        );

        if (course) {
            res.json({
                message: "Course updated",
                course,
            });
        } else {
            res.status(404).json({
                message: "Course not found or you do not have permission",
            });
        }
    } catch (error) {
        console.error("Error updating course:", error);
        res.status(500).json({
            message: "An error occurred while updating the course",
            error: error.message,
        });
    }
});

// Get All Courses (Admin Only)
adminRouter.get("/course/bulk", adminAuth, async (req, res) => {
    try {
        const creatorId = req.userId;

        const courses = await courseModel.find({ createrId: creatorId });

        res.json({
            courses,
            message: "All courses fetched",
        });
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({
            message: "An error occurred while fetching the courses",
            error: error.message,
        });
    }
});

// Admin Logout Route
adminRouter.post('/logout', (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Extract Bearer token

        if (token) {
            blacklist.add(token);  // Add token to blacklist
            res.status(200).json({ message: 'Logged out successfully' });
        } else {
            res.status(400).json({ message: 'No token provided' });
        }
    } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({
            message: "An error occurred during logout",
            error: error.message,
        });
    }
});

module.exports = { adminRouter };
