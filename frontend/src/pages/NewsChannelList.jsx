/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useDispatch, useSelector } from "react-redux";
import { RootLayout } from "../components/layout/Layout";
import Button from "../extra/Button";
import Pagination from "../extra/Pagination";
import Table from "../extra/Table";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import {
  deleteNewsChannel,
  newsChannelListActive,
  newsChannelListBanner,
  newsChannelListTrending,
  getNewsChannelList,
} from "../store/newsChannelListSlice";
import femalImage from "../assets/images/8.jpg";
import moment from "moment";
import ToggleSwitch from "../extra/ToggleSwitch";
import { toast } from "react-toastify";
import EditIcon from "../assets/icons/EditBtn.svg";
import TrashIcon from "../assets/icons/trashIcon.svg";
import { openDialog } from "../store/dialogueSlice";
import NewsChannelListDialogue from "../components/newsChannelList/NewsChannelListDialogue";
import { useNavigate } from "react-router-dom";
import { CiVideoOn } from "react-icons/ci";
import NewsListDialogue from "../components/newList/NewsListDialogue";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import Male from "../assets/images/placeHolder.png";
import { warning } from "../util/Alert";
import { getSetting } from "../store/settingSlice";
import defaultMoviePoster from "../assets/images/default-movie-poster.jpg";
import { setToast } from "../util/toastServices";
import {
  IconEdit,
  IconEye,
  IconTrash,
  IconVideoPlus,
} from "@tabler/icons-react";

const NewsChannelList = () => {
  const dispatch = useDispatch();
  const { dialogueType } = useSelector((state) => state.dialogue);
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [imageError, setImageError] = useState(false);
  const [size, setSize] = useState(10); // Reduced default size
  const [data, setData] = useState([]);
  const { newsChannelList, totalUser } = useSelector((state) => state.newsChannelList);

  useEffect(() => {
    dispatch(getSetting());
  }, []);

  useEffect(() => {
    dispatch(getNewsChannelList({ page, size }))
      .unwrap()
      .then((res) => console.log("👉 Success result:", res))
      .catch((err) => console.error("❌ Error result:", err));
  }, [page, size, dispatch]);

  useEffect(() => {
    setData(newsChannelList);
  }, [newsChannelList]);

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const handleRowsPerPage = (value) => {
    setPage(1);
    setSize(value);
  };

  const [expandedRows, setExpandedRows] = useState({});

  const handleToggleDescription = (index) => {
    setExpandedRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleIsActive = (row) => {
    dispatch(newsChannelListActive(row?._id)).then((res) => {
      if (res?.payload?.status) {
        toast.success(res?.payload?.message);
        dispatch(getNewsChannelList({ page, size }));
      } else {
        toast.error(res?.payload?.message);
      }
    });
  };

  const handleIsBanner = (row) => {
    dispatch(newsChannelListBanner(row?._id)).then((res) => {
      if (res?.payload?.status) {
        toast.success(res?.payload?.message);
        dispatch(getNewsChannelList({ page, size }));
      } else {
        toast.error(res?.payload?.message);
      }
    });
  };

  const handleIsTrending = (row) => {
    dispatch(newsChannelListTrending(row?._id)).then((res) => {
      if (res?.payload?.status) {
        toast.success(res?.payload?.message);
        dispatch(getNewsChannelList({ page, size }));
      } else {
        toast.error(res?.payload?.message);
      }
    });
  };

const handleRedirect = (id) => {
  navigate(`/ViewShortVideo/${id}`);
};

  const handleDeleteNewsChannel = (row) => {
    const data = warning();
    data.then((res) => {
      if (res) {
        dispatch(deleteNewsChannel(row?._id)).then((res) => {
          console.log(res);
          if (res?.payload.status) {
            setToast("success", res?.payload.message);
          } else {
            setToast("error", res?.payload.message);
          }
          setTimeout(() => {
            dispatch(getNewsChannelList({ page, size }));
          }, 1000);
        });
      }
    });
  };

  const newsChannelListTable = [
    {
      Header: "NO",
      body: "no",
      width: "60px",
      Cell: ({ index }) => (
        <span className="text-nowrap text-sm text-red-700 font-medium">
          {(page - 1) * size + parseInt(index) + 1}
        </span>
      ),
    },
    {
      Header: "Image",
      body: "images",
      width: "80px",
      Cell: ({ row }) => {
        const [imageError, setImageError] = useState(false);

        return (
          <div className="flex items-center justify-center">
            <img
              src={row?.thumbnail}
              width={50}
              height={65}
              alt="Thumbnail"
              className="object-cover rounded border border-red-200"
              onError={(e) => {
                e.target.src = defaultMoviePoster;
              }}
            />
          </div>
        );
      },
    },
    {
      Header: "Category",
      body: "category",
      width: "100px",
      Cell: ({ row, index }) => (
        <span className="text-capitalize cursor-pointer text-nowrap text-sm pl-1">
          {row?.category || "-"}
        </span>
      ),
    },
    {
      Header: "Name",
      body: "Name",
      width: "120px",
      Cell: ({ row, index }) => (
        <span className="text-capitalize cursor-pointer text-nowrap text-sm pl-1 font-medium">
          {row?.name || "-"}
        </span>
      ),
    },
    {
      Header: "Description",
      body: "description",
      width: "200px",
      Cell: ({ row, index }) => {
        const [isExpanded, setIsExpanded] = useState(false);

        const toggleExpand = () => setIsExpanded(!isExpanded);

        return (
          <div className="text-capitalize cursor-pointer text-nowrap pl-1">
            <span
              className="block text-sm"
              style={{
                whiteSpace: isExpanded ? "normal" : "nowrap",
              }}
            >
              {isExpanded
                ? row?.description || "-"
                : (row?.description || "-").slice(0, 30)}
            </span>
            {row?.description && row.description.length > 30 && (
              <span
                onClick={toggleExpand}
                className="cursor-pointer hover:text-red-800 text-xs font-medium"
              >
                {isExpanded ? "Show Less" : "Show More"}
              </span>
            )}
          </div>
        );
      },
    },
    {
      Header: "Date",
      body: "date",
      width: "100px",
      Cell: ({ row }) => (
        <span className="text-capitalize cursor-pointer text-sm">
          {moment(row?.releaseDate).format("DD/MM/YYYY") || "-"}
        </span>
      ),
    },
    {
      Header: "Total News",
      body: "plan",
      width: "90px",
      Cell: ({ row }) => (
        <span className="text-lowercase cursor-pointer text-sm font-medium">
          {row?.totalShortVideos === 0 ? 0 : row?.totalShortVideos || "-"}
        </span>
      ),
    },
    {
      Header: "Max Ads",
      body: "maxAdsForFreeView",
      width: "80px",
      Cell: ({ row }) => (
        <span className="text-lowercase cursor-pointer text-sm">
          {row?.maxAdsForFreeView || "-"}
        </span>
      ),
    },
    {
      Header: "Banner",
      body: "isBanner",
      width: "80px",
      Cell: ({ row }) => (
        <div className="flex justify-center">
          <ToggleSwitch
            value={row?.isAutoAnimateBanner}
            onChange={() => handleIsBanner(row)}
            size="small"
            color="red"
          />
        </div>
      ),
    },
    {
      Header: "Trending",
      body: "isTrending",
      width: "80px",
      Cell: ({ row }) => (
        <div className="flex justify-center">
          <ToggleSwitch
            value={row?.isTrending}
            onChange={() => handleIsTrending(row)}
            size="small"
            color="red"
          />
        </div>
      ),
    },
    {
      Header: "Active",
      body: "isActive",
      width: "70px",
      Cell: ({ row }) => (
        <div className="flex justify-center">
          <ToggleSwitch
            value={row?.isActive}
            onChange={() => handleIsActive(row)}
            size="small"
            color="red"
          />
        </div>
      ),
    },
    {
      Header: "Add News",
      body: "addNews",
      width: "80px",
      Cell: ({ row }) => (
        <div className="action-button flex justify-center">
          <Button
            btnIcon={<IconVideoPlus className="text-red-600" size={18} />}
            onClick={() => {
              dispatch(openDialog({ type: "newsList", data: row }));
            }}
            size="small"
            className="hover:bg-red-50"
          />
        </div>
      ),
    },
    {
      Header: "View News",
      body: "viewNews",
      width: "80px",
      Cell: ({ row }) => (
        <div className="action-button flex justify-center">
          <Button
            btnIcon={<IconEye className="text-red-600" size={18} />}
            onClick={() => handleRedirect(row?._id)}
            size="small"
            className="hover:bg-red-50"
          />
        </div>
      ),
    },
    {
      Header: "Action",
      body: "action",
      width: "100px",
      Cell: ({ row }) => (
        <div className="action-button flex space-x-1 justify-center">
          <Button
            btnIcon={<IconEdit className="text-red-600" size={18} />}
            onClick={() => {
              dispatch(openDialog({ type: "newsChannelList", data: row }));
            }}
            size="small"
            className="hover:bg-red-50"
          />
          <Button
            btnIcon={<IconTrash className="text-red-600" size={18} />}
            onClick={() => {
              handleDeleteNewsChannel(row);
            }}
            size="small"
            className="hover:bg-red-50"
          />
        </div>
      ),
    },
  ];

  return (
    <RootLayout>
      {dialogueType === "newsChannelList" && (
        <NewsChannelListDialogue page={page} size={size} />
      )}
      {dialogueType == "newsList" && (
        <NewsListDialogue page={page} size={size} />
      )}

      <div className="p-3 h-full flex flex-col bg-red-50/30">
        <div className="flex-grow flex flex-col min-h-0">
          <div className="user-table real-user mb-3 flex flex-col flex-grow min-h-0">
            <div className="user-table-top flex justify-between items-center mb-3">
              <div className="w-full">
                <h5 className="font-bold text-xl text-red-800">
                  News Channel List
                </h5>
              </div>
<div className="flex justify-end">
  <div className="ms-auto">
    <button
      onClick={() => {
        dispatch(openDialog({ type: "newsChannelList" }));
      }}
      className="
        bg-gradient-to-r from-red-500 to-red-600
        hover:from-red-600 hover:to-red-700
        text-white 
        border-0
        shadow-lg
        hover:shadow-xl
        hover:shadow-red-500/25
        transform
        hover:scale-105
        active:scale-95
        transition-all
        duration-300
        ease-out
        rounded-xl
        font-semibold
        px-4
        py-3
        flex
        items-center
        gap-2
        group
        relative
        overflow-hidden
      "
    >
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      
      <AddIcon className="w-4 h-4 transition-transform group-hover:rotate-90 duration-300 z-10" />
      <span className="z-10">New</span>
    </button>
  </div>
</div>
            </div>
            
            {/* Table Container with proper scrolling */}
            <div className="flex-grow overflow-hidden flex flex-col bg-white rounded-lg border border-red-200 shadow-sm">
              <div className="flex-grow overflow-auto">
                <Table
                  data={data}
                  mapData={newsChannelListTable}
                  serverPerPage={size}
                  serverPage={page}
                  type={"server"}
                  className="text-sm" // Smaller text for table
                  headerClassName="bg-red-100 text-red-800 font-semibold"
                  rowClassName="hover:bg-red-50 border-b border-red-100"
                />
              </div>
              
              {/* Pagination */}
              <div className="mt-2 pt-2 border-t border-red-200">
                <Pagination
                  type={"server"}
                  activePage={page}
                  rowsPerPage={size}
                  userTotal={totalUser}
                  setPage={setPage}
                  handleRowsPerPage={handleRowsPerPage}
                  handlePageChange={handlePageChange}
                  className="text-red-700"
                  activeButtonClass="bg-red-600 text-white"
                  hoverButtonClass="hover:bg-red-100"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  );
};

export default NewsChannelList;