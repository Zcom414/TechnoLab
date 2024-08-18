/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Users() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([{ id: 1, name: 'Admin' }, { id: 2, name: 'Moderateur' }, { id: 3, name: 'Utilisateur' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    axios.get('http://127.0.0.1:3000/customers/')
      .then(response => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setError('Failed to fetch users');
        setLoading(false);
      });
  };

  const addUser = (user) => {
    axios.post('http://127.0.0.1:3000/customers/register', user)
      .then(() => {
        fetchUsers(); // Re-fetch users after adding
      })
      .catch(error => {
        console.error(error);
        setError('Failed to add user');
      });
  };
  const deleteUser = (userId) => {    
      console.log(userId)
    axios.delete(`http://127.0.0.1:3000/customers/${userId}`)
      .then(() => {
        fetchUsers(); // Re-fetch users after deleting
      })
      .catch(error => {
        console.error(error);
        setError('Failed to delete user');
      });
  };

  const updateUserRole = (userId, newRoleId) => {
    axios.put(`http://127.0.0.1:3000/customers/${userId}`, { id_roles: newRoleId })
      .then(() => {
        fetchUsers(); // Re-fetch users after updating
      })
      .catch(error => {
        console.error(error);
        setError('Failed to update user role');
      });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  
  return (
    <div className="dashboard">
      <h1>User Management</h1>
      <ul className="user-list">
        {users.map(user => (

          <li key={user.id} className="item mbt-demi mt-demi p-b-t-2em">
            {user.lastname}, {user.firstname} - Role: {roles.find(role => role.id === user.id_roles)?.name || 'No Role'}

          <div className='flex-wr center spc-ard'>
         

            {roles.filter(role => role.id !== user.id_roles).map(role => ( 
              //Si le role est différent du role.id alors tu m'affiches tout les boutons différents de user.id_roles
              
              <button 

              key={role.id} 
              onClick={() => updateUserRole(user.id, role.id)} 
              className = 'base-btn mt-demi'>

                Nommer {role.name} 

              </button>
            ))}     
              
              <button className='del-btn mt-demi' onClick={() => deleteUser(user.id)}>Supprimer{user.username}</button>

          </div>

          </li>
        ))}
      </ul>
      <button className='base-btn mt-demi center' onClick={() => addUser({ username: 'NewUser', id_roles: 2 })}>
        Ajouter un nouvel utilisateur
      </button>
    </div>
  );
}

export default Users;
