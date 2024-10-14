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
import { selectServices, removeService, fetchServices, handleRemoveServices } from "@/store/Slices/ServiceSlice";

export default function VolunteerPage() {
  const dispatch = useDispatch<AppDispatch>();
  const services = useSelector(selectServices);
  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageData, setPageData] = useState({
    totalPages: 0,
    totalItems: 0,
    limit: 10,
  });

  const fetchData = useCallback(async (page: number, limit: number) => {
    dispatch(fetchServices({ page, limit, type: "volunteer" }));
  }, [dispatch])
  
  useEffect(() => {
    fetchData(currentPage, pageData.limit);
  }, [currentPage, fetchData, pageData.limit]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDeleteCategory = useCallback((id: string | number) => {
    dispatch(handleRemoveServices(id as string));
    dispatch(removeService(id as string));
  }, [dispatch]);

  return (
    <DashboardLayout>
      <GuidelineLayout>
        <div className="bg-white h-full mr-2 px-[1.754em] border border-border rounded-md  ">
          <div className="flex justify-between">
            <h1 className="font-bold text-[1.875rem] leading-[3rem] mt-[1.754rem]">Volunteer</h1>
            <Link href="/guideline/Volunteer/add"
              className="w-[16.125rem] h-[2.375rem] mt-[1.313rem] text-[0.875rem] leading-[1.25rem] rounded-full bg-PrimaryColor text-white text-center flex items-center justify-center"
            >
              Add
            </Link>
          </div>
          <div className="flex flex-col gap-[0.5em] mt-[1.188em]">
            {services?.length
              ? services?.map((service: Service) => (
                  <Task
                    key={service._id}
                    title={service.title}
                    id={service._id}
                    link={`/guideline/Volunteer`}
                    onDelete={handleDeleteCategory}
                  />
                ))
              : null}
          </div>
          <div className="p-4 ">
            <Pagination
              currentPage={currentPage}
              totalPages={pageData.totalPages}
              totalItems={pageData.totalItems}
              onPageChange={handlePageChange}
              limit={pageData.limit}
            />
          </div>
        </div>
      </GuidelineLayout>
    </DashboardLayout>
  );
}
