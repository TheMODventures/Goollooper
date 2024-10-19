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

import { updatePaymentStatus } from "@/store/Slices/PaymentSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { ConfirmationModal } from "../ConfirmationModal";
import { EllipsisVertical } from "lucide-react";
import { SubAdminModal } from "./Modals/SubAdminModal";
import { UserModal } from "./Modals/UserModal";
import ImageAvatar from "../ImageAvatar";
import { formatAmount } from "@/lib/utils";

export function Users({ users, isSubAdmin, isPayment, isUser, handleSignal }: UsersProps) {

  const dispatch = useDispatch<AppDispatch>();
  const handleWithdraw = async (idOrAmount: string | number) => {
    const checkStatus = async () => {
      const result = await dispatch(updatePaymentStatus(idOrAmount as string));
      if (result.meta.requestStatus !== 'fulfilled') {
        setTimeout(checkStatus, 500);
      } else {
        if (handleSignal) {
          handleSignal();
        }
      }
    };

    checkStatus();
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
        {users && users?.map((user: User) => (
          <TableRow key={user._id}>
            <TableCell className="flex items-center gap-3 cursor-pointer">
              <Dialog>
                <DialogTrigger className="flex items-center gap-2">
                  <ImageAvatar profileImage={isPayment ? user?.user?.profileImage : user?.profileImage} firstName={isPayment ? user?.user?.firstName : user.firstName} lastName={isPayment ? user?.user?.lastName : user.lastName} />
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
                <TableCell>{`$${formatAmount(user?.amount ?? 0)}`}</TableCell>
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
                  user.status === "pending" && (
                    <ConfirmationModal
                      isAccept={true}
                      userID={user._id}
                      amount={user.amount}
                      onAccept={handleWithdraw}
                    />
                  )
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