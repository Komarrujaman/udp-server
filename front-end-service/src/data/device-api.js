import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Alternatively, you can use fetch() if you don't want axios
import Server from './conf';

export const DeviceApi = async () => {
  const baseURL = Server.baseURL;
  const basePort = Server.basePort
  try {
    const response = await axios.get(`http://${baseURL}:${basePort}/devices`);
    // Return the `data` field inside the response object
    return response.data.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return []; // Return empty array in case of error
  }
};

export default DeviceApi;
