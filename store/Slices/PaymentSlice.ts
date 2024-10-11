import { ApiResponse, FetchPaymentsParams, FetchServicesParams, GetIndustriesResponse, PaymentState, Service, ServiceApiResponse, Transaction } from "@/types/type";
import { Api } from "@/api/Middleware";
import { getStats, getSubadmin, getUsers } from "@/api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: PaymentState = {
  payments: [],
  status: "idle",
  error: null,
  stripeBalance: null,
  goollooperBalance: 0,
  currentActiveChat: null,
  users: [],
  subadmins: [],
  userCount: 0,
  taskCount: 0,
  singleService: null,
  servicePagination: null,
  loading: false,
  currentPage: 1,
  clientSecret: "",
  pageData: {
    totalPages: 0,
    totalItems: 0,
    limit: 10,
  },
};

export const fetchUserData = createAsyncThunk(
  "user/fetchUserData",
  async (
    {
      page,
      limit,
      search,
      role,
      isSubAdmin,
    }: {
      page: number;
      limit: number;
      search?: string;
      role?: number;
      isSubAdmin?: boolean;
    },
    { rejectWithValue }
  ) => {
    try {
      let userRes;
      if (isSubAdmin) {
        userRes = await getSubadmin(page, limit, search);
      } else {
        userRes = await getUsers(page, limit, search, role);
      }

      const statsRes = await getStats();

      return {
        users: userRes?.data?.data?.data || [],
        pagination: userRes?.data?.data?.pagination,
        stats: statsRes?.data?.data,
      };
    } catch (error) {
      return rejectWithValue("Failed to fetch user data");
    }
  }
);

export const createPaymentIntent = createAsyncThunk(
  "payment/createPaymentIntent",
  async (amount: number, { rejectWithValue }) => {
    try {
      const response = await Api.post("/stripe/create-payment-intent", {
        amount,
      });
      return response.data.data;
    } catch (error: any) {
      console.error("API Error:", error);
      return rejectWithValue(error.response?.data?.msg || "An error occurred");
    }
  }
);

export const fetchPayments = createAsyncThunk(
  "payment/fetchPayments",
  async (
    { page, limit, type }: FetchPaymentsParams,
    { rejectWithValue }
  ) => {
    try {
      const response = await Api.get<ApiResponse>(
        `/transaction?page=${page}&limit=${limit}${type ? `&type=${type}` : ""}`
      );
      return response.data.data;
    } catch (error: any) {
      console.error("API Error:", error);
      return rejectWithValue(error.response?.data?.msg || "An error occurred");
    }
  }
);

export const stripeBalance = createAsyncThunk(
  "payment/stripeBalance",
  async () => {
    try {
      const response = await Api.get<any>(`/stripe/balance`);
      return {
        available: response.data.data.available[0].amount,
        pending: response.data.data.pending[0].amount,
      };
    } catch (error: any) {
      console.error("Stripe Balance Error:", error);
      return error.response?.data?.msg || "An error occurred";
    }
  }
);

export const updatePaymentStatus = createAsyncThunk(
  "payment/updatePaymentStatus",
  async (transactionId: any, { rejectWithValue }) => {
    try {
      const response = await Api.put<any>(
        `/stripe/toggle-withdraw-request/${transactionId}`,
        {
          status: "accepted",
        }
      );
      return response.data.data;
    } catch (error: any) {
      console.error("API Error:", error);
      return rejectWithValue(error.response?.data?.msg || "An error occurred");
    }
  }
);

export const withdrawPayment = createAsyncThunk(
  "payment/withdrawPayment",
  async (amount: any, { rejectWithValue }) => {
    try {
      const response = await Api.post<any>("/stripe/payout", {
        amount: amount,
      });
      return response.data.data;
    } catch (error: any) {
      console.error("API Error:", error);
      return rejectWithValue(error.response?.data?.msg || "An error occurred");
    }
  }
);
export const goollooperBalance = createAsyncThunk(
  "payment/goollooper-balance",
  async () => {
    try {
      const response = await Api.get<any>(`stripe/goollooper-balance`);
      return response.data.data;
    } catch (error: any) {
      console.error("Goollooper Balance Error:", error);
      return error.response?.data?.msg || "An error occurred";
    }
  }
);
export const withdrawGoollooperBalance = createAsyncThunk(
  "payment/withdraw-goollooper-balance",
  async (amount: number, { rejectWithValue }) => {
    try {
      const response = await Api.post<any>("/stripe/platform-payout", {
        amount: Number(amount),
      });
      
      return response.data.data;
    } catch (error: any) {
      console.error("API Error:", error);
      return rejectWithValue(error.response?.data?.msg || "An error occurred");
    }
  }
);


const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setCurrentActiveChat(state, action: PayloadAction<string>) {
      state.currentActiveChat = action.payload;
    },
    clearCurrentActiveChat(state) {
      state.currentActiveChat = null;
    },
    setPageData(state, action: PayloadAction<typeof initialState.pageData>) {
      state.pageData = action.payload;
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayments.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchPayments.fulfilled,
        (state, action: PayloadAction<Transaction[]>) => {
          state.status = "succeeded";
          state.payments = action.payload;
        }
      )
      .addCase(fetchPayments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      .addCase(stripeBalance.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        stripeBalance.fulfilled,
        (
          state,
          action: PayloadAction<{ available: number; pending: number }>
        ) => {
          state.status = "succeeded";
          state.stripeBalance = action.payload;
        }
      )
      .addCase(stripeBalance.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(updatePaymentStatus.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updatePaymentStatus.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(updatePaymentStatus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(withdrawPayment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(withdrawPayment.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(withdrawPayment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(goollooperBalance.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        goollooperBalance.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.status = "succeeded";
          state.goollooperBalance = action.payload as number;
        }
      )
      .addCase(goollooperBalance.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUserData.fulfilled,
        (
          state,
          action: PayloadAction<
            {
              users: any;
              pagination: any;
              stats: any;
            },
            string,
            {
              arg: {
                page: number;
                limit: number;
                search?: string;
                role?: number;
                isSubAdmin?: boolean;
              };
              requestId: string;
              requestStatus: "fulfilled";
            }
          >
        ) => {
          state.loading = false;
          if (action.payload.users) {
            if (action.meta.arg.isSubAdmin) {
              state.subadmins = action.payload.users;
            } else {
              state.users = action.payload.users;
            }
          }
          if (action.payload.pagination) {
            state.pageData = {
              totalPages: action.payload.pagination.totalPages,
              totalItems: action.payload.pagination.totalItems,
              limit: state.pageData?.limit,
            };
          }
          if (action.payload.stats) {
            state.userCount = action.payload.stats.userCount;
            state.taskCount = action.payload.stats.taskCount;
          }
        }
      )
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createPaymentIntent.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        createPaymentIntent.fulfilled,
        (state, action: PayloadAction<{ clientSecret: string }>) => {
          state.status = "succeeded";
          state.clientSecret = action.payload.clientSecret;
        }
      )
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentActiveChat, clearCurrentActiveChat, setPageData, setCurrentPage } =
  paymentSlice.actions;
export default paymentSlice.reducer;
