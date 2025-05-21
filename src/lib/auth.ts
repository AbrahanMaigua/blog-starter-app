import bcrypt from 'bcrypt';    
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hashedPassword: string) {
  return await bcrypt.compare(password, hashedPassword);
}

export function generateToken(user: any) {
  return jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
}

export function verifyToken(token: string) {
    return jwt.verify(token, JWT_SECRET);
}