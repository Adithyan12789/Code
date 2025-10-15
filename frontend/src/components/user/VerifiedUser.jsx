/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import Pagination from "../../extra/Pagination";
import Searching from "../../extra/Searching";
import Table from "../../extra/Table";
import ToggleSwitch from "../../extra/ToggleSwitch";
import { allUsers, blockUser, blockVerifiedUser } from "../../store/userSlice";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Verified from "../../assets/icons/VerifyIcon.svg";
import { baseURL } from "../../util/config";
import useClearSessionStorageOnPopState from "../../extra/ClearStorage";
import { useRouter } from "next/router";
import { Eye, User, Check, ShieldCheck } from "lucide-react";

const VerifiedUser = (props) => {
  useClearSessionStorageOnPopState("multiButton");
  const { startDate, endDate } = props;
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [actionPagination, setActionPagination] = useState("block");
  const [selectCheckData, setSelectCheckData] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [search, setSearch] = useState();
  const { verifiedUserData, totalRealUser } = useSelector(
    (state) => state.user
  );

  const [data, setData] = useState();
  const [showURLs, setShowURLs] = useState([]);
  
  useEffect(() => {
    const payload = {
      type: "verifiedUser",
      start: page,
      limit: size,
      startDate,
      endDate,
    };
    dispatch(allUsers(payload));
  }, [dispatch, startDate, endDate, page, size]);

  useEffect(() => {
    setData(verifiedUserData);
  }, [verifiedUserData]);

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setPage(1);
    setSize(value);
  };

  const handleEdit = (row, type) => {
    router.push({
      pathname: "/viewProfile",
      query: { id: row?._id },
    });

    localStorage.setItem("postData", JSON.stringify(row));
    localStorage.removeItem("multiButton");
  };

  const handleSelectCheckData = (e, row) => {
    const checked = e.target.checked;
    if (checked) {
      setSelectCheckData((prevSelectedRows) => [...prevSelectedRows, row]);
    } else {
      setSelectCheckData((prevSelectedRows) =>
        prevSelectedRows.filter((selectedRow) => selectedRow._id !== row._id)
      );
    }
  };

  const handleSelectAll = (event) => {
    const checked = event.target.checked;
    
    setSelectAllChecked(checked);
    if (checked) {
      setSelectCheckData([...data]);
    } else {
      setSelectCheckData([]);
    }
  };

  const paginationSubmitButton = () => {
    const isActiveData = verifiedUserData?.filter((user) => {
      return (
        user.isBlock === false &&
        selectCheckData.some((ele) => ele._id === user._id)
      );
    });
    const deActiveData = verifiedUserData?.filter((user) => {
      return (
        user.isBlock === true &&
        selectCheckData.some((ele) => ele._id === user._id)
      );
    });
    const getId = isActiveData?.map((item) => item?._id);
    const getId_ = deActiveData?.map((item) => item?._id);
    if (actionPagination === "block") {
      const data = true;
      const payload = {
        id: getId,
        data: data,
      };
      dispatch(blockUser(payload));
    } else if (actionPagination === "unblock") {
      const data = false;
      const payload = {
        id: getId_,
        data: data,
      };
      dispatch(blockUser(payload));
    }
  };

  const handleRedirect = (row) => {
    localStorage.setItem("postData", JSON.stringify(row));
    router.push({
      pathname: "/viewProfile",
      query: { id: row?._id },
    });
  };

  const handleIsActive = (row) => {
    const id = row?._id;
    const data = row?.isBlock === false ? true : false;

    const payload = { id, data };
    dispatch(blockVerifiedUser(payload));
  };

  const handleFilterData = (filteredData) => {
    if (typeof filteredData === "string") {
      setSearch(filteredData);
    } else {
      setData(filteredData);
    }
  };

  const ManageUserData = [
    {
      Header: (
        <input
          type="checkbox"
          checked={selectAllChecked}
          onChange={handleSelectAll}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
        />
      ),
      width: "20px",
      Cell: ({ row }) => (
        <input
          type="checkbox"
          checked={selectCheckData.some(
            (selectedRow) => selectedRow?._id === row?._id
          )}
          onChange={(e) => handleSelectCheckData(e, row)}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
        />
      ),
    },
    {
      Header: "NO",
      body: "no",
      Cell: ({ index }) => (
        <span className="text-nowrap text-gray-700 font-medium">
          {(page - 1) * size + parseInt(index) + 1}
        </span>
      ),
    },
    {
      Header: "Unique id",
      body: "id",
      Cell: ({ row }) => (
        <span className="text-gray-600 font-medium cursor-pointer hover:text-blue-600 transition-colors">
          {row?.uniqueId}
        </span>
      ),
    },
    {
      Header: "User",
      body: "name",
      Cell: ({ row }) => (
        <div
          className="flex items-center cursor-pointer group"
          onClick={() => handleEdit(row, "manageUser")}
        >
          {row?.image ? (
            <img 
              src={baseURL + row?.image} 
              alt={row?.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 group-hover:border-blue-500 transition-colors"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-200 group-hover:border-blue-500 transition-colors">
              <User className="w-6 h-6 text-gray-400" />
            </div>
          )}
          <div className="ml-3 flex items-center space-x-2">
            <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-nowrap">
              {row?.name}
            </span>
            <img
              src={Verified.src}
              alt="Verified"
              className="w-5 h-5"
            />
          </div>
        </div>
      ),
    },
    {
      Header: "User name",
      body: "userName",
      Cell: ({ row }) => (
        <span className="text-gray-600 cursor-pointer hover:text-blue-600 transition-colors">
          @{row?.userName}
        </span>
      ),
    },
    {
      Header: "Status",
      body: "isActive",
      Cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <ToggleSwitch
            value={row?.isBlock}
            onChange={() => handleIsActive(row)}
          />
          <span className={`text-sm font-medium px-2 py-1 rounded-full ${
            row?.isBlock 
              ? 'bg-red-100 text-red-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {row?.isBlock ? 'Blocked' : 'Active'}
          </span>
        </div>
      ),
    },
    {
      Header: "Action",
      body: "Action",
      Cell: ({ row }) => (
        <button
          className="flex items-center space-x-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors duration-200 group mx-auto"
          onClick={() => handleRedirect(row)}
        >
          <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium">View</span>
        </button>
      ),
    },
  ];

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 overflow-hidden">
        {/* Header Section */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-3 mb-4 sm:mb-0">
              <div className="p-2 bg-green-100 rounded-lg">
                <ShieldCheck className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h5 className="text-xl font-semibold text-gray-900">
                  Verified Users
                </h5>
                <p className="text-sm text-gray-600 mt-1">
                  Manage verified user accounts with special privileges
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Active</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-600">Blocked</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="px-6 py-4 border-b border-gray-200">
          <Searching
            label={"Search for ID, Keyword, Username"}
            placeholder={"Search verified users..."}
            data={verifiedUserData}
            type={"client"}
            setData={setData}
            onFilterData={handleFilterData}
            searchValue={search}
            actionPagination={actionPagination}
            setActionPagination={setActionPagination}
            paginationSubmitButton={paginationSubmitButton}
            actionPaginationDataCustom={["Block", "Unblock"]}
          />
        </div>

        {/* Selected Actions */}
        {selectCheckData.length > 0 && (
          <div className="px-6 py-3 bg-blue-50 border-b border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  {selectCheckData.length} verified user(s) selected
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={paginationSubmitButton}
                  className={`px-3 py-1 text-sm font-medium rounded transition-colors duration-200 ${
                    actionPagination === "block"
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {actionPagination === "block" ? "Block Selected" : "Unblock Selected"}
                </button>
                <button
                  onClick={() => {
                    setSelectCheckData([]);
                    setSelectAllChecked(false);
                  }}
                  className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium rounded transition-colors duration-200"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Table Section */}
        <div className="overflow-x-auto">
          <Table
            data={data}
            mapData={ManageUserData}
            serverPerPage={size}
            serverPage={page}
            handleSelectAll={handleSelectAll}
            selectAllChecked={selectAllChecked}
            type={"server"}
          />
        </div>

        {/* Pagination Section */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <Pagination
            type={"server"}
            activePage={page}
            rowsPerPage={size}
            userTotal={totalRealUser}
            setPage={setPage}
            handleRowsPerPage={handleRowsPerPage}
            handlePageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default VerifiedUser;