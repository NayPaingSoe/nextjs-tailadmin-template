'use client';

import { useState } from 'react';
import { 
  useGetUsersQuery, 
  useCreateUserMutation, 
  useUpdateUserMutation, 
  useDeleteUserMutation 
} from '@/redux/services/api';

interface UserFormData {
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
}

const initialFormData: UserFormData = {
  name: '',
  username: '',
  email: '',
  phone: '',
  website: ''
};

const SampleUsers = () => {
  // Using RTK Query hooks
  const { data: users, error, isLoading } = useGetUsersQuery(undefined);
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  
  // State for form data and editing
  const [formData, setFormData] = useState<UserFormData>(initialFormData);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingUserId) {
        // Update existing user
        await updateUser({ id: editingUserId, ...formData });
      } else {
        // Create new user
        await createUser({
          ...formData,
          // These fields are required by the API but not in our form
          company: { name: 'Default Company' },
          address: { city: '', street: '', suite: '', zipcode: '' }
        });
      }
      
      // Reset form
      setFormData(initialFormData);
      setEditingUserId(null);
      setIsFormVisible(false);
    } catch (err) {
      console.error('Error saving user:', err);
    }
  };

  // Start editing a user
  const handleEdit = (user: any) => {
    setEditingUserId(user.id);
    setFormData({
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone,
      website: user.website
    });
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
            setFormData(initialFormData);
            setEditingUserId(null);
            setIsFormVisible(!isFormVisible);
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isFormVisible ? 'Cancel' : 'Add User'}
        </button>
      </div>
      
      {isFormVisible && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded-md bg-gray-50">
          <h3 className="mb-4 font-bold">{editingUserId ? 'Edit User' : 'Add New User'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Website</label>
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
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
          <p>Error: {(error as any).message}</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {users?.map((user: any) => (
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