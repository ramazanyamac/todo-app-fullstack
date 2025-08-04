import express from 'express';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../controllers/todoController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Tüm todo işlemleri için auth middleware
router.get('/', authenticateToken, getTodos);
router.post('/', authenticateToken, createTodo);
router.put('/:todo_id', authenticateToken, updateTodo);
router.delete('/:todo_id', authenticateToken, deleteTodo);

export default router;
