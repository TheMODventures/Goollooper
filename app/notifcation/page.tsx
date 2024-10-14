"use client";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import DashboardLayout from "../layouts/DashboardLayout";
import PushInfomation from "@/components/Pushinfomation/Push";
import { DatePicker } from "@/components/DatePicker/DatePicker";
import { Button } from "@/components/ui/button";

import { getNotification, getUsers, sendNotification } from "@/api";
import { User } from "@/types/type";
import RoleGuard from "@/components/RoleGuard";
import { useAuth } from "@/components/WithAuth/withAuth";

interface Option {
  value: string;
  label: string;
}

const NotificationPage = () => {
  const isAuthenticated = useAuth('/');
  
  const [notifications, setNotifications] = useState([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [search, setSearch] = useState<string>("");
  const [userLoading, setUserLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCheckbox, setSelectedCheckbox] = useState<string>("all");
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [users, setUsers] = useState<Option[] | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setUserLoading(true);
      let usersRes = await getUsers(1, 10, search);
      const data = usersRes?.data?.data?.data?.map((item: User) => ({
        value: item.email,
        label: item.email,
      }));
      setOptions(data);
      setUserLoading(false);
    } catch (error: Error | any) {
      setUserLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [search, fetchData]);

  const fetchNotificationData = async () => {
    try {
      let notificationsRes = await getNotification(1, 10);
      setNotifications(notificationsRes?.data?.data?.result);
    } catch (error: Error | any) {}
  };

  const onPush = async () => {
    if (!title || !content) {
      toast.warning("Please fill all required fields");
      return;
    }
    if (selectedCheckbox === "selected" && !users?.length) {
      toast.warning("Please select users");
      return;
    }
    try {
      setLoading(true);
      let data = {
        title,
        content,
        all: selectedCheckbox === "all",
        receiver: users?.map((item) => item.value) || [],
      };

      let notificationRes: any = await sendNotification(data);
      if (notificationRes?.data?.status) {
        toast.success("Notificaion sent successfully");
        setLoading(false);
        setTitle("");
        setContent("");
      } else {
        toast.warning(notificationRes?.msg);
      }
    } catch (error: Error | any) {
      setLoading(false);
      if (typeof error?.response?.data?.data === "object") {
        error?.response?.data?.data?.map((err: string) => {
          toast.error(err);
        });
      } else {
        toast.error(error?.response?.data?.msg);
      }
    }
  };

  useEffect(() => {
    fetchNotificationData();
  }, []);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <RoleGuard allowedRoles={[1, 4]}>
    <DashboardLayout Active={6}>
      <div className="flex">
        <div className="w-full mt-[0.875em] ml-[0.813em] mb-[0.875em] rounded-lg  flex-col">
          <div className="pt-[1.813em] pl-[1.75em] pr-[1.688em] bg-white pb-6 rounded-md border border-border">
            <div className="flex justify-between items-center">
              <h1 className="text-[1.875rem] leading-[2.813rem] font-bold">Push Notification</h1>
              <div className="py-[0.438em] pl-[0.438em] bg-primary-foreground rounded-md">
                <DatePicker />
              </div>
            </div>

            <PushInfomation
              selectedCheckbox={selectedCheckbox}
              setSelectedCheckbox={setSelectedCheckbox}
              options={options}
              setSearch={setSearch}
              loading={loading}
              userLoading={userLoading}
              handleChange={setUsers}
              title={title}
              setTitle={setTitle}
            />
          </div>

          <div className="mt-[0.875em] bg-white border border-border rounded-lg">

            <h1 className="w-full px-[1.4rem] mt-[0.688em] text-[1.4rem] leading-[2.813rem] font-bold">Notification Content<span className="text-PrimaryColor"> *</span></h1>
            <div className="">

              <textarea className="h-calc-editor-screen w-full px-[1.4rem] pt-2" placeholder="Please write your notification content" value={content} onChange={(e) => setContent(e.target.value)} />
            </div>

            <div className="flex justify-end mt-2 pr-4 pb-4">
              <Button
                className="bg-PrimaryColor rounded-full px-11"
                onClick={onPush}
              >
                Push Now
              </Button>
            </div>
          </div>
        </div>

        <div className="w-2/5 mt-[0.875em] mr-1 mb-3 bg-white ml-[0.875em] p-10 rounded-lg border border-border">
          <p className="mb-5 text-lg font-semibold">History</p>
          <div className="flex flex-col space-y-4 border-l-2 border-dashed p-3">
            {notifications?.map((item: any) => (
              <div className="flex items-center gap-4 px-3" key={item._id}>
                <p className="text-xs ">
                  {new Date(item?.createdAt)?.toLocaleDateString()}
                </p>
                <p className="text-xs text-subTitleSecondaryColor">
                  Notification was sent
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
    </RoleGuard>
  );
}

export default NotificationPage;
