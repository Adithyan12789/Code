/* eslint-disable no-unused-vars */
import axios from "axios";
import { apiInstanceFetch } from "../util/ApiInstance";
import { setToast } from "../util/toastServices";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";



export const getNewsList = createAsyncThunk("admin/getNewsList/get",
    async (payload) => {
        const response = await apiInstanceFetch.get(`/api/admin/shortVideo/fetchShortVideos?start=${payload?.page}&limit=${payload?.size}`)

        console.log("getNewsList: ", response);
        return response;
    }
)
export const getVideoDetails = createAsyncThunk("admin/getVideoDetails/get",
    async (payload) => {
        const response = await apiInstanceFetch.get(`/api/admin/shortVideo/getShortVideoInfo?shortVideoId=${payload}`)

        console.log("getVideoDetails: ", response);

        return response.data;
    }
)
export const getNewsListVideo = createAsyncThunk("admin/getNewsListVideo/get",
    async (payload) => {
        const response = await apiInstanceFetch.get(`/api/admin/shortVideo/retrieveMovieSeriesVideoData?start=${payload?.start}&limit=${payload?.limit}&movieSeriesId=${payload?.movieSeriesId}`)

        console.log("getNewsListVideo: ", response);
        
        return response.data;
    }
)
export const getNewsNumber = createAsyncThunk("admin/getNewsNumber/get",
    async (payload) => {
        const response = await apiInstanceFetch.get(`/api/admin/shortVideo/validateEpisodeLock?episodeNumber=${payload}`)
        return response;
    }
)

export const addVideoList = createAsyncThunk("admin/addVideoList/add",
    async (payload) => {
        // console.log("payload>>>",payload)
        const response = await apiInstanceFetch.post(`/api/admin/shortVideo/createShortVideo`, payload)
        return response;
    }
)

export const uploadImage = createAsyncThunk("admin/uploadImage/add",
    async (payload) => {
        // console.log("payloaddd", payload)
        const response = await axios.post(`/api/admin/file/upload-file`, payload)
        return response;
    }
)

export const uploadMultipleImage = createAsyncThunk("admin/uploadImage/add",
    async (payload) => {
        // console.log("payloaddd", payload)
        const response = await axios.post(`/api/admin/file/upload_multiple_files`, payload)
        return response;
    }
)

export const editVideoList = createAsyncThunk("admin/editVideoList/update",
    async (payload) => {
        const response = await apiInstanceFetch.put(`/api/admin/shortVideo/updateShortVideo`, payload)
        
        return response;
    }
)

export const newsListActive = createAsyncThunk("admin/filmListActive/update",
    async (payload) => {
        const response = await apiInstanceFetch.put(`/api/admin/movieSeries/toggleActiveStatus?movieWebseriesId=${payload}`)
        return response;
    }
)
export const newsListBanner = createAsyncThunk("admin/filmListBanner/update",
    async (payload) => {
        const response = await apiInstanceFetch.put(`/api/admin/movieSeries/toggleAutoAnimateBanner?movieWebseriesId=${payload}`)
        return response;
    }
)
export const newsListTrending = createAsyncThunk("admin/filmListTrending/update",
    async (payload) => {
        const response = await apiInstanceFetch.put(`/api/admin/movieSeries/toggleTrendingStatus?movieWebseriesId=${payload}`)
        return response;
    }
)

export const deleteNewsCategory = createAsyncThunk("admin/deleteFilmCategory/delete",
    async (payload) => {
        const response = await apiInstanceFetch.delete(`/api/admin/category/deleteCategory?categoryId=${payload}`)
        return response;
    }
)



const newsListSlice = createSlice({
    name: "newsList",
    initialState: {
        newsList: [],
        newsListVideo: [],
        getVideo: [],
        totalUser: 0,
        dailyReward: [],
        isLoading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(
            getNewsList.pending,
            (state, action) => {
                state.isLoading = true;
            }
        );
        builder.addCase(
            getNewsList.fulfilled,
            (state, action) => {
                state.isLoading = false;
                state.newsList = action?.payload.data;
                state.totalUser = action?.payload?.total;
            }
        );
        builder.addCase(
            getNewsList.rejected,
            (state, action) => {
                state.isLoading = false;
                setToast("error", action.payload?.message);
            }
        );
        builder.addCase(
            getNewsListVideo.pending,
            (state, action) => {
                state.isLoading = true;
            }
        );
        builder.addCase(
            getNewsListVideo.fulfilled,
            (state, action) => {
                // console.log("actiop", action);
                state.isLoading = false;
                state.filmListVideo = action?.payload;
                state.totalUser = action?.payload?.total;
            }
        );
        builder.addCase(
            getNewsListVideo.rejected,
            (state, action) => {
                state.isLoading = false;
                setToast("error", action.payload?.message);
            }
        );
        builder.addCase(
            getVideoDetails.pending,
            (state, action) => {
                state.isLoading = true;
            }
        );
        builder.addCase(
            getVideoDetails.fulfilled,
            (state, action) => {
                // console.log("actiop", action);
                state.isLoading = false;
                state.getVideo = action?.payload;
                // state.totalUser = action?.payload?.total;
            }
        );
        builder.addCase(
            getVideoDetails.rejected,
            (state, action) => {
                state.isLoading = false;
                setToast("error", action.payload?.message);
            }
        );

        builder.addCase(editVideoList.pending, (state, action) => {
            state.isLoading = true;
        })
        builder.addCase(editVideoList.fulfilled, (state, action) => {

            state.isLoading = false;
            // state.filmListVideo = state.filmListVideo.map((item) =>
            //     item._id === action?.payload.data._id ? action?.payload.data : item
            // );
        });

        builder.addCase(addVideoList.pending, (state, action) => {
            state.isLoading = true;
        })
        builder.addCase(addVideoList.fulfilled, (state, action) => {
            state.isLoading = false;
        })
        builder.addCase(uploadMultipleImage.pending, (state, action) => {
            state.isLoading = true;
        })
        builder.addCase(uploadMultipleImage.fulfilled, (state, action) => {
            state.isLoading = false;
        })
    },
});

export default newsListSlice.reducer;
