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

  // Pobierz pojedynczy post
  const getPost = (id: number) => {
    return useQuery<Post>({
      queryKey: ['post', id],
      queryFn: () => postsApi.getPost(id),
      enabled: !!id,
    });
  };

  return {
    posts,
    getPost,
    isLoading,
    error,
    refetch,
  };
};
