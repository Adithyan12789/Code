import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserInfo } from "../store/userSlice";
import { useNavigate, useParams } from "react-router-dom"; // CHANGED: useParams instead of useSearchParams
import {
  IconChevronCompactLeft,
  IconUser,
  IconMail,
  IconCoin,
  IconLogin,
  IconCrown,
  IconCalendar,
  IconDeviceMobile,
  IconBadge,
} from "@tabler/icons-react";
import defaultImage from "../assets/images/defaultImage.png";
import Button from "../extra/Button";
import Input from "../extra/Input";
import { RootLayout } from "../components/layout/Layout";

const ViewProfile = () => {
  
  const { userInfo } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const { userId } = useParams(); // CHANGED: useParams to get the ID from URL
  const navigate = useNavigate();

  useEffect(() => {
    
    if (userId) {
      dispatch(getUserInfo(userId));
    } else {
      console.log("No userId found in URL parameters");
    }
  }, [userId, dispatch]);

  const handleClose = () => {
    navigate(-1);
  };

  // Format date if available
  const formatDate = (dateString) => {
    
    if (!dateString) {
      return "Unknown";
    }
    
    try {
      const formattedDate = new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      return formattedDate;
    } catch (error) {
      console.log("Date formatting error:", error);
      return "Unknown";
    }
  };

  // Check if userInfo is available and has data
  const userData = userInfo && userInfo.length > 0 ? userInfo[0] : userInfo;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-red-50 to-pink-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-rose-900">User Profile</h1>
            <p className="text-rose-700/80 mt-2">
              User ID:{" "}
              <span className="font-mono bg-rose-100 text-rose-800 px-2 py-1 rounded">
                {userId}
              </span>
            </p>
          </div>
          <Button
            btnName={"Back to Users"}
            newClass={
              "flex items-center gap-2 bg-white hover:bg-rose-50 text-rose-700 px-4 py-2.5 rounded-xl border border-rose-200 shadow-sm hover:shadow transition-all duration-200 font-medium hover:border-rose-300"
            }
            btnIcon={
              <IconChevronCompactLeft size={20} className="text-rose-600" />
            }
            onClick={() => {
              handleClose();
            }}
          />
        </div>

        {/* Rest of your component remains the same... */}
        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-rose-100/50">
          {/* Profile Header with Red Gradient */}
          <div className="bg-gradient-to-r from-rose-600 via-red-500 to-pink-600 px-8 py-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="absolute -inset-1 bg-white/30 rounded-full blur-sm"></div>
                  <img
                    src={userData?.profilePic || defaultImage}
                    alt="profile"
                    className="relative w-20 h-20 object-cover rounded-full border-4 border-white/90 shadow-xl"
                    onError={(e) => {
                      e.currentTarget.src = defaultImage;
                    }}
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white drop-shadow-sm">
                    {userData?.name || "Unknown User"}
                  </h2>
                  <p className="text-rose-100 text-sm drop-shadow">
                    {userData?.username
                      ? `@${userData.username}`
                      : "No username"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Avatar & Stats */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 border border-rose-200/50 shadow-sm">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-6">
                      <div className="absolute -inset-2 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full opacity-20 blur"></div>
                      <img
                        src={userData?.profilePic || defaultImage}
                        alt="profile"
                        className="relative w-32 h-32 object-cover rounded-full border-4 border-white shadow-lg"
                        onError={(e) => {
                          e.currentTarget.src = defaultImage;
                        }}
                      />
                    </div>

                    {/* Coin Balance Card */}
                    <div className="w-full bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-4 text-white shadow-lg relative overflow-hidden">
                      <div className="absolute top-2 right-2">
                        <IconCrown size={20} className="text-amber-200" />
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <IconCoin size={24} className="text-amber-200" />
                        <div>
                          <p className="text-amber-100 text-sm font-medium">
                            Coin Balance
                          </p>
                          <p className="text-2xl font-bold drop-shadow-sm">
                            {userData?.coin || 0}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Additional Stats */}
                    <div className="w-full mt-4 grid gap-3">
                      <div className="bg-white rounded-xl p-3 border border-rose-100 shadow-sm">
                        <div className="flex items-center gap-2 text-rose-600">
                          <IconCalendar size={16} />
                          <span className="text-sm font-medium">
                            Member Since
                          </span>
                        </div>
                        <p className="text-rose-900 font-semibold text-sm mt-1">
                          {formatDate(userData?.createdAt)}
                        </p>
                      </div>
                      <div className="bg-white rounded-xl p-3 border border-rose-100 shadow-sm">
                        <p className="text-rose-600 text-sm font-medium">
                          Status
                        </p>
                        <p className="text-rose-900 font-semibold">Active</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - User Info */}
              <div className="lg:col-span-2">
                <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 border border-rose-200/50 shadow-sm">
                  <h3 className="text-xl font-semibold text-rose-900 mb-6 flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl">
                      <IconUser size={20} className="text-white" />
                    </div>
                    Personal Information
                  </h3>

                  <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-rose-700 flex items-center gap-2">
                        <IconUser size={16} className="text-rose-500" />
                        Full Name
                      </label>
                      <Input
                        type="text"
                        name="name"
                        placeholder="Enter Details..."
                        value={userData?.name || "-"}
                        readOnly
                        newClass="bg-white border-rose-200 focus:border-rose-500 focus:ring-rose-500 rounded-xl text-rose-900 placeholder-rose-300"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-rose-700 flex items-center gap-2">
                        <IconUser size={16} className="text-rose-500" />
                        Username
                      </label>
                      <Input
                        name="username"
                        placeholder="Enter Details..."
                        value={userData?.username || "-"}
                        readOnly
                        newClass="bg-white border-rose-200 focus:border-rose-500 focus:ring-rose-500 rounded-xl text-rose-900 placeholder-rose-300"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-rose-700 flex items-center gap-2">
                        <IconMail size={16} className="text-rose-500" />
                        Email Address
                      </label>
                      <Input
                        name="email"
                        placeholder="Enter Details..."
                        value={userData?.email || "-"}
                        readOnly
                        newClass="bg-white border-rose-200 focus:border-rose-500 focus:ring-rose-500 rounded-xl text-rose-900 placeholder-rose-300"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-rose-700 flex items-center gap-2">
                        <IconCoin size={16} className="text-rose-500" />
                        Coin Balance
                      </label>
                      <Input
                        name="coin"
                        placeholder="Enter Details..."
                        value={userData?.coin || 0}
                        readOnly
                        newClass="bg-white border-rose-200 focus:border-rose-500 focus:ring-rose-500 rounded-xl text-rose-900 placeholder-rose-300 font-semibold"
                      />
                    </div>
                  </form>

                  {/* Additional Info Section */}
                  <div className="mt-8 pt-6 border-t border-rose-200/50">
                    <h4 className="text-lg font-semibold text-rose-900 mb-4">
                      Account Statistics
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-white rounded-xl border border-rose-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <IconUser size={16} className="text-blue-600" />
                        </div>
                        <p className="text-rose-600 text-xs font-medium">
                          Posts
                        </p>
                        <p className="text-rose-900 font-bold text-lg">
                          {userData?.postCount || 0}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-white rounded-xl border border-rose-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <IconUser size={16} className="text-green-600" />
                        </div>
                        <p className="text-rose-600 text-xs font-medium">
                          Following
                        </p>
                        <p className="text-rose-900 font-bold text-lg">
                          {userData?.followingCount || 0}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-white rounded-xl border border-rose-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <IconUser size={16} className="text-purple-600" />
                        </div>
                        <p className="text-rose-600 text-xs font-medium">
                          Followers
                        </p>
                        <p className="text-rose-900 font-bold text-lg">
                          {userData?.followerCount || 0}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-white rounded-xl border border-rose-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <IconCrown size={16} className="text-red-600" />
                        </div>
                        <p className="text-rose-600 text-xs font-medium">
                          Likes
                        </p>
                        <p className="text-rose-900 font-bold text-lg">
                          {userData?.likeCount || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ViewProfilePage = () => {
  return (
    <RootLayout>
      <ViewProfile />
    </RootLayout>
  );
};

export default ViewProfilePage;