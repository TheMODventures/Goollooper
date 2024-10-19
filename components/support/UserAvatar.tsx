"use client";

import { IMAGE_URL } from "@/lib/constants";
import { Chat } from "@/types/type";
import { Checkbox } from "../ui/checkbox";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const selectCurrentActiveChat = (state: RootState) =>
  state.payment.currentActiveChat;

export const UserAvatar = ({
  text,
  chatData,
  chatId,
  isList = false,
  isMark,
  isTask,
  isTicketClosed,
  currentUserId,
  groupId,
  onUserClick,
  handleMarkAsComplete,
}: {
  text?: string;
  chatData?: any;
  chatId?: string;
  isList?: boolean;
  isTask?: boolean;
  isMark?: boolean;
  isTicketClosed?: boolean;
  currentUserId?: string;
  groupId?: string;
  onUserClick?: (chatData: Chat | string | null) => void;
  handleMarkAsComplete?: (
    checked: boolean,
    chatId: string,
    currentUserId: string
  ) => void;
}) => {
  const currentActiveChat = useSelector(selectCurrentActiveChat);
  const currentActiveTask = useSelector(
    (state: RootState) => state.tasks.activeTaskId
  );

  const chatDetailsData = chatData?.participants?.find(
    (userObj: any) => userObj?._id === chatData?.createdBy
  );

  // console.log(`${IMAGE_URL}${chatDetailsData?.profileImage}`);
  // console.log(chatData);
  // console.log(chatId);
  return (
    <div
      className={`flex items-center 
          ${
            (currentActiveChat === chatId && isList) ||
            (currentActiveTask === chatId && isTask)
              ? "gap-[0.75em] py-1 bg-backGroundSecondaryColor pl-8 pr-5 hover:cursor-pointer"
              : isList || isTask
              ? "gap-[0.75em] py-1 hover:bg-backGroundSecondaryColor pl-8 pr-5 hover:cursor-pointer"
              : "gap-[1.063em]"
          }`}
      onClick={() =>
        isList && onUserClick
          ? onUserClick(chatData || null)
          : isTask && onUserClick
          ? onUserClick(chatId as string)
          : {}
      }
    >
      <Avatar className="rounded-full">
        <AvatarImage
          src={
            chatDetailsData?.profileImage
              ? `${IMAGE_URL}${chatDetailsData?.profileImage}`
              : chatData?.postedBy?.profileImage
              ? `${IMAGE_URL}${chatData?.postedBy?.profileImage}`
              : ""
          }
          alt={isList ? "LA" : "DA"}
          sizes={isList || isTask ? "38" : "48"}
        />
        <AvatarFallback>
          {isList && !isTask
            ? `${chatDetailsData?.firstName?.charAt(
                0
              )}${chatDetailsData?.lastName?.charAt(0)}`
            : isTask
            ? `${chatData?.postedBy?.firstName?.charAt(
                0
              )}${chatData?.postedBy?.lastName?.charAt(0)}`
            : `${chatDetailsData?.firstName?.charAt(
                0
              )}${chatDetailsData?.lastName?.charAt(0)}`}
        </AvatarFallback>
      </Avatar>
      <div>
        <div
          className={
            isList || isTask
              ? "flex flex-col"
              : "flex flex-row items-center gap-[0.25em]"
          }
        >
          <h3
            className={
              isList || isTask
                ? "text-[0.875rem] leading-[1.313rem] font-normal"
                : "text-[1.125rem] leading-[1.688rem] font-medium"
            }
          >
            {isList && !isTask
              ? `${chatDetailsData?.firstName} ${chatDetailsData?.lastName}`
              : isTask
              ? `${chatData?.postedBy?.firstName} ${chatData?.postedBy?.lastName}`
              : `${chatDetailsData?.firstName} ${chatDetailsData?.lastName} -`}
          </h3>
          <p
            className={
              isList || isTask
                ? "text-[0.75rem] leading-[1.125rem] font-normal text-[#1C1C1CA6]"
                : "text-[1.125rem] leading-[1.688rem] text-[#F48C06] font-medium uppercase"
            }
          >
            {isList || isTask ? text : groupId}
          </p>
        </div>
        {isMark && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="login-checkbox"
              className="w-[1.063em] h-[1.063em] rounded-md border-border data-[state=checked]:bg-PrimaryColor"
              onCheckedChange={(checked) => {
                if (handleMarkAsComplete && chatId && currentUserId) {
                  handleMarkAsComplete(
                    checked as boolean,
                    chatId,
                    currentUserId
                  );
                }
              }}
              checked={isTicketClosed}
              disabled={isTicketClosed}
            />
            <label
              htmlFor="login-checkbox"
              className="text-[0.875rem] leading-[1.313rem]"
            >
              Mark as complete
            </label>
          </div>
        )}
      </div>
    </div>
  );
};
