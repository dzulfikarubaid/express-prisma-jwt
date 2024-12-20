import express from "express";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js"
import { PORT } from "./utilities/secret.js";
const app = express();

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/api', userRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})