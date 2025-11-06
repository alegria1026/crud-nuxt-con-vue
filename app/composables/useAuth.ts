export const useAuth = () => {
    const user = useState<{ id: number; username: string } | null>('user', () => null);
    const loading = useState('auth-loading', () => false);

    const login = async (username: string, password: string) => {
        loading.value = true;
        try {
            const res = await $fetch('/api/login', { method: 'POST', body: { username, password } });
            user.value = res;
        } finally {
            loading.value = false;
        }
    };

    const fetchUser = async () => {
        if (user.value) return;
        try {
            const res = await $fetch('/api/me');
            user.value = res;
        } catch {
            user.value = null; // no autenticado
        }
    };

    return { user, login, fetchUser, loading };
};
