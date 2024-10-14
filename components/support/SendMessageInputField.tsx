import React, { useState, useRef } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface SendMessageInputFieldProps {
  handleSendMessage: (image: string, message: string) => void;
}

const SendMessageInputField: React.FC<SendMessageInputFieldProps> = ({
  handleSendMessage,
}) => {
  const [message, setMessage] = useState("");
  const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<any>();

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative flex flex-col w-full">
      {imagePreview && (
        <div className="absolute bottom-7 left-10 mb-4 shadow-lg">
          <Image
            src={typeof imagePreview === "string" ? imagePreview : ""}
            alt="Preview"
            width={400}
            height={400}
            className="rounded-md border border-border"
          />
          <button
            onClick={() => setImagePreview(null)}
            className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
          >
            <X size={16} />
          </button>
        </div>
      )}
      <div className="flex items-center w-full">
        <Image
          src="/assets/Image/Link.svg"
          alt="Attach File"
          width={18}
          height={17}
          className="mr-2 cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        />
        <input
          type="file"
          onChange={handleFileInputChange}
          accept="image/*"
          style={{ display: "none" }}
          ref={fileInputRef}
        />
        <Input
          type="text"
          placeholder="Type a message..."
          className="bg-backGroundColor rounded-full flex-grow h-[1.875rem] mx-[0.75rem] pl-[1rem] py-[0.313rem] border text-[0.75rem] leading-[1.25rem]"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage(imageFile, message);
              setMessage("");
              setImagePreview(null);
              setImageFile(null);
            }
          }}
        />
        <Image
          src="/assets/Image/Send.svg"
          alt="Send Message"
          width={17}
          height={17}
          className="cursor-pointer"
          onClick={() => {
            handleSendMessage(imageFile, message)
            setMessage("");
            setImagePreview(null);
            setImageFile(null);
          }
        }
        />
      </div>
    </div>
  );
};

export default SendMessageInputField;
