/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootLayout } from "../components/layout/Layout";
import Button from "../extra/Button";
import { adminProfileGet, adminProfileUpdate, updateAdminPassword } from "../store/adminSlice";
import Male from "../assets/images/defaultImage.png";
import { uploadImage } from "../store/newsListSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { 
  IconCamera, 
  IconUser, 
  IconLock, 
  IconMail, 
  IconShield,
  IconCheck,
  IconEdit,
  IconRefresh,
  IconUpload
} from "@tabler/icons-react";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { admin } = useSelector((state) => state.admin);

  const [data, setData] = useState();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [oldEmail, setOldEmail] = useState();
  const [oldPassword, setOldPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [imageError, setImageError] = useState(false);
  const [imagePath, setImagePath] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const [error, setError] = useState({
    name: "",
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    dispatch(adminProfileGet());
  }, [dispatch]);

  useEffect(() => {
    setName(admin?.name);
    setEmail(admin?.email);
    setOldEmail(admin?.email);
    setOldPassword(admin?.password);
    setImagePath(admin?.image);
    setData(admin);
  }, [admin]);

  const folderStructure = `admin/adminImage`;

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("folderStructure", folderStructure);
    formData.append("keyName", file.name);
    formData.append("content", file);

    try {
      dispatch(uploadImage(formData)).then((res) => {
        setImagePath(res?.payload?.data?.url);
        if (res?.payload?.data?.status) {
          dispatch(adminProfileUpdate({ image: res?.payload?.data?.url })).then((res) => {
            if (res?.payload?.status) {
              toast.success("Profile picture updated successfully!");
              dispatch(adminProfileGet());
            }
          });
        }
        setIsLoading(false);
      });
    } catch (err) {
      console.error("Image Upload Failed:", err);
      setIsLoading(false);
    }
  };

  const handleEditProfile = () => {
    if (!email || !name) {
      const err = {};
      if (!email) err.email = "Email is required";
      if (!name) err.name = "Name is required";
      return setError({ ...err });
    }

    setIsLoading(true);
    const profileData = { name, email };
    dispatch(adminProfileUpdate(profileData)).then((res) => {
      if (res?.payload?.status) {
        toast.success("Profile updated successfully!");
        if (email !== oldEmail) {
          navigate("/login");
        }
        dispatch(adminProfileGet());
      }
      setIsLoading(false);
    });
  };

  const handlePassword = () => {
    if (!newPassword || !oldPassword || !confirmPassword) {
      const err = {};
      if (!newPassword) err.newPassword = "New password is required";
      if (!oldPassword) err.oldPassword = "Current password is required";
      if (!confirmPassword) err.confirmPassword = "Please confirm your password";
      return setError({ ...err });
    }

    if (newPassword !== confirmPassword) {
      return setError({ ...error, confirmPassword: "Passwords do not match" });
    }

    setIsLoading(true);
    const passwordData = { oldPass: oldPassword, newPass: newPassword, confirmPass: confirmPassword };
    dispatch(updateAdminPassword(passwordData)).then((res) => {
      if (res?.payload?.status) {
        toast.success("Password updated successfully!");
        navigate("/login");
        dispatch(adminProfileGet());
      }
      setIsLoading(false);
    });
  };

  return (
    <RootLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50/30 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Modern Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg border border-white/20 mb-4">
              <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-full animate-pulse"></div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-800 via-pink-700 to-red-600 bg-clip-text text-transparent">
                Account Settings
              </h1>
            </div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Manage your personal information and secure your account
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="xl:col-span-1">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-6 sticky top-6">
                {/* Profile Summary */}
                <div className="text-center mb-8">
                  <div className="relative inline-block mb-4">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-2xl">
                      {!imagePath || imageError ? (
                        <img 
                          src={Male} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img 
                          src={imagePath} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                          onError={() => setImageError(true)}
                        />
                      )}
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-red-500 to-pink-600 rounded-full border-4 border-white flex items-center justify-center">
                      <IconCheck size={14} className="text-white" />
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg">{admin?.name || "Admin User"}</h3>
                  <p className="text-gray-600 text-sm flex items-center justify-center gap-1">
                    <IconMail size={14} />
                    {admin?.email || "admin@example.com"}
                  </p>
                </div>

                {/* Navigation Tabs */}
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      activeTab === "profile" 
                        ? "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg" 
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                    }`}
                  >
                    <IconUser size={20} />
                    <span className="font-medium">Profile Information</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab("security")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      activeTab === "security" 
                        ? "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg" 
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                    }`}
                  >
                    <IconShield size={20} />
                    <span className="font-medium">Security Settings</span>
                  </button>
                </nav>

                {/* Stats */}
                <div className="mt-8 p-4 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border border-red-100">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">Active</div>
                    <div className="text-sm text-gray-600">Account Status</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="xl:col-span-3">
              {/* Profile Information Tab */}
              {activeTab === "profile" && (
                <div className="space-y-6">
                  {/* Profile Card */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>
                        <p className="text-gray-600">Update your personal details and profile picture</p>
                      </div>
                      <div className="p-3 bg-red-100 rounded-xl">
                        <IconUser size={24} className="text-red-600" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Profile Picture Upload */}
                      <div className="space-y-6">
                        <div className="text-center">
                          <label htmlFor="image" className="cursor-pointer group">
                            <div className="relative inline-block">
                              <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-2xl group-hover:border-red-200 transition-all duration-300">
                                {!imagePath || imageError ? (
                                  <img 
                                    src={Male} 
                                    alt="Profile" 
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <img 
                                    src={imagePath} 
                                    alt="Profile" 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    onError={() => setImageError(true)}
                                  />
                                )}
                              </div>
                              <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <IconUpload size={24} className="text-white" />
                              </div>
                              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                                <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium shadow-lg">
                                  <IconCamera size={16} />
                                  Change Photo
                                </div>
                              </div>
                            </div>
                            <input
                              type="file"
                              name="image"
                              id="image"
                              className="hidden"
                              onChange={handleFileUpload}
                              accept="image/*"
                            />
                          </label>
                        </div>
                      </div>

                      {/* Profile Form */}        
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Full Name
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={name || ""}
                              onChange={(e) => setName(e.target.value)}
                              className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm"
                              placeholder="Enter your full name"
                            />
                            <IconEdit size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          </div>
                          {error.name && (
                            <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                              <span>⚠</span> {error.name}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Email Address
                          </label>
                          <div className="relative">
                            <input
                              type="email"
                              value={email || ""}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm"
                              placeholder="Enter your email address"
                            />
                            <IconMail size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          </div>
                          {error.email && (
                            <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                              <span>⚠</span> {error.email}
                            </p>
                          )}
                        </div>

                        <div className="pt-4">
                          <Button
                            btnName={isLoading ? "Updating Profile..." : "Update Profile"}
                            newClass="w-full py-4 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleEditProfile}
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings Tab */}
              {activeTab === "security" && (
                <div className="space-y-6">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800">Security Settings</h2>
                        <p className="text-gray-600">Change your password and secure your account</p>
                      </div>
                      <div className="p-3 bg-red-100 rounded-xl">
                        <IconShield size={24} className="text-red-600" />
                      </div>
                    </div>

                    <div className="max-w-2xl space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type="password"
                            value={oldPassword || ""}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm"
                            placeholder="Enter current password"
                          />
                          <IconLock size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                        {error.oldPassword && (
                          <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                            <span>⚠</span> {error.oldPassword}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type="password"
                            value={newPassword || ""}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm"
                            placeholder="Enter new password"
                          />
                          <IconRefresh size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                        {error.newPassword && (
                          <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                            <span>⚠</span> {error.newPassword}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <input
                            type="password"
                            value={confirmPassword || ""}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all duration-200 bg-white/50 backdrop-blur-sm"
                            placeholder="Confirm new password"
                          />
                          <IconCheck size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                        {error.confirmPassword && (
                          <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                            <span>⚠</span> {error.confirmPassword}
                          </p>
                        )}
                      </div>

                      <div className="pt-4">
                        <Button
                          btnName={isLoading ? "Updating Password..." : "Change Password"}
                          newClass="w-full py-4 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={handlePassword}
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  );
};

export default Profile;