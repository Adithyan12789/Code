/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NewTitle from "../../extra/Title";
import Table from "../../extra/Table";
import Pagination from "../../extra/Pagination";
import moment from "moment";
import { getAllVipPlan, getUserWiseVipPlan } from "../../store/vipPlanSlice";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const VipPlanUserHistory = ({ startDate, endDate }) => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);

  const { userId } = useParams();

  const [size, setSize] = useState(20);
  const { userVipPlan } = useSelector((state) => state.vipPlan);

  useEffect(() => {
    setData(userVipPlan);
  }, [userVipPlan]);

  useEffect(() => {
    if (userId) {
      dispatch(getUserWiseVipPlan({ startDate, endDate, page, size, userId }));
    }
  }, [startDate, page, userId]);

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setPage(1);
    setSize(value);
  };

  const coinPlanTable = [
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
      Header: "Unique Id",
      body: "uniqueId",
      Cell: ({ row }) => (
        <span className="text-nowrap">{row?.uniqueId || "-"}</span>
      ),
    },
    {
      Header: "Username",
      body: "username",
      Cell: ({ row }) => (
        <span className="text-nowrap">{row?.username || "-"}</span>
      ),
    },
    {
      Header: "Name",
      body: "name",
      Cell: ({ row }) => (
        <span className="text-nowrap">{row?.name || "-"}</span>
      ),
    },
    {
      Header: "Payment Gateway",
      body: "paymentGateway",
      Cell: ({ row }) => (
        <span className="text-nowrap">{row?.paymentGateway || "-"}</span>
      ),
    },
    {
      Header: "Price",
      body: "price",
      Cell: ({ row }) => <span className="text-nowrap">{row?.price}</span>,
    },
    {
      Header: "Offer Price",
      body: "offerPrice",
      Cell: ({ row }) => <span className="text-nowrap">{row?.offerPrice}</span>,
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
  ];

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h5 className="text-xl font-medium text-gray-900">
            VIP Plan History
          </h5>
        </div>

        <div className="p-6">
          <Table
            data={data}
            mapData={coinPlanTable}
            serverPerPage={size}
            serverPage={page}
            type={"server"}
          />

          <div className="mt-4">
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
  );
};

export default VipPlanUserHistory;
