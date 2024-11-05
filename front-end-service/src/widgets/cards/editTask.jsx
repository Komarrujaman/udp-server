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
  const { serial_number } = useParams(); // Extract id from the URL params
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
  const backEndPath = `/device/update/${serial_number}`; // Use the edit path with task ID

  // Fetch existing task data when the component mounts
  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        const response = await axios.get(`http://${backEndUrl}:${backEndPort}/devices/${serial_number}`); // Make sure you have this endpoint
        setInputData(response.data.data);
        
      } catch (error) {
        console.error('Error fetching task data:', error);
      }
    };
    fetchTaskData();
  }, [serial_number]); // Fetch when the ID changes

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
    <Card className="w-full mt-5 md:mt-10 bg-white bg-opacity-5">
      <CardHeader
        floated={false}
        shadow={false}
        className="m-0 grid place-items-center px-4 py-8 text-center bg-orange-600 shadow-sm"
      >
        
        <Typography variant="h4" color="white">
          Edit Device
        </Typography>

        <div className="mb-4 h-20 p-6 text-gray-300">
          <CreditCardIcon className="h-10 w-10 text-gray-300 mx-auto"/>
        </div>
      </CardHeader>
      <CardBody>
        <Tabs value={type} className="overflow-visible">
          <form className="mt-6 block lg:flex" onSubmit={postData}>
              <div className="w-full mr-2">
                <div className="mt-3">
                  <Typography
                    variant="small"
                    className="my-2 font-medium text-gray-300"
                  >
                    Serial Number
                  </Typography>

                  <Input
                    placeholder="7e067024084498"
                    type="text"
                    name="serial_number"
                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900 text-gray-300"
                    labelProps={{
                      className: "before:content-none after:content-none",
                    }}
                    value={serial_number}
                    onChange={handleChange}
                  />
                </div>

              </div>

            </form> 
            <Button className="w-full mt-4 bg-gray-500" onClick={postData}>Save</Button>
            <Alert open={greenAlertPost} className="" color="green" onClose={() => setGreenAlertPost(false)}>
                  Device succesfully updated.
            </Alert>
            <Alert open={redAlertPost} className="" color="red" onClose={() => setRedAlertPost(false)}>
                  Device not succesfully updated.
            </Alert>           
        </Tabs>
      </CardBody>
    </Card>
  );
}
