import React, { useState, useEffect } from 'react';
import { UserApi } from "@/data";
import { Typography, Button } from '@material-tailwind/react';
import MessageCard from './message-card'; // Assuming you have MessageCard as a separate component
import Server from '@/data/conf';

const ListUser = ({size}) => {
  const [listUsers, setListUsers] = useState([]);
  const baseURL = Server.baseURL;
  const basePort = Server.basePort;
  const deleteUserPath = "/users/delete";
  const token = localStorage.getItem('token');

  useEffect(() => {
    UserApi().then((result) => {
      setListUsers(result);
      console.log(listUsers);
    })
  }, []);

  // Function to handle deleting a user
  const deleteUser = async (id, username) => {
    const confirmLogout = window.confirm("Are you sure want to Delete this User?");

    if (confirmLogout) {
      try {
        const response = await fetch(`http://${baseURL}:${basePort}${deleteUserPath}/${id}`, {
          method: 'DELETE',
          Authorization: `Bearer ${token}`,
        });
  
        if (response.ok) {
          // If successful, remove user from the state
          setListUsers(listUsers.filter(user => user.id !== id));
          alert(`User with ${username} deleted successfully!`);
        } else {
          alert(`Failed to delete user: ${username}`); 
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  return (
    <div className='bg-opacity-5'>
      <Typography variant={size} className="mb-2 text-white text-center bg-opacity-80">
        List User
      </Typography>
      <Typography color="white" className="mb-3 md:mb-6 font-normal text-center">
        Admin role able to add new users or delete users 
      </Typography>
      <ul className="flex flex-col gap-6">
        {listUsers.map((props) => (
          <MessageCard
            key={props.username}
            {...props}
            action={
              <Button color='white' variant="text" size="sm" onClick={() => deleteUser( props.id, props.username,)}>
                Delete
              </Button>
            }
          />
        ))}
      </ul>
    </div>
  );
};

export default ListUser;
