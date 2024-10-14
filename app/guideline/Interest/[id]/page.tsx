"use client";

import { Button } from "@/components/ui/button";
import DashboardLayout from "@/app/layouts/DashboardLayout";
import GuidelineLayout from "@/app/layouts/GuidelineLayout";
import { use, useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { Chips } from "@/components/Chips";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";

import Selector from "@/components/services/Selector";
import ServiceInput from "@/components/services/ServiceInput";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  fetchService,
  getIndustries,
  handleSelectIndustry,
  resetServiceState,
  selectLoading,
  selectService,
  selectSingleSubCategory,
  handleAddSubCategory,
  handleCategory,
  handleSingleSubCategory,
  handleRemoveSubCategory,
  handleCurrentSubCategory,
  handleAddNestedSubCategory,
  handleAddKeyword,
  handleRemoveKeyword,
  setSubCategoryLevel1Index,
  setSubCategoryLevel2Index,
  setSubCategoryLevel3Index,
  setSubCategoryLevel4Index,
  selectSubCategoryLevel1Index,
  selectSubCategoryLevel2Index,
  selectSubCategoryLevel3Index,
  selectSubCategoryLevel4Index,

  selectLevel1SubCategoryList,
  selectLevel2SubCategoryList,
  selectLevel3SubCategoryList,
  selectLevel4SubCategoryList,
  saveService,
  handleSetType,
  SubService,
  editService,
  updateSubService,
  selectState,
  handleUpdateSubCategory,
  removeService,
  updateKeywordTitle,
  handleRemoveNestedSubCategory,
} from "@/store/Slices/ServiceSlice";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import CopyToModal from "@/components/services/CopyToModal";
import OptionalCatgories from "@/components/services/OptionalCatgories";

export default function InterestSubpage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const serviceId = Array.isArray(params.id) ? params.id[0] : params.id;
  const serviceTitle = searchParams.get("title");
  const dispatch = useDispatch<AppDispatch>();
  const service = useSelector(selectService);
  const level1SubCategoryList = useSelector(selectLevel1SubCategoryList);
  const level2SubCategoryList = useSelector(selectLevel2SubCategoryList);
  const level3SubCategoryList = useSelector(selectLevel3SubCategoryList);
  const level4SubCategoryList = useSelector(selectLevel4SubCategoryList);

  const loading = useSelector(selectLoading);
  const singleSubCategory = useSelector(selectSingleSubCategory);
  const industries = useSelector(
    (state: RootState) => state.service.industries
  );

  const state = useSelector(selectState);

  const [singleKeyword, setSingleKeyword] = useState<string>("");
  const [subCategoryIndex, setSubCategoryIndex] = useState<number>(0);
  const [keywordIndex, setKeywordIndex] = useState<number>(0);

  const [nestedSubCategoryInputs, setNestedSubCategoryInputs] = useState<{
    [key: number]: string;
  }>({
    0: "",
    1: "",
    2: "",
    3: "",
  });

  const fetchData = useCallback(() => {
    if (serviceId !== "add") {
      dispatch(fetchService(serviceId));
    }
  }, [dispatch, serviceId]);

  useEffect(() => {
    fetchData();
    return () => {
      dispatch(resetServiceState());
    };

  }, [dispatch, fetchData]);


  const fetchIndustries = useCallback(() => {
    dispatch(getIndustries());
    dispatch(handleSetType("interest"));
  }, [dispatch]);

  useEffect(() => {
    fetchIndustries();
  }, [fetchIndustries]);

  const handleSelectIndustryChange = (value: string) => {
    const industryId = industries.find(
      (industry: { name: string }) => industry.name === value
    )?._id;
    dispatch(handleSelectIndustry(industryId));
  };

  const handleCategoryChange = (value: string) => {
    dispatch(handleCategory(value));
  };

  const handleSingleSubCategoryChange = (value: string) => {
    dispatch(handleSingleSubCategory(value));
  };

  const handleAddSubCategoryClick = () => {

    if (serviceId === "add") {
      dispatch(handleAddSubCategory(singleSubCategory));
    } else if (singleSubCategory) {
      const id = service?.subCategories[subCategoryIndex]?._id ?? null;
      const parent = service?.subCategories[subCategoryIndex]?.parent ?? null;
      const type = service?.subCategories[subCategoryIndex]?.type ?? null;

      dispatch(
        updateSubService({ id, parent, type, title: singleSubCategory })
      );
      dispatch(handleUpdateSubCategory(singleSubCategory));
      dispatch(handleSingleSubCategory(""));
      toast.success("Sub category updated successfully");
    } else {
      toast.warning("Please input a value for sub category");
    }
  };

  const handleRemoveSubCategoryClick = (value: string) => {
    if (serviceId === "add") {
      dispatch(handleRemoveSubCategory(value));
      console.log("Remove service:", value);
    } else {
      dispatch(removeService(value));
      const title =
        service.subCategories.find((item: any) => item._id === value)?.title ??
        "";
      dispatch(handleRemoveSubCategory(title));
    }

  };

  const handleCurrentSubCategoryClick = (index: number) => {
    dispatch(handleCurrentSubCategory(index));
    setSubCategoryIndex(index);
  };

  const handleSingleKeywordChange = (value: string) => {
    setSingleKeyword(value);
  };

  const handleNestedSubCategoryChange = (value: string, level: number) => {
    setNestedSubCategoryInputs((prev) => ({ ...prev, [level]: value }));
  };

  const handleAddKeywordClick = () => {

    if (serviceId == "add") {
      dispatch(handleAddKeyword({ subCategoryIndex, value: singleKeyword }));
    } else {
      const id = service?.subCategories[subCategoryIndex]._id;
      dispatch(updateKeywordTitle({ index: keywordIndex, value: singleKeyword }));
      const filterKeyword = service?.subCategories[subCategoryIndex].keyWords.filter((keyword: string) => keyword !== service?.subCategories[subCategoryIndex].keyWords[keywordIndex]);
      filterKeyword.push(singleKeyword);
      const body = {
        keyWords: filterKeyword,
      };
      dispatch(editService({ id: id, service: body }));
    }

    setSingleKeyword("");
  };

  const handleRemoveKeywordClick = (index: number, name: string) => {

    if (serviceId !== "add") {
      const id = service?.subCategories[subCategoryIndex]._id;
      const updatedKeywords = service?.subCategories[subCategoryIndex].keyWords.filter((keyword: string) => keyword !== name);
      const body = {
        keyWords: updatedKeywords,
      };
      dispatch(editService({ id: id, service: body }));
    }
    dispatch(handleRemoveKeyword({ subCategoryIndex, value: name }))
  };

  const handleAddNestedSubCategoryClick = (level: number) => {
    if (!nestedSubCategoryInputs[level]) {
      toast.warning(`Please input a value for level ${level + 1} category`);
      return;
    }

    dispatch(
      handleAddNestedSubCategory({
        parentIndex: subCategoryIndex,
        value: nestedSubCategoryInputs[level],
        level,
      })
    );
    setNestedSubCategoryInputs((prev) => ({ ...prev, [level]: "" }));
  };


  function getLevelIndex(level: number, state: any): number {
    switch (level) {
      case 0:
        return state.subCategoryLevel1Index;
      case 1:
        return state.subCategoryLevel2Index;
      case 2:
        return state.subCategoryLevel3Index;
      default:
        return -1;
    }
  }

  function getNestedSubCategoryTitle(
    service: any,
    subCategoryIndex: number,
    level: number
  ): string {
    let category = service?.subCategories[subCategoryIndex];
    for (let i = 0; i < level; i++) {
      if (category?.subCategories?.length > 0) {
        category = category.subCategories[getLevelIndex(i, state)];
      } else {
        return "";
      }
    }
    return category?.title || "";
  }

  function getNestedSubCategories(
    service: any,
    subCategoryIndex: number,
    level: number
  ): any[] {
    let category = service?.subCategories[subCategoryIndex];
    for (let i = 0; i < level; i++) {
      if (category?.subCategories?.length > 0) {
        category = category.subCategories[getLevelIndex(i, state)];
      } else {
        return [];
      }
    }
    return category?.subCategories || [];
  }

  function handleRemoveNestedSubCategoryClick(
    name: string,
    level: number,
  ) {
    console.log(name, level);
    dispatch(handleRemoveNestedSubCategory({
      parentIndex: subCategoryIndex,
      value: name,
      level,
    }));
  }

  function handleLevelIndexChange(level: number, index: number) {
    switch (level) {
      case 0:
        dispatch(setSubCategoryLevel1Index(index));
        break;
      case 1:
        dispatch(setSubCategoryLevel2Index(index));
        break;
      case 2:
        dispatch(setSubCategoryLevel3Index(index));
        break;
      case 3:
        dispatch(setSubCategoryLevel4Index(index));
        break;
    }
  }


  const handleKeyworSelect = (index: number) => {
    setKeywordIndex(index);
  };


  const handleSaveService = () => {
    if (!service?.industry && !service?.title && service?.subCategories?.length === 0) {
      toast.warning("Please select an industry group");
      return;
    } else if (!service?.title) {
      toast.warning("Please input a category");
      return;
    } else if (service?.subCategories?.length === 0) {
      toast.warning("Please add at least one sub category");
      return;
    } else if (!service?.industry) {
      toast.warning("Please fill all required fields");
      return;
    } else {
      toast.success(`Service ${service?.title} saved successfully`);
      dispatch(saveService({ service }));
      setTimeout(() => {
        router.push("/guideline/Interest");
      }, 1000);
    }
  };

  return (
    <DashboardLayout>
      <GuidelineLayout>
        <div className="bg-white mr-2 rounded-md border border-border px-[1.75em] py-[1.438em]">
          <div className="flex flex-row justify-between items-center">
            <h1 className="text-[1.875em] leading-[2.813] font-bold">
              Interest / Categories
            </h1>

            {serviceId === "add" ? (
              <Button
                className="w-[7.75rem] h-[2.375rem] text-[0.875rem] leading-[1.25rem] font-medium bg-PrimaryColor rounded-full"
                onClick={handleSaveService}
              >
                Save
              </Button>
            ) : null}
          </div>
          <div>
            {serviceId === "add" ? (
              <div>
                <h4 className="text-[0.625rem] leading-[0.938rem] font-normal">
                  Industry Group
                </h4>
                <Selector
                  options={industries}
                  placeholder="Industry"
                  onChange={handleSelectIndustryChange}
                />
                <ServiceInput
                  title="Category"
                  onChange={handleCategoryChange}
                />
              </div>
            ) : (
              <div>
                {/* <h2 className="flex items-center">
                  Industry Group: <span className="text-PrimaryColor ml-1">{serviceTitle}</span>
                </h2> */}
                <h6 className="flex flex-col">
                  Category:
                  <span className="text-PrimaryColor ml-1 text-[1.875em] font-bold">
                    {serviceTitle}
                  </span>
                </h6>
              </div>
            )}

            <ServiceInput
              title="Sub Category"
              value={singleSubCategory}
              onChange={handleSingleSubCategoryChange}
            />
            <div className="mt-5 flex justify-end">
              <Button
                className="h-[2.375rem] text-[0.875rem] leading-[1.25rem] font-medium bg-PrimaryColor rounded-full"
                onClick={handleAddSubCategoryClick}
              >
                {serviceId === "add" ? "Add SubCategory" : "Update SubCategory"}
              </Button>
            </div>

            <div className="w-full flex flex-wrap gap-5 mt-6">
              {service?.subCategories?.map((item: any, index: number) => (
                <Chips
                  key={item?.title}
                  id={item?._id}
                  index={index}
                  text={item?.title}
                  selected={subCategoryIndex}
                  isSubCategory={true}
                  isDeleteId={serviceId === "add" ? false : true}
                  onSubCategoryClick={handleRemoveSubCategoryClick}
                  currentSelected={handleCurrentSubCategoryClick}
                />
              ))}
            </div>

            <Tabs defaultValue="keywords" className="flex flex-col mt-10">
              <TabsList className="grid grid-cols-2 h-[2.771em] mb-[0.458em] p-0 bg-muted-none shadow-none">
                <TabsTrigger
                  value="keywords"
                  className="h-[46px] text-[1.083rem] leading-[1.203rem] py-[0.75rem] rounded-r-none m-0 bg-white data-[state=active]:bg-PrimaryColor data-[state=active]:text-white data-[state=active]:border-none border-y border-l border-border"
                >
                  Keywords
                </TabsTrigger>
                <TabsTrigger
                  value="nestedSubCategory"
                  className="h-[46px] text-[1.083rem] leading-[1.203rem] py-[0.75rem] rounded-l-none p-0 m-0 bg-white data-[state=active]:bg-PrimaryColor data-[state=active]:text-white data-[state=active]:border-none border-y border-r border-border"
                >
                  Nested Sub Category
                </TabsTrigger>
              </TabsList>
              <TabsContent
                value="keywords"
                className="m-0 p-0 flex-grow flex flex-col"
              >
                <div className="mt-10 mb-2">
                  <h4 className="text-[1.5rem] leading-[0.938rem] font-normal">
                    {serviceId === "add"
                      ? "Add keywords for"
                      : "Update keywords for"}
                    <span className="text-PrimaryColor ml-1">
                      {service?.subCategories?.[subCategoryIndex]?.title}
                    </span>
                  </h4>
                </div>

                <ServiceInput
                  title="Keyword"
                  value={singleKeyword}
                  onChange={handleSingleKeywordChange}
                />
                <div
                  className={`flex items-center ${
                    serviceId === "add" ? "justify-between" : "justify-end"
                  }`}
                >
                  {serviceId === "add" ? (
                    <CopyToModal
                      buttonTitle="Copy Keywords"
                      title="Select subcategories to copy keywords to"
                      content={service?.subCategories}
                      aditionalContent={
                        service?.subCategories[subCategoryIndex]?.keyWords
                      }
                      currentIndex={subCategoryIndex}
                    />
                  ) : null}
                  <Button
                    className="w-[10.625rem] h-[2.375rem] text-[0.875rem] leading-[1.25rem] font-medium bg-PrimaryColor rounded-full"
                    onClick={handleAddKeywordClick}
                  >
                    {serviceId === "add" ? "Add Keyword" : "Update Keyword"}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-5 mt-6">
                  {service?.subCategories?.[subCategoryIndex]?.keyWords?.map(
                    (keyword: string, index: number) => (
                      <Chips
                        key={keyword}
                        id={keyword}
                        index={index}
                        text={keyword}
                        selected={keywordIndex}
                        currentSelected={handleKeyworSelect}
                        isSubCategory={serviceId === "add" ? false : true}
                        onKeywordClick={(index, name) => 
                            handleRemoveKeywordClick(index, name)
                        }
                      />
                    )
                  )}
                </div>
              </TabsContent>
              <TabsContent value="nestedSubCategory">
                {serviceId === "add" ? (
                  [0, 1, 2, 3].map((level) => {
                    const parentNestedAvailable = getNestedSubCategories(
                      service,
                      subCategoryIndex,
                      level - 1
                    ).length > 0;

                    return (
                    <div key={level}>
                      {level === 0 || parentNestedAvailable ? (
                        <>
                      <div className="mt-10 mb-2 flex justify-between">
                        <h4 className="text-[1.5rem] leading-[0.938rem] font-normal">
                          {serviceId === "add"
                            ? "Add sub category to"
                            : "Update sub category to"}
                          <span className="text-PrimaryColor ml-1">
                            {getNestedSubCategoryTitle(
                              service,
                              subCategoryIndex,
                              level
                            )}
                          </span>
                        </h4>
                        <h4 className="text-[1.5rem] leading-[0.938rem] font-normal">
                          Level {level + 1}
                        </h4>
                      </div>
  
                      <ServiceInput
                        value={nestedSubCategoryInputs[level]}
                        onChange={(value) => {
                          handleNestedSubCategoryChange(value, level);
                        }}
                      />
                      <div className="mt-5 flex justify-end">
                        <Button
                          className="h-[2.375rem] text-[0.875rem] leading-[1.25rem] font-medium bg-PrimaryColor rounded-full"
                          onClick={() => {
                            handleAddNestedSubCategoryClick(level);
                          }}
                        >
                          {serviceId === "add"
                            ? "Add SubCategory"
                            : "Update SubCategory"}
                        </Button>
                      </div>
  
                      <div className="w-full flex flex-wrap gap-5 mt-6">
                        {getNestedSubCategories(
                          service,
                          subCategoryIndex,
                          level
                        ).map((item: any, index: number) => (
                          <Chips
                            key={item?.title}
                            id={item._id}
                            index={index}
                            text={item?.title}
                            selected={getLevelIndex(level, state)}
                            isSubCategory={true}
                            isNested={true}
                            level={level}
                            onNestedClick={handleRemoveNestedSubCategoryClick}
                            currentSelected={(index) =>
                              handleLevelIndexChange(level, index)
                            }
                          />
                        ))}
                      </div>
                      </>
                      ) : null}
                    </div>
                    )
                  })
                ) : (
                  service?.subCategories?.[subCategoryIndex]?.hasSubCategory ? 
                  <OptionalCatgories id={service?.subCategories[subCategoryIndex]?._id} level={1} title={service?.subCategories[subCategoryIndex]?.title} /> 
                  : <h1 className="pt-3 pb-3.5">No nested level subcategories</h1>
                )}
                

              </TabsContent>
            </Tabs>
          </div>
        </div>
      </GuidelineLayout>
    </DashboardLayout>
  );
}
