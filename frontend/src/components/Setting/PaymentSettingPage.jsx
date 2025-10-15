import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSetting, handleSwitchUpdate, updateSetting } from '../../store/settingSlice';
import { toast } from 'react-toastify';

const PaymentSettingPage = () => {
  const [razorPaySwitch, setRazorPaySwitch] = useState(false);
  const [stripePublishableKey, setStripePublishableKey] = useState('');
  const [stripeSecretKey, setStripeSecretKey] = useState('');
  const [stripeSwitch, setStripeSwitch] = useState(false);
  const [googlePlaySwitch, setGooglePlaySwitch] = useState(false);
  const [flutterWaveId, setFlutterWaveId] = useState('');
  const [isFlutterWaveSwitch, setIsFlutterWaveSwitch] = useState(false);
  const [razorSecretKey, setRazorSecretKey] = useState('');
  const [razorPayId, setRazorPayId] = useState('');

  const { setting } = useSelector((state) => state.setting);
  const dispatch = useDispatch();

  useEffect(() => {
    if (setting) {
      setRazorPayId(setting?.razorPayId || '');
      setStripeSwitch(setting?.stripeSwitch || false);
      setRazorPaySwitch(setting?.razorPaySwitch || false);
      setStripeSecretKey(setting?.stripeSecretKey || '');
      setStripePublishableKey(setting?.stripePublishableKey || '');
      setRazorSecretKey(setting?.razorSecretKey || '');
      setGooglePlaySwitch(setting?.googlePlaySwitch || false);
      setFlutterWaveId(setting?.flutterWaveId || '');
      setIsFlutterWaveSwitch(setting?.flutterWaveSwitch || false);
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
      razorPayId: razorPayId,
      razorSecretKey: razorSecretKey,
      stripeSecretKey: stripeSecretKey,
      stripePublishableKey: stripePublishableKey,
      flutterWaveId: flutterWaveId,
      settingId: setting?._id,
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

  const PaymentGatewayCard = ({ 
    title, 
    isEnabled, 
    onToggle, 
    toggleType,
    fields = [],
    color = 'red'
  }) => {
    const colorClasses = {
      red: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-800',
        light: 'text-red-600',
        gradient: 'from-red-500 to-rose-500',
        icon: 'text-red-500'
      },
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-800',
        light: 'text-blue-600',
        gradient: 'from-blue-500 to-blue-600',
        icon: 'text-blue-500'
      },
      green: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-800',
        light: 'text-green-600',
        gradient: 'from-green-500 to-green-600',
        icon: 'text-green-500'
      },
      purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        text: 'text-purple-800',
        light: 'text-purple-600',
        gradient: 'from-purple-500 to-purple-600',
        icon: 'text-purple-500'
      }
    };

    const currentColor = colorClasses[color];

    return (
      <div className={`rounded-2xl border ${currentColor.border} ${currentColor.bg} p-6`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 ${currentColor.bg} rounded-xl border ${currentColor.border} flex items-center justify-center`}>
              <svg className={`w-6 h-6 ${currentColor.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <h3 className={`text-lg font-bold ${currentColor.text}`}>{title}</h3>
              <p className={`text-sm ${currentColor.light}`}>
                Status: <span className={`font-semibold ${isEnabled ? 'text-green-600' : 'text-red-600'}`}>
                  {isEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={() => onToggle(toggleType)}
            className={`relative inline-flex items-center h-7 rounded-full w-14 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isEnabled 
                ? `bg-gradient-to-r ${currentColor.gradient}` 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
          >
            <span className="sr-only">Enable {title}</span>
            <span
              className={`inline-block w-5 h-5 transform bg-white rounded-full transition duration-200 ease-in-out ${
                isEnabled ? 'translate-x-8' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {fields.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((field, index) => (
              <div key={index}>
                <label className={`block text-sm font-medium ${currentColor.text} mb-2`}>
                  {field.label}
                </label>
                <input
                  type="text"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={field.placeholder}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-50 to-rose-50 border-b border-red-200 px-6 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-red-800">Payment Gateway Settings</h2>
            <p className="text-red-600 text-sm mt-1">
              Configure and manage payment gateway integrations
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
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* RazorPay */}
          <PaymentGatewayCard
            title="RazorPay Settings"
            isEnabled={razorPaySwitch}
            onToggle={handleChange}
            toggleType="razorPaySwitch"
            color="blue"
            fields={[
              {
                label: "RazorPay ID",
                value: razorPayId,
                onChange: (e) => setRazorPayId(e.target.value),
                placeholder: "Enter RazorPay ID"
              },
              {
                label: "RazorPay Secret Key",
                value: razorSecretKey,
                onChange: (e) => setRazorSecretKey(e.target.value),
                placeholder: "Enter RazorPay Secret Key"
              }
            ]}
          />

          {/* Stripe */}
          <PaymentGatewayCard
            title="Stripe Settings"
            isEnabled={stripeSwitch}
            onToggle={handleChange}
            toggleType="stripeSwitch"
            color="green"
            fields={[
              {
                label: "Stripe Publishable Key",
                value: stripePublishableKey,
                onChange: (e) => setStripePublishableKey(e.target.value),
                placeholder: "Enter Stripe Publishable Key"
              },
              {
                label: "Stripe Secret Key",
                value: stripeSecretKey,
                onChange: (e) => setStripeSecretKey(e.target.value),
                placeholder: "Enter Stripe Secret Key"
              }
            ]}
          />

          {/* Google Play */}
          <PaymentGatewayCard
            title="Google Play Settings"
            isEnabled={googlePlaySwitch}
            onToggle={handleChange}
            toggleType="googlePlaySwitch"
            color="red"
          />

          {/* FlutterWave */}
          <PaymentGatewayCard
            title="FlutterWave Settings"
            isEnabled={isFlutterWaveSwitch}
            onToggle={handleChange}
            toggleType="flutterWaveSwitch"
            color="purple"
            fields={[
              {
                label: "FlutterWave ID",
                value: flutterWaveId,
                onChange: (e) => setFlutterWaveId(e.target.value),
                placeholder: "Enter FlutterWave ID"
              }
            ]}
          />
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-red-50 rounded-xl p-4 border border-red-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-red-600">Active Gateways</p>
                <p className="text-lg font-bold text-red-800">
                  {[razorPaySwitch, stripeSwitch, googlePlaySwitch, isFlutterWaveSwitch].filter(Boolean).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
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
          
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-green-600">Status</p>
                <p className="text-lg font-bold text-green-800">Live</p>
              </div>
            </div>
          </div>
          
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-amber-600">Total Gateways</p>
                <p className="text-lg font-bold text-amber-800">4</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-end">
          <button
            onClick={() => {
              setRazorPayId(setting?.razorPayId || '');
              setRazorSecretKey(setting?.razorSecretKey || '');
              setStripePublishableKey(setting?.stripePublishableKey || '');
              setStripeSecretKey(setting?.stripeSecretKey || '');
              setFlutterWaveId(setting?.flutterWaveId || '');
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

export default PaymentSettingPage;