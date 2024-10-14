import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { IMAGE_URL } from "@/lib/constants";

interface ImageAvatarProps {
  profileImage?: string;
  firstName?: string;
  lastName?: string;
  css?: string;
  isModal?: boolean;
}

const ImageAvatar: React.FC<ImageAvatarProps> = ({
  profileImage,
  firstName,
  lastName,
  css,
  isModal,
}) => {
  return (
    <Avatar className={`${css}`}>
      <AvatarImage
        src={profileImage && `${IMAGE_URL}${encodeURIComponent(profileImage)}`}
        alt="profile-image"
      />
      <AvatarFallback className={`${isModal ? "text-xl" : ""} text-center rounded-full`}>
        {firstName?.charAt(0)}
        {lastName?.charAt(0)}
      </AvatarFallback>
    </Avatar>
  );
};

export default ImageAvatar;
