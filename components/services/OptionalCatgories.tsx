"use client";

import { useCallback, useEffect, useState } from "react";
import {
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

const OptionalCatgories = ({
  id,
  level,
  title,
}: {
  id: string;
  level: number;
  title: string;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [data, setData] = useState([]);
  const [category, setCategory] = useState("");
  const [categoryIndex, setCategoryIndex] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const response = await dispatch(fetchService(id)).unwrap();
      setData(response);
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
    console.log("Remove service:", service._id);
    dispatch(removeService(service._id));
    setData((prevData) => {
      const newData = [...prevData] as any;
      return newData.filter((item: any) => item.title !== value);
    });
    toast.success("Sub category removed successfully");
  };

  const handleUpdateCategory = () => {
    const service = data[categoryIndex] as any;
    const body: any = {
      title: category,
    };
    console.log("Update service:", service._id, body);
    dispatch(editService({ id: service._id, service: body }));
    setData((prevData) => {
      const newData = [...prevData] as any;
      newData[categoryIndex].title = category;
      return newData;
    });
    setCategory("");
    toast.success("Sub category updated successfully");
  };

  if (data.length === 0) return null;
  // console.log(`Level ${level}:`, data);

  return (
    <div>
      <div>
        <div className="mt-10 mb-2 flex justify-between">
          <h4 className="text-[1.5rem] leading-[0.938rem] font-normal">
            Update sub category to
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
            Update sub catgory
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
      {data.map(
        (item: any, index: number) =>
          item.hasSubCategory &&
          item._id === (data[categoryIndex] as any)?._id && (
            <OptionalCatgories
              key={item._id}
              id={item._id}
              level={level + 1}
              title={item.title}
            />
          )
      )}
    </div>
  );
};

export default OptionalCatgories;
