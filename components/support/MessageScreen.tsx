import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Message, User } from "@/types/type";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { IMAGE_URL } from "@/lib/constants";
import { AlertCircle } from "lucide-react";
import ImagePreview from "./ImagePreview";
import SendMessageInputField from "./SendMessageInputField";

const groupMessagesByTime = (messages: Message[]): [string, Message[]][] => {
  const groups: { [key: string]: Message[] } = {};
  
  messages.forEach((message) => {
    if (message.createdAt) {
      const date = new Date(message.createdAt);
      const roundedMinutes = Math.floor(date.getMinutes() / 10) * 10;
      date.setMinutes(roundedMinutes, 0, 0);
      const key = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(message);
    }
  });

  return Object.entries(groups);
}

export const MessageScreen = ({
    messages,
    user,
    isTicketClosed,
    onSend,
  }: {
    messages: Message[];
    user: User;
    isTicketClosed?: boolean;
    onSend: (message: string, type: string) => void;
  }) => {
    const fileInputRef = useRef<any>(null);
    const [message, setMessage] = useState<string>("");
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const groupedMessages = useMemo(() => groupMessagesByTime(messages), [messages]);
  
    const handleSendMessage = (image: any, message: string) => {
      if (!message && !image) return;
      if (image) {
        onSend(image, "image");
      }
      onSend(message, "message");
    };
  
    const handleFileInputChange = (event: any) => {
      // When a file is selected, update the state
      // console.log(event.target.files);
      if (!event.target.files.length) return;
      onSend(event.target.files[0], "image");
      // setSelectedFile(event.target.files[0]);
    };

    const handleImageClick = (mediaUrl: string) => {
      setPreviewImage(IMAGE_URL + mediaUrl);
    };
  
    const closePreview = () => {
      setPreviewImage(null);
    };
  
    return (
      <div className="flex flex-col">
        <ScrollArea className="p-7 h-calc-message-screen">
          {/* Admin Messages on the left */}
          {/* <p className="flex justify-center text-xs mb-5">8:00 AM</p> */}
          {groupedMessages.map(([time, msgs]) => (
            <div key={`${time}-${Math.random()}`}>
              <p className="flex justify-center text-xs mb-5">{time}</p>
          {msgs?.map((msg: Message) => {
            let isAdminMsg = msg?.sentBy === user?._id;
            return (
              <>
                {msg?.mediaUrls?.map((media: string) => (
                  <div
                  key={msg.requestId + media}
                    className={`flex ${
                      isAdminMsg
                        ? "items-end justify-end mb-4"
                        : "items-start mb-4"
                    } `}
                  >
                    <Image
                      src={IMAGE_URL + media}
                      alt=""
                      width={150}
                      height={150}
                      className="rounded cursor-pointer"
                      onClick={() => handleImageClick(media)}
                    />
                  </div>
                ))}
                {msg?.body && (
                  <div
                    className={`flex ${
                      isAdminMsg
                        ? "items-end justify-end mb-4"
                        : "items-start mb-4"
                    } `}
                  >
                    {/* <div className="w-[55%]"> */}
                    <p
                      className={`${
                        isAdminMsg
                          ? "bg-backGroundColor w-[70%]"
                          : "bg-PrimaryColor text-white w-[55%]"
                        }  text-[0.75rem] leading-[1.25rem] rounded-[0.625rem] px-[0.938rem] py-[0.688rem]`}
                    >
                      {msg?.body}
                    </p>
                    {/* </div> */}
                  </div>
                )}
              </>
            );
          })}
            </div>
          ))}
        </ScrollArea>
  
        {/* Admin Input Field at the bottom */}
        <div className="px-4">
          {isTicketClosed ? (
            <div className="text-red-500 flex items-center justify-center w-full">
              <p className="flex text-sm items-center">
                <AlertCircle size={16} className="mr-2" />
                This ticket is Mark as Complete and you can&apos;t send messages.
              </p>
            </div>
          ) : (
            <SendMessageInputField handleSendMessage={handleSendMessage} />
          )}
        </div>
        
        {previewImage && <ImagePreview src={previewImage} onClose={closePreview} />}
      </div>
    );
  };