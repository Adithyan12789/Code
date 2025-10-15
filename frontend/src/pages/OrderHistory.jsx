/* eslint-disable no-unused-vars */
import { useState } from "react";
import { RootLayout } from '../components/layout/Layout';
import CoinPlanHistoryPage from "../components/coinPlan/CoinPlanHistoryPage";
import VipPlanHistory from "../components/vipPlan/VipPlanHistory";
import MultiButton from "../extra/MultiButton";

const OrderHistory = () => {
    const [multiButtonSelect, setMultiButtonSelect] = useState("Coin Plan");
    const [startDate, setStartDate] = useState("All");
    const [endDate, setEndDate] = useState("All");
    const labelData = ["Coin Plan", "VIP Plan"];
    
    return (
        <RootLayout>
            <div className="min-h-[80vh] bg-red-50 p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-red-900 mb-2">
                            Plan History
                        </h1>
                        <p className="text-red-600">
                            View and manage your coin and VIP plan history
                        </p>
                    </div>

                    {/* MultiButton Tabs */}
                    <div className="mb-6">
                        <MultiButton
                            multiButtonSelect={multiButtonSelect}
                            setMultiButtonSelect={setMultiButtonSelect}
                            label={labelData}
                        />
                    </div>

                    {/* Content Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
                        {multiButtonSelect === "Coin Plan" && <CoinPlanHistoryPage />}
                        {multiButtonSelect === "VIP Plan" && <VipPlanHistory />}
                    </div>
                </div>
            </div>
        </RootLayout>
    );
};

export default OrderHistory;