import React, { useState } from "react";
import axios from 'axios';

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
  Select,
  Option,
  Alert
} from "@material-tailwind/react";
import {
  BanknotesIcon,
  CreditCardIcon,
  LockClosedIcon,
} from "@heroicons/react/24/solid";
import Server from "@/data/conf";
 
export default function NVRForm() {
  const [type, setType] = React.useState("card");
  const [inputData, setInputData] = useState(
    {
      serial_number: '',
    }
  );
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [redAlertTes, setRedAlertTes] = React.useState(false);
  const [greenAlertTes, setGreenAlertTes] = React.useState(false);
  const [redAlertPost, setRedAlertPost] = React.useState(false);
  const [greenAlertPost, setGreenAlertPost] = React.useState(false);
  const backEndUrl = Server.baseURL;
  const backEndPort = Server.basePort;
  const backEndPath = '/postTaskById';
  const backEndTestPath = '/test-fetch-image';
  const testFtpPath = '/test-upload-image';

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputData({
      ...inputData,
      [name]: value
    });
  };

  const postData = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const fullUrl = `http://${backEndUrl}:${backEndPort}${backEndPath}`;

    console.log("back end:",fullUrl);
    const dataToSend = {
      data: inputData,
    };

    fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    })
      .then(response => response.json())
      .then(data => {
        setResponseMessage(`Server response: ${data.message}`);
        setSuccess(true);
        setGreenAlertPost(true);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error sending data:', error);
        setResponseMessage('Error sending data');
        setSuccess(false);
        setLoading(false);
        setRedAlertPost(true);
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
          Add New Device
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
                    name="serialNumber"
                    className=" !border-t-blue-gray-200 focus:!border-t-gray-900 text-gray-300"
                    labelProps={{
                      className: "before:content-none after:content-none",
                    }}
                    onChange={handleChange}
                  />
                </div>

              </div>

            </form> 
            <Button className="w-full mt-4 bg-gray-500" onClick={postData}>Save</Button>
            <Alert open={greenAlertPost} className="" color="green" onClose={() => setGreenAlertPost(false)}>
                  Task succesfully added.
            </Alert>
            <Alert open={redAlertPost} className="" color="red" onClose={() => setRedAlertPost(false)}>
                  Task not succesfully added.
            </Alert>           
        </Tabs>
      </CardBody>
    </Card>
  );
}