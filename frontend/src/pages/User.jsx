/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useMemo, useState } from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IconEdit, IconEye, IconHistory } from "@tabler/icons-react";
import { openDialog } from "../store/dialogueSlice";
import { blockUser, getAllUsers } from "../store/userSlice";
import Button from "../extra/Button";
import ToggleSwitch from "../extra/ToggleSwitch";
import Pagination from "../extra/Pagination";
import Table from "../extra/Table";
import defaultImage from "../assets/images/defaultImage.png";
import UserDialogue from "../components/user/UserDialogue";
import { RootLayout } from "../components/layout/Layout";
import { formatUserTableDate } from "../extra/DateFormatter";

const UserTable = () => {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("All");
  const [endDate, setEndDate] = useState("All");
  const [blockedUsers, setBlockedUsers] = useState(new Set()); // Track blocked users

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { dialogueType } = useSelector((state) => state.dialogue);
  const { realUserData, totalRealUser, blockStatus } = useSelector((state) => state.users);

  // Fetch users when page, size, dates change or when block status updates
  useEffect(() => {
    dispatch(getAllUsers({ startDate, endDate, page, size, search: "All" }));
  }, [dispatch, page, startDate, endDate, size, blockStatus]); // Added blockStatus dependency

  // Update local data when realUserData changes
  useEffect(() => {
    setData(realUserData);
  }, [realUserData]);

  // Handle block status changes dynamically
  useEffect(() => {
    if (blockStatus && blockStatus.userId) {
      setBlockedUsers(prev => {
        const newBlockedUsers = new Set(prev);
        if (blockStatus.isBlocked) {
          newBlockedUsers.add(blockStatus.userId);
        } else {
          newBlockedUsers.delete(blockStatus.userId);
        }
        return newBlockedUsers;
      });

      // Optional: Refresh the data to get updated user list
      dispatch(getAllUsers({ startDate, endDate, page, size, search: "All" }));
    }
  }, [blockStatus, dispatch]);

  const handlePageChange = (pageNumber) => setPage(pageNumber);
  
  const handleRowsPerPage = (value) => {
    setPage(1);
    setSize(value);
  };

  const handleRedirect = (id) => {
    console.log("Redirecting with user ID:", id);
    navigate(`/viewProfile/${id}`);
  };

  const handleRedirectHistory = (id) => {
    console.log("Redirecting to history with user ID:", id);
    navigate(`/viewProfileHistory/${id}`);
  };

  const handleIsActive = (row) => {
    dispatch(blockUser(row?._id));
  };

  const handleSearch = (event) => {
    if (event.key === "Enter") {
      const searchValue = search.trim().toLowerCase();
      dispatch(
        getAllUsers({
          startDate,
          endDate,
          page,
          size,
          search: searchValue || "All",
        })
      );
    }
  };

  // Enhanced ManageUserData with dynamic block status
  const ManageUserData = useMemo(
    () => [
      {
        Header: "No",
        body: "no",
        Cell: ({ index }) => (
          <span>{(page - 1) * size + parseInt(index) + 1}</span>
        ),
      },
      {
        Header: "User Name",
        body: "userName",
        Cell: ({ row }) => (
          <div className="flex items-center space-x-3">
            <img
              src={row?.profilePic || defaultImage}
              alt="user"
              className="w-10 h-10 rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.src = defaultImage;
              }}
            />
            <span className="capitalize font-medium">{row?.name || "-"}</span>
          </div>
        ),
      },
      {
        Header: "Unique Id",
        body: "uniqueId",
        Cell: ({ row }) => <span>{row?.uniqueId || "-"}</span>,
      },
      {
        Header: "Coins",
        body: "coins",
        Cell: ({ row }) => <span>{row?.coin || "-"}</span>,
      },
      {
        Header: "Plan",
        body: "plan",
        Cell: ({ row }) => (
          <span
            className={`${
              row?.isVipPlan ? "text-yellow-500" : "text-gray-400"
            } font-semibold`}
          >
            {row?.isVipPlan ? "VIP" : "Free"}
          </span>
        ),
      },
      {
        Header: "Date",
        body: "date",
        Cell: ({ row }) => <span>{formatUserTableDate(row?.date)}</span>,
      },
      {
        Header: "Block",
        body: "isActive",
        Cell: ({ row }) => {
          // Use blockedUsers state for real-time updates
          const isCurrentlyBlocked = blockedUsers.has(row?._id) || row?.isBlock;
          
          return (
            <ToggleSwitch
              value={isCurrentlyBlocked}
              onChange={() => handleIsActive(row)}
            />
          );
        },
      },
      {
        Header: "Action",
        body: "action",
        Cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              btnIcon={<IconEdit className="text-blue-500" />}
              onClick={() =>
                dispatch(
                  openDialog({
                    type: "manageUsers",
                    data: row,
                  })
                )
              }
            />
            <Button
              btnIcon={<IconEye className="text-green-500" />}
              onClick={() => handleRedirect(row?._id)}
            />
            <Button
              btnIcon={<IconHistory className="text-purple-500" />}
              onClick={() => handleRedirectHistory(row?._id)}
            />
          </div>
        ),
      },
    ],
    [page, size, blockedUsers] // Added blockedUsers dependency
  );

  return (
    <RootLayout>
      {dialogueType === "manageUsers" && (
        <UserDialogue
          startDate={startDate}
          endDate={endDate}
          page={page}
          size={size}
        />
      )}

      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-5 gap-4">
          <h2 className="text-2xl font-semibold text-gray-800">Real Users</h2>

          <input
            type="text"
            placeholder="Search here..."
            className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-80 focus:ring-2 focus:ring-blue-500 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={handleSearch}
          />
        </div>

        <div className="bg-white shadow-md rounded-2xl overflow-hidden">
          <Table
            data={data}
            mapData={ManageUserData}
            serverPerPage={size}
            serverPage={page}
            type="server"
          />
          <div className="p-4 border-t border-gray-200">
            <Pagination
              type="server"
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
    </RootLayout>
  );
};

export default UserTable;