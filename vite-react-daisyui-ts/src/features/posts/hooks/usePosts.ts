import { useQuery } from '@tanstack/react-query';
import type { Post } from '../api/postsApi';
import { postsApi } from '../api/postsApi';

export const usePosts = () => {
  // Pobierz wszystkie posty
  const { 
    data: posts = [], 
    isLoading, 
    error,
    refetch,
  } = useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: () => postsApi.getPosts(),
  });

  return {
    posts,
    isLoading,
    error,
    refetch,
  };
};

// Hook for getting a single post
export const usePost = (id: number) => {
  return useQuery<Post>({
    queryKey: ['post', id],
    queryFn: () => postsApi.getPost(id),
    enabled: !!id,
  });
};
