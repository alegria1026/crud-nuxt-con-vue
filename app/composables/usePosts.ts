export type Post = {
    id: number;
    title: string;
    content: string;
    created_at: string;
};

export const usePosts = () => {
    const { data: posts, refresh } = useFetch<Post[]>('/api/posts');

    const createPost = async (title: string, content: string) => {
        await $fetch('/api/posts', {
            method: 'POST',
            body: { title, content }
        });
        await refresh();
    };

    const updatePost = async (id: number, title: string, content: string) => {
        await $fetch('/api/posts', {
            method: 'PUT',
            query: { id },
            body: { title, content }
        });
        await refresh();
    };

    const deletePost = async (id: number) => {
        await $fetch('/api/posts', {
            method: 'DELETE',
            query: { id }
        });
        await refresh();
    };

    return {
        posts,
        createPost,
        updatePost,
        deletePost,
        refresh
    };
};