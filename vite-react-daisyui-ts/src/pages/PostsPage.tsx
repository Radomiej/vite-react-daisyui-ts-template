import { PostsList } from '../features/posts';

export const PostsPage = () => {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8">Posts</h1>
      <div className="max-w-6xl mx-auto">
        <PostsList />
      </div>
    </div>
  );
};
