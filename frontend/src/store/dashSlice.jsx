/* eslint-disable no-unused-vars */
import { apiInstanceFetch } from "../util/ApiInstance";
import { setToast } from "../util/toastServices";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const dashboardCount = createAsyncThunk(
  "admin/dashboard/dashboardCount",
  async (payload) => {
    let url = "/api/admin/dashboard/dashboardCount";

    // Build query parameters only if they exist
    const params = [];
    if (payload?.startDate) params.push(`startDate=${payload.startDate}`);
    if (payload?.endDate) params.push(`endDate=${payload.endDate}`);

    if (params.length > 0) {
      url += `?${params.join("&")}`;
    }

    return apiInstanceFetch.get(url);
  }
);

export const getChartUser = createAsyncThunk(
  "admin/dashboard/chartAnalytic/user",
  async (payload) => {
    let url = "/api/admin/dashboard/chartAnalytic?type=User";

    // Build query parameters only if they exist
    const params = [];
    if (payload?.startDate) params.push(`startDate=${payload.startDate}`);
    if (payload?.endDate) params.push(`endDate=${payload.endDate}`);

    if (params.length > 0) {
      url += `&${params.join("&")}`;
    }

    return apiInstanceFetch.get(url);
  }
);

export const getChartRevenue = createAsyncThunk(
  "admin/dashboard/chartAnalytic/post",
  async (payload) => {
    let url = "/api/admin/dashboard/chartAnalytic?type=revenue";

    // Build query parameters only if they exist
    const params = [];
    if (payload?.startDate) params.push(`startDate=${payload.startDate}`);
    if (payload?.endDate) params.push(`endDate=${payload.endDate}`);

    if (params.length > 0) {
      url += `&${params.join("&")}`;
    }

    return apiInstanceFetch.get(url);
  }
);
export const getChartVideo = createAsyncThunk(
  "admin/dashboard/chartAnalytic/video",
  async (payload) => {
    return apiInstanceFetch.get(
      `/admin/dashboard/chartAnalytic?startDate=${payload?.startDate}&endDate=${payload?.endDate}&type=Video`
    );
  }
);
const dashSlice = createSlice({
  name: "dashboard",
  initialState: {
    dashCount: {},
    chartAnalyticOfUsers: [],
    chartAnalyticOfRevenue: [],
    chartAnalyticOfVideos: [],
    isLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(dashboardCount.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(dashboardCount.fulfilled, (state, action) => {
      state.isLoading = false;
      state.dashCount = action.payload.data;
    });
    builder.addCase(dashboardCount.rejected, (state, action) => {
      state.isLoading = false;
      setToast("error", action.payload?.message);
    });

    builder.addCase(getChartRevenue.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getChartRevenue.fulfilled, (state, action) => {
      state.isLoading = false;
      state.chartAnalyticOfRevenue = action?.payload?.chartAnalyticOfRevenue;
    });
    builder.addCase(getChartRevenue.rejected, (state, action) => {
      state.isLoading = false;
      setToast("error", action.payload?.message);
    });
    builder.addCase(getChartUser.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getChartUser.fulfilled, (state, action) => {
      // console.log("chartuse",action)
      state.isLoading = false;
      state.chartAnalyticOfUsers = action?.payload?.chartAnalyticOfUsers;
    });
    builder.addCase(getChartUser.rejected, (state, action) => {
      state.isLoading = false;
      setToast("error", action.payload?.message);
    });
    builder.addCase(getChartVideo.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getChartVideo.fulfilled, (state, action) => {
      state.isLoading = false;
      state.chartAnalyticOfVideos = action?.payload?.chartVideo;
    });
    builder.addCase(getChartVideo.rejected, (state, action) => {
      state.isLoading = false;
      setToast("error", action.payload?.message);
    });
  },
});

export default dashSlice.reducer;
