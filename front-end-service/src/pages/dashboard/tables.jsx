import ListTask from "./listTask";
import DeviceDetails from "@/widgets/cards/deviceDetails";


export function Tables() {

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <ListTask/>
      <DeviceDetails />
    </div>
  );
}

export default Tables;
