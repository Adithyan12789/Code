/* eslint-disable react-hooks/exhaustive-deps */
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';
import { IconEdit } from '@tabler/icons-react';
import { Add } from '@mui/icons-material';
import { getCoinPlan, handleIsActiveCoin } from '../store/coinPlanSlice';
import { openDialog } from '../store/dialogueSlice';
import CoinPlanDialogue from '../components/coinPlan/CoinPlanDialogue';
import { RootLayout } from '../components/layout/Layout';
import Table from '../extra/Table';
import Pagination from '../extra/Pagination';
import ToggleSwitch from '../extra/ToggleSwitch';

const CoinPlan = () => {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const { dialogueType } = useSelector((state) => state.dialogue);
  const [data, setData] = useState([]);
  const { coinPlan } = useSelector((state) => state.coinPlan);
  
  const dispatch = useDispatch();

  useEffect(() => {
    setData(coinPlan);
  }, [coinPlan]);

  useEffect(() => {
    dispatch(getCoinPlan({ page, size }));
  }, [page, size]);

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setPage(1);
    setSize(value);
  };

  const handleIsActive = (row) => {
    dispatch(handleIsActiveCoin(row?._id)).then((res) => {
      if (res?.payload?.status) {
        toast.success(res?.payload?.message);
        dispatch(getCoinPlan({ page, size }));
      } else {
        toast.error(res?.payload?.message);
      }
    });
  };

  const coinPlanTable = [
    {
      Header: 'No',
      body: 'no',
      Cell: ({ index }) => (
        <span className="text-nowrap text-red-800 font-medium">
          {(page - 1) * size + parseInt(index) + 1}
        </span>
      ),
    },
    {
      Header: 'Product Key',
      body: 'productKey',
      Cell: ({ row }) => (
        <span className="text-nowrap text-red-900 font-semibold bg-red-50 px-3 py-1 rounded-full text-sm">
          {row?.productKey}
        </span>
      ),
    },
    {
      Header: 'Price',
      body: 'price',
      Cell: ({ row }) => (
        <span className="text-nowrap text-red-700 font-bold">${row?.price}</span>
      ),
    },
    {
      Header: 'Offer Price',
      body: 'offerPrice',
      Cell: ({ row }) => (
        <span className="text-nowrap text-amber-600 font-bold">
          ${row?.offerPrice}
        </span>
      ),
    },
    {
      Header: 'Coin',
      body: 'coin',
      Cell: ({ row }) => (
        <span className="text-nowrap text-red-800 font-semibold bg-amber-50 px-3 py-1 rounded-full">
          {row?.coin}
        </span>
      ),
    },
    {
      Header: 'Bonus Coin',
      body: 'bonusCoin',
      Cell: ({ row }) => (
        <span className="text-nowrap text-green-700 font-semibold bg-green-50 px-3 py-1 rounded-full">
          +{row?.bonusCoin}
        </span>
      ),
    },
    {
      Header: 'Date',
      body: 'createdAt',
      Cell: ({ row }) => (
        <span className="text-nowrap text-red-700 bg-red-50 px-3 py-1 rounded-full text-sm">
          {moment(row?.createdAt).format('DD/MM/YYYY')}
        </span>
      ),
    },
    {
      Header: 'Status',
      body: 'isActive',
      Cell: ({ row }) => (
        <div className="flex flex-col items-center">
          <ToggleSwitch
            value={row?.isActive}
            onChange={() => handleIsActive(row)}
          />
          <span className={`text-xs mt-1 font-medium ${row?.isActive ? 'text-green-600' : 'text-red-600'}`}>
            {row?.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
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
                  type: 'coinPlan',
                  data: row,
                })
              );
            }}
            className="p-2 text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            aria-label="Edit coin plan"
          >
            <IconEdit className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <RootLayout>
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 p-6">
        {dialogueType === 'coinPlan' && (
          <CoinPlanDialogue page={page} size={size} />
        )}
        
        <div className="bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-red-600 to-rose-600 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex-1">
                <h5 className="text-2xl font-bold text-white mb-2">
                  Coin Plans
                </h5>
                <p className="text-red-100 text-opacity-90">
                  Manage your coin plans, pricing, and special offers
                </p>
              </div>
              <div className="flex justify-end w-full sm:w-auto">
                <button
                  onClick={() => {
                    dispatch(openDialog({ type: "coinPlan" }));
                  }}
                  className="flex items-center space-x-3 bg-white text-red-600 px-6 py-3 rounded-xl hover:bg-red-50 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold transform hover:scale-105"
                >
                  <Add className="w-5 h-5" />
                  <span>Create New Plan</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="bg-white p-6 border-b border-red-100">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                <div className="text-red-600 text-sm font-semibold">Total Plans</div>
                <div className="text-2xl font-bold text-red-800 mt-1">{data?.length || 0}</div>
              </div>
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                <div className="text-amber-600 text-sm font-semibold">Active Plans</div>
                <div className="text-2xl font-bold text-amber-800 mt-1">
                  {data?.filter(item => item?.isActive)?.length || 0}
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                <div className="text-green-600 text-sm font-semibold">Featured</div>
                <div className="text-2xl font-bold text-green-800 mt-1">
                  {data?.filter(item => item?.bonusCoin > 0)?.length || 0}
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <div className="text-blue-600 text-sm font-semibold">This Month</div>
                <div className="text-2xl font-bold text-blue-800 mt-1">
                  {data?.filter(item => moment(item?.createdAt).isSame(new Date(), 'month'))?.length || 0}
                </div>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="p-6">
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
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-red-800 mb-2">
                  No Coin Plans Found
                </h3>
                <p className="text-red-600 mb-6 max-w-md mx-auto">
                  There are no coin plans available at the moment. Start by creating your first coin plan to offer coins to your users.
                </p>
                <button
                  onClick={() => {
                    dispatch(openDialog({ type: "coinPlan" }));
                  }}
                  className="flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold mx-auto"
                >
                  <Add className="w-5 h-5" />
                  <span>Create Your First Plan</span>
                </button>
              </div>
            ) : (
              // Data Table
              <>
                <div className="overflow-x-auto rounded-xl border border-red-100">
                  <Table
                    data={data}
                    mapData={coinPlanTable}
                    serverPerPage={size}
                    serverPage={page}
                    type={"server"}
                  />
                </div>
                
                {/* Pagination */}
                <div className="mt-6 bg-red-50 rounded-xl p-4 border border-red-100">
                  <Pagination
                    type={"server"}
                    activePage={page}
                    rowsPerPage={size}
                    setPage={setPage}
                    handleRowsPerPage={handleRowsPerPage}
                    handlePageChange={handlePageChange}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </RootLayout>
  );
};

export default CoinPlan;