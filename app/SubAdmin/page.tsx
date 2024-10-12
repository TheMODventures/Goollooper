"use client";
import React, { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";
import { Users } from "@/components/User/Users";
import Pagination from "@/components/User/Pagination/Pagination";
import Search from "@/components/Searching/Search";

import RoleGuard from "@/components/RoleGuard";
import { useAuth } from "@/components/WithAuth/withAuth";
import { RootState } from "@/store/reducers/rootReducer";
import { useSelector } from "react-redux";
import { fetchUserData } from "@/store/Slices/PaymentSlice";
import { useAppDispatch } from "@/lib/hooks";

const SubadminPage = () => {
  const dispatch = useAppDispatch();
  const { subadmins, pageData } = useSelector((state: RootState) => state.payment);
  const isAuthenticated = useAuth('/');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [search, setSearch] = React.useState("");

  useEffect(() => {
    try {
      dispatch(fetchUserData({ page: currentPage, limit: pageData.limit, search, isSubAdmin: true }));
    } catch (error) {
      console.error("Error fetching subadmin data:", error);
    }
  }, [dispatch, currentPage, search, pageData.limit]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <RoleGuard allowedRoles={[1, 4]}>
    <DashboardLayout Active={3}>
      <div
        className="flex-grow flex flex-col m-2 border border-border bg-white rounded p-5"
      >
        <div>
          <h1 className="font-bold text-4xl">Sub Admins</h1>
          <p className="text-subTitleColor mt-5">
            You can see the overall Sub Admins of Goollooper here
          </p>
          <Search isSubAdmin={true} isUser={false} value={search} onChange={handleSearchChange} users={subadmins} />

          <div className="flex flex-col items-stretch space-y-14 flex-grow overflow-auto">
            {/* Adding overflow-auto to handle the content overflow */}
            {/* <Users users={dummyUsers2}  isSubAdmin={true}/> */}
            {subadmins?.length ? (
              <Users users={subadmins} isSubAdmin={true} isPayment={false} isUser={false} />
            ) : null}
          </div>
        </div>

        {/* The div you want to stick to the bottom */}
        <div className="p-4 ">
          <Pagination
            currentPage={currentPage}
            totalPages={pageData?.totalPages}
            totalItems={pageData?.totalItems}
            onPageChange={handlePageChange}
            limit={pageData?.limit}
          />
        </div>
      </div>
    </DashboardLayout>
    </RoleGuard>
  );
}

export default SubadminPage;
