/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeDialog } from "../../store/dialogueSlice";
import { getNewsActiveCategory } from "../../store/newsCategorySlice";
import { toast } from "react-toastify";
import {
  addNewsChannelList,
  editNewsChannelList,
  getNewsChannelList,
  uploadImage,
} from "../../store/newsChannelListSlice";

const NewsChannelListDialogue = ({ page, size }) => {
  const { dialogue: open, dialogueData } = useSelector(
    (state) => state.dialogue
  );

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [maxAdsForFreeView, setMaxAdsForFreeView] = useState(0);
  
  // Poster image states
  const [posterImagePath, setPosterImagePath] = useState(null);
  const [posterSelectedFile, setPosterSelectedFile] = useState(null);
  const [posterImagePreviewUrl, setPosterImagePreviewUrl] = useState(null);
  const [posterImageError, setPosterImageError] = useState(false);

  // Banner image states
  const [bannerImagePath, setBannerImagePath] = useState(null);
  const [bannerSelectedFile, setBannerSelectedFile] = useState(null);
  const [bannerImagePreviewUrl, setBannerImagePreviewUrl] = useState(null);
  const [bannerImageError, setBannerImageError] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const { newsActiveCategory } = useSelector((state) => state.newsCategory);

  useEffect(() => {
    dispatch(getNewsActiveCategory());
  }, [dispatch]);

  useEffect(() => {
    if (dialogueData) {
      setName(dialogueData?.name || "");
      setDescription(dialogueData?.description || "");
      setPosterImagePath(dialogueData?.thumbnail || null);
      setBannerImagePath(dialogueData?.banner || null);
      setCategory(dialogueData?.categoryId || "");
      setMaxAdsForFreeView(dialogueData?.maxAdsForFreeView || 0);
    } else {
      // Reset form when adding new
      setName("");
      setDescription("");
      setPosterImagePath(null);
      setBannerImagePath(null);
      setCategory("");
      setMaxAdsForFreeView(0);
      setPosterSelectedFile(null);
      setBannerSelectedFile(null);
      setPosterImagePreviewUrl(null);
      setBannerImagePreviewUrl(null);
      setErrors({});
    }
  }, [dialogueData, open]);

  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      if (posterImagePreviewUrl) {
        URL.revokeObjectURL(posterImagePreviewUrl);
      }
      if (bannerImagePreviewUrl) {
        URL.revokeObjectURL(bannerImagePreviewUrl);
      }
    };
  }, [posterImagePreviewUrl, bannerImagePreviewUrl]);

  const handleCloseAds = () => {
    dispatch(closeDialog());
  };

  const validation = () => {
    let error = {};
    let isValid = true;

    if (!name.trim()) {
      isValid = false;
      error["name"] = "Please enter name";
    }
    if (!description.trim()) {
      isValid = false;
      error["description"] = "Please enter description";
    }
    if (!posterImagePath && !posterSelectedFile) {
      isValid = false;
      error["posterImage"] = "Please select a poster image";
    }
    if (!bannerImagePath && !bannerSelectedFile) {
      isValid = false;
      error["bannerImage"] = "Please select a banner image";
    }
    if (!category) {
      isValid = false;
      error["category"] = "Please select category";
    }
    if (!maxAdsForFreeView || maxAdsForFreeView < 0) {
      isValid = false;
      error["maxAdsForFreeView"] = "Please enter valid max ads for free view";
    }

    setErrors(error);
    return isValid;
  };

  const handlePosterFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors({ ...errors, posterImage: "Please select a valid image file" });
        return;
      }

      setPosterSelectedFile(file);
      setErrors({ ...errors, posterImage: "" });

      const localPreviewUrl = URL.createObjectURL(file);
      setPosterImagePreviewUrl(localPreviewUrl);
      setPosterImageError(false);
    }
  };

  const handleBannerFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors({ ...errors, bannerImage: "Please select a valid image file" });
        return;
      }

      setBannerSelectedFile(file);
      setErrors({ ...errors, bannerImage: "" });

      const localPreviewUrl = URL.createObjectURL(file);
      setBannerImagePreviewUrl(localPreviewUrl);
      setBannerImageError(false);
    }
  };

  const uploadImageFile = async (file, folderName) => {
    try {
      const formData = new FormData();
      formData.append("folderStructure", `admin/${folderName}`);
      formData.append("keyName", file.name);
      formData.append("content", file);

      const response = await dispatch(uploadImage(formData)).unwrap();

      if (response?.data?.status && response.data.url) {
        return {
          status: true,
          url: response.data.url,
          message: response.data.message,
        };
      }
      throw new Error(response?.data?.message || "Upload failed");
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }

    if (!validation()) {
      return;
    }

    setIsSubmitting(true);

    try {
      let finalPosterImagePath = posterImagePath;
      let finalBannerImagePath = bannerImagePath;

      // Upload poster image if a new file is selected
      if (posterSelectedFile) {
        const uploadResponse = await uploadImageFile(posterSelectedFile, "NewsChannelPoster");
        if (!uploadResponse.status) {
          toast.error("Failed to upload poster image");
          setIsSubmitting(false);
          return;
        }
        finalPosterImagePath = uploadResponse.url;
      }

      // Upload banner image if a new file is selected
      if (bannerSelectedFile) {
        const uploadResponse = await uploadImageFile(bannerSelectedFile, "NewsChannelBanner");
        if (!uploadResponse.status) {
          toast.error("Failed to upload banner image");
          setIsSubmitting(false);
          return;
        }
        finalBannerImagePath = uploadResponse.url;
      }

      // Prepare data with both poster and banner URLs
      const data = {
        name: name.trim(),
        description: description.trim(),
        category: category,
        thumbnail: finalPosterImagePath,
        banner: finalBannerImagePath,
        maxAdsForFreeView: Number(maxAdsForFreeView),
      };

      const action = dialogueData 
        ? editNewsChannelList({ ...data, id: dialogueData._id })
        : addNewsChannelList(data);

      const response = await dispatch(action).unwrap();

      if (response?.status) {
        toast.success(response.message);
        handleCloseAds();
        dispatch(getNewsChannelList({ page, size }));
      } else {
        toast.error(response?.message || "An error occurred");
      }
    } catch (error) {
      toast.error("An error occurred while processing your request");
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Enter key to submit form
  useEffect(() => {
    const handleEnterKey = (event) => {
      if (event.key === 'Enter' && open) {
        event.preventDefault();
        handleSubmit();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEnterKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEnterKey);
    };
  }, [open, name, description, category, maxAdsForFreeView, posterImagePath, bannerImagePath, posterSelectedFile, bannerSelectedFile]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.keyCode === 27) {
        handleCloseAds();
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-opacity-60 transition-opacity backdrop-blur-sm"
        onClick={handleCloseAds}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className="relative bg-gradient-to-br from-white to-red-50 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border-2 border-red-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-8 py-6 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-t-2xl shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9m0 0v12" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold m-0">
                  {dialogueData ? "Edit News Channel" : "Add News Channel"}
                </h2>
                <p className="text-red-100 text-sm mt-1 m-0">
                  {dialogueData ? "Update News Channel details and media" : "Create a new News Channel entry"}
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-8 bg-gradient-to-br from-white to-red-50">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Form Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  <div className="w-full">
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        setErrors({ ...errors, category: "" });
                      }}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white appearance-none cursor-pointer"
                    >
                      <option value="">Select Category...</option>
                      {newsActiveCategory?.map((option) => (
                        <option key={option._id} value={option._id}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                    {errors?.category && (
                      <p className="text-red-600 text-sm mt-2 font-medium flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span>{errors.category}</span>
                      </p>
                    )}
                  </div>

                  <div className="w-full">
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setErrors({ ...errors, name: "" });
                      }}
                      placeholder="Enter channel name"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white"
                    />
                    {errors?.name && (
                      <p className="text-red-600 text-sm mt-2 font-medium flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span>{errors.name}</span>
                      </p>
                    )}
                  </div>

                  <div className="w-full">
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Max Ads For Free View *
                    </label>
                    <input
                      type="number"
                      value={maxAdsForFreeView}
                      onChange={(e) => {
                        setMaxAdsForFreeView(e.target.value);
                        setErrors({ ...errors, maxAdsForFreeView: "" });
                      }}
                      placeholder="Enter max ads count"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white"
                    />
                    {errors?.maxAdsForFreeView && (
                      <p className="text-red-600 text-sm mt-2 font-medium flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span>{errors.maxAdsForFreeView}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div className="w-full">
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                        setErrors({ ...errors, description: "" });
                      }}
                      placeholder="Enter channel description"
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none transition-all duration-200 bg-white"
                    />
                    {errors?.description && (
                      <p className="text-red-600 text-sm mt-2 font-medium flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span>{errors.description}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                {/* Poster Upload */}
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-gray-800 uppercase tracking-wide">
                    Poster Image *
                  </label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePosterFileSelect}
                      className="w-full px-4 py-4 border-2 border-dashed border-red-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-red-50 transition-all duration-200 cursor-pointer hover:border-red-300"
                    />
                    <div className="border-2 border-dashed border-red-200 rounded-xl p-6 text-center bg-red-50 transition-all duration-200 hover:border-red-300">
                      {posterImagePreviewUrl || posterImagePath ? (
                        <div className="space-y-3">
                          <img
                            src={posterImagePreviewUrl || posterImagePath}
                            className="w-32 h-40 object-cover rounded-lg shadow-lg mx-auto border-2 border-white"
                            alt="Poster Thumbnail"
                            onError={() => setPosterImageError(true)}
                          />
                          <p className="text-green-600 text-sm font-medium">Poster image selected</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="w-32 h-40 bg-red-100 rounded-lg flex items-center justify-center mx-auto border-2 border-red-200">
                            <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <p className="text-red-500 text-sm">No poster image selected</p>
                        </div>
                      )}
                    </div>
                  </div>
                  {errors?.posterImage && (
                    <p className="text-red-600 text-sm mt-2 font-medium flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span>{errors.posterImage}</span>
                    </p>
                  )}
                </div>

                {/* Banner Upload */}
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-gray-800 uppercase tracking-wide">
                    Banner Image *
                  </label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBannerFileSelect}
                      className="w-full px-4 py-4 border-2 border-dashed border-red-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-red-50 transition-all duration-200 cursor-pointer hover:border-red-300"
                    />
                    <div className="border-2 border-dashed border-red-200 rounded-xl p-6 text-center bg-red-50 transition-all duration-200 hover:border-red-300">
                      {bannerImagePreviewUrl || bannerImagePath ? (
                        <div className="space-y-3">
                          <img
                            src={bannerImagePreviewUrl || bannerImagePath}
                            className="w-32 h-40 object-cover rounded-lg shadow-lg mx-auto border-2 border-white"
                            alt="Banner Thumbnail"
                            onError={() => setBannerImageError(true)}
                          />
                          <p className="text-green-600 text-sm font-medium">Banner image selected</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="w-32 h-40 bg-red-100 rounded-lg flex items-center justify-center mx-auto border-2 border-red-200">
                            <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <p className="text-red-500 text-sm">No banner image selected</p>
                        </div>
                      )}
                    </div>
                  </div>
                  {errors?.bannerImage && (
                    <p className="text-red-600 text-sm mt-2 font-medium flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span>{errors.bannerImage}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Hidden submit button for Enter key */}
              <button type="submit" className="hidden" />
            </form>
          </div>

          {/* Footer */}
          <div className="px-8 py-6 border-t border-red-200 bg-gradient-to-r from-white to-red-50 rounded-b-2xl">
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCloseAds}
                disabled={isSubmitting}
                className="px-8 py-3 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 border-2 border-red-300 text-red-700 bg-white hover:bg-red-50 hover:border-red-400 focus:ring-red-500 shadow-md"
              >
                Close
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-3 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 focus:ring-red-500 shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsChannelListDialogue;