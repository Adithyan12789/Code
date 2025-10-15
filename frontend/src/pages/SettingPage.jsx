import React, { useState } from "react";
import { RootLayout } from "../components/layout/Layout";

const SettingPage = () => {
  const [activeTab, setActiveTab] = useState("Setting");

  const tabs = [
    "Setting",
    "Ads Setting",
    "Payment Setting",
    "Report Reason",
    "Withdraw Setting",
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "Setting":
        return <AppSetting />;
      case "Ads Setting":
        return <AdSetting />;
      case "Payment Setting":
        return <PaymentSetting />;
      case "Withdraw Setting":
        return <WithdrawSetting />;
      case "Report Reason":
        return <ReportReasonSetting />;
      default:
        return <AppSetting />;
    }
  };

  return (
    <RootLayout>
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-red-600 to-rose-600 rounded-2xl shadow-xl p-6 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    Application Settings
                  </h1>
                  <p className="text-red-100 text-opacity-90 text-lg">
                    Configure and manage all application settings and preferences
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-white bg-opacity-20 rounded-xl px-4 py-2">
                    <span className="text-white font-semibold text-sm">
                      {tabs.length} Categories
                    </span>
                  </div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-100 text-sm font-medium">Live</span>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-2">
              <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 min-w-[150px] px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                      activeTab === tab
                        ? "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg transform scale-105"
                        : "text-red-700 bg-red-50 hover:bg-red-100 hover:text-red-800"
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      {getTabIcon(tab)}
                      <span className="text-xs sm:text-sm whitespace-nowrap">{tab}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden">
            {/* Active Tab Header */}
            <div className="bg-gradient-to-r from-red-50 to-rose-50 border-b border-red-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                    {getTabIcon(activeTab, true)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-red-800">
                      {activeTab} Configuration
                    </h2>
                    <p className="text-red-600 text-sm">
                      {getTabDescription(activeTab)}
                    </p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center space-x-2 bg-white px-3 py-1 rounded-full border border-red-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 text-sm font-medium">Active</span>
                </div>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {renderContent()}
            </div>
          </div>

          {/* Quick Stats Footer */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  <p className="text-lg font-bold text-red-800">{tabs.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 border border-amber-200 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-amber-600">Status</p>
                  <p className="text-lg font-bold text-amber-800">All Active</p>
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
            
            <div className="bg-white rounded-xl p-4 border border-blue-200 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-600">Version</p>
                  <p className="text-lg font-bold text-blue-800">v2.1.0</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  );
};

// Helper function to get icons for each tab
const getTabIcon = (tabName, large = false) => {
  const iconClass = large ? "w-4 h-4 text-white" : "w-3 h-3 sm:w-4 sm:h-4";
  
  switch (tabName) {
    case "Setting":
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case "Ads Setting":
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      );
    case "Payment Setting":
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      );
    case "Withdraw Setting":
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      );
    case "Report Reason":
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      );
    default:
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
  }
};

// Helper function to get tab descriptions
const getTabDescription = (tabName) => {
  switch (tabName) {
    case "Setting":
      return "Configure general application settings and preferences";
    case "Ads Setting":
      return "Manage advertisement settings and monetization options";
    case "Payment Setting":
      return "Set up payment gateways and transaction configurations";
    case "Withdraw Setting":
      return "Configure withdrawal settings and payout methods";
    case "Report Reason":
      return "Manage report reasons and moderation settings";
    default:
      return "Configure application settings and preferences";
  }
};

// Placeholder components - replace with your actual components
const AppSetting = () => (
  <div className="text-center py-12">
    <div className="bg-red-50 rounded-2xl p-8 max-w-md mx-auto">
      <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      <h3 className="text-xl font-bold text-red-800 mb-2">App Settings</h3>
      <p className="text-red-600">General application configuration panel</p>
    </div>
  </div>
);

const AdSetting = () => (
  <div className="text-center py-12">
    <div className="bg-amber-50 rounded-2xl p-8 max-w-md mx-auto">
      <svg className="w-16 h-16 text-amber-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
      <h3 className="text-xl font-bold text-amber-800 mb-2">Ad Settings</h3>
      <p className="text-amber-600">Advertisement and monetization configuration</p>
    </div>
  </div>
);

const PaymentSetting = () => (
  <div className="text-center py-12">
    <div className="bg-green-50 rounded-2xl p-8 max-w-md mx-auto">
      <svg className="w-16 h-16 text-green-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
      <h3 className="text-xl font-bold text-green-800 mb-2">Payment Settings</h3>
      <p className="text-green-600">Payment gateway and transaction settings</p>
    </div>
  </div>
);

const WithdrawSetting = () => (
  <div className="text-center py-12">
    <div className="bg-blue-50 rounded-2xl p-8 max-w-md mx-auto">
      <svg className="w-16 h-16 text-blue-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
      </svg>
      <h3 className="text-xl font-bold text-blue-800 mb-2">Withdraw Settings</h3>
      <p className="text-blue-600">Withdrawal and payout configuration</p>
    </div>
  </div>
);

const ReportReasonSetting = () => (
  <div className="text-center py-12">
    <div className="bg-purple-50 rounded-2xl p-8 max-w-md mx-auto">
      <svg className="w-16 h-16 text-purple-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
      <h3 className="text-xl font-bold text-purple-800 mb-2">Report Reason Settings</h3>
      <p className="text-purple-600">Report reasons and moderation settings</p>
    </div>
  </div>
);

SettingPage.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export default SettingPage;