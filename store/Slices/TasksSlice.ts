import { banUser, getTasks, deleteTask } from "@/api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Location {
    coordinates: [number, number];
    readableLocation: string;
    type: string;
}

interface Slot {
    startTime: string;
    endTime: string;
}

interface GoList {
    title: string;
    taskInterests: any[];
    goListId: string;
}

interface PostedBy {
    _id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    averageRating: number;
    ratingCount: number;
    profileImage?: string;
    username?: string;
}

interface ServiceProvider {
    user: string;
    status: number;
}

interface Tasks {
    _id: string;
    title: string;
    description: string | null;
    location: Location;
    requirement: string | null;
    date: string;
    slot: Slot;
    noOfServiceProvider: number;
    commercial: boolean;
    type: string;
    taskInterests: any[];
    goList: GoList;
    postedBy: PostedBy;
    gender: string | null;
    ageFrom: number | null;
    ageTo: number | null;
    serviceProviders: ServiceProvider[];
    pendingCount: number;
    acceptedCount: number;
    idleCount: number;
    status: string;
    flag: boolean;
    isDeleted: boolean;
    invoiceAmount: number;
    subTasks: any[];
    createdAt: string;
    updatedAt: string;
    __v: number;
    applicationEndDate?: string;
}

interface TasksState {
  tasks: Tasks[];
  loading: boolean;
  activeTaskId: string;
}

const initialState: TasksState = {
  tasks: [],
  loading: false,
  activeTaskId: "",
};

export const getAllTasks = createAsyncThunk("tasks/getAllTasks", async () => {
  try {
    const response = await getTasks();
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch tasks");
  }
});

export const blockUser = createAsyncThunk(
  "tasks/blockUser",
  async (userId: string) => {
    try {
      const response = await banUser(userId);
      return response;
    } catch (error) {
      throw new Error("Failed to block user");
    }
  }
);

export const deleteTheTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId: string) => {
    try {
      const response = await deleteTask(taskId);
      return response;
    } catch (error) {
      throw new Error("Failed to delete task");
    }
  }
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setActiveTaskId: (state, action: PayloadAction<string>) => {
      state.activeTaskId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllTasks.fulfilled, (state, action) => {
        state.tasks = action.payload.data.data;
        state.loading = false;
      })
      .addCase(getAllTasks.rejected, (state, action) => {
        console.log(action.error.message);
        state.loading = false;
      })
      .addCase(getAllTasks.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(blockUser.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(blockUser.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(blockUser.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteTheTask.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(deleteTheTask.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteTheTask.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export const { setActiveTaskId } = tasksSlice.actions;

export default tasksSlice.reducer;
