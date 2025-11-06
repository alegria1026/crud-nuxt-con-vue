import { verifyToken } from '../utils/auth';

export default defineEventHandler((event) => {
    const token = getCookie(event, 'token');
    const user = token ? verifyToken(token) : null;
    event.context.user = user;

    if (event.node.req.url?.startsWith('/api/posts') && !user) {
        throw createError({ statusCode: 401, statusMessage: 'No autorizado' });
    }
});