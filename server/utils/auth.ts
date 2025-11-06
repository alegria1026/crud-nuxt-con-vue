import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'devsecret';

export function comparePassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
}

export function generateToken(userId: number) {
    return jwt.sign({ id: userId }, SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
    try {
        return jwt.verify(token, SECRET) as { id: number };
    } catch {
        return null;
    }
}