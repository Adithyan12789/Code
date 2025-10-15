/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { RootLayout } from "../components/layout/Layout";
import CoinHistory from "../components/user/CoinHistory";
import ReferralHistory from "../components/user/ReferralHistory";
import CoinPlanHistory from "../components/user/CoinPlanHistory";
import VipPlanUserHistory from "../components/user/VipPlanUserHistory";
import { IconCoin, IconUsers, IconPackage, IconCrown, IconArrowLeft } from "@tabler/icons-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Button from "../extra/Button";

const ViewProfileHistory = () => {
    const [activeTab, setActiveTab] = useState("Coin History");
    const [startDate, setStartDate] = useState("All");
    const [endDate, setEndDate] = useState("All");
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    // Get userId from query parameters
    const userId = searchParams.get('userId');

    const tabs = [
        {
            id: "Coin History",
            label: "Coin History",
            icon: <IconCoin size={20} />,
            color: "from-blue-500 to-cyan-500"
        },
        {
            id: "Referral History",
            label: "Referral History",
            icon: <IconUsers size={20} />,
            color: "from-green-500 to-emerald-500"
        },
        {
            id: "Coin Plan History",
            label: "Coin Plan History",
            icon: <IconPackage size={20} />,
            color: "from-orange-500 to-red-500"
        },
        {
            id: "VIP Plan History",
            label: "VIP Plan History",
            icon: <IconCrown size={20} />,
            color: "from-purple-500 to-pink-500"
        }
    ];

    // Add loading state and user data fetch if needed
    useEffect(() => {
        if (!userId) {
            console.warn("No user ID provided in query parameters");
            // You might want to redirect back or show an error
            return;
        }
        
        console.log("Loading history for user:", userId);
        // You can fetch user basic info here if needed
    }, [userId]);

    const handleBack = () => {
        navigate(-1); // Go back to previous page
    };

    const renderContent = () => {
        const props = {
            endDate,
            startDate,
            multiButtonSelectNavigate: setActiveTab,
            userId: userId // Pass userId to child components
        };

        switch (activeTab) {
            case "Coin History":
                return <CoinHistory {...props} />;
            case "Referral History":
                return <ReferralHistory {...props} />;
            case "Coin Plan History":
                return <CoinPlanHistory {...props} />;
            case "VIP Plan History":
                return <VipPlanUserHistory {...props} />;
            default:
                return <CoinHistory {...props} />;
        }
    };

    // Show error if no user ID
    if (!userId) {
        return (
            <RootLayout>
                <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50/30 p-6 flex items-center justify-center">
                    <div className="text-center">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20 max-w-md">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <IconUsers size={32} className="text-red-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">User Not Found</h2>
                            <p className="text-gray-600 mb-6">No user ID provided. Please go back and select a user.</p>
                            <Button
                                btnName="Go Back"
                                btnIcon={<IconArrowLeft size={20} />}
                                onClick={handleBack}
                                newClass="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
                            />
                        </div>
                    </div>
                </div>
            </RootLayout>
        );
    }

    return (
        <RootLayout>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50/30 p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Enhanced Header with Back Button */}
                    <div className="flex items-center justify-between mb-8">
                        <Button
                            btnName="Back to User"
                            btnIcon={<IconArrowLeft size={20} />}
                            onClick={handleBack}
                            newClass="flex items-center gap-2 bg-white/80 hover:bg-white text-gray-700 px-4 py-2.5 rounded-xl border border-gray-200 shadow-sm hover:shadow transition-all duration-200 font-medium"
                        />
                        
                        <div className="text-center flex-1">
                            <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-4 shadow-lg border border-white/20 mb-4">
                                <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-full animate-pulse"></div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-red-800 via-pink-700 to-red-600 bg-clip-text text-transparent">
                                    Transaction History
                                </h1>
                            </div>
                            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                                User ID: <span className="font-mono text-red-600 bg-red-50 px-2 py-1 rounded">{userId}</span>
                            </p>
                        </div>

                        <div className="w-32"></div> {/* Spacer for balance */}
                    </div>

                    {/* Date Range Selector */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8">
                        <div className="flex flex-wrap gap-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                                        activeTab === tab.id
                                            ? `bg-gradient-to-r ${tab.color} text-white shadow-2xl transform scale-105`
                                            : "text-gray-600 bg-white/80 hover:bg-white hover:text-gray-800 border border-gray-200"
                                    }`}
                                >
                                    {tab.icon}
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Date Display */}
                        <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg border border-gray-200">
                            <div className="text-sm">
                                <span className="text-gray-600">Period: </span>
                                <span className="font-semibold text-gray-800">
                                    {startDate} → {endDate}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Active Tab Indicator */}
                    <div className="mb-6">
                        <div className="flex items-center gap-3">
                            <div className={`w-2 h-8 bg-gradient-to-r ${
                                tabs.find(t => t.id === activeTab)?.color
                            } rounded-full`}></div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                {activeTab} for User {userId}
                            </h2>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
                        {renderContent()}
                    </div>

                    {/* Quick Stats Footer */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                        {tabs.map((tab) => (
                            <div
                                key={tab.id}
                                className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                                    activeTab === tab.id
                                        ? `border-gradient-to-r ${tab.color} bg-gradient-to-r ${tab.color} bg-opacity-10`
                                        : "border-gray-200 bg-white/50 hover:bg-white"
                                }`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg bg-gradient-to-r ${tab.color} text-white`}>
                                        {tab.icon}
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600">{tab.label}</div>
                                        <div className="text-lg font-bold text-gray-800">0</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </RootLayout>
    );
};

export default ViewProfileHistory;