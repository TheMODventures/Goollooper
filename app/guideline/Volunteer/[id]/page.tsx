"use client";

// This component is responsible for managing the volunteer subpage within the guideline section of the application.
// It allows users to view, add, update, and remove categories and subcategories related to volunteer services.
// The component uses Redux for state management and dispatches various actions to handle the service data.
// It also includes UI components for displaying and interacting with the service data, such as buttons, inputs, and chips.
// By Bilal Khalil Khankhail

import { Button } from "@/components/ui/button";
import DashboardLayout from "@/app/layouts/DashboardLayout";
import GuidelineLayout from "@/app/layouts/GuidelineLayout";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Chips } from "@/components/Chips";
import ServiceInput from "@/components/services/ServiceInput";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/store";
import {
  fetchService,
  handleAddSubCategory,
  handleCategory,
  handleSingleSubCategory,
  handleRemoveSubCategory,
  handleCurrentSubCategory,
  selectService,
  selectLoading,
  selectSingleSubCategory,
  resetServiceState,
  handleSetType,
  addSubService,
  removeService,
  updateSubService,
  fetchServices,
  selectServices,
  selectSubServices,
  SubService,
} from "@/store/Slices/ServiceSlice";
import { useParams, useSearchParams } from "next/navigation";

export default function VolunteerSubpage() {
  const searchParams = useSearchParams();
  const params = useParams();
  let volunteerTitle = searchParams.get("title");
  let serviceId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [category, setCategory] = useState<string>("");

  const dispatch = useDispatch<AppDispatch>();
  const service = useSelector(selectService);
  const services = useSelector(selectServices);
  const subServices = useSelector(selectSubServices);
  const loading = useSelector(selectLoading);
  const singleSubCategory = useSelector(selectSingleSubCategory);

  const fetchData = useCallback(() => {
    dispatch(handleSetType("volunteer"));
    if (serviceId !== "add") {
      dispatch(fetchService(serviceId));
      dispatch(fetchServices({ page: 1, limit: 10, type: "volunteer" }));
    }
  }, [dispatch, serviceId]);

  useEffect(() => {
    fetchData();

    return () => {
      dispatch(resetServiceState());
    };
  }, [fetchData, dispatch]);

  useEffect(() => {
    if (volunteerTitle) {
      dispatch(handleCategory(volunteerTitle));
    }
  }, [dispatch, volunteerTitle]);

  const handleAddSubCategoryClick = () => {
    if (service?.title) {
      if (serviceId === "add") {
        dispatch(
          addSubService({
            serviceId: subServices[0]?._id,
            title: singleSubCategory,
            type: "volunteer",
          })
        );
      } else {
        dispatch(
          addSubService({
            serviceId,
            title: singleSubCategory,
            type: "volunteer",
          })
        );
      }
      dispatch(handleAddSubCategory(singleSubCategory));
    } else {
      toast.error("Please add category first");
    }
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
  };

  const handleSingleSubCategoryChange = (value: string) => {
    dispatch(handleSingleSubCategory(value));
  };


  const handleRemoveSubCategoryClick = (value: string | undefined) => {
    if (serviceId !== "add") {
      dispatch(removeService(String(value)));
      const subCategory = service?.subCategories?.find(
        (category: SubService) => category._id === value
      )?.title;
      dispatch(handleRemoveSubCategory(subCategory));
    } else {
      const id = subServices.find((category: SubService) => category.title === value)?._id;
      console.log(id);
      dispatch(removeService(String(id)));
      dispatch(handleRemoveSubCategory(String(value)));
    }

    console.log(value);
  };

  const handleCurrentSubCategoryClick = (index: number) => {
    dispatch(handleCurrentSubCategory(index));
  };

  const handleUpdateCategory = () => {
    dispatch(handleCategory(category));

    if (service?.title) {
      if (serviceId === "add") {
        serviceId = subServices[0]?.data?._id;
      } else {
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.set("title", category);
        window.history.replaceState(null, "", `?${newSearchParams.toString()}`);
      }

      dispatch(
        updateSubService({
          id: serviceId,
          title: category,
          type: "volunteer",
          parent: null,
        })
      );
    } else {
      dispatch(
        addSubService({ serviceId: null, title: category, type: "volunteer" })
      );
    }
    dispatch(handleCategory(category));
    setCategory("");
  };

  console.log(service);
  return (
    <DashboardLayout>
      <GuidelineLayout>
        <div>
          <div className="bg-white h-full mr-2 rounded-md border border-border px-[1.75em] py-[1.438em] ">
            <div className="flex flex-row justify-between items-center">
              <h1 className="text-[1.875em] leading-[2.813] font-bold">
                Volunteer
              </h1>
              <h1 className="text-[1.875em] font-bold text-PrimaryColor">
                {service?.title}
              </h1>
            </div>

            <ServiceInput
              title="Category"
              value={category}
              onChange={handleCategoryChange}
            />
            <div className="mt-5 flex justify-end">
              <Button
                className="w-[10.625rem] h-[2.375rem] text-[0.875rem] leading-[1.25rem] font-medium bg-PrimaryColor rounded-full"
                onClick={handleUpdateCategory}
              >
                {service?.title ? "Update Category" : "Add Category"}
              </Button>
            </div>

            <ServiceInput
              title="Sub Category"
              value={singleSubCategory}
              onChange={handleSingleSubCategoryChange}
            />
            <div className="mt-5 flex justify-end">
              <Button
                className="w-[10.625rem] h-[2.375rem] text-[0.875rem] leading-[1.25rem] font-medium bg-PrimaryColor rounded-full"
                onClick={handleAddSubCategoryClick}
              >
                Add Sub Category
              </Button>
            </div>

            <div className="w-full flex flex-wrap gap-5 mt-6">
              {service?.subCategories &&
                service.subCategories.map((item: SubService, index: number) => (
                  <Chips
                    key={item?.title}
                    id={item?._id ?? ""}
                    index={index}
                    text={item?.title}
                    isSubCategory={true}
                    isDeleteId={serviceId !== "add" ? true : false}
                    onSubCategoryClick={handleRemoveSubCategoryClick}
                    currentSelected={handleCurrentSubCategoryClick}
                  />
                ))}
            </div>
          </div>
        </div>
      </GuidelineLayout>
    </DashboardLayout>
  );
}
