import { Chat, User } from "@/types/type";
import { UserAvatar } from "./UserAvatar";

export const UserList = ({
  chats,
  tasks,
  user,
  isTask,
  onClick,
}: {
  chats?: any;
  tasks?: any;
  user?: User;
  isTask?: boolean;
  onClick: (chatData: Chat | string | null) => void;
}) => {
  // console.log(tasks && "working task");
  return (
    <div>
      {chats &&
        chats?.map((msg: any) => (
          <UserAvatar
            key={msg._id}
            text={msg?.lastMessage?.body}
            chatData={msg}
            chatId={msg?._id}
            onUserClick={onClick}
            isList={true}
            isMark={false}
          />
        ))}
      {tasks &&
        tasks.map((task: any) => (
          <UserAvatar
            key={task._id}
            text={task.title}
            chatData={task}
            chatId={task._id}
            isTask={true}
            onUserClick={onClick}
          />
        ))}
    </div>
  );
};
