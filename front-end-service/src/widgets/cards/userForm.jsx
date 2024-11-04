
import Server from "@/data/conf";
import { FlagIcon } from "@heroicons/react/24/solid";
import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
  Select,
  Option,
  Alert
} from "@material-tailwind/react";

import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; 

export function UserForm() {
  const baseUrl = Server.baseURL;
  const baseport = Server.basePort;
  const addUserPath = '/postUserById';
  const token = localStorage.getItem('token');
  const [responseMessage, setResponseMessage] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [greenAlert, setGreenAlert] = useState(false);
  const [redAlert, setRedAlert] = useState(false);
  const [roles, setRoles] = useState("");
  const [newUserData, setNewUserData] = useState({
    username: "",
    email: "",
    password: "",
    role: "", 
  });

  const handleChange = (value) => {
    // Update the state directly with the selected value
    setNewUserData((prevData) => ({
      ...prevData,
      role: value, // Set the role directly
    }));
  }

  const postData = async (e) => {
    e.preventDefault();

    const postUrl = `http://${baseUrl}:${baseport}${addUserPath}`;

    fetch(postUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(newUserData),
    })
     .then(response => response.json())
     .then(data => {
      console.log(data);
      setResponseMessage(`Server status: ${data.status}`);  
      setLoading(false);
      setSuccess(true);
      if (data.status !== 200 && data.status !== 201) {
        setRedAlert(true);
        alert(data.message);

      } else {
        setGreenAlert(true);
        alert('Success added user');
        toast.success('User added successfully!', data.username);
        setTimeout(() => {
          window.location.reload();
        }, 4000);
      }
     })
     .catch(error => {
      console.error('Error sending data:', error);
      alert('Error sending data:', error);
      setResponseMessage('Error sending data');
      setLoading(false);
      setSuccess(false);
      setRedAlert(true);
     });
  }


  return (
    <Card shadow={false} className="bg-gray p-4 md:p-8 w-full md:w-1/2">
      <Typography variant="h4" color="blue-gray" className="text-center">
       Add New User
      </Typography>
      <Typography color="gray" className="mt-1 font-normal text-center">
        Nice to meet you! Enter your details to register.
      </Typography>
      <form className="mt-8 mb-2 w-full" onSubmit={postData}>
        <div className="mb-1 flex flex-col gap-6">
          <Typography variant="h6" color="blue-gray" className="-mb-3">
            Your Name
          </Typography>
          <Input
            size="lg"
            name="username"
            placeholder="name@mail.com"
            className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
            value={newUserData.username}
            onChange={(e) => setNewUserData({ ...newUserData, username: e.target.value })}
          />
          <Typography variant="h6" color="blue-gray" className="-mb-3">
            Your Email
          </Typography>
          <Input
            size="lg"
            name="email"
            placeholder="name@mail.com"
            className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
            value={newUserData.email}
            onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
          />
          <Typography variant="h6" color="blue-gray" className="-mb-3">
            Password
          </Typography>
          <Input
            type="password"
            size="lg"
            name="password"
            placeholder="********"
            className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
            value={newUserData.password}
            onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
          />

          
          <Typography variant="h6" color="blue-gray" className="-mb-3">
            Role
          </Typography>
          <Select
            color="black"
            size="lg"
            label="Select Role"
            name="role"
            value={newUserData.role} // Bind the select to the state
            onChange={handleChange} // Call handleChange on selection
            className="mb-4"
          >
        <Option value="admin">Admin</Option>
        <Option value="user">User</Option>
      </Select>
        </div>
        
        {/* <Alert color="green" open={greenAlert} className="absolute top-1/2 z-50" onClose={() => setGreenAlert(false)}>
          User added successfully!
        </Alert>
        
        <Alert color="red" open={redAlert} className="absolute top-1/2 z-50" onClose={() => setRedAlert(false)}>
          Failed : {responseMessage}
        </Alert> */}
        
        <Button className="mt-6" fullWidth type="submit">
          Add New User
        </Button>
      </form>
    </Card>
  )
}

export default UserForm;