/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeDialog } from "../../store/dialogueSlice";
import { getVideoDetails } from "../../store/newsListSlice";
import Hls from "hls.js";

const VideoDialogue = () => {
  const { dialogue, dialogueData } = useSelector((state) => state.dialogue);
  const { getVideo } = useSelector((state) => state.newsList);
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [addPostOpen, setAddPostOpen] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (dialogueData?._id) {
      dispatch(getVideoDetails(dialogueData._id));
    }
  }, [dialogueData, dispatch]);

  useEffect(() => {
    setAddPostOpen(dialogue);
  }, [dialogue]);

  useEffect(() => {
    if (getVideo?.videoUrl && videoRef.current) {
      const url = getVideo.videoUrl;
      let hls;

      if (url.endsWith(".m3u8") && Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(videoRef.current);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log("HLS manifest loaded");
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error("HLS error:", data);
          setVideoError(true);
        });
      } else {
        // For mp4 or Safari native HLS
        videoRef.current.src = url;
      }

      return () => {
        if (hls) {
          hls.destroy();
        }
      };
    }
  }, [getVideo]);

  const handleCloseAddCategory = () => {
    setAddPostOpen(false);
    dispatch(closeDialog());
  };

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  const Button = ({ onClick, btnName, className = "" }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${className}`}
    >
      {btnName}
    </button>
  );

  const maxLength = 10;
  const caption = dialogueData?.caption || "";

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.keyCode === 27) {
        handleCloseAddCategory();
      }
    };

    if (addPostOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [addPostOpen]);

  if (!addPostOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleCloseAddCategory}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              View Video
            </h2>
          </div>

          {/* Description Section (commented out in original) */}
          {/* <div className="px-6 py-4">
            {caption && (
              <div>
                <span className="font-semibold text-gray-700">
                  Video Description
                </span>
                <div className="mt-2">
                  <p className={`text-gray-600 ${!isExpanded ? 'line-clamp-3' : ''}`}>
                    {isExpanded
                      ? caption
                      : `${caption.substring(0, maxLength)}${caption.length > maxLength ? "..." : ""}`
                    }
                  </p>
                  {caption.length > maxLength && (
                    <button
                      onClick={toggleReadMore}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                    >
                      {isExpanded ? "Read Less" : "Read More"}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div> */}

          {/* Video Section */}
          <div className="px-6 py-4">
            {!videoError ? (
              <video
                ref={videoRef}
                controls
                autoPlay
                className="w-full h-96 object-contain rounded-lg bg-black"
                onError={() => setVideoError(true)}
              />
            ) : (
              <div className="w-full h-96 bg-gray-100 rounded-lg flex flex-col items-center justify-center">
                <svg 
                  className="w-16 h-16 text-gray-400 mb-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" 
                  />
                </svg>
                <span className="text-gray-500 text-lg font-medium">
                  Video Not Found
                </span>
                <p className="text-gray-400 text-sm mt-2">
                  The video could not be loaded. Please try again later.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
            <div className="flex justify-end">
              <Button
                onClick={handleCloseAddCategory}
                btnName="Close"
                className="border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-gray-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDialogue;