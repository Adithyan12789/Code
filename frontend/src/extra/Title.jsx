import React, { useState } from "react";
import dayjs from "dayjs";
import MultiButton from "./MultiButton";
import { IconCalendar } from "@tabler/icons-react";

export default function Title(props) {
  const {
    newClass,
    name,
    dayAnalyticsShow,
    titleShow,
    setStartDate,
    setEndDate,
    endDate,
    startDate,
    setMultiButtonSelect,
    multiButtonSelect,
    labelData,
  } = props;

  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateRangeSelect = (range) => {
    let start, end;
    
    switch (range) {
      case "All":
        start = "All";
        end = "All";
        break;
      case "Today":
        start = dayjs().format("YYYY-MM-DD");
        end = dayjs().format("YYYY-MM-DD");
        break;
      case "Yesterday":
        start = dayjs().subtract(1, "days").format("YYYY-MM-DD");
        end = dayjs().subtract(1, "days").format("YYYY-MM-DD");
        break;
      case "Last 7 Days":
        start = dayjs().subtract(6, "days").format("YYYY-MM-DD");
        end = dayjs().format("YYYY-MM-DD");
        break;
      case "Last 30 Days":
        start = dayjs().subtract(29, "days").format("YYYY-MM-DD");
        end = dayjs().format("YYYY-MM-DD");
        break;
      case "This Month":
        start = dayjs().startOf("month").format("YYYY-MM-DD");
        end = dayjs().endOf("month").format("YYYY-MM-DD");
        break;
      case "Last Month":
        start = dayjs().subtract(1, "month").startOf("month").format("YYYY-MM-DD");
        end = dayjs().subtract(1, "month").endOf("month").format("YYYY-MM-DD");
        break;
      default:
        start = "All";
        end = "All";
    }

    setStartDate(start);
    setEndDate(end);
    setShowDatePicker(false);
  };

  const getDisplayText = () => {
    if (startDate === "All" && endDate === "All") {
      return "All Time";
    }
    if (startDate && endDate) {
      return `${dayjs(startDate).format("MM/DD/YYYY")} - ${dayjs(endDate).format("MM/DD/YYYY")}`;
    }
    return "Select Date Range";
  };

  const dateRanges = [
    "All",
    "Today", 
    "Yesterday",
    "Last 7 Days",
    "Last 30 Days",
    "This Month",
    "Last Month"
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* TITLE SECTION */}
        <div className={`text-black ${dayAnalyticsShow ? "flex-1" : "w-full"}`}>
          {titleShow && (
            <div className={!newClass ? "flex items-center" : newClass}>
              <div className="title">
                <h4 className="text-2xl font-bold bg-gradient-to-r from-red-800 to-pink-600 bg-clip-text text-transparent capitalize">
                  {name}
                </h4>
              </div>
            </div>
          )}
        </div>

        {/* DATE RANGE PICKER */}
        {dayAnalyticsShow && (
          <div className="flex items-center gap-4">
            {/* Modern Date Range Picker */}
            <div className="relative">
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="flex items-center gap-2 bg-white border border-gray-300 rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition-all duration-200 text-gray-700 font-medium min-w-64"
              >
                <IconCalendar size={20} className="text-red-500" />
                <span className="flex-1 text-left">{getDisplayText()}</span>
                <svg 
                  className={`w-4 h-4 transition-transform duration-200 ${showDatePicker ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showDatePicker && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 p-3 z-50 min-w-64">
                  <div className="space-y-1">
                    {dateRanges.map((range) => (
                      <button
                        key={range}
                        onClick={() => handleDateRangeSelect(range)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
                          (range === "All" && startDate === "All" && endDate === "All") ||
                          (range !== "All" && startDate !== "All" && 
                           ((range === "Today" && startDate === dayjs().format("YYYY-MM-DD")) ||
                            (range === "Yesterday" && startDate === dayjs().subtract(1, "days").format("YYYY-MM-DD")) ||
                            (range === "Last 7 Days" && startDate === dayjs().subtract(6, "days").format("YYYY-MM-DD")) ||
                            (range === "Last 30 Days" && startDate === dayjs().subtract(29, "days").format("YYYY-MM-DD")) ||
                            (range === "This Month" && startDate === dayjs().startOf("month").format("YYYY-MM-DD")) ||
                            (range === "Last Month" && startDate === dayjs().subtract(1, "month").startOf("month").format("YYYY-MM-DD"))))
                            ? "bg-red-500 text-white font-semibold"
                            : "text-gray-700 hover:bg-red-50 hover:text-red-700"
                        }`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                  
                  {/* Custom Date Range Input */}
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs font-medium text-gray-600 mb-2">Custom Range</p>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        value={startDate !== "All" ? startDate : ""}
                        onChange={(e) => {
                          if (e.target.value) {
                            setStartDate(e.target.value);
                            if (!endDate || endDate === "All") {
                              setEndDate(e.target.value);
                            }
                          }
                        }}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-red-500 focus:border-red-500"
                        max={dayjs().format("YYYY-MM-DD")}
                      />
                      <input
                        type="date"
                        value={endDate !== "All" ? endDate : ""}
                        onChange={(e) => {
                          if (e.target.value) {
                            setEndDate(e.target.value);
                            if (!startDate || startDate === "All") {
                              setStartDate(e.target.value);
                            }
                          }
                        }}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-red-500 focus:border-red-500"
                        max={dayjs().format("YYYY-MM-DD")}
                        min={startDate !== "All" ? startDate : undefined}
                      />
                    </div>
                    <button
                      onClick={() => setShowDatePicker(false)}
                      className="w-full mt-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                    >
                      Apply Custom Range
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* MULTI BUTTON */}
            {multiButtonSelect && (
              <div className="flex-shrink-0">
                <MultiButton
                  multiButtonSelect={multiButtonSelect || ""}
                  setMultiButtonSelect={setMultiButtonSelect || ""}
                  label={labelData || []}
                />
              </div>
            )}
          </div>
        )}

        {/* MULTI BUTTON (when no date picker) */}
        {!dayAnalyticsShow && multiButtonSelect && (
          <div className="w-full flex justify-end">
            <MultiButton
              multiButtonSelect={multiButtonSelect || ""}
              setMultiButtonSelect={setMultiButtonSelect || ""}
              label={labelData || []}
            />
          </div>
        )}
      </div>
    </div>
  );
}