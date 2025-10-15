import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getSetting, handleSwitchUpdate, updateSetting } from '../../store/settingSlice';

const AdsSettingPage = () => {
  const [androidGoogleInterstitial, setAndroidGoogleInterstitial] = useState('');
  const [googleNative, setGoogleNative] = useState('');
  const [iosInterstital, setIosInterstial] = useState('');
  const [googlePlaySwitch, setGooglePlaySwitch] = useState(false);
  const [iosNative, setIosNative] = useState('');
  const [adDisplayIndex, setAdDisplayIndex] = useState('');
  
  const { setting } = useSelector((state) => state.setting);
  const dispatch = useDispatch();

  useEffect(() => {
    if (setting) {
      setAndroidGoogleInterstitial(setting?.android?.google?.reward || '');
      setGoogleNative(setting?.android?.google?.native || '');
      setIosInterstial(setting?.ios?.google?.reward || '');
      setGooglePlaySwitch(setting?.googlePlaySwitch || false);
      setIosNative(setting?.ios?.google?.native || '');
      setAdDisplayIndex(setting?.adDisplayIndex || '');
    }
  }, [setting]);

  const handleChange = (type) => {
    const payload = {
      settingId: setting?._id || '',
      type: type,
    };
    dispatch(handleSwitchUpdate(payload)).then((res) => {
      if (res?.payload?.status) {
        toast.success(res?.payload?.message);
        dispatch(getSetting());
      } else {
        toast.error(res?.payload?.message);
      }
    });
  };

  const handleSubmit = () => {
    const settingDataAd = {
      androidGoogleReward: androidGoogleInterstitial,
      androidGoogleNative: googleNative,
      iosGoogleReward: iosInterstital,
      iosGoogleNative: iosNative,
      settingId: setting?._id || '',
    };
    
    dispatch(updateSetting(settingDataAd)).then((res) => {
      if (res?.payload?.status) {
        toast.success(res?.payload?.message);
        dispatch(getSetting());
      } else {
        toast.error(res?.payload?.message);
      }
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-50 to-rose-50 border-b border-red-200 px-6 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-red-800">Ads Configuration</h2>
            <p className="text-red-600 text-sm mt-1">
              Configure advertisement settings for Android and iOS platforms
            </p>
          </div>
          <button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-red-500 to-rose-500 text-white px-6 py-2 rounded-xl hover:from-red-600 hover:to-rose-600 transition-all duration-200 shadow-sm hover:shadow-md font-semibold"
          >
            Save Changes
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Android Settings */}
          <div className="bg-red-50 rounded-xl border border-red-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-red-800">Android Settings</h3>
                <p className="text-red-600 text-sm">Google Ads configuration for Android</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-red-700 mb-2">
                  Android Google Reward Ad Unit ID
                </label>
                <input
                  type="text"
                  value={androidGoogleInterstitial}
                  onChange={(e) => setAndroidGoogleInterstitial(e.target.value)}
                  placeholder="Enter reward ad unit ID..."
                  className="w-full px-4 py-3 border border-red-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-red-700 mb-2">
                  Android Google Native Ad Unit ID
                </label>
                <input
                  type="text"
                  value={googleNative}
                  onChange={(e) => setGoogleNative(e.target.value)}
                  placeholder="Enter native ad unit ID..."
                  className="w-full px-4 py-3 border border-red-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* iOS Settings */}
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-blue-800">iOS Settings</h3>
                <p className="text-blue-600 text-sm">Google Ads configuration for iOS</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  iOS Google Reward Ad Unit ID
                </label>
                <input
                  type="text"
                  value={iosInterstital}
                  onChange={(e) => setIosInterstial(e.target.value)}
                  placeholder="Enter reward ad unit ID..."
                  className="w-full px-4 py-3 border border-blue-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  iOS Google Native Ad Unit ID
                </label>
                <input
                  type="text"
                  value={iosNative}
                  onChange={(e) => setIosNative(e.target.value)}
                  placeholder="Enter native ad unit ID..."
                  className="w-full px-4 py-3 border border-blue-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Google Ads Toggle */}
        <div className="mt-6 bg-amber-50 rounded-xl border border-amber-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-amber-800">Google Ads Master Switch</h3>
                <p className="text-amber-600 text-sm">Enable or disable Google Ads across the entire application</p>
              </div>
            </div>
            
            <button
              onClick={() => handleChange("googlePlaySwitch")}
              className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 ${
                googlePlaySwitch ? 'bg-green-500' : 'bg-red-400'
              }`}
            >
              <span className="sr-only">Enable Google Ads</span>
              <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition duration-200 ease-in-out ${
                  googlePlaySwitch ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <div className="mt-4 flex items-center space-x-2 text-amber-700">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm">
              Current status: <span className={`font-semibold ${googlePlaySwitch ? 'text-green-600' : 'text-red-600'}`}>
                {googlePlaySwitch ? 'Enabled' : 'Disabled'}
              </span>
            </span>
          </div>
        </div>

        {/* Ad Display Frequency */}
        <div className="mt-6 bg-purple-50 rounded-xl border border-purple-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-purple-800">Ad Display Frequency</h3>
              <p className="text-purple-600 text-sm">Control how often ads are displayed to users</p>
            </div>
          </div>

          <div className="max-w-md">
            <label className="block text-sm font-medium text-purple-700 mb-2">
              Ads Displayed After Number of Videos
            </label>
            <input
              type="number"
              value={adDisplayIndex}
              onChange={(e) => setAdDisplayIndex(e.target.value)}
              placeholder="Enter number of videos..."
              min="1"
              className="w-full px-4 py-3 border border-purple-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            />
            <p className="text-purple-600 text-xs mt-2">
              Set the number of videos after which an ad will be displayed
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-end">
          <button
            onClick={() => {
              setAndroidGoogleInterstitial(setting?.android?.google?.reward || '');
              setGoogleNative(setting?.android?.google?.native || '');
              setIosInterstial(setting?.ios?.google?.reward || '');
              setIosNative(setting?.ios?.google?.native || '');
              setAdDisplayIndex(setting?.adDisplayIndex || '');
            }}
            className="px-6 py-3 border border-red-300 text-red-700 rounded-xl hover:bg-red-50 transition-all duration-200 font-medium"
          >
            Reset Changes
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl hover:from-red-600 hover:to-rose-600 transition-all duration-200 shadow-sm hover:shadow-md font-semibold"
          >
            Save All Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdsSettingPage;