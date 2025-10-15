/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeDialog } from "../../store/dialogueSlice";
import { createReportSetting, getReportSetting, updateReportSetting } from "../../store/settingSlice";

const ReportReasonDialogue = () => {
  const { dialogue, dialogueData } = useSelector((state) => state.dialogue);
  const dispatch = useDispatch();
  
  const [isOpen, setIsOpen] = useState(false);
  const [mongoId, setMongoId] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState({
    title: "",
  });

  useEffect(() => {
    if (dialogueData) {
      setTitle(dialogueData?.title || "");
    }
  }, [dialogue, dialogueData]);

  useEffect(() => {
    setIsOpen(dialogue);
    setMongoId(dialogueData?._id || "");
  }, [dialogue]);

  const handleClose = () => {
    setIsOpen(false);
    dispatch(closeDialog());
    setTitle("");
    setError({ title: "" });
  };

  const handleSubmit = () => {
    // Validation
    if (!title.trim()) {
      setError({ title: "Title is required" });
      return;
    }

    let payload;
    if (mongoId) {
      // Update existing report reason
      const reportReasonData = { title: title.trim() };
      payload = {
        data: reportReasonData,
        reportReasonId: mongoId,
      };
      dispatch(updateReportSetting(payload)).then((res) => {
        dispatch(getReportSetting());
      });
    } else {
      // Create new report reason
      payload = { title: title.trim() };
      dispatch(createReportSetting(payload)).then((res) => {
        dispatch(getReportSetting());
      });
    }

    handleClose();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-rose-600 px-6 py-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                {mongoId ? "Edit Report Reason" : "Add Report Reason"}
              </h3>
              <button
                onClick={handleClose}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-red-700 mb-2">
                    Reason Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => {
                      const value = e.target.value;
                      setTitle(value);
                      if (value.trim()) {
                        setError({ title: "" });
                      }
                    }}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter reason title..."
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${
                      error.title 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-300 focus:border-transparent'
                    }`}
                  />
                  {error.title && (
                    <p className="text-red-600 text-sm mt-2 flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{error.title}</span>
                    </p>
                  )}
                </div>

                {/* Help Text */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-blue-800 text-sm font-medium">Report Reason</p>
                      <p className="text-blue-600 text-sm mt-1">
                        Add a clear and concise reason for users to report content. This helps in better content moderation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 rounded-b-2xl border-t border-gray-200">
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl hover:from-red-600 hover:to-rose-600 transition-all duration-200 shadow-sm hover:shadow-md font-semibold"
              >
                {mongoId ? "Update Reason" : "Add Reason"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportReasonDialogue;