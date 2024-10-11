import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface Option {
  id: string;
  name: string;
}

interface SelectorProps {
  options: Option[];
  placeholder: string;
  onChange: (value: string) => void;
}

const Selector: React.FC<SelectorProps> = ({ options, placeholder, onChange }) => {
  return (
    <Select onValueChange={onChange}>
      <SelectTrigger className="h-[4.125rem] mt-[0.1rem] mb-[1.25rem] pl-[2.375rem] pt-[1.313rem] pb-[1.313rem] text-[0.875rem] leading-[1.313rem] shadow-custom bg-white border border-border focus-visible:outline-none focus-visible:ring-0">
        <SelectValue placeholder={`Select ${placeholder}`} />
      </SelectTrigger>
      <SelectContent>

        {Array.isArray(options) && options.length > 0 ?  options?.map((option) => (

          <SelectItem key={option.id + option.name} value={option.name}>
            {option.name}
          </SelectItem>
        )) : null}
      </SelectContent>
    </Select>
  );
};

export default Selector;
