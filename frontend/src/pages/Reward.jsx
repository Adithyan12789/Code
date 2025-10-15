import { useState } from "react";
import { RootLayout } from "../components/layout/Layout";
import AdsCoinRewardSetting from "../components/reward/AdsCoinRewardSetting.jsx";
import DailyRewardSetting from "../components/reward/DailyRewardSetting.jsx";
import RefralBonus from "../components/reward/RefralBonus.jsx";
import LoginRewardSetting from "../components/reward/LoginRewardSetting.jsx";

const Reward = () => {
    const [activeTab, setActiveTab] = useState("Ads Coin Reward");
    
    const tabs = [
        "Ads Coin Reward",
        "Daily Coin Reward",
        "Referral Reward",
        "Login Reward",
    ];

    const renderContent = () => {
        switch (activeTab) {
            case "Ads Coin Reward":
                return <AdsCoinRewardSetting />;
            case "Daily Coin Reward":
                return <DailyRewardSetting />;
            case "Referral Reward":
                return <RefralBonus />;
            case "Login Reward":
                return <LoginRewardSetting />;
            default:
                return <AdsCoinRewardSetting />;
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
                                        Reward System
                                    </h1>
                                    <p className="text-red-100 text-opacity-90 text-lg">
                                        Manage and configure all reward settings for your platform
                                    </p>
                                </div>
                                <div className="bg-white bg-opacity-20 rounded-xl px-4 py-2">
                                    <span className="text-white font-semibold text-sm">
                                        {tabs.length} Reward Types
                                    </span>
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
                                        className={`flex-1 min-w-[200px] px-6 py-4 rounded-xl font-semibold transition-all duration-200 ${
                                            activeTab === tab
                                                ? "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg transform scale-105"
                                                : "text-red-700 bg-red-50 hover:bg-red-100 hover:text-red-800"
                                        }`}
                                    >
                                        <div className="flex items-center justify-center space-x-2">
                                            {getTabIcon(tab)}
                                            <span className="text-sm sm:text-base">{tab}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden">
                        {/* Active Tab Indicator */}
                        <div className="bg-red-50 border-b border-red-200 px-6 py-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <h2 className="text-xl font-bold text-red-800">
                                    {activeTab} Settings
                                </h2>
                            </div>
                            <p className="text-red-600 text-sm mt-1">
                                Configure and manage {activeTab.toLowerCase()} settings
                            </p>
                        </div>

                        {/* Tab Content */}
                        <div className="p-6">
                            {renderContent()}
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-xl p-4 border border-red-200 shadow-sm">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-red-600">Active Rewards</p>
                                    <p className="text-lg font-bold text-red-800">{tabs.length}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-xl p-4 border border-amber-200 shadow-sm">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-amber-600">Users</p>
                                    <p className="text-lg font-bold text-amber-800">All</p>
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
                                    <p className="text-sm font-medium text-blue-600">Updated</p>
                                    <p className="text-lg font-bold text-blue-800">Today</p>
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
const getTabIcon = (tabName) => {
    const iconClass = "w-4 h-4 sm:w-5 sm:h-5";
    
    switch (tabName) {
        case "Ads Coin Reward":
            return (
                <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
            );
        case "Daily Coin Reward":
            return (
                <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            );
        case "Referral Reward":
            return (
                <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            );
        case "Login Reward":
            return (
                <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
            );
        default:
            return (
                <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            );
    }
};

Reward.getLayout = function getLayout(page) {
    return <RootLayout>{page}</RootLayout>;
};

export default Reward;