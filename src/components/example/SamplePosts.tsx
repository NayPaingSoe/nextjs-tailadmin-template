'use client';

import { useGetPostsQuery } from '@/redux/services/api';

const SamplePosts = () => {
  // Using RTK Query hook instead of manual fetching
  const { data: posts, error, isLoading } = useGetPostsQuery(undefined);

  return (
    <div className="mt-6">
      <h2>Sample Posts</h2>
      <div className="flex gap-2">
        {isLoading ? (
          <p>Loading posts...</p>
        ) : error ? (
          <p>Error: {(error as any).message}</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts?.map((post: any) => (
              <li key={post.id} className="border p-4 rounded-md">
                <h3 className="font-bold">{post.title}</h3>
                <p>{post.body}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SamplePosts;
