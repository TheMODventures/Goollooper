"use client";
import React, { useCallback, useEffect, useState } from "react";
import Task from "@/components/Task";
import Pagination from "@/components/User/Pagination/Pagination";
import DashboardLayout from "@/app/layouts/DashboardLayout";
import GuidelineLayout from "@/app/layouts/GuidelineLayout";
import { Service } from "@/types/type";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AppDispatch } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import {
  fetchServices,
  handleRemoveServices,
  removeService,
  selectServices,
} from "@/store/Slices/ServiceSlice";

export default function InterestPage() {
  const dispatch = useDispatch<AppDispatch>();
  const services = useSelector(selectServices);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageData, setPageData] = useState({
    totalPages: 0,
    totalItems: 0,
    limit: 10,
  });

  const fetchData = useCallback(
    async (page: number, limit: number) => {
      dispatch(fetchServices({ page, limit, type: "interest" }));
    },
    [dispatch]
  );

  useEffect(() => {
    fetchData(currentPage, pageData.limit);
  }, [currentPage, fetchData, pageData.limit]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDeleteCategory = useCallback(
    (id: string) => {
      const serviceId = services.find((service: any) => service?._id === id)
        ?.categories[0]._id;
      dispatch(handleRemoveServices(id));
      dispatch(removeService(serviceId));
    },
    [dispatch, services]
  );

  console.log(services);

  return (
    <DashboardLayout>
      <GuidelineLayout>
        <div className="bg-white border border-border px-[1.754em] h-full mr-2 rounded-md  ">
          <div className="flex justify-between">
            <h1 className="font-bold text-[1.875rem] leading-[3rem] mt-[1.754rem]">
              Task Interests (Categories)
            </h1>
            <Link
              href="/guideline/Interest/add"
              className="w-[16.125rem] h-[2.375rem] mt-[1.313rem] text-[0.875rem] leading-[1.25rem] rounded-full bg-PrimaryColor text-white text-center flex items-center justify-center"
            >
              Add
            </Link>
          </div>
          <ScrollArea className="flex flex-col h-calc-interest-list-screen mt-[1.188em]">
            {services?.length

              ? services?.map((service: any) => (
                  service?.categories?.map((category: any) => (
                    <Task
                      key={category._id}
                      title={category.category}
                      id={category._id}
                      link={`/guideline/Interest`}
                      onDelete={handleDeleteCategory} 
                    />
                  ))

                ))
              : null}
          </ScrollArea>
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
