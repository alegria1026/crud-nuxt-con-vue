import { getPool } from '../utils/db';
import { verifyToken } from '../utils/auth';

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'token');
    if (!token) {
        setResponseStatus(event, 401);
        return { error: 'No autenticado' };
    }

    const decoded = verifyToken(token);
    if (!decoded) {
        setResponseStatus(event, 401);
        return { error: 'Token inválido o expirado' };
    }

    const pool = getPool();
    const [rows]: any = await pool.query('SELECT id, username FROM users WHERE id = ?', [decoded.id]);
    const user = rows[0];

    if (!user) {
        setResponseStatus(event, 404);
        return { error: 'Usuario no encontrado' };
    }

    return user;
});