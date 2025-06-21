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

  // Dodaj nowy post (symulacja)
  createPost: async (newPost: Omit<Post, 'id'>): Promise<Post> => {
    // W rzeczywistej aplikacji byłoby to żądanie POST
    // Symulujemy odpowiedź serwera, który nadaje ID i zwraca pełny obiekt posta
    console.log('Symulacja wysyłania posta:', newPost);
    const createdPost: Post = {
      ...newPost,
      id: Math.floor(Math.random() * 1000) + 100, // Symulowane ID
      userId: newPost.userId || 1, // Domyślne userId jeśli nie podano
    };
    // Symulacja opóźnienia sieciowego
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Symulacja odpowiedzi serwera:', createdPost);
    return createdPost;
  },
};
