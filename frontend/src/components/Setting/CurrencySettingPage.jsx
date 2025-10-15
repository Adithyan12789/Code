/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openDialog } from '../../store/dialogueSlice';
import { deleteCurrency, getCurrency, handleDefaultCurrency } from '../../store/currencySlice';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { IconEdit, IconTrash, IconPlus } from '@tabler/icons-react';
import CurrencyDialogue from '../currency/CurrencyDialogue';

const CurrencySettingPage = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [data, setData] = useState([]);
  const { currency } = useSelector((state) => state.currency);
  const { dialogueType } = useSelector((state) => state.dialogue);

  useEffect(() => {
    setData(currency);
  }, [currency]);

  useEffect(() => {
    dispatch(getCurrency({ page: page, size: size }));
  }, [page, size]);

  const handleDeleteCurrency = (row) => {
    const confirmed = window.confirm('Are you sure you want to delete this currency?');
    if (confirmed) {
      dispatch(deleteCurrency(row?._id)).then((result) => {
        if (result?.payload?.status) {
          toast.success(result?.payload?.message);
          dispatch(getCurrency({ page: page, size: size }));
        } else {
          toast.error(result?.payload?.message);
        }
      }).catch((err) => {
        console.log(err);
        toast.error('Failed to delete currency');
      });
    }
  };

  const handleIsActive = (id) => {
    dispatch(handleDefaultCurrency(id)).then((res) => {
      if (res?.payload?.status) {
        toast.success(res?.payload?.message);
        dispatch(getCurrency({ page: page, size: size }));
      } else {
        toast.error(res?.payload?.message);
      }
    });
  };

  const currencyTable = [
    {
      Header: 'NO',
      body: 'no',
      Cell: ({ index }) => (
        <span className="text-red-700 font-medium">
          {(page - 1) * size + index + 1}
        </span>
      ),
    },
    {
      Header: 'Name',
      body: 'name',
      Cell: ({ row }) => (
        <span className="text-red-900 font-semibold capitalize">{row?.name}</span>
      ),
    },
    {
      Header: 'Symbol',
      body: 'symbol',
      Cell: ({ row }) => (
        <span className="text-red-800 font-medium text-lg">{row?.symbol}</span>
      ),
    },
    {
      Header: 'Currency Code',
      body: 'currencyCode',
      Cell: ({ row }) => (
        <span className="text-red-700 bg-red-50 px-3 py-1 rounded-full text-sm font-medium">
          {row?.currencyCode}
        </span>
      ),
    },
    {
      Header: 'Country Code',
      body: 'countryCode',
      Cell: ({ row }) => (
        <span className="text-blue-700 bg-blue-50 px-3 py-1 rounded-full text-sm font-medium">
          {row?.countryCode}
        </span>
      ),
    },
    {
      Header: 'Default',
      body: 'isActive',
      Cell: ({ row }) => (
        <div className="flex flex-col items-center">
          <button
            onClick={() => !row?.isDefault && handleIsActive(row?._id)}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out ${
              row?.isDefault ? 'bg-green-500 cursor-default' : 'bg-gray-300 hover:bg-gray-400'
            }`}
            disabled={row?.isDefault}
          >
            <span
              className={`inline-block w-4 h-4 transform bg-white rounded-full transition duration-200 ease-in-out ${
                row?.isDefault ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-xs mt-1 font-medium ${row?.isDefault ? 'text-green-600' : 'text-gray-500'}`}>
            {row?.isDefault ? 'Default' : 'Set Default'}
          </span>
        </div>
      ),
    },
    {
      Header: 'Created Date',
      body: 'createdAt',
      Cell: ({ row }) => (
        <span className="text-red-700 bg-red-50 px-3 py-1 rounded-full text-sm">
          {row?.createdAt ? dayjs(row?.createdAt).format('DD MMM YYYY') : ''}
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
                  type: 'currency',
                  data: row,
                })
              );
            }}
            className="p-2 text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            aria-label="Edit currency"
          >
            <IconEdit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteCurrency(row)}
            className="p-2 text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            aria-label="Delete currency"
          >
            <IconTrash className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      {dialogueType === "currency" && <CurrencyDialogue page={page} size={size} />}
      
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-red-600 to-rose-600 p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-white mb-2">
                    Currency Management
                  </h1>
                  <p className="text-red-100 text-opacity-90">
                    Manage and configure currencies for your application
                  </p>
                </div>
                <button
                  onClick={() => dispatch(openDialog({ type: "currency" }))}
                  className="flex items-center space-x-2 bg-white text-red-600 px-6 py-3 rounded-xl hover:bg-red-50 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
                >
                  <IconPlus className="w-5 h-5" />
                  <span>Add New Currency</span>
                </button>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="bg-white p-6 border-b border-red-100">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                  <div className="text-red-600 text-sm font-semibold">Total Currencies</div>
                  <div className="text-2xl font-bold text-red-800">{data?.length || 0}</div>
                </div>
                <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                  <div className="text-green-600 text-sm font-semibold">Default Currency</div>
                  <div className="text-2xl font-bold text-green-800">
                    {data?.filter(item => item?.isDefault)?.length || 0}
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                  <div className="text-blue-600 text-sm font-semibold">Active</div>
                  <div className="text-2xl font-bold text-blue-800">{data?.length || 0}</div>
                </div>
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                  <div className="text-amber-600 text-sm font-semibold">This Month</div>
                  <div className="text-2xl font-bold text-amber-800">
                    {data?.filter(item => dayjs(item?.createdAt).isSame(new Date(), 'month'))?.length || 0}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden">
            {!data || data.length === 0 ? (
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
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" 
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-red-800 mb-2">
                  No Currencies Found
                </h3>
                <p className="text-red-600 mb-6 max-w-md mx-auto">
                  There are no currencies configured yet. Start by adding your first currency to enable multi-currency support.
                </p>
                <button
                  onClick={() => dispatch(openDialog({ type: "currency" }))}
                  className="flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold mx-auto"
                >
                  <IconPlus className="w-5 h-5" />
                  <span>Add Your First Currency</span>
                </button>
              </div>
            ) : (
              // Table Content
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-red-50 to-rose-50">
                      <tr>
                        {currencyTable.map((column, index) => (
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
                      {data.map((row, rowIndex) => (
                        <tr key={row._id} className="hover:bg-red-50 transition-colors duration-150">
                          {currencyTable.map((column, colIndex) => (
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
                      Showing {((page - 1) * size) + 1} to {Math.min(page * size, data.length)} of {data.length} entries
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
                        disabled={page * size >= data.length}
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
        </div>
      </div>
    </>
  );
};

export default CurrencySettingPage;