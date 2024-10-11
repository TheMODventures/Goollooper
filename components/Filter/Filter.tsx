import Image from "next/image";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

interface FilterOption {
  label: string;
  value: number | null;
}

interface FilterProps {
  options: FilterOption[];
  value: number | null;
  onChange: (value: number | null) => void;
}

export const Filter: React.FC<FilterProps> = ({ options, value, onChange }) => {
  const selectedOption = options.find(option => option.value === value) || options[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <div className="flex items-center px-7 bg-backGroundSecondaryColor py-2 gap-2 rounded-lg">
          <Image
            src={"/assets/Image/Filter.svg"}
            alt="Filter Icon"
            width={14}
            height={10}
          />
          <p>Filter</p>     
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {options.map((option) => (
          <DropdownMenuItem
            key={option.label}
            onClick={() => onChange(option.value)}
            className="px-[1rem] py-[0.5rem] text-[0.875rem] leading-[1.125rem] hover:bg-backGroundSecondaryColor hover:cursor-pointer"
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}