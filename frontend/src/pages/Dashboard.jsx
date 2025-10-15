/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-case-declarations */
import React, { useEffect, useState } from "react";
import { RootLayout } from "../components/layout/Layout";
import { useDispatch, useSelector } from "react-redux";
import { dashboardCount, getChartRevenue, getChartUser } from "../store/dashSlice";
import { useNavigate } from "react-router-dom";
import { IconClipboardData, IconHistory, IconMovie, IconUsers, IconVideo, IconCalendar } from "@tabler/icons-react";
import Chart from "react-apexcharts";

// Utility function to format dates for API
const formatDateForAPI = (date) => {
  return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
};

// Function to calculate date ranges
const getDateRange = (range) => {
  const today = new Date();
  const start = new Date();
  const end = new Date();

  switch (range) {
    case "today":
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      return {
        startDate: formatDateForAPI(start),
        endDate: formatDateForAPI(end),
        displayText: "Today"
      };
    case "yesterday":
      start.setDate(today.getDate() - 1);
      start.setHours(0, 0, 0, 0);
      end.setDate(today.getDate() - 1);
      end.setHours(23, 59, 59, 999);
      return {
        startDate: formatDateForAPI(start),
        endDate: formatDateForAPI(end),
        displayText: "Yesterday"
      };
    case "last7":
      start.setDate(today.getDate() - 7);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      return {
        startDate: formatDateForAPI(start),
        endDate: formatDateForAPI(end),
        displayText: "Last 7 Days"
      };
    case "last30":
      start.setDate(today.getDate() - 30);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      return {
        startDate: formatDateForAPI(start),
        endDate: formatDateForAPI(end),
        displayText: "Last 30 Days"
      };
    case "thisMonth":
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      return {
        startDate: formatDateForAPI(start),
        endDate: formatDateForAPI(end),
        displayText: "This Month"
      };
    case "lastMonth":
      start.setMonth(today.getMonth() - 1, 1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(today.getMonth(), 0);
      end.setHours(23, 59, 59, 999);
      return {
        startDate: formatDateForAPI(start),
        endDate: formatDateForAPI(end),
        displayText: "Last Month"
      };
    case "all":
    default:
      // For "All Time", set a start date from a year ago and end date as today
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(today.getFullYear() - 1);
      oneYearAgo.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      
      return {
        startDate: formatDateForAPI(oneYearAgo),
        endDate: formatDateForAPI(end),
        displayText: "All Time"
      };
  }
};

// Format date for display (MMM DD, YYYY)
const formatDisplayDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const Dashboard = () => {
  // Set initial state with "All Time" dates
  const [dateRange, setDateRange] = useState(() => {
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    
    return {
      startDate: formatDateForAPI(oneYearAgo),
      endDate: formatDateForAPI(today)
    };
  });
  
  const [displayRange, setDisplayRange] = useState("All Time");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempStartDate, setTempStartDate] = useState("");
  const [tempEndDate, setTempEndDate] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { dashCount, chartAnalyticOfRevenue, chartAnalyticOfUsers, isLoading } = useSelector(
    (state) => state.dashboard
  );

  useEffect(() => {
    const { startDate, endDate } = dateRange;
    
    console.log('Date Range:', { startDate, endDate });
    console.log('Chart Users Data:', chartAnalyticOfUsers);
    console.log('Chart Revenue Data:', chartAnalyticOfRevenue);
    
    // Always send dates - they will always have values now
    const payload = { startDate, endDate };

    console.log('API Payload:', payload);

    dispatch(dashboardCount(payload));
    dispatch(getChartUser(payload));
    dispatch(getChartRevenue(payload));
  }, [dateRange, dispatch]);

  const handleDateRangeSelect = (range) => {
    if (range === "custom") {
      setShowDatePicker(true);
      return;
    }

    const dateRangeData = getDateRange(range);
    setDateRange({
      startDate: dateRangeData.startDate,
      endDate: dateRangeData.endDate
    });
    setDisplayRange(dateRangeData.displayText);
    
    setShowDatePicker(false);
  };

  const handleCustomDateApply = () => {
    if (tempStartDate && tempEndDate) {
      const startDate = formatDateForAPI(new Date(tempStartDate));
      const endDate = formatDateForAPI(new Date(tempEndDate));
      
      setDateRange({ startDate, endDate });
      setDisplayRange(`${formatDisplayDate(startDate)} - ${formatDisplayDate(endDate)}`);
    }
    setShowDatePicker(false);
    setTempStartDate("");
    setTempEndDate("");
  };

  const handleCustomDateCancel = () => {
    setTempStartDate("");
    setTempEndDate("");
    setShowDatePicker(false);
  };

  // Prepare chart data
  let label = [];
  let dataUser = [];
  let dataRevenue = [];

  // Process users data
  if (chartAnalyticOfUsers && Array.isArray(chartAnalyticOfUsers)) {
    chartAnalyticOfUsers.forEach((data_) => {
      if (data_?._id) {
        label.push(data_._id);
        dataUser.push(data_?.count || 0);
      }
    });
  }

  // Process revenue data
  if (chartAnalyticOfRevenue && Array.isArray(chartAnalyticOfRevenue)) {
    chartAnalyticOfRevenue.forEach((data_) => {
      if (data_?._id) {
        if (!label.includes(data_._id)) label.push(data_._id);
        dataRevenue.push(data_?.count || 0);
      }
    });
  }

  // Sort labels chronologically and ensure data alignment
  label = [...new Set(label)].sort((a, b) => new Date(a) - new Date(b));

  const finalDataUser = [];
  const finalDataRevenue = [];

  label.forEach((dateLabel) => {
    const userData = chartAnalyticOfUsers?.find(item => item._id === dateLabel);
    const revenueData = chartAnalyticOfRevenue?.find(item => item._id === dateLabel);
    
    finalDataUser.push(userData?.count || 0);
    finalDataRevenue.push(revenueData?.count || 0);
  });

  console.log('Final Labels:', label);
  console.log('Final User Data:', finalDataUser);
  console.log('Final Revenue Data:', finalDataRevenue);

  const optionsTotal = {
    chart: { 
      type: "area", 
      stacked: false, 
      height: "200px", 
      zoom: { enabled: false }, 
      toolbar: { show: false },
      fontFamily: 'Inter, sans-serif'
    },
    dataLabels: { enabled: false },
    markers: { size: 0 },
    fill: { 
      type: "gradient", 
      gradient: { 
        shadeIntensity: 1, 
        inverseColors: false, 
        opacityFrom: 0.45, 
        opacityTo: 0.05, 
        stops: [20, 100, 100, 100] 
      } 
    },
    yaxis: { show: false },
    xaxis: { 
      categories: label, 
      labels: { 
        style: { fontSize: '10px' }
      }
    },
    tooltip: { 
      shared: true, 
      theme: "light",
      style: {
        fontFamily: 'Inter, sans-serif'
      }
    },
    legend: { 
      position: "top", 
      horizontalAlign: "right", 
      offsetX: -10,
      fontFamily: 'Inter, sans-serif'
    },
    colors: ["#e83a57", "#786D81", "#be73f6"],
  };

  const totalSeries = [
    { name: "Total User", data: finalDataUser },
    { name: "Total Revenue", data: finalDataRevenue },
  ];

  // Check if chart has data
  const hasChartData = () => {
    const hasUserData = finalDataUser.some(val => val > 0);
    const hasRevenueData = finalDataRevenue.some(val => val > 0);
    return hasUserData || hasRevenueData;
  };

  const CustomeCard = ({ link, title, count, icon }) => (
    <div 
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02] p-6 border border-gray-100"
      onClick={() => navigate(link)}
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-3xl font-bold text-gray-800 mb-2">{count}</h3>
          <span className="text-gray-600 font-medium text-sm uppercase tracking-wide">{title}</span>
        </div>
        <div className="p-3 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg text-white">
          {icon}
        </div>
      </div>
      <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-red-500 to-pink-600 h-2 rounded-full transition-all duration-500" 
          style={{ width: `${Math.min((count / 1000) * 100, 100)}%` }}
        />
      </div>
    </div>
  );

  return (
    <RootLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 p-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-800 to-pink-600 bg-clip-text text-transparent">
                Welcome Admin!
              </h1>
              <p className="text-gray-600 mt-2">Here's what's happening with your platform today.</p>
            </div>
            
            {/* Date Range Picker */}
            <div className="relative">
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="flex items-center gap-2 bg-white border border-gray-300 rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition-all duration-200 text-gray-700 font-medium"
              >
                <IconCalendar size={20} className="text-red-500" />
                <span>{displayRange}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showDatePicker && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-50 min-w-64">
                  <div className="space-y-2">
                    <button
                      onClick={() => handleDateRangeSelect("today")}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors"
                    >
                      Today
                    </button>
                    <button
                      onClick={() => handleDateRangeSelect("yesterday")}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors"
                    >
                      Yesterday
                    </button>
                    <button
                      onClick={() => handleDateRangeSelect("last7")}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors"
                    >
                      Last 7 Days
                    </button>
                    <button
                      onClick={() => handleDateRangeSelect("last30")}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors"
                    >
                      Last 30 Days
                    </button>
                    <button
                      onClick={() => handleDateRangeSelect("thisMonth")}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors"
                    >
                      This Month
                    </button>
                    <button
                      onClick={() => handleDateRangeSelect("lastMonth")}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors"
                    >
                      Last Month
                    </button>
                    <button
                      onClick={() => handleDateRangeSelect("all")}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors"
                    >
                      All Time
                    </button>
                    
                    {/* Custom Date Inputs */}
                    <div className="border-t pt-3 mt-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">Custom Range</p>
                      <div className="space-y-2">
                        <input
                          type="date"
                          value={tempStartDate}
                          onChange={(e) => setTempStartDate(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                        <input
                          type="date"
                          value={tempEndDate}
                          onChange={(e) => setTempEndDate(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleCustomDateApply}
                            disabled={!tempStartDate || !tempEndDate}
                            className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                          >
                            Apply
                          </button>
                          <button
                            onClick={handleCustomDateCancel}
                            className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          <CustomeCard 
            link="/user" 
            title="Total User" 
            count={dashCount?.totalUsers || 0} 
            icon={<IconUsers size={24} />} 
          />
          <CustomeCard 
            link="/newsCategory" 
            title="Total News Category" 
            count={dashCount?.totalCategory || 0} 
            icon={<IconMovie size={24} />} 
          />
          <CustomeCard 
            link="/newsChannelList" 
            title="Total Short Video" 
            count={dashCount?.totalShortVideos || 0} 
            icon={<IconClipboardData size={24} />} 
          />
          <CustomeCard 
            link="/newsList" 
            title="Total Movie Series" 
            count={dashCount?.totalMovieSeries || 0} 
            icon={<IconVideo size={24} />} 
          />
          <CustomeCard 
            link="/orderHistory" 
            title="Total Revenue" 
            count={dashCount?.totalRevenue || 0} 
            icon={<IconHistory size={24} />} 
          />
        </div>

        {/* Analytics Chart */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold bg-gradient-to-r from-red-800 to-pink-600 bg-clip-text text-transparent">
              Data Analytics
            </h2>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#e83a57] rounded-full"></div>
                <span className="text-gray-600">Total Users</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#786D81] rounded-full"></div>
                <span className="text-gray-600">Total Revenue</span>
              </div>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-80">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            </div>
          ) : hasChartData() ? (
            <div className="chart-container">
              <Chart options={optionsTotal} series={totalSeries} type="area" height="380px" />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-80 text-gray-500">
              <IconClipboardData size={48} className="mb-4 opacity-50" />
              <p className="text-lg font-medium">No chart data available</p>
              <p className="text-sm">Try selecting a different date range</p>
            </div>
          )}
        </div>
      </div>
    </RootLayout>
  );
};

export default Dashboard;