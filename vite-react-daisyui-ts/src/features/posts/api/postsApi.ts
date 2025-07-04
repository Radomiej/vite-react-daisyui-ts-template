import { api } from '../../../lib/api';

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export const postsApi = {
  // Pobierz wszystkie posty
  getPosts: async (): Promise<Post[]> => {
    const { data } = await api.get<Post[]>('/posts');
    return data;
  },

  // Pobierz pojedynczy post
  getPost: async (id: number): Promise<Post> => {
    const { data } = await api.get<Post>(`/posts/${id}`);
    return data;
  },
};
