/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  deleteShortVideo,
  getNewsChannelListVideo,
} from "../store/newsChannelListSlice";
import Table from "../extra/Table";
import moment from "moment";
import { openDialog } from "../store/dialogueSlice";
import VideoDialogue from "../components/newsVideo/VideoDialogue";
import Button from "../extra/Button";
import { warning } from "../util/Alert";
import NewsListDialogue from "../components/newList/NewsListDialogue";
import { getSetting } from "../store/settingSlice";
import {
  IconEdit,
  IconLockFilled,
  IconLockOpen,
  IconTrash,
} from "@tabler/icons-react";
import Hls from "hls.js";
import { RootLayout } from "../components/layout/Layout";

const ViewShortVideo = () => {
  const { dialogueType } = useSelector((state) => state.dialogue);
  const dispatch = useDispatch();
  const params = useParams();

  console.log("params: ", params);

  // Check all possible parameter names
  const userId = params.id;

  console.log("params: ", params);
  console.log("userId: ", userId);

  const [page, setPage] = useState(1);
  const [size] = useState(20);
  const [data, setData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const observer = useRef();

  const { newsChannelListVideo, totalUser } = useSelector(
    (state) => state.newsChannelList
  );

  // Load initial data
  useEffect(() => {
    if (userId) {
      setIsLoading(true);
      setPage(1);
      setData([]);
      dispatch(
        getNewsChannelListVideo({
          start: 1,
          limit: size,
          movieSeriesId: userId,
        })
      )
        .then(() => setIsLoading(false))
        .catch(() => setIsLoading(false));

      dispatch(getSetting());
    }
  }, [userId, dispatch, size]);

  // Initialize data when newsChannelListVideo changes
  useEffect(() => {
    if (newsChannelListVideo && Array.isArray(newsChannelListVideo)) {
      if (page === 1) {
        setData(newsChannelListVideo);
      } else {
        setData((prevData) => {
          const newVideos = newsChannelListVideo.filter(
            (video) =>
              !prevData.some((prevVideo) => prevVideo._id === video._id)
          );
          return [...prevData, ...newVideos];
        });
      }

      // Check if we have more data to load
      const currentTotalUser = totalUser || 0;
      const currentDataLength = data.length;
      const currentNewsLength = newsChannelListVideo.length;

      setHasMore(currentDataLength + currentNewsLength < currentTotalUser);
    }
  }, [newsChannelListVideo, totalUser, page]);

  // Infinite scroll implementation
  const lastVideoElementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setPage((prevPage) => {
            const nextPage = prevPage + 1;
            setIsLoading(true);
            dispatch(
              getNewsChannelListVideo({
                start: nextPage,
                limit: size,
                movieSeriesId: userId,
              })
            )
              .then(() => setIsLoading(false))
              .catch(() => setIsLoading(false));
            return nextPage;
          });
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore, userId, size, dispatch, isLoading]
  );

  const handleDeleteNewsCategory = (video) => {
    const data = warning();
    data
      .then((res) => {
        if (res) {
          dispatch(
            deleteShortVideo({
              shortVideoId: video?._id,
              movieSeriesId: userId,
              start: 1,
              limit: size,
            })
          ).then((res) => {
            // Refresh the entire list after deletion
            setPage(1);
            setData([]);
            dispatch(
              getNewsChannelListVideo({
                start: 1,
                limit: size,
                movieSeriesId: userId,
              })
            );
          });
        }
      })
      .catch((err) => console.log(err));
  };

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

  const ManageVideoTable = useMemo(
    () => [
      {
        Header: "No",
        body: "no",
        Cell: ({ index }) => (
          <span className="whitespace-nowrap">{index + 1}</span>
        ),
      },
      {
        Header: "Title",
        body: "name",
        Cell: ({ row }) => (
          <div className="max-w-xs">
            <span className="font-medium text-gray-900 line-clamp-2">
              {row?.name || "No name"}
            </span>
          </div>
        ),
      },
      {
        Header: "Description",
        body: "description",
        Cell: ({ row }) => (
          <div className="max-w-md">
            <span className="text-gray-600 line-clamp-2">
              {row?.description || "No Description"}
            </span>
          </div>
        ),
      },
      {
        Header: "Video Image",
        body: "image",
        Cell: ({ row }) => {
          return (
            <div className="flex justify-center">
              <img
                src={row?.videoImage || "/images/default-movie-poster.jpg"}
                width={75}
                height={100}
                alt="Thumbnail"
                className="object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/default-movie-poster.jpg";
                }}
              />
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
        Header: "Locked Status",
        body: "news number",
        Cell: ({ row }) => (
          <div className="flex justify-center">
            <span>
              {row?.isLocked ? (
                <IconLockFilled className="text-red-500" />
              ) : (
                <IconLockOpen className="text-green-500" />
              )}
            </span>
          </div>
        ),
      },
      {
        Header: "Coins",
        body: "coins",
        Cell: ({ row }) => (
          <div className="flex justify-center">
            <span>{row?.coin || 0}</span>
          </div>
        ),
      },
      {
        Header: "Date",
        body: "date",
        Cell: ({ row }) => (
          <span className="cursor-pointer">
            {row?.releaseDate
              ? moment(row.releaseDate).format("DD/MM/YYYY")
              : "-"}
          </span>
        ),
      },
      {
        Header: "Action",
        body: "action",
        Cell: ({ row }) => (
          <div className="flex space-x-2 justify-center">
            <Button
              btnIcon={<IconEdit className="text-blue-600" />}
              onClick={() => {
                dispatch(
                  openDialog({
                    type: "newsList",
                    data: row,
                  })
                );
              }}
            />
            <Button
              btnIcon={<IconTrash className="text-red-600" />}
              onClick={() => handleDeleteNewsCategory(row)}
            />
          </div>
        ),
      },
    ],
    [dispatch, userId, size]
  );

  // Safe data access
  const safeData = data || [];
  const dataLength = safeData.length;

  return (
    <RootLayout>
      {dialogueType === "viewVideo" && <VideoDialogue />}
      {dialogueType === "newsList" && (
        <NewsListDialogue page={page} size={size} />
      )}

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h5 className="font-medium text-xl text-gray-800 mb-1">
              Short Videos
            </h5>
            <small className="text-gray-500">
              Total News: {dataLength}{" "}
              {hasMore ? "(Loading more...)" : "(All loaded)"}
            </small>
            {!userId && (
              <div className="text-red-500 text-sm mt-2">
                Error: User ID not found in URL parameters
              </div>
            )}
          </div>

          <div className="p-6">
            {!userId ? (
              <div className="text-center py-8">
                <p className="text-red-500">User ID is missing from URL</p>
                <p className="text-gray-500 text-sm mt-2">
                  Check your route configuration. Expected parameter:
                  movieSeriesId
                </p>
              </div>
            ) : (
              <Table
                data={safeData}
                mapData={ManageVideoTable}
                type="client"
                lastElementRef={lastVideoElementRef}
              />
            )}

            {/* Loading indicator */}
            {isLoading && (
              <div className="text-center mt-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="text-gray-500 mt-2">Loading more videos...</p>
              </div>
            )}

            {/* No more data indicator */}
            {!hasMore && dataLength > 0 && (
              <div className="text-center my-4">
                <p className="text-gray-500">No more videos to load</p>
              </div>
            )}

            {/* Empty state */}
            {dataLength === 0 && !isLoading && userId && (
              <div className="text-center py-8">
                <p className="text-gray-500">No videos found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .spinner-border {
          display: inline-block;
          width: 2rem;
          height: 2rem;
          border: 0.25em solid currentColor;
          border-right-color: transparent;
          border-radius: 50%;
          animation: spinner-border 0.75s linear infinite;
        }
        @keyframes spinner-border {
          to { transform: rotate(360deg); }
        }
        .visually-hidden {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </RootLayout>
  );
};

export default ViewShortVideo;
