"use client";
import React, { useEffect, useState } from "react";
import { UserAvatar } from "./UserAvatar";
import { MessageScreen } from "./MessageScreen";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentActiveChat } from "@/store/Slices/PaymentSlice";
import TaskDetails from "./TaskDetails";
import { RootState } from "@/store/store";

export const ChatDetails = ({
  chatData,
  messages,
  user,
  isTask = false,
  activeTab,
  handleSendMessage,
  handleMarkAsComplete,
}: {
  chatData: any;
  messages: any;
  user: any;
  isTask?: boolean;
  activeTab: number;
  handleSendMessage: (message: string | any, type: string) => void;
  handleMarkAsComplete?: (userId: string, chatId: string) => void;
}) => {
  const dispatch = useDispatch();
  const activeTaskId = useSelector((state: RootState) => state.tasks.activeTaskId);
  const [isChecked, setIsChecked] = useState<boolean>(chatData?.isTicketClosed);

  const onCheckboxChange = (
    checked: boolean,
    chatId: string,
    currentUserId: string
  ) => {
    setIsChecked(checked);
    if (handleMarkAsComplete && chatId && currentUserId) {
      handleMarkAsComplete(currentUserId, chatId);
    }
  };

  useEffect(() => {
    if (chatData && chatData._id) {
      dispatch(setCurrentActiveChat(chatData._id));
    }
    setIsChecked(chatData?.isTicketClosed);
  }, [chatData, dispatch]);

  // console.log({chatData});

  return (
    <>
      {chatData && activeTab === 1 && (
        <div className="flex-grow">
          <div className="flex gap-1 border-b border-border pt-[1.438em] pb-[1.25em] pl-[1.75em]">
            <UserAvatar
              isTicketClosed={isChecked}
              handleMarkAsComplete={onCheckboxChange}
              chatId={chatData?._id}
              isList={false}
              currentUserId={user?._id}
              groupId={chatData?.groupName}
              chatData={chatData}
            />
          </div>

          <MessageScreen
            messages={messages}
            user={user}
            onSend={handleSendMessage}
            isTicketClosed={isChecked}
          />
        </div>
      )}
      {isTask && activeTab === 2 && activeTaskId !== "" && <TaskDetails />}
    </>
  );
};