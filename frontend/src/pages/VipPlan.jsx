/* eslint-disable react-hooks/exhaustive-deps */
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';
import { IconEdit } from '@tabler/icons-react';
import { Add } from '@mui/icons-material';
import { getVipPlan, handleIsActiveVipCoin } from '../store/vipPlanSlice';
import { openDialog } from '../store/dialogueSlice';
import VipPlanDialogue from '../components/vipPlan/VipPlanDialogue';
import { RootLayout } from '../components/layout/Layout'; 
import Table from '../extra/Table';
import Pagination from '../extra/Pagination';
import ToggleSwitch from '../extra/ToggleSwitch';

const VipPlan = () => {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const { dialogueType } = useSelector((state) => state.dialogue);
  const [data, setData] = useState([]);
  const { vipPlan } = useSelector((state) => state.vipPlan);
  
  const dispatch = useDispatch();

  useEffect(() => {
    setData(vipPlan);
  }, [vipPlan]);

  useEffect(() => {
    dispatch(getVipPlan({ page, size }));
  }, [page, size]);

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setPage(1);
    setSize(value);
  };

  const handleIsActive = (row) => {
    dispatch(handleIsActiveVipCoin(row?._id)).then((res) => {
      if (res?.payload?.status) {
        toast.success(res?.payload?.message);
        dispatch(getVipPlan({ page, size }));
      } else {
        toast.error(res?.payload?.message);
      }
    });
  };

  const vipPlanTable = [
    {
      Header: "No",
      body: "no",
      Cell: ({ index }) => (
        <span className="text-nowrap">
          {(page - 1) * size + parseInt(index) + 1}
        </span>
      ),
    },
    {
      Header: "Product Key",
      body: "productKey",
      Cell: ({ row }) => (
        <span className="text-nowrap">{row?.productKey}</span>
      ),
    },
    {
      Header: "Tags",
      body: "tags",
      Cell: ({ row }) => <span className="text-nowrap">{row?.tags}</span>,
    },
    {
      Header: "Price",
      body: "price",
      Cell: ({ row }) => <span className="text-nowrap">${row?.price}</span>,
    },
    {
      Header: "Offer Price",
      body: "offerPrice",
      Cell: ({ row }) => (
        <span className="text-nowrap">${row?.offerPrice}</span>
      ),
    },
    {
      Header: "Validity",
      body: "validity",
      Cell: ({ row }) => <span className="text-nowrap">{row?.validity}</span>,
    },
    {
      Header: "Validity Type",
      body: "validityType",
      Cell: ({ row }) => (
        <span className="text-nowrap">{row?.validityType}</span>
      ),
    },
    {
      Header: "Date",
      body: "createdAt",
      Cell: ({ row }) => (
        <span className="text-nowrap">
          {moment(row?.createdAt).format("DD/MM/YYYY")}
        </span>
      ),
    },
    {
      Header: "Active",
      body: "isActive",
      Cell: ({ row }) => (
        <ToggleSwitch
          value={row?.isActive}
          onChange={() => handleIsActive(row)}
          className="bg-red-50"
        />
      ),
    },
    {
      Header: "Action",
      body: "action",
      Cell: ({ row }) => (
        <div className="flex justify-center">
          <button
            onClick={() => {
              dispatch(
                openDialog({
                  type: "coinPlan",
                  data: row,
                })
              );
            }}
            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
            aria-label="Edit VIP plan"
          >
            <IconEdit className="w-5 h-5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <RootLayout>
      <div className="min-h-screen bg-red-50 p-6">
        {dialogueType === "coinPlan" && (
          <VipPlanDialogue page={page} size={size} />
        )}
        
        <div className="bg-white rounded-lg shadow-sm border border-red-200">
          <div className="p-6 border-b border-red-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex-1">
                <h5 className="text-xl font-semibold text-red-900">
                  VIP Plan
                </h5>
                <p className="text-sm text-red-600 mt-1">
                  Manage VIP subscription plans
                </p>
              </div>
              <div className="flex justify-end w-full sm:w-auto">
                <button
                  onClick={() => {
                    dispatch(openDialog({ type: "coinPlan" }));
                  }}
                  className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-sm"
                >
                  <Add className="w-5 h-5" />
                  <span>New Plan</span>
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="overflow-x-auto">
              <Table
                data={data}
                mapData={vipPlanTable}
                serverPerPage={size}
                serverPage={page}
                type={"server"}
              />
            </div>
            
            <div className="mt-6">
              <Pagination
                type={"server"}
                activePage={page}
                rowsPerPage={size}
                setPage={setPage}
                handleRowsPerPage={handleRowsPerPage}
                handlePageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  );
};

export default VipPlan;