import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { closeDialog } from "../../store/dialogueSlice";
import { sendNotification, uploadImageNotification } from "../../store/adminSlice";
// import Input from "../extra/Input";
// import Button from "../extra/Button";

const NotificationDialogue = () => {
  const dispatch = useDispatch();
  const { dialogue: open } = useSelector((state) => state.dialogue);

  const [values, setValues] = useState({
    title: "",
    description: "",
    image: null,
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [imagePath, setImageFile] = useState(null);

  const handleCloseDialog = () => {
    dispatch(closeDialog());
  };

  const validation = () => {
    let error = {};
    let isValid = true;

    if (!values.title.trim()) {
      error.title = "Title is required";
      isValid = false;
    }

    if (!values.description.trim()) {
      error.description = "Description is required";
      isValid = false;
    }

    setErrors(error);
    return isValid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setValues({ ...values, image: file });

      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setValues({ ...values, image: null });
    setImagePreview(null);
  };

  const handleSubmit = async () => {
    if (!validation()) return;

    try {
      let finalImagePath = imagePreview;

      if (imagePath) {
        const folderStructure = `admin/notificationImage`;
        const formData = new FormData();
        formData.append("folderStructure", folderStructure);
        formData.append("keyName", imagePath.name);
        formData.append("content", imagePath);

        const uploadResponse = await dispatch(uploadImageNotification(formData)).unwrap();
        finalImagePath = uploadResponse.data.url;
      }

      const payload = {
        title: values.title,
        description: values.description,
        image: finalImagePath || null,
      };

      dispatch(sendNotification(payload));
      handleCloseDialog();
    } catch (error) {
      toast.error("An error occurred while processing your request");
      console.error("Submit error:", error);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-[90%] max-w-lg rounded-xl shadow-lg p-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 pb-3">
          <h2 className="text-xl font-semibold text-gray-800">Notification</h2>
          <button
            onClick={handleCloseDialog}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form className="mt-4 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={values.title || ""}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              rows="3"
              value={values.description || ""}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
                         file:rounded-lg file:border-0
                         file:text-sm file:font-semibold
                         file:bg-blue-50 file:text-blue-700
                         hover:file:bg-blue-100"
            />
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="relative mt-3">
              <img
                src={imagePreview}
                alt="Preview"
                className="rounded-lg max-h-52 w-full object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
              >
                ×
              </button>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCloseDialog}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NotificationDialogue;
