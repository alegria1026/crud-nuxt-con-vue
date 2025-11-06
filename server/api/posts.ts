import { getPool } from '../utils/db';

export default defineEventHandler(async (event) => {
    const pool = getPool();
    const method = getMethod(event);
    const user = event.context.user;

    if (method === 'GET') {
        const { id } = getQuery(event);
        if (id) {
            const [rows] = await pool.query('SELECT * FROM posts WHERE id = ?', [id]);
            return rows[0] || { error: 'No encontrado' };
        }
        const [rows] = await pool.query('SELECT * FROM posts ORDER BY created_at DESC');
        return rows;
    }

    if (!user) throw createError({ statusCode: 401, statusMessage: 'No autorizado' });

    if (method === 'POST') {
        const body = await readBody<{ title?: string; content?: string }>(event);
        if (!body?.title || !body?.content) {
            setResponseStatus(event, 400);
            return { error: 'title y content requeridos' };
        }
        const [result]: any = await pool.query(
            'INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)',
            [body.title, body.content, user.id]
        );
        return { id: result.insertId, ...body };
    }

    if (method === 'PUT') {
        const { id } = getQuery(event);
        const body = await readBody<{ title?: string; content?: string }>(event);
        const [rows]: any = await pool.query('SELECT * FROM posts WHERE id = ?', [id]);
        const post = rows[0];
        if (!post || post.user_id !== user.id) {
            throw createError({ statusCode: 403, statusMessage: 'No puedes editar este post' });
        }
        await pool.query(
            'UPDATE posts SET title = ?, content = ? WHERE id = ?',
            [body.title, body.content, id]
        );
        return { updated: true };
    }

    if (method === 'DELETE') {
        const { id } = getQuery(event);
        const [rows]: any = await pool.query('SELECT * FROM posts WHERE id = ?', [id]);
        const post = rows[0];
        if (!post || post.user_id !== user.id) {
            throw createError({ statusCode: 403, statusMessage: 'No puedes borrar este post' });
        }
        await pool.query('DELETE FROM posts WHERE id = ?', [id]);
        return { deleted: true };
    }
});