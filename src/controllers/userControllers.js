import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

const {hashSync} = bcryptjs
const prisma = new PrismaClient();

export const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const updatedUser = await prisma.user.update({
            where: { id: Number(id) },
            data: {
                email,
                password:hashSync(password),
            },
        });

        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedUser = await prisma.user.delete({
            where: { id: Number(id) },
        });

        res.status(200).json({ message: 'User deleted successfully', user: deletedUser });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
