import { getPool } from '../utils/db';

export default defineEventHandler(async (event) => {
    const pool = getPool();
    const method = getMethod(event);

    // GET /api/posts          -> lista
    // GET /api/posts?id=1     -> detalle
    if (method === 'GET') {
        const { id } = getQuery(event);
        if (id) {
            const [rows] = await pool.query('SELECT * FROM posts WHERE id = ?', [id]);
            if (Array.isArray(rows) && rows.length) return rows[0];
            setResponseStatus(event, 404);
            return { error: 'No encontrado' };
        } else {
            const [rows] = await pool.query('SELECT * FROM posts ORDER BY created_at DESC');
            return rows;
        }
    }

    // POST /api/posts         -> crear
    if (method === 'POST') {
        const body = await readBody<{title?: string; content?: string}>(event);
        if (!body?.title || !body?.content) {
            setResponseStatus(event, 400);
            return { error: 'title y content son requeridos' };
        }
        const [result]: any = await pool.query(
            'INSERT INTO posts (title, content) VALUES (?, ?)',
            [body.title, body.content]
        );
        return { id: result.insertId, ...body };
    }

    // PUT /api/posts?id=1     -> actualizar
    if (method === 'PUT') {
        const { id } = getQuery(event);
        if (!id) { setResponseStatus(event, 400); return { error: 'id requerido' }; }
        const body = await readBody<{title?: string; content?: string}>(event);
        const [result]: any = await pool.query(
            'UPDATE posts SET title = COALESCE(?, title), content = COALESCE(?, content) WHERE id = ?',
            [body?.title ?? null, body?.content ?? null, id]
        );
        return { updated: result.affectedRows > 0 };
    }

    // DELETE /api/posts?id=1  -> borrar
    if (method === 'DELETE') {
        const { id } = getQuery(event);
        if (!id) { setResponseStatus(event, 400); return { error: 'id requerido' }; }
        const [result]: any = await pool.query('DELETE FROM posts WHERE id = ?', [id]);
        return { deleted: result.affectedRows > 0 };
    }

    setResponseStatus(event, 405);
    return { error: 'Método no soportado' };
});