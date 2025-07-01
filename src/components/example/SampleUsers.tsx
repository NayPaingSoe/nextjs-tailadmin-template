'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from '@/redux/services/api';
import Label from '../form/Label';
import Input from '../form/input/InputField';

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  company: {
    name: string;
  };
}

interface UserFormData {
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
}

const SampleUsers = () => {
  // Using RTK Query hooks
  const { data: users, error, isLoading } = useGetUsersQuery(undefined);
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UserFormData>({
    mode: 'onBlur',
  });

  // State for editing and form visibility
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Handle form submission
  const onSubmit = async (data: UserFormData) => {
    try {
      if (editingUserId) {
        // Update existing user
        await updateUser({ id: editingUserId, ...data });
      } else {
        // Create new user
        await createUser({
          ...data,
          // These fields are required by the API but not in our form
          company: { name: 'Default Company' },
          address: { city: '', street: '', suite: '', zipcode: '' },
        });
      }

      // Reset form
      reset();
      setEditingUserId(null);
      setIsFormVisible(false);
    } catch (err) {
      console.error('Error saving user:', err);
    }
  };

  // Start editing a user
  const handleEdit = (user: User) => {
    setEditingUserId(user.id);
    setValue('name', user.name);
    setValue('username', user.username);
    setValue('email', user.email);
    setValue('phone', user.phone);
    setValue('website', user.website);
    setIsFormVisible(true);
  };

  // Delete a user
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
      } catch (err) {
        console.error('Error deleting user:', err);
      }
    }
  };

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Sample Users</h2>
        <button
          onClick={() => {
            reset();
            setEditingUserId(null);
            setIsFormVisible(!isFormVisible);
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isFormVisible ? 'Cancel' : 'Add User'}
        </button>
      </div>

      {isFormVisible && (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-6 p-4 border rounded-md bg-gray-50">
          <h3 className="mb-4 font-bold">{editingUserId ? 'Edit User' : 'Add New User'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Name</Label>
              <Input
                {...register('name', { required: 'Name is required.' })}
                type="text"
                error={!!errors.name}
                hint={errors.name?.message}
              />
            </div>
            <div>
              <Label>Username</Label>
              <Input
                {...register('username', { required: 'Username is required.' })}
                type="text"
                error={!!errors.username}
                hint={errors.username?.message}
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                {...register('email', {
                  required: 'Email is required.',
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: 'Entered value does not match email format.',
                  },
                })}
                type="email"
                error={!!errors.email}
                hint={errors.email?.message}
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input {...register('phone')} type="text" />
            </div>
            <div>
              <Label>Website</Label>
              <Input {...register('website')} type="text" />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            {editingUserId ? 'Update' : 'Create'}
          </button>
        </form>
      )}

      <div className="flex gap-2">
        {isLoading ? (
          <p>Loading users...</p>
        ) : error ? (
          <p>Error: {'data' in error ? JSON.stringify(error.data) : 'message' in error ? error.message : 'An error occurred'}</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {users?.map((user: User) => (
              <li key={user.id} className="border p-4 rounded-md relative">
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
                <h3 className="font-bold mt-4">{user.name}</h3>
                <p>Username: {user.username}</p>
                <p>Email: {user.email}</p>
                <p>Phone: {user.phone}</p>
                <p>Website: {user.website}</p>
                <p>Company: {user.company.name}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SampleUsers;