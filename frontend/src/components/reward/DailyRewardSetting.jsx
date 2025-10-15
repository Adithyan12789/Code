/* eslint-disable no-unused-vars */
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { unwrapResult } from '@reduxjs/toolkit';
import moment from 'moment';
import { IconEdit, IconTrash, IconPlus } from '@tabler/icons-react';
import { openDialog } from '../../store/dialogueSlice';
import { deleteDailyReward, getDailyRewardCoin } from "../../store/rewardSlice";
import DailyRewardCoinDialogue from "./DailyRewardCoinDialogue";

const DailyRewardSetting = () => {
  const dispatch = useDispatch();
  const { dialogueType } = useSelector((state) => state.dialogue);
  const { dailyReward } = useSelector((state) => state.adsReward);
  
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);

  useEffect(() => {
    dispatch(getDailyRewardCoin());
  }, [dispatch]);

  useEffect(() => {
    setData(dailyReward || []);
  }, [dailyReward]);

  const handleDeleteReward = (row) => {
    const confirmed = window.confirm('Are you sure you want to delete this daily reward?');
    if (confirmed) {
      dispatch(deleteDailyReward(row?._id))
        .then(unwrapResult)
        .then((result) => {
          toast.success(result?.message);
          dispatch(getDailyRewardCoin());
        })
        .catch((err) => {
          console.log(err);
          toast.error("Failed to delete reward");
        });
    }
  };

  const dailyRewardTable = [
    {
      Header: "NO",
      Cell: ({ index }) => (
        <span className="text-red-700 font-medium">
          {index + 1}
        </span>
      ),
    },
    {
      Header: "DAY",
      Cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            row?.day === 7 ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
            row?.day === 6 ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
            row?.day === 5 ? 'bg-gradient-to-r from-blue-500 to-indigo-500' :
            row?.day === 4 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
            row?.day === 3 ? 'bg-gradient-to-r from-yellow-500 to-amber-500' :
            row?.day === 2 ? 'bg-gradient-to-r from-red-500 to-pink-500' :
            'bg-gradient-to-r from-gray-500 to-gray-600'
          }`}>
            <span className="text-white font-bold text-sm">Day {row?.day}</span>
          </div>
          <div>
            <span className="text-red-900 font-semibold block">Day {row?.day}</span>
            <span className="text-red-600 text-xs">
              {row?.day === 1 ? 'First Login' : 
               row?.day === 7 ? 'Highest Reward' : 
               `Consecutive Day ${row?.day}`}
            </span>
          </div>
        </div>
      ),
    },
    {
      Header: "REWARD",
      Cell: ({ row }) => (
        <div className="text-center">
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 rounded-xl p-3">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-green-600 text-lg font-bold">{row?.dailyRewardCoin}</span>
              <span className="text-green-800 font-semibold">coins</span>
            </div>
            <div className="text-green-600 text-xs mt-1">
              Daily Reward
            </div>
          </div>
        </div>
      ),
    },
    {
      Header: "CREATED AT",
      Cell: ({ row }) => (
        <div className="text-center">
          <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
            {moment(row?.createdAt).format("DD MMM YYYY")}
          </span>
        </div>
      ),
    },
    {
      Header: "ACTION",
      Cell: ({ row }) => (
        <div className="flex space-x-2">
          <button
            onClick={() => {
              dispatch(
                openDialog({
                  type: "dailyCoinReward",
                  data: row,
                })
              );
            }}
            className="p-2 text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            aria-label="Edit daily reward"
          >
            <IconEdit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteReward(row)}
            className="p-2 text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            aria-label="Delete daily reward"
          >
            <IconTrash className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const getCompletionStats = () => {
    const totalDays = 7;
    const completedDays = data?.length || 0;
    const percentage = (completedDays / totalDays) * 100;
    
    return { totalDays, completedDays, percentage };
  };

  const { totalDays, completedDays, percentage } = getCompletionStats();

  return (
    <>
      {dialogueType === "dailyCoinReward" && <DailyRewardCoinDialogue />}
      
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-red-600 to-rose-600 p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-white mb-2">
                    Daily Login Rewards
                  </h1>
                  <p className="text-red-100 text-opacity-90">
                    Configure coin rewards for consecutive daily logins to encourage user engagement
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-white bg-opacity-20 rounded-xl px-4 py-2">
                    <span className="text-white font-semibold text-sm">
                      {completedDays} of {totalDays} Days Configured
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-white p-6 border-b border-red-100">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-red-700">Setup Progress</span>
                  <span className="text-sm font-bold text-red-800">{completedDays}/{totalDays} Days</span>
                </div>
                <div className="w-full bg-red-100 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <p className="text-red-600 text-sm">
                  {percentage === 100 
                    ? '🎉 All daily rewards are configured!'
                    : `Configure ${totalDays - completedDays} more day${totalDays - completedDays === 1 ? '' : 's'} to complete the setup`
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Quick Stats */}
            <div className="lg:col-span-1 space-y-6">
              {/* Total Rewards Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-red-600">Total Rewards</p>
                    <p className="text-2xl font-bold text-red-800">{completedDays}</p>
                  </div>
                </div>
              </div>

              {/* Total Coins Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-green-200 p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-600">Total Coins</p>
                    <p className="text-2xl font-bold text-green-800">
                      {data?.reduce((sum, reward) => sum + (reward?.dailyRewardCoin || 0), 0)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Average Reward Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-blue-200 p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-600">Average Reward</p>
                    <p className="text-2xl font-bold text-blue-800">
                      {completedDays > 0 
                        ? Math.round(data?.reduce((sum, reward) => sum + (reward?.dailyRewardCoin || 0), 0) / completedDays)
                        : 0
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Add New Reward Button */}
              <button
                onClick={() => {
                  if (data.length === 7) {
                    toast.error("All 7 days are already configured");
                  } else if (data.length < 7) {
                    dispatch(openDialog({ type: "dailyCoinReward" }));
                  }
                }}
                disabled={data.length === 7}
                className={`w-full flex items-center justify-center space-x-2 py-3 rounded-xl transition-all duration-200 font-semibold ${
                  data.length === 7
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-red-500 to-rose-500 text-white hover:from-red-600 hover:to-rose-600 shadow-sm hover:shadow-md'
                }`}
              >
                <IconPlus className="w-5 h-5" />
                <span>Add Daily Reward</span>
              </button>

              {data.length === 7 && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-green-800 text-sm font-medium">All days configured!</span>
                  </div>
                </div>
              )}
            </div>

            {/* Main Table */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden">
                {/* Table Header */}
                <div className="bg-gradient-to-r from-red-50 to-rose-50 px-6 py-4 border-b border-red-100">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-red-800">Daily Reward Configuration</h3>
                      <p className="text-red-600 text-sm">Manage coin rewards for consecutive login days</p>
                    </div>
                    <div className="flex items-center space-x-2 text-red-700">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm">Day 7 should have the highest reward</span>
                    </div>
                  </div>
                </div>

                {/* Table Content */}
                {!data || data.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-red-800 mb-2">
                      No Daily Rewards Configured
                    </h3>
                    <p className="text-red-600 mb-6 max-w-md mx-auto">
                      Start by setting up daily login rewards to encourage user engagement. Configure rewards for all 7 days of the week.
                    </p>
                    <button
                      onClick={() => dispatch(openDialog({ type: "dailyCoinReward" }))}
                      className="flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold mx-auto"
                    >
                      <IconPlus className="w-5 h-5" />
                      <span>Create First Reward</span>
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          {dailyRewardTable.map((column, index) => (
                            <th
                              key={index}
                              className="px-6 py-3 text-left text-xs font-semibold text-red-800 uppercase tracking-wider"
                            >
                              {column.Header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {data.map((row, rowIndex) => (
                          <tr key={row._id || rowIndex} className="hover:bg-red-50 transition-colors duration-150">
                            {dailyRewardTable.map((column, colIndex) => (
                              <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                                {column.Cell ? (
                                  <column.Cell row={row} index={rowIndex} />
                                ) : (
                                  <span className="text-red-700">{row[column.body]}</span>
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DailyRewardSetting;