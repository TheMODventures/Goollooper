"use client";
import React, { useEffect, useState } from "react";

import { Users } from "@/components/User/Users";
import Pagination from "@/components/User/Pagination/Pagination";
import Search from "@/components/Searching/Search";
import DashboardLayout from "../layouts/DashboardLayout";

import RoleGuard from "@/components/RoleGuard";
import { useAuth } from "@/components/WithAuth/withAuth";
import { useAppDispatch } from "@/lib/hooks";
import { useSelector } from "react-redux";
import { RootState } from "@/store/reducers/rootReducer";
import { fetchUserData } from "@/store/Slices/PaymentSlice";

const UsersPage = () => {
  const dispatch = useAppDispatch();
  const { users, pageData } = useSelector((state: RootState) => state.payment);
  const isAuthenticated = useAuth('/');
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState(2);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      dispatch(fetchUserData({ page: currentPage, limit: pageData?.limit, search, role: roleFilter }));
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, currentPage, search, roleFilter, pageData?.limit]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRoleFilterChange = (role: number | string) => {
    if (typeof role === "number") setRoleFilter(role);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <RoleGuard allowedRoles={[1, 4]}>
    <DashboardLayout Active={2}>
      <div className="flex-grow flex flex-col mt-4 ml-3 border border-border bg-white rounded p-5">
        <div className="mt-3">
          <h1 className="font-bold text-4xl">Users</h1>
          <p className="text-subTitleColor mt-5">
            You can see the overall Users of Goollooper here
          </p>

          <Search isSubAdmin={false} isUser={true} onRoleFilterChange={handleRoleFilterChange} roleFilter={roleFilter} value={search} onChange={handleSearchChange} users={users} />

          <div className="flex flex-col items-stretch space-y-14 flex-grow overflow-auto">
            {/* Adding overflow-auto to handle the content overflow */}
            {users?.length ? <Users users={users} isUser={true} isSubAdmin={false} isPayment={false} /> : null}
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

export default UsersPage;