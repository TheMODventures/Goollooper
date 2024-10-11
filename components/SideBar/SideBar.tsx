"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import Logo1 from "@/public/assets/Image/Logo.svg";
import Logo2 from "@/public/assets/Image/Logo2.svg";
import DashboardSVG from "@/public/assets/Image/Dashboard.svg";
import DashboardFilledSVG from "@/public/assets/Image/dashboard-filled.svg";
import UserSVG from "@/public/assets/Image/users.svg";
import UserFilledSVG from "@/public/assets/Image/users-filled.svg";
import SubAdminSVG from "@/public/assets/Image/SubAdmin.svg";
import SubAdminFilledSVG from "@/public/assets/Image/subadmin-filled.svg";
import SupportSVG from "@/public/assets/Image/Support.svg";
import SupportFilledSVG from "@/public/assets/Image/support-filled.svg";
import GuidelineSVG from "@/public/assets/Image/Guideline.svg";
import GuidelineFilledSVG from "@/public/assets/Image/guidline-filled.svg";
import NotificationSVG from "@/public/assets/Image/PushNotification.svg";
import NotificationFilledSVG from "@/public/assets/Image/pushNotification-filled.svg";
import PaymentSVG from "@/public/assets/Image/Payment.svg";
import PaymentFilledSVG from "@/public/assets/Image/payment-filled.svg";
import ProfileDropdownIcon from "@/public/assets/Image/ProfileDropdownIcon.svg";

import { removeUser } from "@/store/actions/userAction";
import { RootState } from "@/store/reducers/rootReducer";
import { logout } from "@/api";
import { IMAGE_URL } from "@/lib/constants";

export default function SideBar({
  children,
  Active,
}: {
  children?: React.ReactNode;
  Active?: number;
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const refreshToken = useSelector(
    (state: RootState) => state.user.refreshToken
  );

  const user = useSelector((state: RootState) => state.user.user);
  const userRole = useSelector((state: RootState) => state.user.user?.role);

  const [isClient, setIsClient] = useState(false);

  const currentActivePath = usePathname();
  const basePath = currentActivePath ? currentActivePath.split('/').slice(0, 2).join('/') : '';

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  const AllLinks = [
    {
      Icon: DashboardSVG,
      IconActive: DashboardFilledSVG,
      category: "Dashboard",
      id: 1,
      path: "/dashboard",
      allowedRoles: [1, 4],
    },
    {
      Icon: UserSVG,
      IconActive: UserFilledSVG,
      category: "Users",
      id: 2,
      path: "/users",
      allowedRoles: [1, 4],
    },
    {
      Icon: SubAdminSVG,
      IconActive: SubAdminFilledSVG,
      category: "Sub Admin",
      id: 3,
      path: "/SubAdmin",
      allowedRoles: [1, 4],
    },
    {
      Icon: SupportSVG,
      IconActive: SupportFilledSVG,
      category: "Support",
      id: 4,
      path: "/support",
      allowedRoles: [1, 4, 5],
    },
    {
      Icon: GuidelineSVG,
      IconActive: GuidelineFilledSVG,
      category: "Guideline",
      id: 5,
      path: "/guideline",
      allowedRoles: [1, 4],
    },
    {
      Icon: NotificationSVG,
      IconActive: NotificationFilledSVG,
      category: "Push Notification",
      id: 6,
      path: "/notifcation",
      allowedRoles: [1, 4],
    },
    {
      Icon: PaymentSVG,
      IconActive: PaymentFilledSVG,
      category: "Payments",
      id: 7,
      path: "/payments",
      allowedRoles: [1],
    }
  ];

  const onLogout = async () => {
    try {
      let logotRes: any = await logout({
        refreshToken,
      });
      dispatch(removeUser());
      toast.success(logotRes?.data?.msg);
      router.push("/");
    } catch (error: Error | any) {
      if (typeof error?.response?.data?.data === "object") {
        error?.response?.data?.data?.map((err: string) => {
          toast.error(err);
        });
      } else {
        toast.error(error?.response?.data?.msg);
      }
    }
  };


  return (
    <>
      <aside className="fixed min-h-screen w-[15.688em] flex-col pt-[1.438em] pb-8 z-10 bg-white border-r border-border">
        <div className="flex items-center space-x-[0.625em] px-[1.5em]">
          <Image src={Logo1} alt="" width={37} height={37}/>
          <Image src={Logo2} alt="" width={87} height={60} />
        </div>

        <div className="mt-[1.813em] flex flex-1 flex-col justify-between">
          <nav className="space-y-2">
            {AllLinks.map((item) => {
              if (item.allowedRoles.includes(userRole)) {
                return (
                  <div className="space-y-3" key={item.id}>
                    <Link
                      className={`flex transform items-center px-[1.5em] py-3 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700 ${ basePath === item.path ? "border-r-4 border-PrimaryColor" : "" }`}
                      href={item.path}
                    >
                      <Image
                        src={ basePath === item.path ? item.IconActive : item.Icon }
                        alt="Icon"
                        width={21}
                        height={21}
                        className={ basePath === item.path ? "opacity-100" : "opacity-10" }
                        style={{ fill: "red", color: "red" }}
                      />

                      <span
                        className={`mx-2 text-[0.875rem] leading-[1.313rem] opacity-10 font-normal ${
                          basePath === item.path ? "text-PrimaryColor opacity-100" : null
                        }`}
                      >
                        {item.category}
                      </span>
                    </Link>
                  </div>
                );
              }
          })}
          </nav>
        </div>
      </aside>

      {/* Add the main content here */}
      <div>
        {/* Your main content goes here */}
        <nav className="relative bg-white border-b border-border items-center flex justify-end  px-10  py-4">
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none flex items-center gap-3">
              <Avatar className="cursor-pointer">
                <AvatarImage
                  src={`${IMAGE_URL}${user?.profileImage}`}
                  alt="@shadcn"
                />
                <AvatarFallback>
                  {`${user?.firstName ? user?.firstName?.charAt(0) : "N"}${user?.lastName ? user?.lastName?.charAt(0) : "A"}`}
                </AvatarFallback>
              </Avatar>
              <Image src={ProfileDropdownIcon} alt="Arrow" width={11} height={11} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="text-center mt-4 mr-10 w-[14.875em] h-[14.125em]">
              <div className="flex w-full justify-center">
                <Avatar className="w-[4.188em] h-[4.188em] mb-3 mt-4">
                  <AvatarImage
                    src={`${IMAGE_URL}${user?.profileImage}`}
                    alt="@shadcn"
                    className="w-[4.188em] h-[4.188em]"
                  />
                  <AvatarFallback className="w-[4.188em] h-[4.188em]">
                    {`${user?.firstName ? user?.firstName?.charAt(0) : "N"}${user?.lastName ? user?.lastName?.charAt(0) : "A"}`}
                  </AvatarFallback>
                </Avatar>
              </div>
              <DropdownMenuLabel className="text-[0.875rem]">{`${user?.firstName} ${user?.lastName}`}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="my-1 mx-10 text-md flex text-[0.875rem] justify-center" style={{ backgroundColor: 'transparent', cursor: 'pointer' }}>
                <Link href={"/change-password"}>Change Password</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="my-1 mx-10 text-md flex text-[0.875rem] justify-center" onClick={onLogout} style={{ color: '#F41D1D', backgroundColor: 'transparent', cursor: 'pointer' }}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
        <div className="flex-1 ml-[15.688em]">
          {children}
        </div>
      </div>
    </>
  );
}
