import { getPool } from '../utils/db';
import { comparePassword, generateToken } from '../utils/auth';

export default defineEventHandler(async (event) => {
    const pool = getPool();
    const body = await readBody<{ username: string; password: string }>(event);

    if (!body.username || !body.password) {
        setResponseStatus(event, 400);
        return { error: 'username y password requeridos' };
    }

    const [rows]: any = await pool.query('SELECT * FROM users WHERE username = ?', [body.username]);
    const user = rows[0];
    if (!user) {
        setResponseStatus(event, 401);
        return { error: 'Usuario no encontrado' };
    }

    const valid = await comparePassword(body.password, user.password_hash);
    if (!valid) {
        setResponseStatus(event, 401);
        return { error: 'Contraseña incorrecta' };
    }

    const token = generateToken(user.id);
    setCookie(event, 'token', token, { httpOnly: true, sameSite: 'lax', maxAge: 60 * 60 * 24 * 7 });

    return { id: user.id, username: user.username };
});