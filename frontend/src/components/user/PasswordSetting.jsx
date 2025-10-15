/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import Button from "../../extra/Button";
import Input from "../../extra/Input";
import { useSelector } from "react-redux";
import { userPasswordChange } from "../../store/userSlice";
import { Key, Save, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";

const PasswordSetting = ({ userProfileData }) => {
  const dispatch = useAppDispatch();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userId, setUserId] = useState("");
  const [isChannel, setIsChannel] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const { dialogueData } = useSelector((state) => state.dialogue);

  useEffect(() => {
    setUserId(userProfileData?._id);
    setIsChannel(userProfileData?.isChannel);
    setCurrentPassword(userProfileData?.password || "");
  }, [userProfileData]);

  // Password strength validation
  const validatePassword = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    
    return requirements;
  };

  const passwordRequirements = validatePassword(newPassword);

  const handleSubmit = () => {
    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword ||
      newPassword !== confirmPassword
    ) {
      let newError = {
        currentPassword: !currentPassword
          ? "Current Password Is Required !"
          : "",
        newPassword: !newPassword ? "New Password Is Required !" : "",
        confirmPassword: !confirmPassword
          ? "Confirm Password Is Required !"
          : newPassword !== confirmPassword
            ? "Confirm Password Does Not Match !"
            : "",
      };
      setError({ ...newError });
    } else {
      let passwordChangeData = {
        oldPass: currentPassword,
        newPass: newPassword,
        confirmPass: confirmPassword,
        userId: userId,
      };
      const payload = {
        id: dialogueData?._id,
        data: passwordChangeData,
      };
      dispatch(userPasswordChange(payload));
    }
  };

  const clearError = (field) => {
    setError(prevError => ({
      ...prevError,
      [field]: ""
    }));
  };

  const PasswordRequirement = ({ met, text }) => (
    <div className="flex items-center space-x-2">
      {met ? (
        <CheckCircle className="w-4 h-4 text-green-500" />
      ) : (
        <XCircle className="w-4 h-4 text-gray-400" />
      )}
      <span className={`text-sm ${met ? 'text-green-600' : 'text-gray-500'}`}>
        {text}
      </span>
    </div>
  );

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Key className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h5 className="text-xl font-semibold text-gray-900">
                Password Settings
              </h5>
              <p className="text-sm text-gray-600 mt-1">
                Update your password to keep your account secure
              </p>
            </div>
          </div>
          <Button
            btnName={"Update Password"}
            btnIcon={<Save className="w-4 h-4" />}
            type={"button"}
            onClick={handleSubmit}
            newClass="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 shadow-sm"
          />
        </div>

        {/* Form */}
        <form className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Current Password */}
            <div className="relative">
              <Input
                type={showCurrentPassword ? "text" : "password"}
                label={"Current Password"}
                name={"currentPassword"}
                placeholder={"Enter your current password..."}
                value={currentPassword}
                errorMessage={error.currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  if (e.target.value) {
                    clearError("currentPassword");
                  }
                }}
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* New Password */}
            <div className="relative">
              <Input
                type={showNewPassword ? "text" : "password"}
                label={"New Password"}
                name={"newPassword"}
                placeholder={"Enter your new password..."}
                value={newPassword}
                errorMessage={error.newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (e.target.value) {
                    clearError("newPassword");
                  }
                  if (confirmPassword && e.target.value === confirmPassword) {
                    clearError("confirmPassword");
                  }
                }}
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password Strength */}
            {newPassword && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h6 className="text-sm font-medium text-gray-900 mb-3">
                  Password Strength
                </h6>
                <div className="space-y-2">
                  <PasswordRequirement
                    met={passwordRequirements.length}
                    text="At least 8 characters"
                  />
                  <PasswordRequirement
                    met={passwordRequirements.uppercase}
                    text="One uppercase letter"
                  />
                  <PasswordRequirement
                    met={passwordRequirements.lowercase}
                    text="One lowercase letter"
                  />
                  <PasswordRequirement
                    met={passwordRequirements.number}
                    text="One number"
                  />
                  <PasswordRequirement
                    met={passwordRequirements.special}
                    text="One special character"
                  />
                </div>
              </div>
            )}

            {/* Confirm New Password */}
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                label={"Confirm New Password"}
                name={"confirmNewPassword"}
                placeholder={"Confirm your new password..."}
                value={confirmPassword}
                errorMessage={error.confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (e.target.value) {
                    if (newPassword === e.target.value) {
                      clearError("confirmPassword");
                    } else {
                      setError(prevError => ({
                        ...prevError,
                        confirmPassword: "Confirm Password Does Not Match !"
                      }));
                    }
                  }
                }}
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordSetting;