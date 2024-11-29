const { Router } = require("express");
const purchaseRoute = Router();
const { adminAuth, userAuth } = require("../middleware/user");
const { purchaseModel, courseModel, userModel } = require("../db");

// Admin: Fetch all purchases in bulk
purchaseRoute.get("/bulk", adminAuth, async (req, res) => {
    try {
        // Fetch all purchases with populated user and course data
        const purchases = await purchaseModel.find().populate("userId courseId");

        // If no purchases found
        if (purchases.length === 0) {
            return res.status(404).json({
                message: "No purchase data found",
            });
        }

        res.json({
            purchases,
            message: "Bulk purchase data fetched successfully",
        });
    } catch (error) {
        console.error("Error fetching bulk purchases:", error);
        res.status(500).json({
            message: "Failed to fetch purchase data",
            error: error.message,
        });
    }
});

// User: Fetch their own purchases
purchaseRoute.get("/my-purchases", userAuth, async (req, res) => {
    const userId = req.userId; // Extracted from userAuth middleware

    try {
        // Fetch the purchases made by the current user with populated course data
        const purchases = await purchaseModel.find({ userId }).populate("courseId");

        // If no purchases found for the user
        if (purchases.length === 0) {
            return res.status(404).json({
                message: "No purchases found for this user",
            });
        }

        res.json({
            purchases,
            message: "Your purchases fetched successfully",
        });
    } catch (error) {
        console.error("Error fetching user purchases:", error);
        res.status(500).json({
            message: "Failed to fetch your purchase data",
            error: error.message,
        });
    }
});

module.exports = {
    purchaseRoute,
};
