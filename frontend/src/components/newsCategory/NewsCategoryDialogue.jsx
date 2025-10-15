/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeDialog } from "../../store/dialogueSlice";
import {
  addNewsCategory,
  editNewsCategory,
  getNewsCategory,
} from "../../store/newsCategorySlice";
import { toast } from "react-toastify";
import { XMarkIcon } from "@heroicons/react/24/outline";

const NewsCategoryDialogue = ({ page, size }) => {
  const { dialogue: open, dialogueData } = useSelector(
    (state) => state.dialogue
  );

  const [name, setName] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  const handleCloseAds = () => {
    dispatch(closeDialog());
  };

  useEffect(() => {
    setName(dialogueData?.name || "");
    setErrors({});
    setIsSubmitting(false);
  }, [dialogueData, open]);

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Please enter category name";
    } else if (name.trim().length < 2) {
      newErrors.name = "Category name must be at least 2 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    // Prevent default form submission if event is provided
    if (e) {
      e.preventDefault();
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await dispatch(
        dialogueData 
          ? editNewsCategory({ name: name.trim(), categoryId: dialogueData._id })
          : addNewsCategory({ name: name.trim() })
      );

      if (result?.payload?.status) {
        handleCloseAds();
        toast.success(result?.payload?.message);
        dispatch(getNewsCategory({ page, size }));
      } else {
        toast.error(result?.payload?.message || "Something went wrong");
      }
    } catch (err) {
      toast.error(err.message || "Failed to submit");
    } finally {
      setIsSubmitting(false);
    }
  };

  const Input = ({ type, label, onChange, name, value, error, className = "" }) => (
    <div className={`w-full ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} <span className="text-red-500">*</span>
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-colors ${
          error 
            ? "border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50" 
            : "border-gray-300 focus:ring-red-500 focus:border-red-500"
        }`}
        placeholder={`Enter ${label.toLowerCase()}`}
        // Add autoFocus for better UX
        autoFocus={true}
      />
      {error && (
        <p className="text-red-600 text-sm mt-2 flex items-center">
          <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
          {error}
        </p>
      )}
    </div>
  );

  const Button = ({ onClick, btnName, type = "button", className = "", disabled = false, variant = "secondary" }) => {
    const baseClasses = "px-6 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
      primary: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm hover:shadow-md",
      secondary: "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-gray-500 hover:border-gray-400",
      danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500"
    };

    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`${baseClasses} ${variants[variant]} ${className}`}
      >
        {btnName}
      </button>
    );
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.keyCode === 27) {
        handleCloseAds();
      }
    };

    const handleEnter = (event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        // Only handle Enter if not in a textarea and not holding Ctrl/Cmd
        if (event.target.tagName !== 'TEXTAREA' && !event.ctrlKey && !event.metaKey) {
          event.preventDefault();
          handleSubmit();
        }
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("keydown", handleEnter);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("keydown", handleEnter);
      document.body.style.overflow = "unset";
    };
  }, [open, name]);

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
          className="relative bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-red-50 to-orange-50 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 m-0">
                  {dialogueData ? "Edit Category" : "Add New Category"}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {dialogueData ? "Update the news category details" : "Create a new news category"}
                </p>
              </div>
              <button
                onClick={handleCloseAds}
                className="p-2 hover:bg-red-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                <XMarkIcon className="w-5 h-5 text-gray-500 hover:text-red-600" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-6 bg-white">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">
                        Category names should be descriptive and unique.
                      </p>
                    </div>
                  </div>
                </div>

                <Input
                  type={"text"}
                  label={"Category Name"}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) {
                      setErrors({ ...errors, name: "" });
                    }
                  }}
                  name={"name"}
                  value={name}
                  error={errors?.name}
                  className="mb-2"
                />
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
            <div className="flex justify-between items-center">
              <div className="flex space-x-3">
                <Button
                  onClick={handleCloseAds}
                  btnName={"Cancel"}
                  variant="secondary"
                  className="min-w-[80px]"
                />
                <Button
                  onClick={handleSubmit}
                  btnName={isSubmitting ? "Saving..." : (dialogueData ? "Update" : "Create")}
                  type={"submit"}
                  variant="primary"
                  disabled={isSubmitting}
                  className="min-w-[100px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsCategoryDialogue;