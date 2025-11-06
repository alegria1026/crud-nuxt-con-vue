import { useAuth } from '~/composables/useAuth';

export default defineNuxtRouteMiddleware(async (to) => {
    const { user, fetchUser } = useAuth();

    if (process.server) return;

    if (!user.value) {
        await fetchUser();
    }

    if (!user.value && to.path !== '/login') {
        return navigateTo('/login');
    }
});
