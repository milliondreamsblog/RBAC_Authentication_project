const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config"); // Unified JWT secret

// General role-based middleware
function roleAuth(requiredRole) {
    return (req, res, next) => {
        const token = req.headers.token;

        if (!token) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        try {
            // Verify the token
            const response = jwt.verify(token, JWT_SECRET);

            // Attach user data to request object
            req.userId = response.id;
            req.userRole = response.role; // Assume token contains role field

            // Check if the user has the required role
            if (response.role === requiredRole) {
                return next(); // Proceed if the role matches
            } else {
                return res.status(403).json({ message: "Forbidden. Insufficient permissions." });
            }
        } catch (err) {
            return res.status(400).json({ message: "Invalid token." });
        }
    };
}

// Export role-based middlewares
module.exports = {
    adminAuth: roleAuth("admin"), // Middleware for admin
    userAuth: roleAuth("user"),  // Middleware for regular user
};
