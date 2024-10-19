import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Chat, User } from '@/types/type';
import { SearchBar } from './SearchBar';
import { UserList } from './UserList';
import { getAllTasks, setActiveTaskId } from '@/store/Slices/TasksSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { useSelector } from 'react-redux';


export const ChatList = ({
    chats,
    user,
    onClick,
    handleActiveTab,
  }: {
    chats: Chat[];
    user: User;
    onClick: (chatData: Chat | string | null) => void;
    handleActiveTab: (tab: number) => void;
  }) => {

  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((state: RootState) => state.tasks.tasks)

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredChats, setFilteredChats] = useState(chats);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredChats(chats);
    } else {
      const filtered = chats.filter((chat: Chat) => {
        return chat.participants.some((participant: any) => 
          participant._id === chat.createdBy && 
          (participant.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
           participant.lastName?.toLowerCase().includes(searchQuery.toLowerCase()))       
        );
      });
      setFilteredChats(filtered);
    }
  }, [searchQuery, chats]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const fetchTasks = useCallback(async () => {
    dispatch(getAllTasks());
  }, [dispatch]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCurrentSelectTask = (data: string | Chat | null) => {
    if (typeof data === 'string') {
      dispatch(setActiveTaskId(data));
    }
  }

  return (
    <div className="w-[24em] border-r border-border flex flex-col mb-[0.69em]">
      <div className="border-b border-border mt-[1.813em] mb-[0.396em] pl-[1.938em]">
        <h1 className="font-bold text-[1.875rem] leading-[2.813rem] mb-[0.5rem]">Support</h1>
        <p className="text-subTitleColor text-[0.875rem] leading-[1.313rem] mb-[1.875rem]">You can chat users here</p>
      </div>

      <Tabs defaultValue="support" className="flex flex-col">
        <TabsList className="grid grid-cols-2 h-[2.771em] mb-[0.458em] p-0 bg-muted-none ml-[1.938em] mr-[1.25em] shadow-none">
          <TabsTrigger value="support" onClick={() => handleActiveTab(1)} className="h-[46px] text-[1.083rem] leading-[1.203rem] py-[0.75rem] rounded-r-none m-0 bg-white data-[state=active]:bg-PrimaryColor data-[state=active]:text-white data-[state=active]:border-none border-y border-l border-borde">
            Support
          </TabsTrigger>
          <TabsTrigger value="task" onClick={() => handleActiveTab(2)} className="h-[46px] text-[1.083rem] leading-[1.203rem] py-[0.75rem] rounded-l-none p-0 m-0 bg-white data-[state=active]:bg-PrimaryColor data-[state=active]:text-white data-[state=active]:border-none border-y border-r border-border">
            Tasks
          </TabsTrigger>
        </TabsList>
        <TabsContent value="support" className="m-0 p-0 flex-grow flex flex-col">
          <div className="mb-5">
            <SearchBar onSearch={handleSearch}/>
          </div>
          <ScrollArea className="h-calc-chatlist-screen">
            <UserList chats={filteredChats} user={user} onClick={onClick} />
          </ScrollArea>
        </TabsContent>
        <TabsContent value="task" className="m-0 p-0 flex-grow flex flex-col">
          <div className="mb-5">
            <SearchBar onSearch={handleSearch}/>
          </div>
          <ScrollArea className="h-calc-chatlist-screen">
            <UserList tasks={tasks} onClick={handleCurrentSelectTask}  isTask={true} />
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};