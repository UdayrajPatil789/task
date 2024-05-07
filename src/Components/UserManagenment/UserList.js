import React, { useState, useEffect } from 'react';
import '../UserManagenment/UserList.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [editingUserId, setEditingUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
      setError('Failed to fetch users');
    }
  };

  const handleAddUser = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, role }),
      });
      if (!response.ok) {
        throw new Error('Failed to add user');
      }
      const newUser = await response.json();
      setUsers([...users, newUser]);
      setUsername('');
      setEmail('');
      setRole('user');
    } catch (error) {
      console.error(error);
      setError('Failed to add user');
    }
  };

  const handleDeleteUser = async id => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error(error);
      setError('Failed to delete user');
    }
  };

  const handleEditUser = async (id, updatedUser) => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });
      if (!response.ok) {
        throw new Error('Failed to edit user');
      }
      const updatedUserData = await response.json();
      setUsers(users.map(user => (user.id === id ? updatedUserData : user)));
      setEditingUserId(null);
    } catch (error) {
      console.error(error);
      setError('Failed to edit user');
    }
  };

  const handleEditClick = id => {
    setEditingUserId(id);
    const user = users.find(user => user.id === id);
    setUsername(user.username);
    setEmail(user.email);
    setRole(user.role);
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setUsername('');
    setEmail('');
    setRole('user');
  };

  return (
    <div className="container">
      <h1>User Management</h1>
      <div className="add-user-form">
        <h2>Add User</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        {editingUserId ? (
          <div>
            <button onClick={() => handleEditUser(editingUserId, { username, email, role })}>
              Save
            </button>
            <button onClick={handleCancelEdit}>Cancel</button>
          </div>
        ) : (
          <button onClick={handleAddUser}>Add User</button>
        )}
      </div>
      <div className="user-list">
        <h2>User List</h2>
        {error && <div className="error">{error}</div>}
        <ul>
          {users.map(user => (
            <li key={user.id}>
              {editingUserId === user.id ? (
                <div>
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                  <select value={role} onChange={e => setRole(e.target.value)}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              ) : (
                <div>
                  <span>{user.username}</span>
                  <span>{user.email}</span>
                  <span>{user.role}</span>
                </div>
              )}
              {editingUserId === user.id ? (
                <div>
                  <button onClick={() => handleEditUser(user.id, { username, email, role })}>
                    Save
                  </button>
                  <button onClick={handleCancelEdit}>Cancel</button>
                </div>
              ) : (
                <div>
                  <button onClick={() => handleEditClick(user.id)}>Edit</button>
                  <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserList;
