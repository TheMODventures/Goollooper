import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  Clock,
  MapPin,
  User,
  Flag,
  DollarSign,
  Users,
} from "lucide-react";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { blockUser } from "@/store/Slices/TasksSlice";
import { ConfirmationModal } from "../ConfirmationModal";
import { toast } from "react-toastify";

const TaskDetails = () => {
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const taskId = useSelector((state: RootState) => state.tasks.activeTaskId);
  const task = tasks.find((task: any) => task._id === taskId);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleBanUser = (idOrAmount: string | number, taskID?: string) => {
    if (typeof idOrAmount === "string") {
      dispatch(blockUser(idOrAmount));
      toast.success("The user has been banned.");
      console.log(idOrAmount)
    }
  };

  return (
    <div className="flex-grow p-5">
      <ScrollArea className="h-calc-task-screen">
        <div>
          <h1>Task</h1>
          <div className="text-4xl font-bold mb-2 text-PrimaryColor">
            {task.title}
          </div>
          <Badge variant={task.status === "pending" ? "secondary" : "default"}>
            {task.status}
          </Badge>
        </div>
        <div className="space-y-4 mt-5">
          <h3 className="font-semibold">Description</h3>
          <p className="text-gray-700 p-4 bg-slate-100 rounded-md">
            {task.description}
          </p>

          <div className="grid grid-cols-2 gap-4 border-y-2 border-backGroundSecondaryColor py-2">
            <InfoItem
              icon={<MapPin className="w-4 h-4" />}
              label="Location"
              value={task.location.readableLocation}
              className="col-span-2"
            />
            <InfoItem
              icon={<CalendarIcon className="w-4 h-4" />}
              label="Date"
              value={formatDate(task.date)}
            />
            <InfoItem
              icon={<Clock className="w-4 h-4" />}
              label="Time"
              value={`${task.slot.startTime} - ${task.slot.endTime}`}
            />
            <InfoItem
              icon={<User className="w-4 h-4" />}
              label="Posted By"
              value={`${task.postedBy.firstName} ${task.postedBy.lastName}`}
            />
            <InfoItem
              icon={<Flag className="w-4 h-4" />}
              label="Type"
              value={task.type}
            />
            <InfoItem
              icon={<DollarSign className="w-4 h-4" />}
              label="Commercial"
              value={task.commercial ? "Yes" : "No"}
            />
            <InfoItem
              icon={<Users className="w-4 h-4" />}
              label="Service Providers Needed"
              value={task.noOfServiceProvider}
            />
          </div>

          {task.requirement && (
            <div>
              <h3 className="font-semibold mb-2">Requirements</h3>
              <p className="p-4 bg-slate-100 rounded-md">{task.requirement}</p>
            </div>
          )}

          {(task.gender || task.ageFrom || task.ageTo) && (
            <div>
              <h3 className="font-semibold mb-2">Preferences</h3>
              <ul className="list-disc list-inside">
                {task.gender && <li>Gender: {task.gender}</li>}
                {(task.ageFrom || task.ageTo) && (
                  <li>
                    Age: {task.ageFrom || "Any"} - {task.ageTo || "Any"}
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="grid grid-cols-2 gap-3">
        {/* <Button className="col-start-2 bg bg-PrimaryColor rounded-full">
          Ban {`${task.postedBy.firstName} ${task.postedBy.lastName}`}
        </Button> */}
        <div className="col-start-2">
          <ConfirmationModal
            isBlock={true}
            onAccept={handleBanUser}
            userID={task?.postedBy?._id}
          />
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({
  icon,
  label,
  value,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  className?: string;
}) => (
  <div className={`flex items-center space-x-2 ${className}`}>
    {icon}
    <span className="font-semibold">{label}:</span>
    <span>{value}</span>
  </div>
);

export default TaskDetails;
