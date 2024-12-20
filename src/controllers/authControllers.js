import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
const { hashSync, compareSync } = bcryptjs;
import { JWT_SECRET } from '../utilities/secret.js';
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const sendErrorResponse = (res, statusCode, message) => {
    res.status(statusCode).json({ error: message });
};

export const register = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validate input
        if (!email || !password) {
            return sendErrorResponse(res, 400, 'Email and password are required');
        }

        const existingUser = await prisma.user.findFirst({ where: { email } });
        if (existingUser) {
            return sendErrorResponse(res, 409, 'User already exists');
        }

        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashSync(password, 10),
            },
        });

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error('Registration error:', error);
        sendErrorResponse(res, 500, 'Internal server error');
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return sendErrorResponse(res, 400, 'Email and password are required');
        }
        const user = await prisma.user.findFirst({ where: { email } });
        if (!user) {
            return sendErrorResponse(res, 404, 'Email is not registered');
        }
        if (!compareSync(password, user.password)) {
            return sendErrorResponse(res, 401, 'Invalid password');
        }
        const token = jwt.sign({ id: user.id, email: email }, JWT_SECRET, { expiresIn: '24h' });
        res.status(200).json({ message: 'Login successful', user, token });
    } catch (error) {
        console.error('Login error:', error);
        sendErrorResponse(res, 500, 'Internal server error');
    }
};
