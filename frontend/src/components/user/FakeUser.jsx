/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TrashIcon from "../../assets/icons/trashIcon.svg";
import EditIcon from "../../assets/icons/EditBtn.svg";
import Pagination from "../../extra/Pagination";
import Table from "../../extra/Table";
import Button from "../../extra/Button";
import Searching from "../../extra/Searching";
import { Add } from "lucide-react";
import Image from "next/image";
import { allUsers, blockUser, deleteUser } from "../../store/userSlice";
import { warning } from "../../util/Alert";
import { baseURL } from "@/util/config";
import { useRouter } from "next/router";
import useClearSessionStorageOnPopState from "../../extra/ClearStorage";

const FakeUser = ({ startDate, endDate, setMultiButtonSelect }) => {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [actionPagination, setActionPagination] = useState("delete");
  const [selectCheckData, setSelectCheckData] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [search, setSearch] = useState("");
  const { fakeUserData, totalFakeUser } = useSelector((state) => state.user);
  useClearSessionStorageOnPopState("multiButton");

  const router = useRouter();
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(fakeUserData);
  }, [fakeUserData]);

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setPage(1);
    setSize(value);
  };

  const handleEdit = (row, type) => {
    dispatch(openDialog({ type: type, data: row }));

    router.push({
      pathname: "/viewProfile",
      query: { id: row?._id },
    });

    localStorage.removeItem("multiButton");
    localStorage.setItem("postData", JSON.stringify(row));
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
    const selectCheckDataGetId = selectCheckData?.map((item) => item?._id);
    const isActiveData = fakeUserData?.filter((user) => {
      return (
        user.isBlock === false &&
        selectCheckData.some((ele) => ele._id === user._id)
      );
    });
    const deActiveData = fakeUserData?.filter((user) => {
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
    } else if (actionPagination === "delete") {
      const getIdFind = selectCheckDataGetId?.join(",");
      const data = warning();
      data
        .then((res) => {
          if (res) {
            const payload = {
              id: getIdFind,
            };
            dispatch(deleteUser(payload));
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const handleRedirect = (row) => {
    localStorage.setItem("postData", JSON.stringify(row));
    localStorage.removeItem("multiButton");
    router.push({
      pathname: "/viewProfile",
      query: { id: row?._id },
    });
  };

  const handleDeleteUser = (row) => {
    const data = warning();
    data
      .then((res) => {
        if (res) {
          const payload = {
            id: row?._id,
            data: row?.userName,
          };
          dispatch(deleteUser(payload));
        }
      })
      .catch((err) => console.log(err));
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
      Cell: ({ row, index }) => (
        <div
          className="flex items-center cursor-pointer group"
          onClick={() => handleRedirect(row)}
        >
          {row?.image && (
            <img 
              src={baseURL + row?.image} 
              alt={row?.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 group-hover:border-blue-500 transition-colors"
            />
          )}
          <span className="ml-3 text-gray-800 font-medium text-nowrap group-hover:text-blue-600 transition-colors">
            {row?.name}
          </span>
        </div>
      ),
    },
    {
      Header: "User name",
      body: "userName",
      Cell: ({ row }) => (
        <span className="text-gray-600 cursor-pointer hover:text-blue-600 transition-colors">
          {row?.userName}
        </span>
      ),
    },
    {
      Header: "ACTION",
      body: "action",
      Cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Button
            btnIcon={
              <img src={EditIcon.src} alt="Edit Icon" width={20} height={20} />
            }
            onClick={() => handleEdit(row, "manageUser")}
            newClass="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors duration-200"
          />
          <Button
            btnIcon={
              <img src={TrashIcon.src} alt="Trash Icon" width={20} height={20} />
            }
            onClick={() => handleDeleteUser(row)}
            newClass="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors duration-200"
          />
        </div>
      ),
    },
    {
      Header: "View",
      body: "View",
      Cell: ({ row }) => (
        <button
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 mx-auto group"
          onClick={() => handleRedirect(row)}
        >
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-600 group-hover:text-blue-600 transition-colors"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
          <span className="text-sm font-medium">View</span>
        </button>
      ),
    },
  ];

  useEffect(() => {
    const payload = {
      type: "fakeUser",
      start: page,
      limit: size,
      startDate,
      endDate,
    };
    dispatch(allUsers(payload));
  }, [startDate, endDate, page, size]);

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 overflow-hidden">
        {/* Header Section */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h5 className="text-xl font-semibold text-gray-900">
                User Table
              </h5>
              <p className="text-sm text-gray-600 mt-1">
                Manage fake users in the system
              </p>
            </div>
            <div className="flex items-center">
              <Button
                btnIcon={<Add className="w-5 h-5" />}
                btnName={"New User"}
                onClick={() => {
                  // dispatch(openDialog({ type: "fakeUser" }));
                }}
                newClass="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="px-6 py-4 border-b border-gray-200">
          <Searching
            label={"Search for ID, Keyword, Username"}
            placeholder={"Search..."}
            data={fakeUserData}
            type={"client"}
            setData={setData}
            onFilterData={handleFilterData}
            searchValue={search}
            actionPagination={actionPagination}
            setActionPagination={setActionPagination}
            paginationSubmitButton={paginationSubmitButton}
            actionShow={false}
            customSelectDataShow={true}
          />
        </div>

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
            userTotal={totalFakeUser}
            setPage={setPage}
            handleRowsPerPage={handleRowsPerPage}
            handlePageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default FakeUser;