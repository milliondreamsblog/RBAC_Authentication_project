const { Router } = require("express");
const courseRouter = Router();
const { userAuth } = require("../middleware/user");
const { purchaseModel, courseModel } = require("../db");

// Route to handle course purchase
courseRouter.post("/purchase", userAuth, async (req, res) => {
    try {
        const userId = req.userId; // Extracted from the middleware
        const { courseId } = req.body;

        // Check if the course exists
        const course = await courseModel.findById(courseId);
        if (!course) {
            return res.status(404).json({
                message: "Course not found",
            });
        }

        // Check if the user already purchased the course
        const existingPurchase = await purchaseModel.findOne({
            userId,
            courseId,
        });
        if (existingPurchase) {
            return res.status(400).json({
                message: "You have already purchased this course",
            });
        }

        // Create the purchase record
        await purchaseModel.create({
            userId,
            courseId,
        });

        res.json({
            message: "You have successfully purchased the course",
        });
    } catch (error) {
        console.error("Error during course purchase:", error);
        res.status(500).json({
            message: "An error occurred while purchasing the course",
            error: error.message,
        });
    }
});

// Route to fetch all courses for preview
courseRouter.get("/preview", async (req, res) => {
    try {
        const courses = await courseModel.find({});

        if (courses.length === 0) {
            return res.status(404).json({
                message: "No courses found",
            });
        }

        res.json({
            courses,
            message: "Courses fetched successfully",
        });
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({
            message: "An error occurred while fetching the courses",
            error: error.message,
        });
    }
});

module.exports = { courseRouter };
