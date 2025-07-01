import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

// Define a service using a base URL and expected endpoints
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.NEXT_PUBLIC_APP_BASE_URL || '',
    prepareHeaders: (headers, { getState }) => {
      // Get the token from the auth state
      const token = (getState() as RootState).auth.token;
      
      // If we have a token, add it to the headers
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      
      return headers;
    },
  }),
  tagTypes: ['Posts', 'Users'],
  endpoints: (builder) => ({
    // Define your endpoints here
    getPosts: builder.query({
      query: () => 'https://jsonplaceholder.typicode.com/posts',
      providesTags: ['Posts'],
    }),

    getPost: builder.query({
      query: (id) => `https://jsonplaceholder.typicode.com/posts/${id}`,
      providesTags: (result, error, id) => [{ type: 'Posts', id }],
    }),
    createPost: builder.mutation({
      query: (newPost) => ({
        url: 'https://jsonplaceholder.typicode.com/posts',
        method: 'POST',
        body: newPost,
      }),
      invalidatesTags: ['Posts'],
    }),
    updatePost: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `https://jsonplaceholder.typicode.com/posts/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Posts', id }],
    }),
    deletePost: builder.mutation({
      query: (id) => ({
        url: `https://jsonplaceholder.typicode.com/posts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Posts'],
    }),
    
    // User endpoints
    getUsers: builder.query({
      query: () => 'https://jsonplaceholder.typicode.com/users',
      providesTags: ['Users'],
    }),
    
    // New endpoints for user operations
    createUser: builder.mutation({
      query: (newUser) => ({
        url: 'https://jsonplaceholder.typicode.com/users',
        method: 'POST',
        body: newUser,
      }),
      invalidatesTags: ['Users'],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `https://jsonplaceholder.typicode.com/users/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Users', id }],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `https://jsonplaceholder.typicode.com/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
    useGetPostsQuery,
    useGetPostQuery,
    useCreatePostMutation,
    useUpdatePostMutation,
    useDeletePostMutation,
    useGetUsersQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
  } = api;