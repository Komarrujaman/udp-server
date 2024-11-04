import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Tooltip,
  Chip,
  Progress,
  iconButton,
} from "@material-tailwind/react";

import team1 from "/img/logo-atlassian.svg";
import { DeviceApi } from "@/data";
import { data } from "autoprefixer";
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; 
import { Link } from 'react-router-dom';
import Server from "@/data/conf";

const ListTask = () => {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = useState(true); // State to track loading
  const baseUrl = Server.baseURL;
  const baseport = Server.basePort;
  const deleteTaskPath = "/deleteTaskById";
  useEffect(() => {
    DeviceApi().then((result) => {
      setData(result);
      setLoading(false);
    })
  }, []);

  const handleDeleteTask = async (taskId, name) => {
    const confirmLogout = window.confirm("Are you sure want to Delete this User?");
    if (confirmLogout) {
      try {
        const response = await fetch(`http://${baseUrl}:${baseport}${deleteTaskPath}/${taskId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          // Remove the deleted task from the state
          setData(data.filter((task) => task.id !== taskId));
          console.log(`Task ${name}  deleted successfully`);
          toast.success(`Task ${name} deleted successfully!`);
        } else {
          console.error('Error deleting task:');
        }
      } catch (error) {
        console.error('Error in delete task:', error);
      }
    }
  };
  
  return (
    <>
      <Card className=" xl:col-span-2 shadow-sm bg-white bg-opacity-5">
          <CardHeader variant="gradient" className="mb-8 p-6 bg-orange-500 shadow-sm shadow-orange-300">
            <Typography variant="h6" color="white">
              Devices List
            </Typography>
          </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["ID", "Serial Number", "Created", "Last Updated", "Delete At", "Action"].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-gray-300"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map(
                ({ id, serial_number, created_at, updated_at, delete_at }, key) => {
                  const className = `py-3 px-5 ${
                    key === data.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={id}>
                      <td className={className}>
                        <div className="flex items-center gap-4 text-gray-300">
                          {id}
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                          
                            </Typography>
                            <Typography className="text-xs font-normal text-gray-300">
                              lorem ipsum
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-gray-300">
                          {serial_number}
                        </Typography>
                        <Typography className="text-xs font-normal text-gray-300">
                          {/* {port} */}
                        </Typography>
                      </td>
                      <td className={className} >
                        {/* <Chip 
                          variant="gradient"
                          color={status ? "green" : "blue-gray"}
                          value={status ? "Running" : "Stopped"}
                          className="py-0.5 px-2 text-[11px] font-medium w-fit"
                        /> */}
                        <Typography className="text-xs font-semibold text-gray-300">
                        {
                          new Date(created_at).toLocaleString('en-ID', {
                            month: 'long',   // Full month name
                            day: '2-digit',  // Day with leading zero
                            year: 'numeric', // Full year
                            hour: '2-digit', // Hour (12-hour clock)
                            minute: '2-digit', // Minute with leading zero
                            second: '2-digit', // Second with leading zero
                            hour12: false    // Use 12-hour AM/PM format
                          })
                        }
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-gray-300">
                        {
                          new Date(updated_at).toLocaleString('en-ID', {
                            month: 'long',   // Full month name
                            day: '2-digit',  // Day with leading zero
                            year: 'numeric', // Full year
                            hour: '2-digit', // Hour (12-hour clock)
                            minute: '2-digit', // Minute with leading zero
                            second: '2-digit', // Second with leading zero
                            hour12: false    // Use 12-hour AM/PM format
                          })
                        }
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-gray-300">
                        {
                          new Date(delete_at).toLocaleString('en-ID', {
                            month: 'long',   // Full month name
                            day: '2-digit',  // Day with leading zero
                            year: 'numeric', // Full year
                            hour: '2-digit', // Hour (12-hour clock)
                            minute: '2-digit', // Minute with leading zero
                            second: '2-digit', // Second with leading zero
                            hour12: false    // Use 12-hour AM/PM format
                          })
                        }
                        </Typography>
                      </td>
                      <td className= {" " + className}>
                        <div className="flex">
                        <Link to={`./edit-task/${id}`}>
                            <Typography
                              as="span"
                              className="text-xs font-semibold mx-1 text-orange-700 hover:ring-1 hover:ring-orange-700 rounded-sm p-1"
                            >
                              Edit
                            </Typography>
                          </Link>
                        {/* <Typography
                          as="a"
                          className={"cursor-pointer text-xs font-semibold mx-1 rounded-sm hover:ring-1 p-1 " + (status ? "text-blue-gray-600 hover:ring-blue-gray-600 " : "text-green-700 hover:ring-green-700")}
                          onClick={() => handleRunTask(id)}
                        >
                          {status ? "Stop" : "Run"}
                        </Typography> */}
                        <Typography
                          as="a"
                          className="cursor-pointer text-xs font-semibold mx-1 text-red-600 hover:ring-1 hover:ring-red-600 rounded-sm p-1"
                          onClick={() => handleDeleteTask(id, serial_number)}
                        >
                          Delete
                        </Typography>
                        </div>
                        
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </>
  )
}

export default ListTask;