/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getNewsList } from "../store/newsListSlice";
import { openDialog } from "../store/dialogueSlice";
import NewsListDialogue from "../components/newList/NewsListDialogue";
import moment from "moment";
import { warning } from "../util/Alert";
import { deleteShortVideo } from "../store/newsChannelListSlice";
import Hls from "hls.js";
import {
  IconEdit,
  IconLockFilled,
  IconLockOpen,
  IconTrash,
  IconVideoOff,
} from "@tabler/icons-react";
import { RootLayout } from "../components/layout/Layout";

// Move Button component outside
const Button = ({ btnIcon, btnName, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${className}`}
  >
    {btnIcon}
    {btnName && <span>{btnName}</span>}
  </button>
);

// Move Table component outside
const Table = ({ data, columns, serverPerPage, serverPage, type }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.Header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr key={row._id} className="hover:bg-gray-50">
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                  {column.Cell ? (
                    column.Cell({ row, index: rowIndex })
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
};

// Move Pagination component outside
const Pagination = ({
  activePage,
  rowsPerPage,
  userTotal,
  setPage,
  handleRowsPerPage,
  handlePageChange,
}) => {
  const totalPages = Math.ceil(userTotal / rowsPerPage);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-between mt-4">
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-700">
          Showing {(activePage - 1) * rowsPerPage + 1} to{" "}
          {Math.min(activePage * rowsPerPage, userTotal)} of {userTotal} entries
        </span>
        <select
          value={rowsPerPage}
          onChange={(e) => handleRowsPerPage(Number(e.target.value))}
          className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
      <div className="flex gap-1">
        <button
          onClick={() => handlePageChange(activePage - 1)}
          disabled={activePage === 1}
          className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Previous
        </button>
        {pages.map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => handlePageChange(pageNum)}
            className={`px-3 py-1 border rounded-md ${
              activePage === pageNum
                ? "bg-blue-600 text-white border-blue-600"
                : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            {pageNum}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(activePage + 1)}
          disabled={activePage === totalPages}
          className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

// Video Player Component
// Video Component to avoid JSX issues
const VideoCell = ({ row }) => {
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (row?.videoUrl && videoRef.current) {
      let hls;

      // If URL ends with .m3u8 and Hls.js is supported
      if (row.videoUrl.endsWith(".m3u8") && Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(row.videoUrl);
        hls.attachMedia(videoRef.current);

        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error("HLS error:", data);
          setVideoError(true);
        });
      } else {
        // For MP4 or Safari native HLS support
        videoRef.current.src = row.videoUrl;
      }

      // Cleanup on unmount or video change
      return () => {
        if (hls) hls.destroy();
      };
    }
  }, [row?.videoUrl]);

  return (
    <div className="flex justify-center">
      {!videoError ? (
        <video
          ref={videoRef}
          width={75}
          height={100}
          muted
          controls
          className="object-cover"
          onError={() => setVideoError(true)}
        />
      ) : (
        <span className="text-red-500">Video Not Found</span>
      )}
    </div>
  );
};

const NewsList = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const { dialogueType } = useSelector((state) => state.dialogue);
  const { newsList, totalUser } = useSelector((state) => state.newsList);

  console.log("newsList: ", newsList);

  const handlePageChange = useCallback((pageNumber) => {
    setPage(pageNumber);
  }, []);

  const handleRowsPerPage = useCallback((value) => {
    setPage(1);
    setSize(value);
  }, []);

  // Fetch news list with error handling
  const fetchNewsList = useCallback(async () => {
    try {
      setLoading(true);
      await dispatch(getNewsList({ page, size })).unwrap();
    } catch (error) {
      console.error("Failed to fetch news list:", error);
      // You can add a toast notification here
    } finally {
      setLoading(false);
    }
  }, [page, size, dispatch]);

  useEffect(() => {
    setData(newsList);
  }, [newsList]);

  useEffect(() => {
    fetchNewsList();
  }, [fetchNewsList]);

  const handleDeleteNewsCategory = async (video) => {
    try {
      const confirmed = await warning();
      if (confirmed) {
        const payload = {
          shortVideoId: video?._id,
          movieSeriesId: video?.movieSeries._id,
          start: page,
          limit: size,
        };
        await dispatch(deleteShortVideo(payload)).unwrap();
        fetchNewsList(); // Refresh the list
      }
    } catch (err) {
      console.error("Failed to delete news category:", err);
    }
  };

  const NewsListTable = useMemo(
    () => [
      {
        Header: "No",
        accessor: "no",
        Cell: ({ index }) => (
          <span className="text-nowrap">
            {(page - 1) * size + parseInt(index) + 1}
          </span>
        ),
      },
      {
        Header: "Name",
        accessor: "name",
        Cell: ({ row }) => (
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-900">
              {row?.name}
            </span>
          </div>
        ),
      },
      {
        Header: "Description",
        accessor: "description",
        Cell: ({ row }) => (
          <div className="max-w-xs">
            <span className="text-sm text-gray-600 line-clamp-2">
              {row?.description}
            </span>
          </div>
        ),
      },
      {
        Header: "Video Image",
        accessor: "image",
        Cell: ({ row }) => {
          const [imageError, setImageError] = useState(false);
          return (
            <div className="flex-shrink-0">
              {imageError || !row?.videoImage ? (
                <div className="w-20 h-24 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-xs text-gray-500">No Image</span>
                </div>
              ) : (
                <img
                  src={row.videoImage}
                  width={80}
                  height={96}
                  alt="Thumbnail"
                  className="rounded object-cover"
                  onError={() => setImageError(true)}
                />
              )}
            </div>
          );
        },
      },
      {
        Header: "Video",
        body: "video",
        Cell: ({ row }) => <VideoCell row={row} />,
      },
      {
        Header: "News Channel",
        accessor: "movieSeries",
        Cell: ({ row }) => (
          <div>
            <span className="text-sm text-gray-900">
              {row?.movieSeries?.name}
            </span>
          </div>
        ),
      },
      {
        Header: "Duration (seconds)",
        accessor: "duration",
        Cell: ({ row }) => (
          <div>
            <span className="text-sm text-gray-900">{row?.duration}</span>
          </div>
        ),
      },
      {
        Header: "Lock Status",
        accessor: "isLocked",
        Cell: ({ row }) => (
          <div>
            {row?.isLocked ? (
              <IconLockFilled className="w-5 h-5 text-red-500" />
            ) : (
              <IconLockOpen className="w-5 h-5 text-green-500" />
            )}
          </div>
        ),
      },
      {
        Header: "Coins",
        accessor: "coins",
        Cell: ({ row }) => (
          <div>
            <span className="text-sm font-medium text-gray-900">
              {row?.coin}
            </span>
          </div>
        ),
      },
      {
        Header: "Date",
        accessor: "date",
        Cell: ({ row }) => (
          <span className="text-sm text-gray-600">
            {row?.releaseDate
              ? moment(row.releaseDate).format("DD/MM/YYYY")
              : "-"}
          </span>
        ),
      },
      {
        Header: "Action",
        accessor: "action",
        Cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              btnIcon={<IconEdit className="w-4 h-4 text-gray-600" />}
              onClick={() => {
                dispatch(
                  openDialog({
                    type: "newsList",
                    data: row,
                  })
                );
              }}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700"
            />
            <Button
              btnIcon={<IconTrash className="w-4 h-4 text-gray-600" />}
              onClick={() => handleDeleteNewsCategory(row)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700"
            />
          </div>
        ),
      },
    ],
    [page, size, data, dispatch, handleDeleteNewsCategory]
  );

  return (
    <RootLayout>
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="px-4 sm:px-6 lg:px-8">
          {dialogueType === "newsList" && (
            <NewsListDialogue page={page} size={size} />
          )}

          <div className="bg-white rounded-lg shadow-sm">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h5 className="text-xl font-semibold text-gray-900">
                    News List
                    {loading && (
                      <span className="ml-2 text-sm text-gray-500">
                        Loading...
                      </span>
                    )}
                  </h5>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="p-6">
              <Table
                data={data}
                columns={NewsListTable}
                serverPerPage={size}
                serverPage={page}
                type={"server"}
              />

              {/* Pagination */}
              <Pagination
                type={"client"}
                activePage={page}
                rowsPerPage={size}
                userTotal={totalUser}
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

export default NewsList;
