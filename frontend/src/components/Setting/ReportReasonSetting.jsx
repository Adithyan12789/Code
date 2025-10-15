/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openDialog } from '../../store/dialogueSlice';
import { deleteReportSetting, getReportSetting } from '../../store/settingSlice';
import { IconEdit, IconTrash, IconPlus } from '@tabler/icons-react';
import ReportReasonDialogue from '../reportreason/ReportReasonDialogue';

const ReportReasonSetting = () => {
  const { settingData } = useSelector((state) => state.setting);
  const { dialogueType } = useSelector((state) => state.dialogue);
  const dispatch = useDispatch();

  const [size, setSize] = useState(20);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const payload = {};
    dispatch(getReportSetting(payload));
  }, [dispatch]);

  const handleDelete = (row) => {
    const confirmed = window.confirm('Are you sure you want to delete this report reason?');
    if (confirmed) {
      const id = row?._id;
      dispatch(deleteReportSetting(id)).then((res) => {
        dispatch(getReportSetting());
      });
    }
  };

  const reportReasonTable = [
    {
      Header: 'NO',
      body: 'no',
      Cell: ({ index }) => (
        <span className="text-red-700 font-medium">
          {index + 1}
        </span>
      ),
    },
    {
      Header: 'Title',
      body: 'title',
      Cell: ({ row }) => (
        <span className="text-red-900 font-semibold capitalize">
          {row?.title}
        </span>
      ),
    },
    {
      Header: 'Status',
      body: 'status',
      Cell: ({ row }) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          row?.isActive 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {row?.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      Header: 'Created Date',
      body: 'createdAt',
      Cell: ({ row }) => (
        <span className="text-red-700 text-sm">
          {new Date(row?.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      Header: 'Action',
      body: 'action',
      Cell: ({ row }) => (
        <div className="flex space-x-2">
          <button
            onClick={() => {
              dispatch(
                openDialog({
                  type: 'editreportreason',
                  data: row,
                })
              );
            }}
            className="p-2 text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            aria-label="Edit report reason"
          >
            <IconEdit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="p-2 text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            aria-label="Delete report reason"
          >
            <IconTrash className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      {dialogueType === "reportreason" && <ReportReasonDialogue />}
      {dialogueType === "editreportreason" && <ReportReasonDialogue />}

      <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-red-600 to-rose-600 p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-white mb-2">
                    Report Reasons
                  </h1>
                  <p className="text-red-100 text-opacity-90">
                    Manage and configure report reasons for user content moderation
                  </p>
                </div>
                <button
                  onClick={() => dispatch(openDialog({ type: "reportreason" }))}
                  className="flex items-center space-x-2 bg-white text-red-600 px-6 py-3 rounded-xl hover:bg-red-50 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
                >
                  <IconPlus className="w-5 h-5" />
                  <span>Add New Reason</span>
                </button>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="bg-white p-6 border-b border-red-100">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                  <div className="text-red-600 text-sm font-semibold">Total Reasons</div>
                  <div className="text-2xl font-bold text-red-800">{settingData?.length || 0}</div>
                </div>
                <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                  <div className="text-green-600 text-sm font-semibold">Active Reasons</div>
                  <div className="text-2xl font-bold text-green-800">
                    {settingData?.filter(item => item?.isActive)?.length || 0}
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                  <div className="text-blue-600 text-sm font-semibold">This Month</div>
                  <div className="text-2xl font-bold text-blue-800">
                    {settingData?.filter(item => 
                      new Date(item?.createdAt).getMonth() === new Date().getMonth() &&
                      new Date(item?.createdAt).getFullYear() === new Date().getFullYear()
                    )?.length || 0}
                  </div>
                </div>
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                  <div className="text-amber-600 text-sm font-semibold">Last Updated</div>
                  <div className="text-2xl font-bold text-amber-800">Today</div>
                </div>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden">
            {!settingData || settingData.length === 0 ? (
              // Empty State
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <svg 
                    className="w-12 h-12 text-red-400" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-red-800 mb-2">
                  No Report Reasons Found
                </h3>
                <p className="text-red-600 mb-6 max-w-md mx-auto">
                  There are no report reasons configured yet. Start by adding your first report reason to help users report inappropriate content.
                </p>
                <button
                  onClick={() => dispatch(openDialog({ type: "reportreason" }))}
                  className="flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold mx-auto"
                >
                  <IconPlus className="w-5 h-5" />
                  <span>Add Your First Reason</span>
                </button>
              </div>
            ) : (
              // Table Content
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-red-50 to-rose-50">
                      <tr>
                        {reportReasonTable.map((column, index) => (
                          <th
                            key={index}
                            className="px-6 py-4 text-left text-xs font-semibold text-red-800 uppercase tracking-wider"
                          >
                            {column.Header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-red-100">
                      {settingData.map((row, rowIndex) => (
                        <tr key={row._id || rowIndex} className="hover:bg-red-50 transition-colors duration-150">
                          {reportReasonTable.map((column, colIndex) => (
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

                {/* Pagination */}
                <div className="bg-red-50 border-t border-red-100 px-6 py-4">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-sm text-red-700">
                      Showing 1 to {settingData.length} of {settingData.length} entries
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                        className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setPage(prev => prev + 1)}
                        disabled={page * size >= settingData.length}
                        className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Quick Info */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 border border-red-200 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-red-600">Report Categories</p>
                  <p className="text-lg font-bold text-red-800">Content Moderation</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 border border-green-200 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-green-600">System Status</p>
                  <p className="text-lg font-bold text-green-800">Active</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 border border-blue-200 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-600">User Reports</p>
                  <p className="text-lg font-bold text-blue-800">Enabled</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportReasonSetting;