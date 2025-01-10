import jwt from "jsonwebtoken";

// Middleware to verify token
export const verifyToken = (req, res, next) => {
    const token = req.cookies?.accessToken;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "You are not authorized. Token missing.",
        });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(401).json({
                success: false,
                message: "Token is invalid or expired.",
            });
        }

        req.user = user; // Attach the user data to the request object
        next(); // Proceed to the next middleware or route handler
    });
};

// Middleware to verify user
export const verifyUser = (req, res, next) => {
    verifyToken(req, res, next, () => {
        if (req.user.id === req.params.id || req.user.role === "admin") {
            next(); // User is authenticated
        } else {
            return res.status(403).json({
                success: false,
                message: "You are not authenticated .",
            });
        }
    });
};

// Middleware to verify admin
export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, next, () => {
        if (req.user.role === "admin") {
            next(); // User is an admin
        } else {
            return res.status(403).json({
                success: false,
                message: "You are not authorized .",
            });
        }
    });
};
