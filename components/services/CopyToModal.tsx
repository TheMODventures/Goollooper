"use client";

import React, { FC, useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  copyKeyword,
  setCopyKeywordsSubList,
  SubService,
} from "@/store/Slices/ServiceSlice";
import { Chips } from "../Chips";
import { AppDispatch } from "@/store/store";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

interface CopyToModalProps {
  buttonTitle: string;
  title: string;
  content: SubService[];
  aditionalContent: string[];
  currentIndex: number;
}

const CopyToModal: FC<CopyToModalProps> = ({
  buttonTitle,
  title,
  content,
  aditionalContent,
  currentIndex,
}) => {
  const [selected, setSelected] = useState<number[]>([]);
  const dispatch = useDispatch<AppDispatch>();

  const handleSelect = (id: number) => {
    content.map((cont: any, index: number) => {
      if (index === id) {
        setSelected((prev) => [...prev, index]);
      }
    });
  };

  const copy = () => {
    if (selected && selected.length > 0) {
      if (aditionalContent.length > 0) {
        dispatch(setCopyKeywordsSubList(selected));
        dispatch(copyKeyword(aditionalContent));
        toast.success("Keywords copied successfully");
      } else {
        toast.warning(
          "The current subcategory doesn't have any keywords. Please add keywords first!"
        );
      }
    } else {
      toast.warning(
        "Please select subcategories in the modal first to copy keywords to them."
      );
    }
  };

  const clearList = () => {
    setSelected([]);
  };

  // console.log(aditionalContent);

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="h-[2.375rem] text-[0.875rem] leading-[1.25rem] rounded-full bg-PrimaryColor text-white text-center flex items-center justify-center">
          {buttonTitle}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>
          {content?.map((cont: SubService, index: number) =>
            index !== currentIndex ? (
              <Chips
                key={cont.title}
                id={index.toString()}
                index={index}
                text={cont.title}
                hideCross={true}
                selected={selected}
                isSubCategory={false}
                isMultipleSelected={true}
                currentSelected={handleSelect}
              />
            ) : null
          )}
        </DialogDescription>
        <DialogClose className="flex flex-col gap-2">
          <Button
            className="w-full h-[2.375rem] mt-[1.313rem] text-[0.875rem] leading-[1.25rem] rounded-full bg-PrimaryColor text-white text-center flex items-center justify-center"
            onClick={copy}
          >
            Copy
          </Button>
          <Button className="w-full" variant="ghost" onClick={clearList}>
            Close
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default CopyToModal;
