/* eslint-disable no-unused-vars */

import { Box, Modal } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Input from "../../extra/Input";
import Button from "../../extra/Button";
import { closeDialog } from "../../store/dialogueSlice";
import {
  getNewsChannelList,
  getNewsChannelListVideo,
} from "../../store/newsChannelListSlice";
import { useEffect, useState } from "react";
import {
  addVideoList,
  editVideoList,
  getNewsList,
  uploadImage,
} from "../../store/newsListSlice";
import { useLocation } from "react-router-dom";
import Male from "../../assets/images/placeHolder.png";
import { setToast } from "../../util/toastServices";

const NewsListDialogue = ({ page, size }) => {
  const { dialogue: open, dialogueData } = useSelector(
    (state) => state.dialogue
  );

  const [imagePath, setImagePath] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [videoDuration, setVideoDuration] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [videoInputType, setVideoInputType] = useState("upload");
  const [videoLink, setVideoLink] = useState("");
  const [movieSeriesId, setMovieSeriesId] = useState("");
  const [newsChannelList, setNewsChannelList] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [coin, setCoin] = useState(0);

  const dispatch = useDispatch();
  const location = useLocation();
  
  const getQueryParams = () => {
    const searchParams = new URLSearchParams(location.search);
    const params = {};
    for (let [key, value] of searchParams) {
      params[key] = value;
    }
    return params;
  };

  const query = getQueryParams();
  const userId = query.movieSeriesId;

  useEffect(() => {
    if (dialogueData) {
      setMovieSeriesId(dialogueData?.movieSeries?._id || dialogueData?._id);
      setImagePath(dialogueData?.videoImage);

      if (
        dialogueData?.videoUrl &&
        !dialogueData?.videoUrl.includes("/videos/")
      ) {
        setVideoInputType("link");
        setVideoLink(dialogueData.videoUrl);
      }

      setName(dialogueData?.name || "");
      setDescription(dialogueData?.description || "");
      setCoin(dialogueData?.coin || 0);
    }
  }, [dialogueData]);

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const validation = () => {
    let error = {};
    let isValid = true;

    if (!name || name.trim() === "") {
      isValid = false;
      error["name"] = "Please enter a name";
    }

    if (!description || description.trim() === "") {
      isValid = false;
      error["description"] = "Please enter a description";
    }

    if (!dialogueData && videoInputType === "upload" && !selectedVideo) {
      isValid = false;
      error["video"] = "Please upload a video";
    } else if (!dialogueData && videoInputType === "link" && !videoLink) {
      isValid = false;
      error["video"] = "Please enter a video link";
    } else if (
      videoInputType === "link" &&
      videoLink &&
      !isValidUrl(videoLink)
    ) {
      isValid = false;
      error["video"] = "Please enter a valid video URL";
    }

    if (!selectedImage && !dialogueData?.videoImage) {
      isValid = false;
      error["image"] = "Please upload a thumbnail image";
    }

    setErrors(error);
    return isValid;
  };

  const handleError = (msg, err = null) => {
    console.error(msg, err);
    setToast("error", msg);
    setErrors((prev) => ({ ...prev, submit: msg }));
    setIsSubmitting(false);
  };

  const handleVideo = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setErrors((prev) => ({ ...prev, video: "Please select a video!" }));
      return;
    }

    const videoURL = URL.createObjectURL(file);
    setVideoPreviewUrl(videoURL);
    setSelectedVideo(file);
    setVideoLink("");

    const videoElement = document.createElement("video");
    videoElement.src = videoURL;

    videoElement.addEventListener("loadedmetadata", async () => {
      setVideoDuration(videoElement.duration);
    });

    setErrors({ ...errors, video: "" });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors({ ...errors, image: "Please select a valid image file" });
      return;
    }

    setSelectedImage(file);
    setErrors({ ...errors, image: "" });

    const reader = new FileReader();
    reader.onload = (e) => {
      setThumbnailPreviewUrl(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleVideoLinkChange = (e) => {
    const link = e.target.value;
    setVideoLink(link);
    setSelectedVideo(null);
    setVideoPreviewUrl(null);

    if (link) {
      const videoElement = document.createElement("video");
      videoElement.src = link;
      videoElement.addEventListener("loadedmetadata", () => {
        setVideoDuration(videoElement.duration);
      });
      setErrors({ ...errors, video: "" });
    }
  };

  const uploadVideo = async () => {
    if (!selectedVideo) return null;
    return await uploadImageFile(selectedVideo, "newsVideos");
  };

  const handleCloseAds = () => {
    if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    if (thumbnailPreviewUrl) URL.revokeObjectURL(thumbnailPreviewUrl);

    setSelectedVideo(null);
    setSelectedImage(null);
    setVideoPreviewUrl(null);
    setThumbnailPreviewUrl(null);
    setVideoLink("");
    dispatch(closeDialog());
  };

  const uploadImageFile = async (file, folderName) => {
    try {
      const formData = new FormData();
      formData.append("folderStructure", `admin/${folderName}`);
      formData.append("keyName", file.name);
      formData.append("content", file);

      const response = await dispatch(uploadImage(formData));

      let fileUrl =
        response.payload?.data?.fileUrl ||
        response.payload?.fileUrl ||
        response.payload?.data?.url ||
        response.payload?.url ||
        response.payload?.data?.imageUrl ||
        response.payload?.imageUrl;

      if (response.payload && response.payload.status && fileUrl) {
        return {
          status: response.payload.status,
          fileUrl: fileUrl,
          message: response.payload.message,
        };
      }

      throw new Error(
        response.payload?.message || "Upload failed - no file URL received"
      );
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const handleProcessVideo = async () => {
    try {
      let finalVideoUrl = dialogueData?.videoUrl || "";
      let finalImage = dialogueData?.videoImage || "";

      if (videoInputType === "upload" && selectedVideo) {
        const uploadedVideoData = await uploadVideo();
        if (!uploadedVideoData?.status)
          throw new Error("Failed to upload video");
        finalVideoUrl = uploadedVideoData.fileUrl;
      } else if (videoInputType === "link" && videoLink) {
        finalVideoUrl = videoLink;
      }

      if (selectedImage) {
        const uploadedImageData = await uploadImageFile(
          selectedImage,
          "newsImages"
        );
        if (!uploadedImageData?.status)
          throw new Error("Failed to upload image");
        finalImage = uploadedImageData.fileUrl;
      } else if (!dialogueData) {
        throw new Error("Please upload a thumbnail image");
      }

      return { finalVideoUrl, finalImage };
    } catch (err) {
      handleError("Video processing failed", err);
      throw err;
    }
  };

  const handleEditSubmit = async () => {
    if (validation() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        const { finalVideoUrl, finalImage } = await handleProcessVideo();

        const data = {
          movieSeriesId,
          name: name || dialogueData?.name,
          description: description || dialogueData?.description,
          duration: videoDuration || dialogueData?.duration,
          videoImage: finalImage || dialogueData?.videoImage,
          videoUrl: finalVideoUrl || dialogueData?.videoUrl,
          coin: coin || dialogueData?.coin || 0,
          shortVideoId: dialogueData?._id,
        };

        const res = await dispatch(editVideoList(data));

        if (res?.payload?.status) {
          setToast("success", res?.payload?.message);
          handleCloseAds();
        } else {
          setToast("error", res?.payload?.message || "Failed to update news");
        }
      } catch (error) {
        setErrors({ ...errors, submit: "Failed to submit form" });
      } finally {
        setIsSubmitting(false);
        handleCloseAds();
        dispatch(getNewsList({ page, size }));
        dispatch(getNewsChannelList({ page, size }));
        if (userId) {
          dispatch(
            getNewsChannelListVideo({
              start: page,
              limit: size,
              movieSeriesId: userId,
            })
          );
        }
      }
    }
  };

  const handleSubmit = async () => {
    if (validation() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        const { finalVideoUrl, finalImage } = await handleProcessVideo();

        const data = {
          movieSeriesId,
          name,
          description,
          duration: videoDuration ?? 0,
          videoImage: finalImage || "",
          videoUrl: finalVideoUrl || "",
          coin: coin ?? 0,
          shortVideoId: dialogueData?._id,
        };

        const res = await dispatch(addVideoList(data));
        if (res?.payload?.status) {
          setToast("success", res?.payload?.message);
          handleCloseAds();
        } else {
          throw new Error(res?.payload?.message || "Add video failed");
        }
      } catch (err) {
        handleError("Failed to submit new news", err);
      } finally {
        setIsSubmitting(false);
        dispatch(getNewsList({ page, size }));
        dispatch(getNewsChannelList({ page, size }));
        dispatch(
          getNewsChannelListVideo({
            start: page,
            limit: size,
            movieSeriesId,
          })
        );
      }
    }
  };

  const isNewsChannelListPage = location.pathname === "/newsChannelList";

  return (
    <div>
      <Modal open={open} onClose={handleCloseAds}>
        <Box>
          <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-200">
              
              {/* Header */}
              <div className="relative bg-gradient-to-br from-white to-gray-50 border-b border-gray-100">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-red-600" />
                <div className="pt-6 pb-5 px-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                        {isNewsChannelListPage ? "Add News" : "Edit News"}
                      </h2>
                      <p className="text-gray-500 text-sm mt-1">
                        {isNewsChannelListPage ? "Create a new news entry" : "Update existing news details"}
                      </p>
                    </div>
                    <button
                      onClick={handleCloseAds}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    >
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 bg-white">
                <form>
                  <div className="space-y-6">
                    
                    {/* Name Field */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        News Title <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter news title"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-500 transition-all duration-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 focus:bg-white hover:border-gray-400"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                      </div>
                      {errors?.name && (
                        <div className="flex items-center gap-2 text-red-600 text-sm">
                          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.name}
                        </div>
                      )}
                    </div>

                    {/* Description Field */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Enter news description"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-500 transition-all duration-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 focus:bg-white hover:border-gray-400"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                          </svg>
                        </div>
                      </div>
                      {errors?.description && (
                        <div className="flex items-center gap-2 text-red-600 text-sm">
                          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.description}
                        </div>
                      )}
                    </div>

                    {/* Coin Field */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Coin Value
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={coin}
                          onChange={(e) => setCoin(Number(e.target.value))}
                          placeholder="0"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-500 transition-all duration-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 focus:bg-white hover:border-gray-400"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Video Input Type */}
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Video Source
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setVideoInputType("upload")}
                          className={`p-4 border-2 rounded-xl text-left transition-all duration-200 ${
                            videoInputType === "upload" 
                              ? "border-red-500 bg-red-50 shadow-sm" 
                              : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              videoInputType === "upload" ? "border-red-500 bg-red-500" : "border-gray-300"
                            }`}>
                              {videoInputType === "upload" && (
                                <div className="w-2 h-2 rounded-full bg-white"></div>
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">Upload Video</div>
                              <div className="text-sm text-gray-500 mt-1">From your device</div>
                            </div>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setVideoInputType("link")}
                          className={`p-4 border-2 rounded-xl text-left transition-all duration-200 ${
                            videoInputType === "link" 
                              ? "border-red-500 bg-red-50 shadow-sm" 
                              : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              videoInputType === "link" ? "border-red-500 bg-red-500" : "border-gray-300"
                            }`}>
                              {videoInputType === "link" && (
                                <div className="w-2 h-2 rounded-full bg-white"></div>
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">Video Link</div>
                              <div className="text-sm text-gray-500 mt-1">External URL</div>
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Upload Video */}
                    {videoInputType === "upload" && (
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Upload Video <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="file"
                            onChange={handleVideo}
                            accept="video/*"
                            className="w-full p-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 text-gray-600 cursor-pointer transition-all duration-200 hover:border-red-300 hover:bg-red-50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                          />
                        </div>
                        {videoPreviewUrl && (
                          <div className="relative inline-block group">
                            <video
                              src={videoPreviewUrl}
                              controls
                              className="h-32 w-56 object-cover rounded-lg border border-gray-200 shadow-sm transition-all duration-200 group-hover:shadow-md"
                            />
                            <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs font-medium backdrop-blur-sm">
                              Preview
                            </div>
                          </div>
                        )}
                        {errors?.video && (
                          <div className="flex items-center gap-2 text-red-600 text-sm">
                            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors?.video}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Video Link */}
                    {videoInputType === "link" && (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Video URL <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={videoLink}
                            onChange={handleVideoLinkChange}
                            placeholder="https://example.com/video.mp4"
                            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-500 transition-all duration-200 focus:border-red-500 focus:ring-2 focus:ring-red-100 focus:bg-white hover:border-gray-400"
                          />
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                          </div>
                        </div>
                        {errors?.video && (
                          <div className="flex items-center gap-2 text-red-600 text-sm">
                            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors?.video}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Image Upload */}
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Thumbnail Image <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          onChange={handleImageUpload}
                          accept="image/*"
                          className="w-full p-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 text-gray-600 cursor-pointer transition-all duration-200 hover:border-red-300 hover:bg-red-50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                        />
                      </div>
                      {errors?.image && (
                        <div className="flex items-center gap-2 text-red-600 text-sm">
                          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors?.image}
                        </div>
                      )}
                    </div>

                    {/* Thumbnail Preview */}
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Thumbnail Preview
                      </label>
                      <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center bg-gray-50 transition-all duration-200 hover:border-gray-300 min-h-[200px] flex items-center justify-center">
                        {imageError || (!thumbnailPreviewUrl && !imagePath) ? (
                          <div className="text-center">
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <p className="text-gray-500 text-sm font-medium">
                              No thumbnail selected
                            </p>
                            <p className="text-gray-400 text-xs mt-1">
                              Upload an image to see preview
                            </p>
                          </div>
                        ) : (
                          <div className="relative group">
                            <img
                              src={thumbnailPreviewUrl || imagePath}
                              className="w-40 h-48 object-cover rounded-lg border border-gray-200 shadow-sm transition-all duration-200 group-hover:shadow-md"
                              alt="Thumbnail preview"
                              onError={() => setImageError(true)}
                            />
                            <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs font-medium backdrop-blur-sm">
                              Preview
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                <div className="flex justify-end gap-3">
                  <button
                    onClick={handleCloseAds}
                    disabled={isSubmitting}
                    className="px-6 py-2.5 border border-gray-300 text-gray-700 bg-white rounded-xl font-medium text-sm transition-all duration-200 hover:bg-gray-50 hover:border-gray-400 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={isNewsChannelListPage ? handleSubmit : handleEditSubmit}
                    disabled={isSubmitting}
                    className="px-8 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium text-sm transition-all duration-200 hover:from-red-600 hover:to-red-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {isNewsChannelListPage ? "Creating..." : "Updating..."}
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {isNewsChannelListPage ? "Create News" : "Update News"}
                      </>
                    )}
                  </button>
                </div>
                {errors?.submit && (
                  <div className="mt-3 flex justify-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
                      <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors?.submit}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default NewsListDialogue;