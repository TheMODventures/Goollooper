import Image from "next/image";
import { Input } from "@/components/ui/input";
import AddSubAdmin from "./AddSubAdmin";
import { Filter } from "../Filter/Filter";
import { User } from "@/types/type";
import { downloadCSV } from "@/lib/utils";

interface SearchProps {
  isSubAdmin: boolean;
  isUser: boolean;
  value?: string;
  onChange?: (e: string) => void;
  onRoleFilterChange?: (role: number | string) => void;
  roleFilter?: number | null;
  users: User[];
}


export default function Search({ isSubAdmin, isUser, value, onChange, onRoleFilterChange, roleFilter, users }: SearchProps) {
  const subAdminFilterLabelData = [
    { label: "User", value: 2 },
    { label: "Service Provider", value: 3 }
  ];
  const paymentFilterLabelData = [
    { label: "Top Up", value: 2 },
    { label: "Application Fee", value: 3 },
    { label: "Task Add Request", value: 5 },
    { label: "Subscription", value: 6 },
    { label: "Megablast", value: 7 },
    { label: "Withdraw", value: 8 },
    { label: "Service Initiation Fee", value: 9 },
  ];


  const handleRoleFilterChange = (role: number | null) => {
    if (onRoleFilterChange && role !== null && (isSubAdmin || isUser)) {
      onRoleFilterChange(role);
    } else {
      const type = paymentFilterLabelData.find((item: any) => item.value === role);
      if (onRoleFilterChange) {
        onRoleFilterChange(type?.label ?? '');
      }
    }
  };

  const handleDownloadCSV = () => {
    downloadCSV(users);
  };

  return (
    <div className="flex justify-between items-center">
      <div className="flex justify-start gap-3 mt-5 mb-3">
        <Filter 
          options={isSubAdmin || isUser ? subAdminFilterLabelData : paymentFilterLabelData}
          value={roleFilter ?? null}
          onChange={handleRoleFilterChange}
        />
        {isUser || isSubAdmin ? (
          <div className="relative outline-none">
            <Input
              className=" bg-backGroundSecondaryColor px-9"
              placeholder="Searching"
              value={value}
              onChange={(e) => onChange && onChange(e.target.value)}
            />
            <Image
              src={"/assets/Image/Search.svg"}
              alt="Filter Icon"
              width={14}
              height={10}
              className="absolute top-3 left-4 outline-none"
            />
          </div>) 
        : null}
      </div>
      <div>

        {isUser ? (

          <button className="flex items-center px-7 bg-backGroundSecondaryColor py-2 gap-2 rounded-lg"
            onClick={handleDownloadCSV}
          >
            <Image
              src={"/assets/Image/Csv.jpg"}
              alt="Filter Icon"
              width={20}
              height={20}
            />
            Download CSV
          </button>
        ) : isSubAdmin ? (
          <AddSubAdmin />
        ) : null}
      </div>
    </div>
  );
}
