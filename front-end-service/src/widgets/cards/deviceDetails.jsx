import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { projectsTableData } from "@/data";
import axios from 'axios';
import team2 from "/img/logo-slack.svg";
import { useState, useEffect } from "react";
import Server from "@/data/conf";

// Fungsi untuk membalikkan string hex
function reverseString(str) {
  return str.match(/.{1,2}/g).reverse().join('');
}

// Fungsi untuk mengubah nilai hex menjadi desimal
function hexToDecimal(hex) {
  return parseInt(hex, 16);
}

// Fungsi untuk konversi nilai hex ke desimal dengan format two's complement
function hex2sComplementToDecimal(hex) {
  const dec = parseInt(hex, 16);
  return (dec & 0x80) ? dec - 0x100 : dec;
}

// Fungsi untuk konversi nilai hex ke biner
function hexToBinary(hex) {
  return parseInt(hex, 16).toString(2).padStart(8, '0');
}

function decodePayload(payload) {
  // Serial Number (posisi 10-20), dibalik string-nya
  const serialNumber = reverseString(payload.slice(10, 20).toString('hex'));

  // Konversi unit untuk flow berdasarkan byte spesifik
  const F_flow_unit = payload.slice(34, 36) === "2b" ? 0.001 : 1;
  const R_flow_unit = payload.slice(36, 38) === "2b" ? 0.001 : 1;
  const I_flow_unit = payload.slice(38, 40) === "35" ? 0.01 : 1;

  // Mengambil dan membalik hex value untuk flow dan battery
  const ForwardFlow = hexToDecimal(reverseString(payload.slice(42, 50).toString('hex'))) * F_flow_unit;
  const ReverseFlow = hexToDecimal(reverseString(payload.slice(68, 76).toString('hex'))) * R_flow_unit;
  const InstantaneousFlow = hexToDecimal(reverseString(payload.slice(76, 84).toString('hex'))) * I_flow_unit;
  const Battery = hexToDecimal(payload.slice(64, 66)) * 0.1;

  // Status Alarm berdasarkan nilai biner dari status byte
  const status_1 = hexToBinary(payload.slice(58, 60));
  const status_2 = hexToBinary(payload.slice(60, 62));

  // Alarm berdasarkan kondisi status
  const alarms = {
    Alarm11: status_1[3] === '1' ? "TEMPER REMOVED" : "",
    Alarm12: status_1[1] === '1' ? "BATTERY LOW" : "",
    Alarm21: status_2[2] === '1' ? "ALARM REVERSE FLOW" : "",
    Alarm22: status_2[5] === '1' ? "ABNORMAL WATER PRESSURE" : "",
    Alarm23: status_2[6] === '1' ? "ANOMALY INSTANTANEOUS FLOW" : ""
  };

  // Ambil data flow per jam
  const hourlyData = [];
  for (let i = 0; i < 24; i++) {
    const start = 86 + (i * 10); // Menyesuaikan posisi untuk tiap jam
    const hourlyHex = payload.slice(start, start + 8).toString('hex');
    const hourlyFlow = hexToDecimal(reverseString(hourlyHex)) * F_flow_unit;
    hourlyData.push(` Hourly ${i.toString().padStart(2, '0')}.00 = ${hourlyFlow.toFixed(2)} m³`);
  }

  // Kekuatan Sinyal (Signal Intensity)
  const SignalIntensity = hex2sComplementToDecimal(payload.slice(326, 328));

  return `Alarms: ${Object.values(alarms).filter(alarm => alarm)}
          Serial Number: ${serialNumber},
          Forward Flow: ${ForwardFlow.toFixed(1)} m³,
          Reverse Flow: ${ReverseFlow.toFixed(1)} m³,
          Battery: ${Battery.toFixed(1)} V,
          Instantaneous Flow: ${InstantaneousFlow.toFixed(1)} m³/h,
          Hourly Data: 
          ${hourlyData},
          Signal Strength: ${SignalIntensity} dBm,
  `;
}

export function DeviceDetails() {
  const [data, setData] = useState([]);
  const [serialNumber, setSerialNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const baseUrl = Server.baseURL;
  const basePort = Server.basePort;
  let payloadArray = [];

  const payloadDisplay = (payload) => {
    payloadArray = payload.match(/.{1,2}/g);
    return payloadArray;
  }

  const fetchDevicesBySerial = async () => {
    try {
      const response = await axios.get(`http://${baseUrl}:${basePort}/data/${serialNumber}`);
      // Only set the relevant fields to state
      const filteredData = response.data.data.map((device) => ({
        id: device.id,
        payload: device.payload,
        payloadArray: payloadDisplay(device.payload),
        decode : decodePayload(device.payload),
        created_at: device.created_at,
      }));
      setData(filteredData);
      // payloadDisplay(filteredData.payload)
    } catch (error) {
      console.error('Error fetching devices:', error);
      setData([]); // Clear devices if error occurs
    }
  };

  return (
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
                (device, key) => {
                  const className = `py-3 px-5 ${
                    key === projectsTableData.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={device.id}>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          {/* <Avatar src={team2} alt={serial_number} size="sm" /> */}
                          <Typography className="text-sm text-gray-300 font-normal">
                            {device.id}
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
                        <div className="grid grid-cols-11 gap-x-4 ">
                          {device.payloadArray.map((payload, index) => (
                            <span key={index} className="text-xs font-semibold text-gray-300">
                              {payload}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-gray-300 whitespace-pre-line">
                          {device.decode}
                        </Typography>
                      </td>

                      <td className={className}>
                        <Typography className="text-xs font-semibold text-gray-300">
                          {
                            new Date(device.created_at).toLocaleString('en-ID', {
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
  )
}

export default DeviceDetails;
