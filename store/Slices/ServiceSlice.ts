import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { toast } from "react-toastify";
import { addService, getService, getServices, updateService } from "@/api";
import {
  FetchServicesParams,
  GetIndustriesResponse,
  Industry,
} from "@/types/type";
import { Api } from "@/api/Middleware";
import { any } from "zod";

interface ServiceResponse {
  data: Category[];
  pagination: {
    totalItems: number;
    perPage: number;
    currentPage: number;
    totalPages: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: number | null;
    nextPage: number | null;
  };
}

export interface SubService {
  _id?: string;
  title: string;
  keyWords: string[];
  industry: string;
  parent?: string | null;
  type?: string | null;
  subCategories: SubService[];

  hasSubCategory?: boolean;
}

interface Category {
  _id?: string;
  title: string;
  type: string;
  industry: string | null;
  parent: string | null;
  categories?: any[];
  isDeleted?: boolean;
  hasSubCategory?: boolean;

  subCategories: SubService[];
}

interface ServiceState {
  service: Category;
  services: Category[];
  industries: Industry[];

  copyKeywordsSubList: number[];

  loading: boolean;
  error: string | null;
  subServices: SubService[];
  singleSubCategory: string;
  subCategoryIndex: number;
  subCategoryLevel1Index?: number;
  subCategoryLevel2Index?: number;
  subCategoryLevel3Index?: number;
  subCategoryLevel4Index?: number;
}

const initialState: ServiceState = {
  service: {
    title: "",
    type: "",
    industry: null,
    parent: null,
    subCategories: [],
  },
  services: [],
  industries: [],

  copyKeywordsSubList: [],

  loading: false,
  error: null,
  subServices: [],
  singleSubCategory: "",
  subCategoryIndex: 0,

  subCategoryLevel1Index: 0,
  subCategoryLevel2Index: 0,
  subCategoryLevel3Index: 0,
  subCategoryLevel4Index: 0,
};

export const fetchServices = createAsyncThunk(
  "service/fetchServices",
  async ({ page, limit, type }: FetchServicesParams, { rejectWithValue }) => {
    try {
      const response = await getServices(page, limit, type);
      return response.data.data;
    } catch (error: any) {
      console.error("API Error:", error);
      return rejectWithValue(error.response?.data?.msg || "An error occurred");
    }
  }
);

export const fetchService = createAsyncThunk(
  "service/fetchService",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getService(id);
      return response.data.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const saveService = createAsyncThunk(
  "service/addSubService",
  async ({ service }: { service: Category }, { rejectWithValue }) => {
    try {
      const response = await addService(service);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const editService = createAsyncThunk(
  "service/updateService",
  async (
    { id, service }: { id: string; service: any },

    { rejectWithValue }
  ) => {
    try {
      const response = await updateService(id, service);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeService = createAsyncThunk(
  "service/deleteService",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await Api.delete(`/service/delete/${id}`);

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getIndustries = createAsyncThunk(
  "services/getIndustries",
  async () => {
    try {
      const response = await Api.get<GetIndustriesResponse>("/industry");
      return response.data.data;
    } catch (error: any) {
      console.error("Industries error", error);
      return error.response?.data?.msg || "An error occurred";
    }
  }
);

export const addSubService = createAsyncThunk(
  "services/addSubService",
  async (
    {
      serviceId,
      title,
      type,
    }: { serviceId: string | null; title: string; type: string },
    { rejectWithValue }: { rejectWithValue: (value: any) => void }
  ) => {
    try {
      const body = {
        title: title,
        type: type,
        parent: serviceId,
      };
      const response = await addService(body);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateSubService = createAsyncThunk(
  "services/updateSubService",
  async (
    {
      id,
      title,
      type,
      parent,
    }: {
      id: string | null;
      title: string;
      type: string | null;
      parent: string | null;
    },

    { rejectWithValue }: { rejectWithValue: (value: any) => void }
  ) => {
    try {
      const body = {
        title: title,
        type: type,
        parent: parent,
      };
      const response = await Api.patch(`/service/update/${id}`, body);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteSubService = createAsyncThunk(
  "services/deleteSubService",
  async (
    { serviceId, id, body }: { serviceId: string; id: string; body: any },
    { rejectWithValue }: { rejectWithValue: (value: any) => void }
  ) => {
    try {
      const response = await Api.delete(
        `/service/sub-service/delete/${serviceId}/${id}`,
        body
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

const serviceSlice = createSlice({
  name: "service",
  initialState,
  reducers: {
    handleSetType(state, action: PayloadAction<string>) {
      state.service = {
        ...state.service,
        type: action.payload,
      };
    },
    handleSelectIndustry(state, action: PayloadAction<string>) {
      state.service = {
        ...state.service,
        industry: action.payload,
      };
    },
    handleAddSubCategory: (state, action: PayloadAction<string>) => {
      const newSubCategory = action.payload;
      const existingSubCategory = state.service.subCategories.find(
        (subCategory) =>
          subCategory.title.toLowerCase() === newSubCategory.toLowerCase()
      );

      if (existingSubCategory) {
        toast.warning("This sub-category already exists.");
      } else if (!newSubCategory) {
        toast.warning("Please enter a sub-category");
      } else {
        state.service.subCategories.push({
          title: newSubCategory,
          keyWords: [],
          industry: state.service.industry || "",
          subCategories: [],
          type: state.service.type,
        });
        state.singleSubCategory = "";
        toast.success(`Sub-category ${newSubCategory} added successfully`);
      }
    },
    handleCategory(state, action: PayloadAction<string>) {
      state.service.title = action.payload;
    },
    handleSingleSubCategory(state, action: PayloadAction<string>) {
      state.singleSubCategory = action.payload;
    },

    handleUpdateSubCategory: (state, action: PayloadAction<string>) => {
      state.service.subCategories[state.subCategoryIndex].title =
        action.payload;
    },

    handleRemoveSubCategory(state, action: PayloadAction<string>) {
      state.service.subCategories = state.service.subCategories.filter(
        (subCategory) => subCategory.title !== action.payload
      );
      toast.success(`Sub-category ${action.payload} removed successfully`);
    },
    handleCurrentSubCategory(state, action: PayloadAction<number>) {
      state.subCategoryIndex = action.payload;
    },
    handleAddNestedSubCategory: (
      state,
      action: PayloadAction<{
        parentIndex: number;
        value: string;
        level: number;
      }>
    ) => {
      const { parentIndex, value, level } = action.payload;
      if (!value) {
        toast.warning("Please enter a nested sub-category");
        return;
      }
      if (!state.service.subCategories[parentIndex]) {
        toast.warning("Please add a sub-category first");
        return;
      }

      let targetSubCategory = state.service.subCategories[parentIndex];

      for (let i = 0; i < level; i++) {
        if (i === 0) {
          targetSubCategory =
            targetSubCategory.subCategories[state.subCategoryLevel1Index!];
        } else if (i === 1) {
          targetSubCategory =
            targetSubCategory.subCategories[state.subCategoryLevel2Index!];
        } else if (i === 2) {
          targetSubCategory =
            targetSubCategory.subCategories[state.subCategoryLevel3Index!];
        } else if (i === 3) {
          targetSubCategory =
            targetSubCategory.subCategories[state.subCategoryLevel4Index!];
        }
      }

      if (targetSubCategory?.subCategories.some((sub) => sub.title === value)) {
        toast.warning("Nested sub-category already exists");
        return;
      }

      targetSubCategory.subCategories.push({
        title: value,
        industry: state.service.industry || "",
        keyWords: [],
        subCategories: [],
        type: state.service.type,
      });

      toast.success("Nested sub-category added successfully");
    },
    handleRemoveNestedSubCategory: (
      state,
      action: PayloadAction<{
        parentIndex: number;
        value: string;
        level: number;
      }>
    ) => {
      const { parentIndex, value, level } = action.payload;
      let targetSubCategory = state.service.subCategories[parentIndex];

      for (let i = 0; i < level; i++) {
        if (i === 0) {
          targetSubCategory =
            targetSubCategory.subCategories[state.subCategoryLevel1Index!];
        } else if (i === 1) {
          targetSubCategory =
            targetSubCategory.subCategories[state.subCategoryLevel2Index!];
        } else if (i === 2) {
          targetSubCategory =
            targetSubCategory.subCategories[state.subCategoryLevel3Index!];
        } else if (i === 3) {
          targetSubCategory =
            targetSubCategory.subCategories[state.subCategoryLevel4Index!];
        }
      }

      targetSubCategory.subCategories = targetSubCategory.subCategories.filter(
        (sub) => sub.title !== value
      );
      toast.success("Nested sub-category removed successfully");
    },
    handleAddKeyword: (
      state,
      action: PayloadAction<{ subCategoryIndex: number; value: string }>
    ) => {
      const { subCategoryIndex, value } = action.payload;
      if (!value) {
        toast.warning("Please enter a keyword");
        return;
      }
      if (!state.service.subCategories[subCategoryIndex]) {
        toast.warning("Please add a sub-category first");
        return;
      }

      const keywords = state.service.subCategories[subCategoryIndex].keyWords;

      if (keywords.includes(value)) {
        toast.warning("Keyword already exists");
        return;
      }

      keywords.push(value);
      toast.success(`${value} Keyword added successfully`);
    },

    handleRemoveKeyword: (
      state,
      action: PayloadAction<{ subCategoryIndex: number; value: string }>
    ) => {
      const { subCategoryIndex, value } = action.payload;
      const keywords = state.service.subCategories[subCategoryIndex].keyWords;
      state.service.subCategories[subCategoryIndex].keyWords = keywords.filter(
        (keyword) => keyword !== value
      );
      toast.success(`${value} Keyword removed successfully`);
    },

    copyKeyword: (state, action: PayloadAction<string[]>) => {
      state.service.subCategories.forEach(
        (subCategory: SubService, index: number) => {
          if (state.copyKeywordsSubList.includes(index)) {
            const newKeywords = action.payload.filter(
              (keyword) => !subCategory.keyWords.includes(keyword)
            );
            subCategory.keyWords = [...subCategory.keyWords, ...newKeywords];
          }
        }
      );
    },
    setCopyKeywordsSubList: (state, action: PayloadAction<number[]>) => {
      state.copyKeywordsSubList = action.payload;
      // console.log(state.copyKeywordsSubList);
    },

    setSubCategoryLevel1Index: (state, action: PayloadAction<number>) => {
      state.subCategoryLevel1Index = action.payload;
    },

    setSubCategoryLevel2Index: (state, action: PayloadAction<number>) => {
      state.subCategoryLevel2Index = action.payload;
    },

    setSubCategoryLevel3Index: (state, action: PayloadAction<number>) => {
      state.subCategoryLevel3Index = action.payload;
    },

    setSubCategoryLevel4Index: (state, action: PayloadAction<number>) => {
      state.subCategoryLevel4Index = action.payload;
    },
    handleRemoveServices: (state, action: PayloadAction<string>) => {
      state.services = state.services.filter(
        (service) => service._id !== action.payload
      );
    },
    handleRemoveInterestServices: (
      state,
      action: PayloadAction<{ index: number; id: string }>
    ) => {
      if (state.services[action.payload.index]?.categories) {
        state.services[action.payload.index].categories = state.services[
          action.payload.index
        ].categories?.filter(
        (service: any) => service?._id !== action.payload.id
      )}
    },
    updateKeywordTitle: (
      state,
      action: PayloadAction<{ index: number; value: string }>
    ) => {
      state.service.subCategories[state.subCategoryIndex].keyWords[
        action.payload.index
      ] = action.payload.value;
    },
    resetServiceState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchService.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchService.fulfilled, (state, action) => {
        state.loading = false;
        if (state.service.type === "volunteer") {
          state.service.subCategories = action.payload;
        }
        if (state?.service?.subCategories.length === 0) {
          action.payload.map((item: Category) => {
            item.subCategories = [];
          });
          state.service.subCategories = action.payload;
        }
      })
      .addCase(fetchService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(saveService.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveService.fulfilled, (state, action) => {
        state.loading = false;
        state.subServices.push(action.payload);
      })
      .addCase(saveService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(editService.pending, (state) => {
        state.loading = true;
      })
      .addCase(editService.fulfilled, (state, action) => {
        state.loading = false;

        if (state.service.type !== "interest") {
          state.service = action.payload;
        }
      })
      .addCase(editService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(
        fetchServices.fulfilled,
        (state, action: PayloadAction<ServiceResponse>) => {
          state.loading = false;
          state.services = action.payload.data;
        }
      )
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeService.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.services = state.services.filter(
          (service) => service._id !== action.payload.id
        );
      })
      .addCase(removeService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getIndustries.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.industries = action.payload;
      })
      .addCase(getIndustries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addSubService.pending, (state) => {
        state.loading = true;
      })
      .addCase(addSubService.fulfilled, (state, action) => {
        state.loading = false;
        state.subServices.push(action.payload.data);
      })
      .addCase(addSubService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  handleSetType,
  handleSelectIndustry,
  handleAddSubCategory,
  handleCategory,
  handleSingleSubCategory,
  handleUpdateSubCategory,
  handleRemoveSubCategory,
  handleCurrentSubCategory,
  resetServiceState,
  handleAddNestedSubCategory,
  handleAddKeyword,
  handleRemoveKeyword,
  setSubCategoryLevel1Index,
  setSubCategoryLevel2Index,
  setSubCategoryLevel3Index,
  setSubCategoryLevel4Index,
  handleRemoveServices,
  handleRemoveNestedSubCategory,
  copyKeyword,
  setCopyKeywordsSubList,
  updateKeywordTitle,
  handleRemoveInterestServices,
} = serviceSlice.actions;

export const selectService = (state: RootState) => state.service.service;
export const selectLevel1SubCategoryList = (state: RootState) =>
  state.service.fetchedLevel1SubCategoryList;
export const selectLevel2SubCategoryList = (state: RootState) =>
  state.service.fetchedLevel2SubCategoryList;
export const selectLevel3SubCategoryList = (state: RootState) =>
  state.service.fetchedLevel3SubCategoryList;
export const selectLevel4SubCategoryList = (state: RootState) =>
  state.service.fetchedLevel4SubCategoryList;
export const selectState = (state: RootState) => state.service;

export const selectServices = (state: RootState) => state.service.services;
export const selectLoading = (state: RootState) => state.service.loading;
export const selectError = (state: RootState) => state.service.error;
export const selectSubServices = (state: RootState) =>
  state.service.subServices;
export const selectSingleSubCategory = (state: RootState) =>
  state.service.singleSubCategory;
export const selectSubCategoryIndex = (state: RootState) =>
  state.service.subCategoryIndex;
export const selectSubCategoryLevel1Index = (state: RootState) =>
  state.service.subCategoryLevel1Index;
export const selectSubCategoryLevel2Index = (state: RootState) =>
  state.service.subCategoryLevel2Index;
export const selectSubCategoryLevel3Index = (state: RootState) =>
  state.service.subCategoryLevel3Index;
export const selectSubCategoryLevel4Index = (state: RootState) =>
  state.service.subCategoryLevel4Index;

export default serviceSlice.reducer;
