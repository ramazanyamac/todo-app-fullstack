import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

export const generateToken = (user) => {
  return jwt.sign(
    { userId: user.user_id, username: user.username },
    process.env.JWT_SECRET || 'secretkey',
    { expiresIn: '1h' }
  );
};
