import pool from '../db/pool.js';
import { getMessage } from '../constants/messages.js';

export const getTodos = async (req, res, next) => {
  const userId = req.user?.userId;
  const lang = req.headers['accept-language']?.split(',')[0] || 'en';
  if (!userId) {
    return res.status(401).json({
      status: 401,
      message: getMessage('error_forbidden', lang),
      details: { error: getMessage('error_user_not_verified', lang) },
    });
  }
  try {
    const result = await pool.query('SELECT * FROM todos WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    return res.status(200).json({ status: 200, message: getMessage('success_todo_get', lang), todos: result.rows });
  } catch (err) {
    return res
      .status(500)
      .json({ status: 500, message: getMessage('error_server', lang), details: { error: err.message } });
  }
};

export const createTodo = async (req, res, next) => {
  const userId = req.user?.userId;
  const { title, description, due_date } = req.body;
  const lang = req.headers['accept-language']?.split(',')[0] || 'en';
  if (!userId || !title) {
    return res.status(400).json({
      status: 400,
      message: getMessage('error_fields_required', lang),
      details: { field: !userId ? 'user_id' : 'title' },
    });
  }
  try {
    const result = await pool.query(
      'INSERT INTO todos (user_id, title, description, due_date) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, title, description || null, due_date || null]
    );
    return res.status(201).json({ status: 201, message: getMessage('success_todo_add', lang), todo: result.rows[0] });
  } catch (err) {
    return res
      .status(500)
      .json({ status: 500, message: getMessage('error_server', lang), details: { error: err.message } });
  }
};

export const updateTodo = async (req, res, next) => {
  const { todo_id } = req.params;
  const { title, description, completed, due_date } = req.body;
  const lang = req.headers['accept-language']?.split(',')[0] || 'en';
  if (!todo_id) {
    return res
      .status(400)
      .json({ status: 400, message: getMessage('error_fields_required', lang), details: { field: 'todo_id' } });
  }
  try {
    const result = await pool.query(
      `UPDATE todos SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        completed = COALESCE($3, completed),
        due_date = COALESCE($4, due_date),
        updated_at = CURRENT_TIMESTAMP
      WHERE todo_id = $5
      RETURNING *`,
      [title, description, completed, due_date, todo_id]
    );
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ status: 404, message: getMessage('todo_not_found', lang), details: { field: 'todo_id' } });
    }
    return res.status(200).json({ status: 200, message: getMessage('success_todo_edit', lang), todo: result.rows[0] });
  } catch (err) {
    return res
      .status(500)
      .json({ status: 500, message: getMessage('error_server', lang), details: { error: err.message } });
  }
};

export const deleteTodo = async (req, res, next) => {
  const { todo_id } = req.params;
  const lang = req.headers['accept-language']?.split(',')[0] || 'en';
  if (!todo_id) {
    return res
      .status(400)
      .json({ status: 400, message: getMessage('error_fields_required', lang), details: { field: 'todo_id' } });
  }
  try {
    const result = await pool.query('DELETE FROM todos WHERE todo_id = $1 RETURNING *', [todo_id]);
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ status: 404, message: getMessage('todo_not_found', lang), details: { field: 'todo_id' } });
    }
    return res.status(200).json({ status: 200, message: getMessage('success_todo_delete', lang) });
  } catch (err) {
    return res
      .status(500)
      .json({ status: 500, message: getMessage('error_server', lang), details: { error: err.message } });
  }
};

export const toggleCompleted = async (req, res, next) => {
  const { todo_id } = req.params;
  const lang = req.headers['accept-language']?.split(',')[0] || 'en';
  if (!todo_id) {
    return res
      .status(400)
      .json({ status: 400, message: getMessage('error_fields_required', lang), details: { field: 'todo_id' } });
  }
  try {
    const result = await pool.query(
      `UPDATE todos SET
        completed = NOT completed,
        updated_at = CURRENT_TIMESTAMP
      WHERE todo_id = $1
      RETURNING *`,
      [todo_id]
    );
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ status: 404, message: getMessage('todo_not_found', lang), details: { field: 'todo_id' } });
    }
    return res
      .status(200)
      .json({ status: 200, message: getMessage('success_todo_toggle', lang), todo: result.rows[0] });
  } catch (err) {
    return res
      .status(500)
      .json({ status: 500, message: getMessage('error_server', lang), details: { error: err.message } });
  }
};
