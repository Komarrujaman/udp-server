import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Alternatively, you can use fetch() if you don't want axios
import Server from './conf';

export const conversationsData = [
  {
    img: "/img/team-1.jpeg",
    username: "Sophie B.",
    role: "admin",
  },
  {
    img: "/img/team-2.jpeg",
    username: "Alexander",
    role: "admin",
  },
  {
    img: "/img/team-3.jpeg",
    username: "Ivanna",
    role: "user",
  },
  {
    img: "/img/team-4.jpeg",
    username: "Peterson",
    role: "user",
  },
  {
    img: "/img/bruce-mars.jpeg",
    username: "Bruce Mars",
    role: "user",
  },
];

export const UserApi = async () => {
  const baseURL = Server.baseURL;
  const basePort = Server.basePort
  try {
    const response = await axios.get(`http://${baseURL}:${basePort}/getAllUsers`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return conversationsData; // Return empty array in case of error
  }
  
};


export default UserApi;
