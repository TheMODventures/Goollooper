"use client";

import { useCallback, useEffect, useState } from "react";
import {
  addSubService,
  editService,
  fetchService,
  removeService,
} from "@/store/Slices/ServiceSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { Button } from "../ui/button";
import ServiceInput from "./ServiceInput";
import { Chips } from "../Chips";
import { toast } from "react-toastify";
import { Skeleton } from "../ui/skeleton";

const OptionalCatgories = ({
  id,
  level,
  title,
  industry,
}: {
  id: string;
  level: number;
  title: string;
  industry: string;
}) => {  
  const dispatch = useDispatch<AppDispatch>();
  const [data, setData] = useState<any[]>([]);
  const [category, setCategory] = useState("");
  const [categoryIndex, setCategoryIndex] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const response = await dispatch(fetchService(id)).unwrap();
      if (response.length > 0) {
        setData(response);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching service:", error);
    }
  }, [dispatch, id]);

  useEffect(() => {
    fetchData();
  }, [id, dispatch, fetchData]);

  const handleCategoryChange = (e: string) => {
    setCategory(e);
  };

  const handleCurrentSubCategoryClick = (index: number) => {
    setCategoryIndex(index);
  };

  const handleRemoveSubCategoryClick = (value: string) => {
    const service = data.find((item: any) => item.title === value) as any;
    dispatch(removeService(service._id));
    setData((prevData) => {
      const newData = [...prevData] as any;
      return newData.filter((item: any) => item.title !== value);
    });
    setCategoryIndex(0);
    toast.success("Sub category removed successfully");
  };

  const handleUpdateCategory = async () => {
    const response = await dispatch(
      addSubService({
        serviceId: id,
        title: category,
        type: "interest",
        industry: industry,
      })
    ).unwrap();
    setData((prevData) => {
      return [...prevData, response.data];
    });
    setCategory("");
    toast.success(`Sub category ${category} successfully`);
  };

  if (title === undefined) return null;

  return (
    <div>
      <div>
        <div className="mt-10 mb-2 flex justify-between">
          <h4 className="text-[1.5rem] leading-[0.938rem] font-normal">
            Add sub category to
            <span className="text-PrimaryColor ml-1">{` ${title}`}</span>
          </h4>
          <h4 className="text-[1.5rem] leading-[0.938rem] font-normal">
            Level {level}
          </h4>
        </div>
        <ServiceInput
          title="Keyword"
          value={category}
          onChange={handleCategoryChange}
        />
        <div className="mt-5 flex justify-end">
          <Button
            className="w-[10.625rem] h-[2.375rem] text-[0.875rem] leading-[1.25rem] font-medium bg-PrimaryColor rounded-full"
            onClick={handleUpdateCategory}
          >
            Add sub catgory
          </Button>
        </div>
        <div className="w-full flex flex-wrap gap-5 mt-6">
          {data.map((item: any, index: number) => (
            <Chips
              key={item.title}
              id={item.title}
              index={index}
              text={item.title}
              selected={categoryIndex}
              isSubCategory={true}
              currentSelected={handleCurrentSubCategoryClick}
              onSubCategoryClick={handleRemoveSubCategoryClick}
            />
          ))}
        </div>
      </div>
      {/* {data.map(
        (item: any, index: number) =>
          ((item.hasSubCategory &&
            item._id === data[categoryIndex]?._id) ||
            index === 0) && (
            
          )
      )} */}

      {data.length > 0 && level < 4 ? (
        <OptionalCatgories
          key={data[categoryIndex]?._id}
          id={data[categoryIndex]?._id}
          level={level + 1}
          title={data[categoryIndex]?.title}
          industry={industry}
        />
      ) : null}
    </div>
  );
};

export default OptionalCatgories;
