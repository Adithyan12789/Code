/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  deleteNewsCategory,
  newsCategoryActive,
  getNewsCategory,
} from "../store/newsCategorySlice";
import moment from "moment";
import { openDialog } from "../store/dialogueSlice";
import NewsCategoryDialogue from "../components/newsCategory/NewsCategoryDialogue";
import { warning } from "../util/Alert";
import { toast } from "react-toastify";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { RootLayout } from "../components/layout/Layout";

const NewsCategory = () => {
  const dispatch = useDispatch();
  const { dialogueType } = useSelector((state) => state.dialogue);

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [data, setData] = useState([]);

  useEffect(() => {
    dispatch(getNewsCategory({ page, size }));
  }, [page, size]);

  const { newsCategory, total } = useSelector((state) => state.newsCategory);
  
  useEffect(() => {
    setData(newsCategory);
  }, [newsCategory]);

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setPage(1);
    setSize(value);
  };

  const handleDeleteNewsCategory = (row) => {
    const data = warning();
    data
      .then((res) => {
        if (res) {
          const id = row?._id;
          dispatch(deleteNewsCategory(id)).then((res) => {
            if (res?.payload?.status) {
              toast.success(res?.payload?.message);
              dispatch(getNewsCategory({ page, size }));
            }
          });
        }
      })
      .catch((err) => console.log(err));
  };

  const handleIsActive = (row) => {
    dispatch(newsCategoryActive(row?._id)).then((res) => {
      if (res?.payload?.status) {
        toast.success(res?.payload?.message);
        dispatch(getNewsCategory({ page, size }));
      } else {
        toast.error(res?.payload?.message);
      }
    });
  };

  // Table header configuration
  const newsCategoryTable = [
    {
      Header: "NO",
      accessor: "no",
      Cell: ({ row, index }) => (
        <span className="text-nowrap">
          {(page - 1) * size + parseInt(index) + 1}
        </span>
      ),
    },
    {
      Header: "Unique Id",
      accessor: "uniqueId",
      Cell: ({ row }) => (
        <span className="text-capitalize cursor-pointer">
          {row?.uniqueId || "-"}
        </span>
      ),
    },
    {
      Header: "Category Name",
      accessor: "name",
      Cell: ({ row }) => (
        <span className="text-capitalize cursor-pointer text-nowrap pl-2.5">
          {row?.name || "-"}
        </span>
      ),
    },
    {
      Header: "Total News",
      accessor: "totalMovies",
      Cell: ({ row }) => (
        <span className="text-lowercase cursor-pointer">
          {row?.totalMovies === 0 ? 0 : row?.totalMovies || "-"}
        </span>
      ),
    },
    {
      Header: "Date",
      accessor: "date",
      Cell: ({ row }) => (
        <span className="text-capitalize cursor-pointer">
          {moment(row?.date).format("DD/MM/YYYY") || "-"}
        </span>
      ),
    },
    {
      Header: "Active",
      accessor: "isActive",
      Cell: ({ row }) => (
        <ToggleSwitch
          value={row?.isActive}
          onChange={() => handleIsActive(row)}
        />
      ),
    },
    {
      Header: "Action",
      accessor: "action",
      Cell: ({ row }) => (
        <div className="flex space-x-2">
          <button
            onClick={() => {
              dispatch(
                openDialog({
                  type: "newsCategory",
                  data: row,
                })
              );
            }}
            className="p-1 text-gray-600 hover:text-red-600 transition-colors"
          >
            <IconEdit className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleDeleteNewsCategory(row)}
            className="p-1 text-gray-600 hover:text-red-600 transition-colors"
          >
            <IconTrash className="w-5 h-5" />
          </button>
        </div>
      ),
    },
  ];

  // Custom ToggleSwitch component with red theme
  const ToggleSwitch = ({ value, onChange }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        value ? "bg-red-600" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          value ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );

  // Custom Button component with red theme
  const Button = ({ onClick, btnIcon, btnName, className = "" }) => (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors ${className}`}
    >
      {btnIcon}
      {btnName && <span>{btnName}</span>}
    </button>
  );

  // Custom Table component
  const Table = ({ data, mapData, serverPerPage, serverPage, type }) => (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-red-50">
          <tr>
            {mapData.map((column, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider"
              >
                {column.Header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr key={row._id || rowIndex} className="hover:bg-red-50">
              {mapData.map((column, colIndex) => (
                <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-gray-900">
                  {column.Cell ? (
                    <column.Cell row={row} index={rowIndex} />
                  ) : (
                    <span>{row[column.accessor]}</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Custom Pagination component with red theme
  const Pagination = ({
    activePage,
    rowsPerPage,
    userTotal,
    setPage,
    handleRowsPerPage,
    handlePageChange,
  }) => {
    const totalPages = Math.ceil(userTotal / rowsPerPage);
    const visiblePages = 5; // Number of visible page buttons
    const startPage = Math.max(1, activePage - Math.floor(visiblePages / 2));
    const endPage = Math.min(totalPages, startPage + visiblePages - 1);

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between mt-4 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => handleRowsPerPage(Number(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={() => handlePageChange(activePage - 1)}
            disabled={activePage === 1}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          
          {startPage > 1 && (
            <>
              <button
                onClick={() => handlePageChange(1)}
                className="px-3 py-1 border border-gray-300 rounded hover:bg-red-50 transition-colors"
              >
                1
              </button>
              {startPage > 2 && <span className="px-2">...</span>}
            </>
          )}
          
          {pageNumbers.map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`px-3 py-1 border rounded transition-colors ${
                activePage === pageNum
                  ? "bg-red-600 text-white border-red-600"
                  : "border-gray-300 hover:bg-red-50"
              }`}
            >
              {pageNum}
            </button>
          ))}
          
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="px-2">...</span>}
              <button
                onClick={() => handlePageChange(totalPages)}
                className="px-3 py-1 border border-gray-300 rounded hover:bg-red-50 transition-colors"
              >
                {totalPages}
              </button>
            </>
          )}
          
          <button
            onClick={() => handlePageChange(activePage + 1)}
            disabled={activePage === totalPages}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
        
        <div className="text-sm text-gray-700">
          Page {activePage} of {totalPages} ({userTotal} total items)
        </div>
      </div>
    );
  };

  return (
    <RootLayout>
      {dialogueType === "newsCategory" && (
        <NewsCategoryDialogue page={page} size={size} />
      )}
      
      <div className="min-h-screen bg-gray-50 p-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-red-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h5 className="text-xl font-semibold text-gray-900 border-l-4 border-red-600 pl-3">
                  News Category
                </h5>
                <p className="text-sm text-gray-600 mt-1">
                  Manage your news categories and their status
                </p>
              </div>
              <div className="flex justify-end">
                <Button
                  btnIcon={<PlusIcon className="w-5 h-5" />}
                  btnName="New Category"
                  onClick={() => {
                    dispatch(openDialog({ type: "newsCategory" }));
                  }}
                />
              </div>
            </div>

            {data.length > 0 ? (
              <>
                <Table
                  data={data}
                  mapData={newsCategoryTable}
                  serverPerPage={size}
                  serverPage={page}
                  type="server"
                />
                
                <Pagination
                  type="server"
                  activePage={page}
                  rowsPerPage={size}
                  userTotal={total}
                  setPage={setPage}
                  handleRowsPerPage={handleRowsPerPage}
                  handlePageChange={handlePageChange}
                />
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <PlusIcon className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No news categories found
                </h3>
                <p className="text-gray-600 mb-4">
                  Get started by creating your first news category.
                </p>
                <Button
                  btnIcon={<PlusIcon className="w-4 h-4" />}
                  btnName="Create New Category"
                  onClick={() => {
                    dispatch(openDialog({ type: "newsCategory" }));
                  }}
                />
              </div>
            )}
          </div>
      </div>
    </RootLayout>
  );
};

export default NewsCategory;