import jwt from 'jsonwebtoken';
import { getMessage } from '../constants/messages.js';

export function authenticateToken(req, res, next) {
  const lang = req.headers['accept-language']?.split(',')[0] || 'en';
  const token = req.cookies?.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
  if (!token) {
    return res
      .status(401)
      .json({ status: 401, message: getMessage('error_token', lang), details: { error: 'Token yok' } });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    req.user = { userId: decoded.userId, username: decoded.username };
    next();
  } catch (err) {
    return res
      .status(403)
      .json({ status: 403, message: getMessage('error_token_invalid', lang), details: { error: err.message } });
  }
}
