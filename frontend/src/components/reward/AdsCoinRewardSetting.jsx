/* eslint-disable no-unused-vars */
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { unwrapResult } from '@reduxjs/toolkit';
import { IconEdit, IconTrash, IconPlus } from '@tabler/icons-react';
import { openDialog } from '../../store/dialogueSlice';
import { deleteAdsReward, getAdsRewardCoin } from '../../store/rewardSlice';
import { getSetting, updateSetting } from '../../store/settingSlice';
import AdsCoinRewarddialogue from './AdsCoinRewarddialogue';

const AdsCoinRewardSetting = () => {
  const dispatch = useDispatch();
  const { dialogueType } = useSelector((state) => state.dialogue);
  const { adsReward } = useSelector((state) => state.adsReward);
  const { setting } = useSelector((state) => state.setting);
  
  const [data, setData] = useState([]);
  const [error, setError] = useState({});
  const [maxAdPerDay, setMaxAdPerDay] = useState('');
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);

  useEffect(() => {
    dispatch(getAdsRewardCoin());
    dispatch(getSetting());
  }, [dispatch]);

  useEffect(() => {
    setData(adsReward);
  }, [adsReward]);

  useEffect(() => {
    setMaxAdPerDay(setting?.maxAdPerDay || '');
  }, [setting]);

  const handleSubmit = () => {
    if (!maxAdPerDay) {
      setError({ maxAdPerDay: "Maximum ads per day is required" });
      return;
    }

    const settingDataSubmit = {
      settingId: setting?._id || '',
      maxAdPerDay: parseInt(maxAdPerDay),
    };

    dispatch(updateSetting(settingDataSubmit)).then((res) => {
      if (res?.payload?.status) {
        toast.success(res?.payload?.message);
        setError({});
      }
    });
  };

  const handleDeleteReward = (row) => {
    const confirmed = window.confirm('Are you sure you want to delete this ads reward?');
    if (confirmed) {
      dispatch(deleteAdsReward(row?._id))
        .then(unwrapResult)
        .then((result) => {
          toast.success(result?.message);
          dispatch(getAdsRewardCoin());
        })
        .catch((err) => {
          console.log(err);
          toast.error('Failed to delete reward');
        });
    }
  };

  const adsRewardTable = [
    {
      Header: "NO",
      Cell: ({ index }) => (
        <span className="text-red-700 font-medium">
          {index + 1}
        </span>
      ),
    },
    {
      Header: "LABEL",
      Cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
            <span className="text-red-600 text-sm font-semibold">AD</span>
          </div>
          <span className="text-red-900 font-semibold">{row?.adLabel}</span>
        </div>
      ),
    },
    {
      Header: "DISPLAY INTERVAL",
      Cell: ({ row }) => (
        <div className="text-center">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {row?.adDisplayInterval}s
          </span>
        </div>
      ),
    },
    {
      Header: "COIN EARNED",
      Cell: ({ row }) => (
        <div className="text-center">
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            {row?.coinEarnedFromAd} coins
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
                  type: 'adsCoinReward',
                  data: row,
                })
              );
            }}
            className="p-2 text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            aria-label="Edit ads reward"
          >
            <IconEdit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteReward(row)}
            className="p-2 text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            aria-label="Delete ads reward"
          >
            <IconTrash className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      {dialogueType === "adsCoinReward" && <AdsCoinRewarddialogue />}
      
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-red-600 to-rose-600 p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-white mb-2">
                    Ads Coin Rewards
                  </h1>
                  <p className="text-red-100 text-opacity-90">
                    Configure advertisement rewards and daily limits for user coin earnings
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-white bg-opacity-20 rounded-xl px-4 py-2">
                    <span className="text-white font-semibold text-sm">
                      {data?.length || 0} Reward Types
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Daily Limit Settings */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-red-800">Daily Limits</h3>
                    <p className="text-red-600 text-sm">Set maximum ads per day</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-red-700 mb-2">
                      Maximum Ads Per Day <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={maxAdPerDay}
                      onChange={(e) => {
                        setMaxAdPerDay(e.target.value);
                        if (e.target.value) {
                          setError(prev => ({ ...prev, maxAdPerDay: '' }));
                        }
                      }}
                      placeholder="Enter maximum ads per day"
                      min="1"
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${
                        error.maxAdPerDay 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-gray-300 focus:border-transparent'
                      }`}
                    />
                    {error.maxAdPerDay && (
                      <p className="text-red-600 text-sm mt-2 flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{error.maxAdPerDay}</span>
                      </p>
                    )}
                  </div>
                  
                  <button
                    onClick={handleSubmit}
                    className="w-full bg-gradient-to-r from-red-500 to-rose-500 text-white py-3 rounded-xl hover:from-red-600 hover:to-rose-600 transition-all duration-200 shadow-sm hover:shadow-md font-semibold"
                  >
                    Save Daily Limit
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-6 space-y-4">
                <div className="bg-white rounded-xl p-4 border border-red-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-600">Total Reward Types</p>
                      <p className="text-2xl font-bold text-red-800">{data?.length || 0}</p>
                    </div>
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 border border-green-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Daily Limit</p>
                      <p className="text-2xl font-bold text-green-800">{maxAdPerDay || '0'}</p>
                    </div>
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ads Reward Table */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden">
                {/* Table Header */}
                <div className="bg-gradient-to-r from-red-50 to-rose-50 px-6 py-4 border-b border-red-100">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-red-800">Ads Reward Configuration</h3>
                      <p className="text-red-600 text-sm">Manage different ad reward types and their settings</p>
                    </div>
                    <button
                      onClick={() => {
                        dispatch(
                          openDialog({
                            type: "adsCoinReward",
                          })
                        );
                      }}
                      className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-rose-500 text-white px-4 py-2 rounded-xl hover:from-red-600 hover:to-rose-600 transition-all duration-200 shadow-sm hover:shadow-md font-semibold"
                    >
                      <IconPlus className="w-4 h-4" />
                      <span>New Reward</span>
                    </button>
                  </div>
                </div>

                {/* Table Content */}
                {!data || data.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-red-800 mb-2">
                      No Ads Rewards Found
                    </h3>
                    <p className="text-red-600 mb-6 max-w-md mx-auto">
                      There are no ads reward configurations yet. Start by creating your first ads reward to enable coin earnings from advertisements.
                    </p>
                    <button
                      onClick={() => {
                        dispatch(
                          openDialog({
                            type: "adsCoinReward",
                          })
                        );
                      }}
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
                          {adsRewardTable.map((column, index) => (
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
                            {adsRewardTable.map((column, colIndex) => (
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

export default AdsCoinRewardSetting;