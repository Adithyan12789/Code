/* eslint-disable no-unused-vars */
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getSetting, updateSetting } from '../../store/settingSlice';
import { setToast } from '../../util/toastServices';

const LoginRewardSetting = () => {
  const { setting } = useSelector((state) => state.setting);
  const dispatch = useDispatch();
  
  const [loginRewardCoins, setLoginRewardCoins] = useState('');
  const [error, setError] = useState({ loginRewardCoins: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(getSetting());
  }, [dispatch]);

  useEffect(() => {
    setLoginRewardCoins(setting?.loginRewardCoins?.toString() || '');
  }, [setting]);

  const validateForm = () => {
    const newError = {};
    const loginRewardCoinsValue = parseInt(loginRewardCoins);

    if (!loginRewardCoins.trim()) {
      newError.loginRewardCoins = 'Login reward coins are required';
    } else if (loginRewardCoinsValue <= 0) {
      newError.loginRewardCoins = 'Amount must be greater than 0';
    } else if (loginRewardCoinsValue > 1000000) {
      newError.loginRewardCoins = 'Amount is too large';
    }

    setError(newError);
    return Object.keys(newError).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const settingDataSubmit = {
        settingId: setting?._id || '',
        loginRewardCoins: parseInt(loginRewardCoins),
      };

      const res = await dispatch(updateSetting(settingDataSubmit));
      
      if (res?.payload?.status) {
        setToast("success", res?.payload?.message);
      } else {
        setToast("error", res?.payload?.message);
      }
    } catch (error) {
      setToast("error", "Failed to update login reward settings");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-red-600 to-rose-600 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white mb-2">
                  Login Reward Settings
                </h1>
                <p className="text-red-100 text-opacity-90">
                  Configure coin rewards for user logins to encourage daily engagement
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-white bg-opacity-20 rounded-xl px-4 py-2">
                  <span className="text-white font-semibold text-sm">
                    Daily Login Bonus
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Configuration Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-red-800">Login Reward Configuration</h3>
                  <p className="text-red-600 text-sm">Set the coin reward for daily user logins</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Login Reward Input */}
                <div>
                  <label className="block text-sm font-medium text-red-700 mb-2">
                    Login Reward Coins <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={loginRewardCoins}
                      onChange={(e) => {
                        setLoginRewardCoins(e.target.value);
                        if (error.loginRewardCoins) {
                          setError(prev => ({ ...prev, loginRewardCoins: '' }));
                        }
                      }}
                      onKeyPress={handleKeyPress}
                      placeholder="Enter coin amount for login reward"
                      min="1"
                      max="1000000"
                      className={`w-full px-4 py-3 pl-12 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${
                        error.loginRewardCoins 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-gray-300 focus:border-transparent'
                      }`}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                  </div>
                  {error.loginRewardCoins && (
                    <p className="text-red-600 text-sm mt-2 flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{error.loginRewardCoins}</span>
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => {
                      setLoginRewardCoins(setting?.loginRewardCoins?.toString() || '');
                      setError({ loginRewardCoins: '' });
                    }}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
                  >
                    Reset
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`px-6 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl transition-all duration-200 shadow-sm hover:shadow-md font-semibold ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:from-red-600 hover:to-rose-600'
                    }`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Saving...</span>
                      </div>
                    ) : (
                      'Save Settings'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Info and Stats Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Current Setting Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-green-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-green-600">Current Setting</p>
                  <p className="text-2xl font-bold text-green-800">
                    {setting?.loginRewardCoins || 0}
                  </p>
                </div>
              </div>
              <p className="text-green-600 text-sm">
                Users receive this amount every time they log in
              </p>
            </div>

            {/* Impact Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-blue-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-600">User Engagement</p>
                  <p className="text-lg font-bold text-blue-800">High Impact</p>
                </div>
              </div>
              <p className="text-blue-600 text-sm">
                Login rewards significantly increase daily active users
              </p>
            </div>

            {/* Best Practices Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-amber-200 p-6">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-amber-600">Best Practices</p>
                  <ul className="text-amber-600 text-sm mt-2 space-y-1">
                    <li>• Set meaningful but sustainable rewards</li>
                    <li>• Consider your economy balance</li>
                    <li>• Higher rewards increase engagement</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        {loginRewardCoins && !error.loginRewardCoins && (
          <div className="mt-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-bold text-purple-800 mb-2">Reward Preview</h4>
                <p className="text-purple-600">
                  Users will receive <span className="font-bold text-purple-800">{loginRewardCoins} coins</span> every time they log in
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">{loginRewardCoins}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginRewardSetting;