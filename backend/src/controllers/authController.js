import pool from '../db/pool.js';
import { hashPassword, comparePassword, generateToken } from '../services/authService.js';
import { getMessage } from '../constants/messages.js';

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  const lang = req.headers['accept-language']?.split(',')[0] || 'en';
  if (!username || !email || !password) {
    return res.status(400).json({
      status: 400,
      message: getMessage('error_invalid_data', lang),
      details: {
        field: !username ? 'username' : !email ? 'email' : 'password',
      },
    });
  }
  try {
    const userCheck = await pool.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);
    if (userCheck.rows.length > 0) {
      return res.status(409).json({
        status: 409,
        message: getMessage('error_register_exists', lang),
        details: {
          field: userCheck.rows[0].username === username ? 'username' : 'email',
        },
      });
    }
    const hashedPassword = await hashPassword(password);
    await pool.query('INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)', [
      username,
      email,
      hashedPassword,
    ]);
    res.status(201).json({
      status: 201,
      message: getMessage('success_register', lang),
      details: null,
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: getMessage('error_server', lang),
      details: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  const lang = req.headers['accept-language']?.split(',')[0] || 'en';
  if (!username || !password) {
    return res.status(400).json({
      status: 400,
      message: getMessage('error_invalid_data', lang),
      details: {
        field: !username ? 'username' : 'password',
        error: 'This field is required',
      },
    });
  }
  try {
    const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({
        status: 401,
        message: getMessage('error_login', lang),
        details: {
          field: 'username',
          error: 'No user found with this username',
        },
      });
    }
    const user = userResult.rows[0];
    const match = await comparePassword(password, user.password_hash);
    if (!match) {
      return res.status(401).json({
        status: 401,
        message: getMessage('error_login', lang),
        details: {
          field: 'password',
          error: 'Incorrect password',
        },
      });
    }
    const token = generateToken(user);
    await pool.query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = $1', [user.user_id]);
    return res.status(200).json({
      status: 200,
      message: getMessage('success_login', lang),
      token,
      id: user.user_id,
      username: user.username,
      email: user.email,
      details: null,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: getMessage('error_server', lang),
      details: { error: err.message },
    });
  }
};

export const logout = (req, res) => {
  const lang = req.headers['accept-language']?.split(',')[0] || 'en';
  res.clearCookie('token');
  return res.status(200).json({ status: 200, message: getMessage('success_logout', lang) });
};
