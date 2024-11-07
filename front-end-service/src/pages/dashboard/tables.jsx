import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Tooltip,
  Progress,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { DeviceApi, projectsTableData } from "@/data";
import ListTask from "./listTask";
import axios from 'axios';
import team2 from "/img/logo-slack.svg";
import { useState, useEffect } from "react";
import Server from "@/data/conf";

export function Tables() {
  const [data, setData] = useState([]);
  const [serialNumber, setSerialNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const baseUrl = Server.baseURL;
  const basePort = Server.basePort;

  function decodePayload(payload) {
    // Pastikan payload ada dan panjangnya sesuai
    if (!payload || payload.length < 72) {
        throw new Error("Payload tidak valid atau terlalu pendek");
    }

    // Mengambil Serial Number (posisi ke-8 hingga ke-20 dari payload, 12 karakter)
    const serialNumber = payload.slice(8, 20);

    // Forward Flow (32 bit, posisi ke-28 hingga ke-35 dari payload, sebagai float)
    const forwardFlowHex = payload.slice(28, 36);
    const forwardFlow = parseInt(forwardFlowHex, 16) / 1000; // asumsi satuan dalam ribuan m³

    // Reverse Flow (32 bit, posisi ke-36 hingga ke-43 dari payload, sebagai float)
    const reverseFlowHex = payload.slice(36, 44);
    const reverseFlow = parseInt(reverseFlowHex, 16) / 1000; // asumsi satuan dalam ribuan m³

    // TimeStamp (32 bit, posisi ke-44 hingga ke-51 dari payload)
    const timestampHex = payload.slice(44, 52);
    const timestampValue = parseInt(timestampHex, 16);
    const date = new Date(timestampValue * 1000); // konversi Unix timestamp ke Date

    // Battery (posisi ke-52 hingga ke-55 dari payload, sebagai signed integer)
    const batteryHex = payload.slice(52, 56);
    let batteryLevel = parseInt(batteryHex, 16);
    if (batteryLevel > 32767) {
        batteryLevel -= 65536; // konversi dari signed 16-bit integer jika negatif
    }
    const battery = batteryLevel / 100; // asumsi satuan dalam persen
    const time = date.toLocaleString();
    // Format hasil
    return `   Serial Number: ${serialNumber},
        Forward Flow: ${forwardFlow.toFixed(3)} m³,
        Reverse Flow: ${reverseFlow.toFixed(3)} m³,
        TimeStamp: ${time},
        Battery: ${battery.toFixed(2)} %,
    `;
}

  const fetchDevicesBySerial = async () => {
    try {
      const response = await axios.get(`http://${baseUrl}:${basePort}/data/${serialNumber}`);
      // Only set the relevant fields to state
      const filteredData = response.data.data.map((device) => ({
        id: device.id,
        payload: device.payload,
        decode : decodePayload(device.payload),
        created_at: device.created_at,
      }));
      setData(filteredData);
    } catch (error) {
      console.error('Error fetching devices:', error);
      setData([]); // Clear devices if error occurs
    }
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      
      <ListTask/>

      <Card className="bg-main shadow-nuero">
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex justify-between items-center">
          <Typography variant="h6" color="white">
            Device Details
          </Typography>
          
          <div className="">
            <div class="w-full max-w-sm min-w-[200px]">
              <div class="relative">
                <input
                  class="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-3 pr-28 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                  placeholder="Serial Number"
                  onChange={(e => setSerialNumber(e.target.value))} 
                />
                <button
                  class="absolute top-1 right-1 flex items-center rounded bg-slate-800 py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  type="button"
                  onClick={fetchDevicesBySerial}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 mr-2">
                    <path fill-rule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clip-rule="evenodd" />
                  </svg>

                  Search
                </button> 
              </div>
            </div>
          </div>

        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["id","payload", "Decode", "Created at", ""].map(
                  (el) => (
                    <th
                      key={el}
                      className="border-b border-blue-gray-50 py-3 px-5 text-left"
                    >
                      <Typography
                        variant="small"
                        className="text-[11px] font-bold uppercase text-white"
                      >
                        {el}
                      </Typography>
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {data.map(
                ({ id, serial_number, payload, decode, created_at }, key) => {
                  const className = `py-3 px-5 ${
                    key === projectsTableData.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={payload}>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          {/* <Avatar src={team2} alt={serial_number} size="sm" /> */}
                          <Typography className="text-sm text-gray-300 font-normal">
                            {id}
                          </Typography>
                          <div>
                            {/* <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              {payload}
                            </Typography> */}
                            {/* <Typography className="text-xs font-normal text-white">
                                {payload}
                            </Typography> */}
                          </div>
                          
                        </div>
                      </td>
                      <td className={className}>
                        {/* <Typography className="text-xs font-semibold text-white">
                          {send_interval/1000} Seconds
                        </Typography> */}
                        <p className="text-xs font-normal text-white h-full max-w-xs truncate ...">
                          {payload}
                        </p>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-gray-300 whitespace-pre-line">
                          {decode}
                        </Typography>
                      </td>

                      <td className={className}>
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
                        <Typography
                          as="a"
                          href="#"
                          className="text-xs font-semibold text-white"
                        >
                          <EllipsisVerticalIcon
                            strokeWidth={2}
                            className="h-5 w-5 text-inherit"
                          />
                        </Typography>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}

export default Tables;
