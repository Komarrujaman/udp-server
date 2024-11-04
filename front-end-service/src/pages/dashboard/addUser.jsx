import { MessageCard } from "@/widgets/cards";
import {
  Button,
  Typography,
} from "@material-tailwind/react";

import { UserApi } from "@/data";
import { useEffect, useState } from "react";
import UserForm from "@/widgets/cards/userForm";
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import default styles
import ListUser from "@/widgets/cards/listUser";
 
export function AddUser() {
  const [listUsers, setListUsers] = useState([]);

  useEffect(() => {
    UserApi().then((result) => {
      setListUsers(result);
      console.log(listUsers);
    })
  }, []);

  return (
    <div className="justify-center mx-auto mt-4 md:mt-8 block md:flex 0 shadow-none md:shadow-sm rounded-lg">
    
      <UserForm />

      <div className="w-full my-5 md:my-0 md:w-1/2 p-4 md:p-8 rounded-lg">
        <ListUser size="h4"/>
      </div>
      {/* <ToastContainer position="top-center" theme="colored"/> */}
    </div>
      
  );
}

export default AddUser;