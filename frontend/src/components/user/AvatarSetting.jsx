/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { updateFakeUser } from "../../store/userSlice";
import { baseURL } from "@/util/config";
import useClearSessionStorageOnPopState from "../../extra/ClearStorage";

const AvatarSetting = (props) => {
  useClearSessionStorageOnPopState("multiButton");

  const { userProfileData } = props;
  const [imageShow, setImageShow] = useState("");
  const [userId, setUserId] = useState("");
  const [isChannel, setIsChannel] = useState(false);
  const { getUserProfileData } = useSelector((state) => state.user);
  const [data, setData] = useState();
  const fileInputRef = useRef(null);

  const dispatch = useAppDispatch();

  useEffect(() => {
    setData(getUserProfileData);
  }, [userProfileData, getUserProfileData]);

  const handleFileUpload = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const getFile = e.target.files[0];
      const imageURL = URL.createObjectURL(getFile);

      if (imageURL) {
        setImageShow(imageURL);
        const formData = new FormData();
        formData.append("image", getFile);

        let payload = {
          id: userProfileData?._id,
          data: formData,
        };

        dispatch(updateFakeUser(payload));
        dispatch(closeDialog());
      }
    }
  };

  const handleAvatarClick = () => {
    if (userProfileData?.isFake === true && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    setUserId(userProfileData?._id || "");
    setIsChannel(userProfileData?.isChannel || false);
    setImageShow(baseURL + userProfileData?.image || "");
  }, [userProfileData, getUserProfileData]);

  // Fallback avatar if no image is available
  const getAvatarContent = () => {
    if (imageShow) {
      return (
        <img
          src={imageShow}
          alt="Avatar"
          className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover transition-all duration-300 group-hover:brightness-75"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      );
    }
    
    return (
      <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-lg">
        {userProfileData?.name?.charAt(0)?.toUpperCase() || 'U'}
      </div>
    );
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center">
          <div className="w-full">
            <h5 className="text-lg font-semibold text-gray-900">
              Avatar & Cover
            </h5>
            <p className="text-sm text-gray-600 mt-1">
              Manage your profile picture and cover image
            </p>
          </div>
        </div>

        {/* Image Container */}
        <div className="relative w-full">
          {/* Cover Image */}
          <div className="w-full h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg overflow-hidden shadow-md relative">
            {/* Cover image upload area (you can add similar functionality for cover image) */}
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
              <button className="bg-white bg-opacity-90 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-opacity-100">
                Change Cover
              </button>
            </div>
          </div>

          {/* Avatar Image */}
          <div className="absolute -bottom-8 left-6">
            <div 
              className={`relative group ${userProfileData?.isFake === true ? 'cursor-pointer transform hover:scale-105 transition-transform duration-200' : 'cursor-default'}`}
              onClick={handleAvatarClick}
            >
              {getAvatarContent()}
              
              {/* Edit Icon Overlay */}
              {userProfileData?.isFake === true && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    name="image"
                    id="image"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="mt-12 pt-4">
          <div className="text-center md:text-left md:pl-32">
            <h3 className="text-xl font-bold text-gray-900">
              {userProfileData?.name || "User Name"}
            </h3>
            <p className="text-gray-600 mt-1">
              {userProfileData?.username ? `@${userProfileData.username}` : "@username"}
            </p>
            {userProfileData?.bio && (
              <p className="text-gray-500 text-sm mt-2 max-w-md">
                {userProfileData.bio}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarSetting;