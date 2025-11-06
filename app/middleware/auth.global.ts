import { useAuth } from '~/composables/useAuth';

export default defineNuxtRouteMiddleware(async (to) => {
    const { user, fetchUser } = useAuth();

    // Si estamos en SSR, saltamos
    if (process.server) return;

    // Si aún no tenemos usuario, intentamos restaurarlo desde la cookie
    if (!user.value) {
        await fetchUser();
    }

    // Si después de intentar no hay usuario, redirige
    if (!user.value && to.path !== '/login') {
        return navigateTo('/login');
    }
});
