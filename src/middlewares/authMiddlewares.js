import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../utilities/secret.js';

export const authMiddleware = (req, res, next) => {
    // Get the token from the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Attach user information to request
        req.user = decoded;

        // Proceed to the next middleware or route handler
        next();
    } catch (err) {
        console.error('Token verification failed:', err);
        res.status(403).json({ error: 'Invalid or expired token.' });
    }
};
