import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import todoRoutes from './routes/todoRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT;
app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ message: 'API is running.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
