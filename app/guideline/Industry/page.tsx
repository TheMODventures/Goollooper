"use client";

import React, { useCallback, useEffect, useState } from "react";
import Task from "@/components/Task";
import Pagination from "@/components/User/Pagination/Pagination";
import DashboardLayout from "@/app/layouts/DashboardLayout";
import GuidelineLayout from "@/app/layouts/GuidelineLayout";
import { Service } from "@/types/type";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/store";
import {
  deleteIndustry,
  fetchIndustries,
  removeIndustry,
  selectIndustries,
} from "@/store/Slices/IndustrySlice";
import IndustryModal from "@/components/Industry/IndustryModal";

export default function IndustryPage() {
  const dispatch = useDispatch<AppDispatch>();
  const industries = useSelector(selectIndustries);

  const fetchData = useCallback(async () => {
    dispatch(fetchIndustries());
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeleteCategory = useCallback(
    (id: string | number) => {
      dispatch(deleteIndustry(id as string));
      dispatch(removeIndustry(id));
    },
    [dispatch]
  );



  return (
    <DashboardLayout>
      <GuidelineLayout>
        <div className="bg-white h-full mr-2 px-[1.754em] border border-border rounded-md  ">
          <div className="flex justify-between">
            <h1 className="font-bold text-[1.875rem] leading-[3rem] mt-[1.754rem]">
              Industry
            </h1>
            {/* <<Link
              href="/guideline/Volunteer/add"
              className="w-[16.125rem] h-[2.375rem] mt-[1.313rem] text-[0.875rem] leading-[1.25rem] rounded-full bg-PrimaryColor text-white text-center flex items-center justify-center"
            >
              Add
            </Link>> */}
            <IndustryModal />
          </div>
          <div className="flex flex-col gap-[0.5em] mt-[1.188em]">
            {industries?.length
              ? industries?.map((industry: any) => (
                  <Task
                    key={industry._id}
                    title={industry.name}
                    id={industry._id}
                    onDelete={handleDeleteCategory}
                    isIndustry={true}
                  />
                ))
              : null}
          </div>
          {/* <div className="p-4 ">
            <Pagination
              currentPage={currentPage}
              totalPages={pageData.totalPages}
              totalItems={pageData.totalItems}
              onPageChange={handlePageChange}
              limit={pageData.limit}
            />
          </div> */}
        </div>
      </GuidelineLayout>
    </DashboardLayout>
  );
}
