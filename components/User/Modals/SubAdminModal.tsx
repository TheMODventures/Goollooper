import Image from "next/image";
import { User } from "@/types/type";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IMAGE_URL } from "@/lib/constants";
import InfoRow from "./InfoRow";

export function SubAdminModal({ user }: { user: User }) {
  return (
    <DialogContent className=" w-[30%] ">
      <DialogHeader>
        <DialogTitle className="mx-auto">Sub Admin Profile</DialogTitle>
        <hr />
        <DialogDescription>
          <div className="flex flex-col justify-between item h-[340px]">
            <div className="flex items-center flex-col mt-10 h-[30%]">
              <Image
                className="rounded-full"
                src={user.profileImage ? `${IMAGE_URL}${user.profileImage}` : "/assets/Image/userPhoto.png"}
                alt="user-profile"
                width={70}
                height={70}
              />
              <h1 className="mt-2 font-bold text-black">{`${user?.firstName} ${user?.lastName}`}</h1>

              <div className="mt-3 text-center">
                <p className="text-PrimaryColor">
                  {new Date(user?.createdAt)?.toLocaleDateString()}
                </p>
                <p>Sub Admin Since</p>
              </div>
            </div>
            <div>
              <h1 className="text-black font-bold text-xl">Personal Info</h1>
              <div className="">
                <InfoRow label="Email Address" value={user?.email || ""} />
                <InfoRow label="Phone number" value={user?.phone || ""} />
              </div>
            </div>
          </div>
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  );
}