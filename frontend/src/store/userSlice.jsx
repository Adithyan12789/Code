/* eslint-disable no-unused-vars */
import { apiInstance, apiInstanceFetch } from "../util/ApiInstance";
import { setToast } from "../util/toastServices";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Helper function to clean axios response
const cleanAxiosResponse = (response) => {
  return {
    data: response.data,
    status: response.status,
    statusText: response.statusText,
  };
};

// Helper for apiInstanceFetch responses
const cleanApiInstanceResponse = (response) => {
  return {
    data: response.data,
    status: response.status,
    statusText: response.statusText,
  };
};

export const getAllUsers = createAsyncThunk(
  "admin/getAllUsers/get",
  async (payload) => {
    const response = await axios.get(
      `/api/admin/user/getUsersByAdmin?start=${payload?.page}&limit=${
        payload?.size
      }&startDate=${payload?.startDate}&endDate=${payload?.endDate}&search=${
        payload?.search || "All"
      }`
    );
    return cleanAxiosResponse(response);
  }
);

export const getUserInfo = createAsyncThunk(
  "admin/getUserInfo/get",
  async (payload) => {    
    const url = `/api/admin/user/retriveUserProfile?userId=${payload}`;
    
    const response = await apiInstanceFetch.get(url);

    return {
      data: response,
      status: 200,
      statusText: 'OK',
    };
  }
);

export const getUserCoinHistory = createAsyncThunk(
  "admin/getUserCoinHistory/get",
  async (payload) => {
    const response = await apiInstanceFetch.get(
      `/api/admin/history/retrieveUserCoinTransactions?startDate=${payload?.startDate}&endDate=${payload?.endDate}&userId=${payload?.userId}`
    );
    return cleanApiInstanceResponse(response);
  }
);

export const getUserReferralHistory = createAsyncThunk(
  "admin/getUserReferralHistory/get",
  async (payload) => {
    const response = await apiInstanceFetch.get(
      `/api/admin/history/retrieveUserReferralRecords?startDate=${payload?.startDate}&endDate=${payload?.endDate}&userId=${payload?.userId}`
    );
    return cleanApiInstanceResponse(response);
  }
);

export const getUserProfile = createAsyncThunk(
  "admin/user/getProfile?userId",
  async (payload) => {
    const response = await apiInstanceFetch.get(
      `/admin/user/getProfile?userId=${payload?.id}`
    );
    return cleanApiInstanceResponse(response);
  }
);

export const getCountry = createAsyncThunk(
  "https://restcountries.com/v3.1/all",
  async () => {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const data = await response.json();
    return data;
  }
);

export const deleteUser = createAsyncThunk(
  "admin/user/deleteUsers",
  async (payload) => {
    const response = await apiInstanceFetch.delete(
      `/admin/user/deleteUsers?userId=${payload?.id}`
    );
    return cleanApiInstanceResponse(response);
  }
);

export const blockUser = createAsyncThunk(
  "admin/user/isBlock",
  async (payload) => {
    const response = await apiInstanceFetch.put(
      `/api/admin/user/isBlock?userId=${payload}`
    );
    return cleanApiInstanceResponse(response);
  }
);

export const editUser = createAsyncThunk(
  "admin/user/editUser",
  async (payload) => {
    const response = await apiInstanceFetch.put(
      `/api/admin/user/modifyUserInfo`,
      payload
    );
    return cleanApiInstanceResponse(response);
  }
);

export const blockVerifiedUser = createAsyncThunk(
  "admin/user/isBlockverifieduser",
  async (payload) => {
    const response = await axios.patch(
      `/admin/user/isBlock?userId=${payload?.id ? payload?.id : payload}`
    );
    return cleanAxiosResponse(response);
  }
);

export const addFakeUser = createAsyncThunk(
  "admin/user/fakeUser",
  async (payload) => {
    const response = await axios.post("admin/user/fakeUser", payload?.data);
    return cleanAxiosResponse(response);
  }
);

export const updateFakeUser = createAsyncThunk(
  "admin/user/updateUser",
  async (payload) => {
    const response = await axios.patch(
      `/admin/user/updateUser?userId=${payload?.id}`,
      payload.data
    );
    return cleanAxiosResponse(response);
  }
);

export const userPasswordChange = createAsyncThunk(
  "admin/user/userPasswordChange",
  async (payload) => {
    const response = await axios.patch(
      `/admin/user/userPasswordChange?userId=${payload?.id}`,
      payload.data
    );
    return cleanAxiosResponse(response);
  }
);

const userSlice = createSlice({
  name: "users",
  initialState: {
    realUserData: [],
    totalRealUser: 0,
    fakeUserData: [],
    coinHistory: [],
    referralHistory: [],
    verifiedUserData: [],
    userPostData: [],
    totalFakeUser: 0,
    totalVerifiedUser: 0,
    getUserProfileData: {},
    postData: {},
    countryData: [],
    userInfo: [],
    userInfoId: "",
    isLoading: false,
  },
  reducers: {
    setUserInfoId(state, action) {
      state.userInfoId = action.payload;
    },
    setGetProfileRemove(state, action) {
      state.getUserProfileData = action.payload.data;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllUsers.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(getAllUsers.fulfilled, (state, action) => {
      if (action.payload.data.status) {
        state.realUserData = action.payload.data.user;
        state.totalRealUser = action.payload.data.totalUsers;
        state.isLoading = false;
      } else {
        setToast("error", action.payload.data.message);
        state.isLoading = false;
      }
    });

    builder.addCase(getAllUsers.rejected, (state, action) => {
      state.isLoading = false;
    });

    builder.addCase(getUserInfo.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(getUserInfo.fulfilled, (state, action) => {
      state.userInfo = action.payload.data?.user || [];
      state.isLoading = false;
    });

    builder.addCase(getUserInfo.rejected, (state, action) => {
      state.isLoading = false;
    });

    builder.addCase(getUserProfile.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(getUserProfile.fulfilled, (state, action) => {
      state.getUserProfileData = action.payload.data?.data; // Fixed: access data from cleaned response
      state.isLoading = false;
    });

    builder.addCase(getUserProfile.rejected, (state, action) => {
      state.isLoading = false;
    });

    builder.addCase(getUserCoinHistory.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(getUserCoinHistory.fulfilled, (state, action) => {
      state.coinHistory = action.payload.data?.data; // Fixed: access data from cleaned response
      state.isLoading = false;
    });

    builder.addCase(getUserCoinHistory.rejected, (state, action) => {
      state.isLoading = false;
    });

    builder.addCase(getUserReferralHistory.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(getUserReferralHistory.fulfilled, (state, action) => {
      state.referralHistory = action.payload.data?.data; // Fixed: access data from cleaned response
      state.isLoading = false;
    });

    builder.addCase(getUserReferralHistory.rejected, (state, action) => {
      state.isLoading = false;
    });

    builder.addCase(blockUser.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(blockUser.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload.data?.status) {
        // Fixed: access data from cleaned response
        const userId = action.meta.arg;
        state.realUserData = state?.realUserData?.map((user) => {
          if (user._id === userId) {
            return {
              ...user,
              isBlock: !user.isBlock,
            };
          } else {
            return user;
          }
        });

        const toastMessage = action.payload.data?.data?.data?.some(
          // Fixed: access data from cleaned response
          (value) => value?.isBlock === true
        )
          ? "User Blocked Successfully"
          : "User Unblocked Successfully";

        setToast("success", toastMessage);
      } else {
        setToast("error", action.payload.data?.message); // Fixed: access data from cleaned response
      }
    });

    builder.addCase(blockUser.rejected, (state, action) => {
      state.isLoading = false;
      setToast("error", action.payload?.message);
    });

    builder.addCase(blockVerifiedUser.fulfilled, (state, action) => {
      if (action.payload.data?.status) {
        // Fixed: access data from cleaned response
        const userId = action.meta.arg?.id;

        state.verifiedUserData = state?.verifiedUserData?.map((userData) => {
          if (userId?.includes(userData?._id)) {
            const matchingUserData = action.payload.data?.data?.data?.find(
              // Fixed: access data from cleaned response
              (user) => user?._id === userData?._id
            );
            return {
              ...userData,
              isBlock: matchingUserData?.isBlock,
            };
          }
          return userData;
        });

        const isAnyUserBlocked = action.payload.data?.data?.data?.some(
          // Fixed: access data from cleaned response
          (user) => user?.isBlock === true
        );

        const toastMessage = isAnyUserBlocked
          ? "Verified User Blocked Successfully"
          : "Verified User Unblocked Successfully";

        setToast("success", toastMessage);
      }
    });

    builder.addCase(blockVerifiedUser.rejected, (state, action) => {
      state.isLoading = false;
    });

    builder.addCase(deleteUser.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(deleteUser.fulfilled, (state, action) => {
      const deletedUserIds = action.meta.arg?.id;

      state.isLoading = false;
      state.fakeUserData = state.fakeUserData.filter(
        (user) => user?._id !== deletedUserIds
      );
      setToast("success", " User Delete Successfully");
    });

    builder.addCase(deleteUser.rejected, (state, action) => {
      state.isLoading = false;
    });

    builder.addCase(getCountry.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(getCountry.fulfilled, (state, action) => {
      state.countryData = action.payload;
      state.isLoading = false;
    });

    builder.addCase(getCountry.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(addFakeUser.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(addFakeUser.fulfilled, (state, action) => {
      if (action.payload.data?.status === true) {
        // Fixed: access data from cleaned response
        state.fakeUserData?.unshift(action.payload.data?.data?.data); // Fixed: access data from cleaned response
        setToast(
          "success",
          `${action.payload.data?.data?.data?.userName} New User Created` // Fixed: access data from cleaned response
        );
      } else {
        setToast("error", action.payload.data?.message); // Fixed: access data from cleaned response
      }
      state.isLoading = false;
    });

    builder.addCase(addFakeUser.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(updateFakeUser.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(updateFakeUser.fulfilled, (state, action) => {
      if (action.payload.data?.status === true) {
        // Fixed: access data from cleaned response
        state.fakeUserData = state?.fakeUserData?.map((user) => {
          if (user?._id === action.meta.arg?.id) {
            return action.payload.data?.data?.data; // Fixed: access data from cleaned response
          }
          return user;
        });
        setToast(
          "success",
          `${action.payload.data?.data?.data?.userName} User Updated Successfully` // Fixed: access data from cleaned response
        );
      }
      state.isLoading = false;
    });

    builder.addCase(updateFakeUser.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(userPasswordChange.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(userPasswordChange.fulfilled, (state, action) => {
      state.isLoading = false;
    });

    builder.addCase(userPasswordChange.rejected, (state, action) => {
      state.isLoading = false;
      setToast("error", action.payload?.message);
    });

    builder.addCase(editUser.pending, (state, action) => {
      state.isLoading = true;
    });

    builder.addCase(editUser.fulfilled, (state, action) => {
      state.isLoading = false;
    });
  },
});

export default userSlice.reducer;
export const { setGetProfileRemove, setUserInfoId } = userSlice.actions;
