import Link from "next/link";

import { Button } from "./ui/button";
import Image from "next/image";
import { ConfirmationModal } from "./ConfirmationModal";
interface ServiceProps {
  title: string;
  id: string;
  link?: string;
  industryId?: string;
  isIndustry?: boolean;
  isCategory?: boolean;
  parentIndex?: number;
  onDelete: (idOrAmount: string | number, id?: string) => void;
}

const Task: React.FC<ServiceProps> = ({ title, id, link, industryId, isIndustry, isCategory, parentIndex, onDelete }) => {
  // console.log(industryId);
  return (
    <div className="flex justify-between rounded-sm mt-[0.5em] h-[3.5em] bg-backGroundSecondaryColor items-center pl-[1.063em] pr-[0.25em]">
      <div>
        <p className="text-[0.875rem] leading-[1.116rem] text-subTitleColor font-semibold">{title}</p>
      </div>
      <div className="flex gap-[0.3em]">
        {!isIndustry &&
          <Button className="bg-backGroundColor px-[0.85rem] py-[1.5rem] rounded-sm">
            <Link href={`${link}/${id}?${industryId ? `id=${industryId}&` : ""}title=${title}`}>
              <Image
                src={"/assets/Image/Pancel.svg"}
                alt=""
                width={24}
                height={24}
              />
            </Link>
          </Button>
        } 
        <ConfirmationModal isDelete={true} taskID={id} onAccept={onDelete} index={parentIndex} isCategory={isCategory ? true : false} />
      </div>
    </div>
  );
};

export default Task;
