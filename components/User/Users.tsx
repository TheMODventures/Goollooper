"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User, UsersProps } from "@/types/type";
import Image from "next/image";
import React from "react";
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IMAGE_URL } from "@/lib/constants";

import { updatePaymentStatus,withdrawPayment } from "@/store/Slices/PaymentSlice";
import { AppDispatch } from "@/store/store";
import { useDispatch } from "react-redux";
import { ConfirmationModal } from "../ConfirmationModal";
import { EllipsisVertical } from "lucide-react";
import { SubAdminModal } from "./Modals/SubAdminModal";
import { UserModal } from "./Modals/UserModal";

export function Users({ users, isSubAdmin, isPayment, isUser }: UsersProps) {

  const dispatch = useDispatch<AppDispatch>();

  const handleUpdatePayment = async (id: string) => {
    try {
      const result = await dispatch(updatePaymentStatus(id)).unwrap();
      console.log("Updated the status of", id, result);
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  const handleWithdraw = async (amount: number) => {
    try {
      const result = await dispatch(withdrawPayment(amount)).unwrap();
      console.log("Withdrawn the payment of", amount, result);
    } catch (error) {
      console.error("Error withdrawing payment:", error);
    }
  };  

  return (
    <Table className="border-collapse"> 
      <TableCaption></TableCaption>
      <TableHeader>
        <TableRow className="border-y border-collapse">
          <TableHead>Full Name</TableHead>
          { isPayment? (
            <>
              <TableHead>Amount</TableHead>
              <TableHead>Type</TableHead>
            </>
          ) : (
            <>
              <TableHead>Email Address</TableHead>
              { isUser ? (
                <>
                  <TableHead>Premium User</TableHead>
                  <TableHead>Tasker</TableHead>
                </>
              ) : null}
              <TableHead>Phone Number</TableHead>
              <TableHead>Gender</TableHead>
            </>
          )}
          
          <TableHead>User Since</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user: User) => (
          <TableRow key={user._id}>
            <TableCell className="flex items-center gap-3 cursor-pointer">
              <Dialog>
                <DialogTrigger className="flex items-center gap-2">
                <div className="rounded-full overflow-hidden w-[30px] h-[30px]">
                  <Image
                    src={
                      isPayment
                        ? user?.user?.profileImage
                          ? `${IMAGE_URL}${user.user.profileImage}`
                          : "/assets/Image/userPhoto.png"
                        : user.profileImage
                        ? `${IMAGE_URL}${user.profileImage}`
                        : "/assets/Image/userPhoto.png"
                    }
                    alt="User-Profile-Pic"
                    width={30}
                    height={30}
                    className="object-cover w-full h-full"
                  />
                </div>
                  <p className="text-xs">
                    {`${isPayment ? user?.user?.firstName : user.firstName} ${isPayment ? user?.user?.lastName : user.lastName}`}
                  </p>{" "}
                </DialogTrigger>
                {!isPayment && (
                  !isSubAdmin ? (
                    <UserModal user={user} />
                  ) : (
                    <SubAdminModal user={user} />
                  )
                )}
              </Dialog>
            </TableCell>

            {!isPayment && (
              <>
                <TableCell className="font-medium">{user.email}</TableCell>
                { isUser && <TableCell className="">Yes</TableCell>}
                { isUser && (
                  <TableCell>{user?.role === 3 ? "Yes" : "No"}</TableCell>
                )}
              </>
            )}

            {!isPayment ? (
              <>
                <TableCell>
                  {user?.countryCode === "US"
                    ? `(${user?.phone?.slice(0, 3) ?? ''}) ${user?.phone?.slice(3, 6) ?? ''}-${user?.phone?.slice(6) ?? ''}`
                    : user?.phone}
                </TableCell>
                <TableCell>{user?.gender}</TableCell>
              </>
            ) : (
              <>
                <TableCell>{`$${user?.amount}`}</TableCell>
                <TableCell>{user?.type}</TableCell>
              </>
            )}
            <TableCell>
              {new Date(user?.createdAt)?.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </TableCell>
            {isPayment ? (
              <TableCell>{user?.status}</TableCell>
            ) : (
              <TableCell
                className={`${
                  user.isActive
                    ? "text-green-500 font-bold "
                    : "text-red-500 font-bold"
                }`}
              >
                {user.isActive ? "Active" : "Offline"}
              </TableCell>
            )}
            {isPayment ? (
              <TableCell>
                {user.type === "Withdraw" ? (
                    <ConfirmationModal
                    isAccept={true}
                    // amount={user.gooollooperAmount}
                    onAccept={handleWithdraw}
                  />
                ) : null}
              </TableCell>
            ) : (
              <TableCell>
                <EllipsisVertical size={20}/>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

