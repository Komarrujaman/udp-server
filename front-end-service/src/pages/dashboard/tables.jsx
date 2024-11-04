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
import team2 from "/img/logo-slack.svg";
import { useState, useEffect } from "react";

export function Tables() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    DeviceApi().then((result) => {
      setData(result);
      setLoading(false);
    })
  }, []);

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      
      <ListTask/>

      <Card className="bg-gray-500">
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Task Statistics
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Task Name / URL", "Interval", "Success Request", "Failed Request", "Success Rate", ""].map(
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
                ({ name, server, port, prefix, send_interval, success, failed }, key) => {
                  const className = `py-3 px-5 ${
                    key === projectsTableData.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={name}>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <Avatar src={team2} alt={name} size="sm" />
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              {name}
                            </Typography>
                            <Typography className="text-xs font-normal text-white">
                                {server}:{port}/{prefix}
                            </Typography>
                          </div>
                          
                        </div>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-white">
                          {send_interval/1000} Seconds
                        </Typography>
                        <Typography className="text-xs font-normal text-white">
                          {port}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography
                          variant="small"
                          className="text-xs font-medium text-white"
                        >
                          {success}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography
                          variant="small"
                          className="text-xs font-medium text-white"
                        >
                          {failed}
                        </Typography>
                      </td>
                      <td className={className}>
                        <div className="w-10/12">
                          <Typography
                            variant="small"
                            className="mb-1 block text-xs font-medium text-white"
                          >
                            {Math.round((success * 100) / (success + failed))} %
                          </Typography>
                          <Progress
                            value={Math.round((success * 100) / (success + failed))}
                            variant="gradient"
                            color={Math.round((success * 100) / (success + failed)) === 100 ? "green" : "gray"}
                            className="h-1"
                          />
                        </div>
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
