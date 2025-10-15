import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getSetting, saveToggle, updateSetting } from "../../store/settingSlice";
import { toast } from "react-toastify";

const SettingPage = () => {
  const { setting } = useSelector((state) => state.setting);
  const dispatch = useDispatch();

  const [freeNewsForNonVip, setFreeNewsForNonVip] = useState("");
  const [durationOfShorts, setDurationOfShorts] = useState("");
  const [privacyPolicyLink, setPrivacyPolicyLink] = useState("");
  const [privacyPolicyText, setPrivacyPolicyText] = useState("");
  const [firebaseKeyText, setFirebaseKeyText] = useState("");
  const [localStorage, setLocalStorage] = useState(false);
  const [awsS3Storage, setAwsS3Storage] = useState(false);
  const [digitalOceanStorage, setDigitalOceanStorage] = useState(false);
  const [selectedStorage, setSelectedStorage] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [resendApiKey, setResendApiKey] = useState('');

  useEffect(() => {
    if (setting) {
      setFreeNewsForNonVip(setting?.freeNewsForNonVip || "");
      setDurationOfShorts(setting?.durationOfShorts || "");
      setFirebaseKeyText(JSON.stringify(setting?.privateKey) || "");
      setPrivacyPolicyLink(setting?.privacyPolicyLink || "");
      setPrivacyPolicyText(setting?.termsOfUsePolicyLink || "");
      setSupportEmail(setting?.contactEmail || "");
      setResendApiKey(setting?.resendApiKey || "");
      
      if (setting.storage) {
        setLocalStorage(setting?.storage?.local || false);
        setAwsS3Storage(setting?.storage?.awsS3 || false);
        setDigitalOceanStorage(setting?.storage?.digitalOcean || false);
      }
    }
  }, [setting]);

  const handleSubmit = () => {
    const data = {
      freeNewsForNonVip: freeNewsForNonVip,
      durationOfShorts: durationOfShorts,
      settingId: setting?._id || '',
      privateKey: firebaseKeyText,
      privacyPolicyLink: privacyPolicyLink,
      termsOfUsePolicyLink: privacyPolicyText,
      contactEmail: supportEmail,
      resendApiKey: resendApiKey,
      storage: {
        local: localStorage,
        awsS3: awsS3Storage,
        digitalOcean: digitalOceanStorage,
      },
    };
    
    dispatch(updateSetting(data)).then((res) => {
      if (res?.payload?.status) {
        toast.success(res?.payload?.message);
        dispatch(getSetting());
      }
    });
  };

  const handleStorageChange = (type) => {
    setLocalStorage(type === "local");
    setAwsS3Storage(type === "awsS3");
    setDigitalOceanStorage(type === "digitalOcean");
    setSelectedStorage(type);
  };

  const handleSaveStorage = () => {
    const payload = {
      settingId: setting?._id || '',
      type: selectedStorage,
    };

    dispatch(saveToggle(payload)).then((res) => {
      if (res?.payload?.status) {
        toast.success(res?.payload?.message);
        dispatch(getSetting());
      } else {
        toast.error(res?.payload?.message);
      }
    });
  };

  const SettingCard = ({ title, children, icon }) => (
    <div className="bg-white rounded-2xl border border-red-200 p-6 shadow-sm">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-red-800">{title}</h3>
      </div>
      {children}
    </div>
  );

  const StorageOption = ({ name, isActive, onToggle, type }) => (
    <div className="flex items-center justify-between py-3 border-b border-red-100 last:border-b-0">
      <span className="text-red-700 font-medium">{name}</span>
      <button
        onClick={() => onToggle(type)}
        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out ${
          isActive 
            ? 'bg-gradient-to-r from-red-500 to-rose-500' 
            : 'bg-gray-300 hover:bg-gray-400'
        }`}
      >
        <span className="sr-only">Enable {name}</span>
        <span
          className={`inline-block w-4 h-4 transform bg-white rounded-full transition duration-200 ease-in-out ${
            isActive ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-red-600 to-rose-600 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white mb-2">
                  Application Settings
                </h1>
                <p className="text-red-100 text-opacity-90">
                  Configure and manage all application settings and preferences
                </p>
              </div>
              <button
                onClick={handleSubmit}
                className="flex items-center space-x-2 bg-white text-red-600 px-6 py-3 rounded-xl hover:bg-red-50 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Save All Changes</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Firebase Notification Settings */}
          <SettingCard 
            title="Firebase Notification Settings"
            icon={
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            }
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-red-700 mb-2">
                  Private Key JSON
                </label>
                <textarea
                  rows={8}
                  value={firebaseKeyText}
                  onChange={(e) => setFirebaseKeyText(e.target.value)}
                  placeholder="Enter Firebase private key JSON..."
                  className="w-full px-4 py-3 border border-red-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 resize-none"
                />
              </div>
            </div>
          </SettingCard>

          {/* Non-VIP Access & Duration Settings */}
          <div className="space-y-6">
            <SettingCard 
              title="Non-VIP Access Settings"
              icon={
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-red-700 mb-2">
                    Free News For Non-VIP
                  </label>
                  <input
                    type="text"
                    value={freeNewsForNonVip}
                    onChange={(e) => setFreeNewsForNonVip(e.target.value)}
                    placeholder="Enter free news limit for non-VIP users..."
                    className="w-full px-4 py-3 border border-red-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
            </SettingCard>

            <SettingCard 
              title="Content Duration Settings"
              icon={
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-red-700 mb-2">
                    Duration Of Shorts (Seconds)
                  </label>
                  <input
                    type="text"
                    value={durationOfShorts}
                    onChange={(e) => setDurationOfShorts(e.target.value)}
                    placeholder="Enter duration of shorts in seconds..."
                    className="w-full px-4 py-3 border border-red-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
            </SettingCard>
          </div>

          {/* App Policy Settings */}
          <SettingCard 
            title="App Policy Settings"
            icon={
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-red-700 mb-2">
                  Privacy Policy Link
                </label>
                <input
                  type="text"
                  value={privacyPolicyLink}
                  onChange={(e) => setPrivacyPolicyLink(e.target.value)}
                  placeholder="Enter privacy policy link..."
                  className="w-full px-4 py-3 border border-red-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-red-700 mb-2">
                  Terms & Conditions Link
                </label>
                <input
                  type="text"
                  value={privacyPolicyText}
                  onChange={(e) => setPrivacyPolicyText(e.target.value)}
                  placeholder="Enter terms and conditions link..."
                  className="w-full px-4 py-3 border border-red-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          </SettingCard>

          {/* Email & Support Settings */}
          <div className="space-y-6">
            <SettingCard 
              title="Email API Settings"
              icon={
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-red-700 mb-2">
                    Resend API Key
                  </label>
                  <input
                    type="text"
                    value={resendApiKey}
                    onChange={(e) => setResendApiKey(e.target.value)}
                    placeholder="Enter Resend API key..."
                    className="w-full px-4 py-3 border border-red-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
            </SettingCard>

            <SettingCard 
              title="Support Email Settings"
              icon={
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-red-700 mb-2">
                    Support Email
                  </label>
                  <input
                    type="email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    placeholder="Enter support email address..."
                    className="w-full px-4 py-3 border border-red-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
            </SettingCard>
          </div>
        </div>

        {/* Storage Settings */}
        <div className="mt-6">
          <SettingCard 
            title="Storage Settings"
            icon={
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
              </svg>
            }
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <StorageOption 
                  name="Local Storage"
                  isActive={localStorage}
                  onToggle={handleStorageChange}
                  type="local"
                />
                <StorageOption 
                  name="AWS S3 Storage"
                  isActive={awsS3Storage}
                  onToggle={handleStorageChange}
                  type="awsS3"
                />
                <StorageOption 
                  name="Digital Ocean Space"
                  isActive={digitalOceanStorage}
                  onToggle={handleStorageChange}
                  type="digitalOcean"
                />
              </div>
              <div className="flex justify-end pt-4">
                <button
                  onClick={handleSaveStorage}
                  className="px-6 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl hover:from-red-600 hover:to-rose-600 transition-all duration-200 shadow-sm hover:shadow-md font-semibold"
                >
                  Save Storage Settings
                </button>
              </div>
            </div>
          </SettingCard>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-red-200 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-red-600">Settings Categories</p>
                <p className="text-lg font-bold text-red-800">6</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-green-200 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-green-600">Status</p>
                <p className="text-lg font-bold text-green-800">Active</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-blue-200 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-600">Last Updated</p>
                <p className="text-lg font-bold text-blue-800">Just now</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-amber-200 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-amber-600">Version</p>
                <p className="text-lg font-bold text-amber-800">v2.1.0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingPage;