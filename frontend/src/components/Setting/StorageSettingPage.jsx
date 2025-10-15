import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getSetting, saveToggle, updateSetting } from "../../store/settingSlice";

const StorageSettingPage = () => {
  const { setting } = useSelector((state) => state.setting);
  const dispatch = useDispatch();

  const [localStorage, setLocalStorage] = useState(false);
  const [awsS3Storage, setAwsS3Storage] = useState(false);
  const [digitalOceanStorage, setDigitalOceanStorage] = useState(false);
  const [selectedStorage, setSelectedStorage] = useState("");

  // Digital Ocean state
  const [doEndpoint, setdoEndpoint] = useState("");
  const [doAccessKey, setdoAccessKey] = useState("");
  const [doSecretKey, setdoSecretKey] = useState("");
  const [doHostname, setdoHostname] = useState("");
  const [doBucketName, setdoBucketName] = useState("");
  const [doRegion, setdoRegion] = useState("");

  // AWS state
  const [awsEndpoint, setawsEndpoint] = useState("");
  const [awsAccessKey, setawsAccessKey] = useState("");
  const [awsSecretKey, setawsSecretKey] = useState("");
  const [awsHostname, setawsHostname] = useState("");
  const [awsBucketName, setawsBucketName] = useState("");
  const [awsRegion, setawsRegion] = useState("");

  useEffect(() => {
    const payload = {};
    dispatch(getSetting(payload));
  }, [dispatch]);

  useEffect(() => {
    if (setting) {
      setdoEndpoint(setting?.doEndpoint || "");
      setdoAccessKey(setting?.doAccessKey || "");
      setdoSecretKey(setting?.doSecretKey || "");
      setdoHostname(setting?.doHostname || "");
      setdoBucketName(setting?.doBucketName || "");
      setdoRegion(setting?.doRegion || "");

      setawsEndpoint(setting?.awsEndpoint || "");
      setawsAccessKey(setting?.awsAccessKey || "");
      setawsSecretKey(setting?.awsSecretKey || "");
      setawsHostname(setting?.awsHostname || "");
      setawsBucketName(setting?.awsBucketName || "");
      setawsRegion(setting?.awsRegion || "");

      if (setting?.storage) {
        setAwsS3Storage(setting?.storage?.awsS3 || false);
        setDigitalOceanStorage(setting?.storage?.digitalOcean || false);
        setLocalStorage(setting?.storage?.local || false);
      }
    }
  }, [setting]);

  const handleSubmit = () => {
    const settingDataAd = {
      doEndpoint,
      doAccessKey,
      doSecretKey,
      doHostname,
      doBucketName,
      doRegion,
      awsEndpoint,
      awsAccessKey,
      awsSecretKey,
      awsHostname,
      awsBucketName,
      awsRegion,
    };

    const payload = {
      ...settingDataAd,
      settingId: setting?._id,
    };

    dispatch(updateSetting(payload)).then((res) => {
      if (res?.payload?.status) {
        toast.success(res?.payload?.message);
        dispatch(getSetting());
      } else {
        toast.error(res?.payload?.message);
      }
    });
  };

  const handleChangeStorage = (type) => {
    setLocalStorage(type === "local");
    setAwsS3Storage(type === "awsS3");
    setDigitalOceanStorage(type === "digitalOcean");
    setSelectedStorage(type);
  };

  const handleSaveStorage = () => {
    const payload = {
      settingId: setting?._id,
      type: selectedStorage,
    };
    
    dispatch(saveToggle(payload)).then((res) => {
      if (res?.payload?.status) {
        toast.success(res?.payload?.message);
        dispatch(getSetting());
      }
    });
  };

  const StorageCard = ({ title, children, icon, color = "red" }) => {
    const colorClasses = {
      red: { bg: "bg-red-50", border: "border-red-200", text: "text-red-800" },
      blue: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-800" },
      green: { bg: "bg-green-50", border: "border-green-200", text: "text-green-800" }
    };

    const currentColor = colorClasses[color];

    return (
      <div className={`rounded-2xl border ${currentColor.border} ${currentColor.bg} p-6`}>
        <div className="flex items-center space-x-3 mb-6">
          <div className={`w-12 h-12 ${currentColor.bg} rounded-xl border ${currentColor.border} flex items-center justify-center`}>
            {icon}
          </div>
          <h3 className={`text-xl font-bold ${currentColor.text}`}>{title}</h3>
        </div>
        {children}
      </div>
    );
  };

  const StorageOption = ({ name, isActive, onToggle, type, description }) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-200 last:border-b-0">
      <div className="flex-1">
        <div className="flex items-center space-x-3">
          <span className="text-gray-800 font-semibold">{name}</span>
          {isActive && (
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
              Active
            </span>
          )}
        </div>
        {description && (
          <p className="text-gray-600 text-sm mt-1">{description}</p>
        )}
      </div>
      <button
        onClick={() => onToggle(type)}
        className={`relative inline-flex items-center h-7 rounded-full w-14 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
          isActive 
            ? 'bg-gradient-to-r from-red-500 to-rose-500' 
            : 'bg-gray-300 hover:bg-gray-400'
        }`}
      >
        <span className="sr-only">Enable {name}</span>
        <span
          className={`inline-block w-5 h-5 transform bg-white rounded-full transition duration-200 ease-in-out ${
            isActive ? 'translate-x-8' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  const FormField = ({ label, value, onChange, placeholder, helpText, type = "text" }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
      />
      {helpText && (
        <p className="text-red-500 text-xs">{helpText}</p>
      )}
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
                  Storage Configuration
                </h1>
                <p className="text-red-100 text-opacity-90">
                  Configure and manage cloud storage providers and settings
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
          {/* Digital Ocean Settings */}
          <StorageCard 
            title="Digital Ocean Spaces"
            color="blue"
            icon={
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
              </svg>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Endpoint"
                value={doEndpoint}
                onChange={(e) => setdoEndpoint(e.target.value)}
                placeholder="https://region.digitaloceanspaces.com"
                helpText="e.g https://region.digitaloceanspaces.com"
              />
              <FormField
                label="Host Name"
                value={doHostname}
                onChange={(e) => setdoHostname(e.target.value)}
                placeholder="https://bucketname.region.digitaloceanspaces.com"
                helpText="e.g. https://bucketname.region.digitaloceanspaces.com"
              />
              <FormField
                label="Access Key"
                value={doAccessKey}
                onChange={(e) => setdoAccessKey(e.target.value)}
                placeholder="Enter access key"
                type="password"
              />
              <FormField
                label="Secret Key"
                value={doSecretKey}
                onChange={(e) => setdoSecretKey(e.target.value)}
                placeholder="Enter secret key"
                type="password"
              />
              <FormField
                label="Bucket Name"
                value={doBucketName}
                onChange={(e) => setdoBucketName(e.target.value)}
                placeholder="Enter bucket name"
              />
              <FormField
                label="Region"
                value={doRegion}
                onChange={(e) => setdoRegion(e.target.value)}
                placeholder="Enter region"
              />
            </div>
          </StorageCard>

          {/* AWS S3 Settings */}
          <StorageCard 
            title="AWS S3 Storage"
            color="green"
            icon={
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
              </svg>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Endpoint"
                value={awsEndpoint}
                onChange={(e) => setawsEndpoint(e.target.value)}
                placeholder="https://s3.region.amazonaws.com"
                helpText="e.g https://s3.region.amazonaws.com"
              />
              <FormField
                label="Host Name"
                value={awsHostname}
                onChange={(e) => setawsHostname(e.target.value)}
                placeholder="https://bucket-name.s3.region.amazonaws.com"
                helpText="e.g https://bucket-name.s3.region.amazonaws.com"
              />
              <FormField
                label="Access Key"
                value={awsAccessKey}
                onChange={(e) => setawsAccessKey(e.target.value)}
                placeholder="Enter access key"
                type="password"
              />
              <FormField
                label="Secret Key"
                value={awsSecretKey}
                onChange={(e) => setawsSecretKey(e.target.value)}
                placeholder="Enter secret key"
                type="password"
              />
              <FormField
                label="Bucket Name"
                value={awsBucketName}
                onChange={(e) => setawsBucketName(e.target.value)}
                placeholder="Enter bucket name"
              />
              <FormField
                label="Region"
                value={awsRegion}
                onChange={(e) => setawsRegion(e.target.value)}
                placeholder="Enter region"
              />
            </div>
          </StorageCard>
        </div>

        {/* Storage Selection */}
        <div className="mt-6">
          <StorageCard 
            title="Storage Provider Selection"
            icon={
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
          >
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <StorageOption
                  name="Local Storage"
                  isActive={localStorage}
                  onToggle={handleChangeStorage}
                  type="local"
                  description="Store files on your local server"
                />
                <StorageOption
                  name="AWS S3 Storage"
                  isActive={awsS3Storage}
                  onToggle={handleChangeStorage}
                  type="awsS3"
                  description="Amazon Web Services S3 cloud storage"
                />
                <StorageOption
                  name="Digital Ocean Spaces"
                  isActive={digitalOceanStorage}
                  onToggle={handleChangeStorage}
                  type="digitalOcean"
                  description="Digital Ocean object storage service"
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleSaveStorage}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl hover:from-red-600 hover:to-rose-600 transition-all duration-200 shadow-sm hover:shadow-md font-semibold"
                >
                  Save Storage Selection
                </button>
              </div>
            </div>
          </StorageCard>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-red-200 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-red-600">Active Storage</p>
                <p className="text-lg font-bold text-red-800">
                  {[localStorage, awsS3Storage, digitalOceanStorage].filter(Boolean).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-blue-200 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-600">Status</p>
                <p className="text-lg font-bold text-blue-800">Configured</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-green-200 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-green-600">Last Updated</p>
                <p className="text-lg font-bold text-green-800">Just now</p>
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
                <p className="text-sm font-medium text-amber-600">Providers</p>
                <p className="text-lg font-bold text-amber-800">3</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorageSettingPage;