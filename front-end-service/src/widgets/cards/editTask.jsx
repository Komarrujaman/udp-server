import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useParams } from 'react-router-dom'; // Ensure you have react-router-dom installed

import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Button,
  Typography,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Alert
} from "@material-tailwind/react";
import { CreditCardIcon } from "@heroicons/react/24/solid";
import Server from "@/data/conf";

export default function EditTask() {
  const { id } = useParams(); // Extract id from the URL params
  const [type, setType] = useState("card");
  const [inputData, setInputData] = useState({
    name: '',
    server: '',
    port: '',
    username: '',
    password: '',
    prefix: '',
    ftp_url: '',
    ftp_port: '',
    ftp_user: '',
    ftp_pass: '',
    ftp_dir: '',
    send_interval: '',
    status: '',
  });
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [greenAlertPost, setGreenAlertPost] = useState(false);
  const [redAlertPost, setRedAlertPost] = useState(false);
  
  const backEndUrl = Server.baseURL;
  const backEndPort = Server.basePort;
  const backEndPath = `/editTaskById/${id}`; // Use the edit path with task ID

  // Fetch existing task data when the component mounts
  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        const response = await axios.get(`http://${backEndUrl}:${backEndPort}/getTaskById/${id}`); // Make sure you have this endpoint
        setInputData(response.data.data);
        
      } catch (error) {
        console.error('Error fetching task data:', error);
      }
    };
    fetchTaskData();
  }, [id]); // Fetch when the ID changes

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputData({
      ...inputData,
      [name]: value,
    });
  };

  const postData = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const fullUrl = `http://${backEndUrl}:${backEndPort}${backEndPath}`;

    const dataToSend = {
      data: inputData,
    };

    fetch(fullUrl, {
      method: 'PUT', // Change to PUT for updating
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    })
      .then(response => response.json())
      .then(data => {
        setResponseMessage(`Server response: ${data.message}`);
        setGreenAlertPost(true);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error sending data:', error);
        setResponseMessage('Error sending data');
        setRedAlertPost(true);
        setLoading(false);
      });
  };
 
  return (
    <Card className="w-full mt-5 md:mt-10">
      <CardHeader
        floated={false}
        shadow={false}
        className="m-0 grid place-items-center px-4 py-8 text-center bg-orange-600 shadow-sm"
      >
        <Typography variant="h4" color="white">
          Edit Task
        </Typography>
        <div className="mb-4 h-20 p-6 text-white">
          <CreditCardIcon className="h-10 w-10 text-white mx-auto" />
          <h2 className="font-bold text-white">NVR CONFIGURATION</h2>
        </div>
      </CardHeader>
      <CardBody>
        <Tabs value={type} className="overflow-visible">
          <TabsHeader className="relative z-0 ">
            <Tab value="card" onClick={() => setType("card")}>
              NVR API Credentials
            </Tab>
            <Tab value="paypal" onClick={() => setType("paypal")}>
              FTP API Credentials
            </Tab>
          </TabsHeader>
            
          <form className="mt-12 block lg:flex" onSubmit={postData}>
            <div className="w-full mr-2 lg:w-1/2">
              <div className="mt-3">
                <Typography variant="small" color="blue-gray" className="my-2 font-medium ">
                  Task Name
                </Typography>
                <Input
                  placeholder="Antares CCTV"
                  type="text"
                  name="name"
                  className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{ className: "before:content-none after:content-none" }}
                  value={inputData.name || ''}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="my-2 font-medium">
                  NVR Server
                </Typography>
                <Input
                  type="text"
                  name="server"
                  placeholder="36.92.168.180"
                  className=" !border-t-blue-gray-200 focus:!border-t-gray-900 mb-2"
                  labelProps={{ className: "before:content-none after:content-none" }}
                  value={inputData.server}
                  onChange={handleChange}
                />
              </div>
              <div className="">
                <Typography variant="small" color="blue-gray" className="my-2 font-medium ">
                  NVR Username
                </Typography>
                <Input
                  placeholder="admin"
                  type="text"
                  name="username"
                  className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{ className: "before:content-none after:content-none" }}
                  value={inputData.username}
                  onChange={handleChange}
                />
              </div>
              <div className="">
                <Typography variant="small" color="blue-gray" className="my-2 font-medium ">
                  NVR Password
                </Typography>
                <Input
                  placeholder="******"
                  type="password"
                  name="password"
                  className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{ className: "before:content-none after:content-none" }}
                  value={inputData.password}
                  onChange={handleChange}
                />
              </div>
              <div className="">
                <Typography variant="small" color="blue-gray" className="my-2 font-medium">
                  NVR Port
                </Typography>
                <Input
                  placeholder="3000"
                  type="text"
                  name="port"
                  className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{ className: "before:content-none after:content-none" }}
                  value={inputData.port}
                  onChange={handleChange} 
                />
              </div>
              <div className="mb-3">
                <Typography variant="small" color="blue-gray" className="my-2 font-medium">
                  NVR Prefix
                </Typography>
                <Input
                  type="text"
                  name="prefix"
                  placeholder="cgi-bin/snapshot.cgi?channel=5&subtype=1"
                  className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{ className: "before:content-none after:content-none" }}
                  value={inputData.prefix}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="w-full lg:w-1/2">
              <div className="my-3">
                <Typography variant="small" color="blue-gray" className="my-2 font-medium">
                  FTP URL
                </Typography> 
                <Input
                  placeholder="www.gombel.xyz"
                  name="ftp_url"
                  className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{ className: "before:content-none after:content-none" }}
                  value={inputData.ftp_url}
                  onChange={handleChange}
                />
                <Typography
                  placeholder="antares.id"
                  type="text"
                  variant="small"
                  color="blue-gray"
                  className="my-2 font-medium"
                >
                  FTP Port
                </Typography>
                <Input
                  placeholder="3000"
                  type="text"
                  name="ftp_port"
                  className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{ className: "before:content-none after:content-none" }}
                  value={inputData.ftp_port}
                  onChange={handleChange}
                />
                <Typography variant="small" color="blue-gray" className="my-2 font-medium">
                  FTP Username
                </Typography>
                <Input
                  placeholder="admin"
                  type="text"
                  name="ftp_user"
                  className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{ className: "before:content-none after:content-none" }}
                  value={inputData.ftp_user}
                  onChange={handleChange}
                />
                <Typography variant="small" color="blue-gray" className="my-2 font-medium">
                  FTP Password
                </Typography>
                <Input
                  placeholder="******"
                  type="password"
                  name="ftp_pass"
                  className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{ className: "before:content-none after:content-none" }}
                  value={inputData.ftp_pass}
                  onChange={handleChange}
                />
                <Typography variant="small" color="blue-gray" className="my-2 font-medium">
                  FTP Directory
                </Typography>
                <Input
                  placeholder="/data"
                  type="text"
                  name="ftp_dir"
                  className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{ className: "before:content-none after:content-none" }}
                  value={inputData.ftp_dir}
                  onChange={handleChange}
                />
                <Typography variant="small" color="blue-gray" className="my-2 font-medium">
                  Send Interval
                </Typography>
                <Input
                  type="number"
                  name="send_interval"
                  className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{ className: "before:content-none after:content-none" }}
                  value={inputData.send_interval}
                  onChange={handleChange}
                />
              </div>
              <Button
                type="submit"
                className="mt-6 w-full"
                color="orange"
                disabled={loading} // Disable button while loading
              >
                {loading ? 'Updating...' : 'Update Task'}
              </Button>
            </div>
          </form>
        {greenAlertPost && (
          <Alert
            variant="filled"
            color="green"
            onClose={() => setGreenAlertPost(false)}
            className="mb-4"
          >
            {responseMessage}
          </Alert>
        )}
        {redAlertPost && (
          <Alert
            variant="filled"
            color="red"
            onClose={() => setRedAlertPost(false)}
            className="mb-4"
          >
            {responseMessage}
          </Alert>
        )}
        </Tabs> 
      </CardBody>
    </Card>
  );
}
