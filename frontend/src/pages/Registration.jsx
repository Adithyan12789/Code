/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, signUpAdmin } from "../store/adminSlice";
import Input from "../extra/Input";
import Button from "../extra/Button";
import Logo from "../assets/images/mainLogo.png";
import { projectName } from "../util/config";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IconEye, IconEyeOff, IconMail, IconLock, IconKey } from "@tabler/icons-react";
import LiquidEther from "./LiquidEther";

export default function Registration() {
  const dispatch = useDispatch();
  const { isAuth, admin } = useSelector((state) => state.admin);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [code, setCode] = useState("");
  const [type, setType] = useState("password");
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState({
    email: "",
    password: "",
    newPassword: "",
    code: "",
  });

  useEffect(() => {}, [isAuth, admin]);

  const hideShow = () => {
    setType(type === "password" ? "text" : "password");
  };

  const handleSubmit = async () => {
    let errorObj = {};
    if (!email) errorObj.email = "Email is required!";
    if (!password) errorObj.password = "Password is required!";
    if (!newPassword) errorObj.newPassword = "Confirm Password is required!";
    if (password && newPassword && password !== newPassword)
      errorObj.newPassword = "Password and Confirm Password must match!";
    if (!code) errorObj.code = "Purchase code is required!";

    if (Object.keys(errorObj).length > 0) {
      setError(errorObj);
      return;
    }

    setIsLoading(true);
    const payload = { email, password, newPassword, code };
    try {
      const res = await dispatch(signUpAdmin(payload));
      const apiData = res?.payload?.data;
      toast.success(apiData.message);
      navigate("/");
    } catch (err) {
      console.error("CATCH ERROR:", err);
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit();
    }
  };

  const handleLoginRedirect = () => {
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-red-50 to-pink-50">
      {/* Left Side - Liquid Ether Background */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-gradient-to-br from-red-900 via-pink-900 to-rose-800 relative overflow-hidden">
        <div className="absolute inset-0">
          <LiquidEther
            colors={['#ff2727', '#ff0080', '#B19EEF']}
            mouseForce={20}
            cursorSize={100}
            isViscous={false}
            viscous={30}
            iterationsViscous={32}
            iterationsPoisson={32}
            resolution={0.5}
            isBounce={false}
            autoDemo={true}
            autoSpeed={0.5}
            autoIntensity={2.2}
            takeoverDuration={0.25}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
          />
        </div>

        {/* Welcome Content Overlay */}
        <div className="relative z-10 text-center text-white px-8">
          <h1 className="text-5xl font-bold mb-6 drop-shadow-lg bg-gradient-to-r from-white to-pink-100 bg-clip-text text-transparent">
            Join Us Today!
          </h1>
          <p className="text-xl opacity-90 mb-8 drop-shadow-md font-light">
            Start your journey with{" "}
            <span className="font-semibold text-white">{projectName}</span>
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-pink-200 to-transparent mx-auto mb-8 rounded-full"></div>
          <p className="text-lg opacity-90 font-light drop-shadow-sm">
            "Create your account and begin connecting"
          </p>
        </div>
      </div>

      {/* Right Side Form */}
      <div className="flex w-full md:w-1/2 items-center justify-center px-6 sm:px-8 lg:px-12">
        <div className="w-full max-w-150 bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <img src={Logo} alt="Logo" className="h-20 w-20 drop-shadow-lg" />
              <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-pink-600 rounded-full opacity-10 blur-sm"></div>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-red-800 to-pink-600 bg-clip-text text-transparent mb-3">
              Create Account
            </h2>
            <p className="text-gray-700 text-lg">
              Sign up for your {projectName} account
            </p>
          </div>

          {/* Email Input */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-3 text-sm uppercase tracking-wide">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors">
                <IconMail size={20} />
              </div>
              <input
                type="email"
                value={email}
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl bg-white/50 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all duration-200 shadow-sm hover:shadow-md"
                placeholder="Enter your email"
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError((prev) => ({
                    ...prev,
                    email: e.target.value ? "" : "Email is required",
                  }));
                }}
                onKeyPress={handleKeyPress}
              />
            </div>
            {error.email && (
              <p className="text-red-600 text-sm mt-2 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error.email}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-3 text-sm uppercase tracking-wide">
              Password
            </label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors">
                <IconLock size={20} />
              </div>
              <input
                type={type}
                value={password}
                className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl bg-white/50 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all duration-200 shadow-sm hover:shadow-md"
                placeholder="Enter your password"
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError((prev) => ({
                    ...prev,
                    password: e.target.value ? "" : "Password is required",
                  }));
                }}
                onKeyPress={handleKeyPress}
              />
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-red-600 transition-colors p-1 rounded-lg hover:bg-red-50"
                onClick={hideShow}
              >
                {type === "password" ? (
                  <IconEye size={20} />
                ) : (
                  <IconEyeOff size={20} />
                )}
              </span>
            </div>
            {error.password && (
              <p className="text-red-600 text-sm mt-2 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error.password}
              </p>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-3 text-sm uppercase tracking-wide">
              Confirm Password
            </label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors">
                <IconLock size={20} />
              </div>
              <input
                type={type}
                value={newPassword}
                className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl bg-white/50 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all duration-200 shadow-sm hover:shadow-md"
                placeholder="Confirm your password"
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setError((prev) => ({
                    ...prev,
                    newPassword: e.target.value ? "" : "Confirm Password is required",
                  }));
                }}
                onKeyPress={handleKeyPress}
              />
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-red-600 transition-colors p-1 rounded-lg hover:bg-red-50"
                onClick={hideShow}
              >
                {type === "password" ? (
                  <IconEye size={20} />
                ) : (
                  <IconEyeOff size={20} />
                )}
              </span>
            </div>
            {error.newPassword && (
              <p className="text-red-600 text-sm mt-2 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error.newPassword}
              </p>
            )}
          </div>

          {/* Purchase Code Input */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-3 text-sm uppercase tracking-wide">
              Purchase Code
            </label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-red-500 transition-colors">
                <IconKey size={20} />
              </div>
              <input
                type="text"
                value={code}
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl bg-white/50 focus:bg-white focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all duration-200 shadow-sm hover:shadow-md"
                placeholder="Enter purchase code"
                onChange={(e) => {
                  setCode(e.target.value);
                  setError((prev) => ({
                    ...prev,
                    code: e.target.value ? "" : "Purchase Code is required",
                  }));
                }}
                onKeyPress={handleKeyPress}
              />
            </div>
            {error.code && (
              <p className="text-red-600 text-sm mt-2 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error.code}
              </p>
            )}
          </div>

          {/* Sign Up Button */}
          <Button
            btnName={isLoading ? "Creating Account..." : "Create Account"}
            newClass="w-full py-4 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            onClick={handleSubmit}
            disabled={isLoading}
          />

          {/* Divider */}
          <div className="relative flex items-center my-8">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-sm">or</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* Additional Info */}
          <div className="text-center">
            <p className="text-gray-700">
              Already have an account?{" "}
              <span 
                className="text-red-600 hover:text-red-800 cursor-pointer font-semibold hover:underline transition-colors"
                onClick={handleLoginRedirect}
              >
                Sign in now
              </span>
            </p>
          </div>

          {/* Security Note */}
          <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-100">
            <p className="text-xs text-red-700 text-center">
              🔒 Your information is encrypted and secure
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}