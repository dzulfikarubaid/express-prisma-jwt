
import { getUsers, updateUser, deleteUser } from '../controllers/userControllers.js'
import { authMiddleware } from '../middlewares/authMiddlewares.js'
import express from 'express'
const userRoutes = express.Router()


userRoutes.get('/users', authMiddleware, getUsers)
userRoutes.put('/users/:id', authMiddleware, updateUser)
userRoutes.delete('/users/:id', authMiddleware, deleteUser)

export default userRoutes