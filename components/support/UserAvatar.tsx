"use client";
import { useState, useCallback } from "react";
import { IMAGE_URL } from "@/lib/constants";
import { Chat } from "@/types/type";
import Image from "next/image";
import { Checkbox } from "../ui/checkbox";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

const selectCurrentActiveChat = (state: RootState) => state.payment.currentActiveChat;

export const UserAvatar = ({
    text,
    chatData,
    chatId,
    isList = false, 
    isTicketClosed,
    onUserClick,
    currentUserId,
    groupId,
    handleMarkAsComplete,
  }: {
    text?: string;
    chatData?: any;
    chatId?: string;
    isList: boolean;
    isTicketClosed?: boolean;
    currentUserId?: string;
    groupId?: string;
    onUserClick?: (chatData: Chat | null) => void;
    handleMarkAsComplete?: (checked: boolean, chatId: string, currentUserId: string) => void;
  }) => {
    const currentActiveChat = useSelector(selectCurrentActiveChat);
    
    const chatDetailsData = chatData?.participants?.find(
      (userObj: any) => userObj?._id === chatData?.createdBy
    );
    
    console.log(`${IMAGE_URL}${chatDetailsData?.profileImage}`);

    return (
      <div
        className={`flex items-center 
          ${ (currentActiveChat === chatId && isList) ? "gap-[0.75em] py-1 bg-backGroundSecondaryColor pl-8 pr-5 hover:cursor-pointer" : isList ? "gap-[0.75em] py-1 hover:bg-backGroundSecondaryColor pl-8 pr-5 hover:cursor-pointer" :
            "gap-[1.063em]"}`}
        onClick={() => (isList && onUserClick ? onUserClick(chatData || null) : {})}
      >
        <Image
          src={chatDetailsData?.profileImage ? `${IMAGE_URL}${chatDetailsData?.profileImage}` : "/assets/Image/userPhoto.png"}

          alt={isList ? "LA" : "DA"}

          width={isList ? 38 : 48}
          height={isList ? 38 : 48}
          className="rounded-full"
        />
        <div>
          <div className={isList ? "flex flex-col" : "flex flex-row items-center gap-[0.25em]"}>
            <h3 className={isList ? "text-[0.875rem] leading-[1.313rem] font-normal" : "text-[1.125rem] leading-[1.688rem] font-medium"}>
              {isList ? `${chatDetailsData?.firstName} ${chatDetailsData?.lastName}` : `${chatDetailsData?.firstName} ${chatDetailsData?.lastName} -`}
            </h3>
            <p className={isList ? "text-[0.75rem] leading-[1.125rem] font-normal text-[#1C1C1CA6]" : "text-[1.125rem] leading-[1.688rem] text-[#F48C06] font-medium uppercase"}>
              {isList ? text : groupId}
            </p>
          </div>
          {!isList && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="login-checkbox"
                className="w-[1.063em] h-[1.063em] rounded-md border-border data-[state=checked]:bg-PrimaryColor"
                onCheckedChange={(checked) => {
                  if (handleMarkAsComplete && chatId && currentUserId) {
                    handleMarkAsComplete(checked as boolean, chatId, currentUserId);
                  }
                }}
                checked={isTicketClosed}
                disabled={isTicketClosed}
              />
              <label htmlFor="login-checkbox" className="text-[0.875rem] leading-[1.313rem]">
                Mark as complete
              </label>
            </div>
          )}
        </div>
      </div>
    );
  };