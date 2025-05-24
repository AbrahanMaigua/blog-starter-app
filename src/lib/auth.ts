import bcrypt from "bcryptjs"; 
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "defaultsecret"; 

if (JWT_SECRET === "defaultsecret") {
    console.warn("Warning: Using default JWT secret. Please set JWT_SECRET in your environment variables.");
}


export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hashedPassword: string) {
  return await bcrypt.compare(password, hashedPassword);
}

export function generateToken(user: any) {
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }
    // Check if user is an object and has an _id property
    if (typeof user !== 'object' || !user._id) {
        throw new Error('Invalid user object');
    }
    // Generate a JWT token with the user's id
  return jwt.sign({ id: user._id }, JWT_SECRET, {  expiresIn: "30d"  });
}

export function verifyToken(token: string) {
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }
    return jwt.verify(token, JWT_SECRET);
}