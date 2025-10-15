/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getUserReferralHistory } from "../../store/userSlice";
import Table from "../../extra/Table";
import moment from "moment";
import Pagination from "../../extra/Pagination";
import { 
    IconUsers, 
    IconCoin, 
    IconCalendar, 
    IconGift,
    IconTrendingUp,
    IconUserPlus
} from "@tabler/icons-react";

const ReferralHistory = ({ startDate, endDate }) => {
    const { userId } = useParams();
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(20);
    const dispatch = useDispatch();
    const { referralHistory } = useSelector((state) => state.users);
    const [data, setData] = useState([]);
    const [stats, setStats] = useState({ totalCoins: 0, totalReferrals: 0, averageCoins: 0 });

    useEffect(() => {
        setData(referralHistory ?? []);
        
        // Calculate stats
        const totalCoins = referralHistory?.reduce((sum, item) => sum + (item?.coin || 0), 0) || 0;
        const totalReferrals = referralHistory?.length || 0;
        const averageCoins = totalReferrals > 0 ? (totalCoins / totalReferrals).toFixed(1) : 0;
        
        setStats({
            totalCoins,
            totalReferrals,
            averageCoins
        });
    }, [referralHistory]);

    useEffect(() => {
        if (userId) {
            dispatch(getUserReferralHistory({ startDate, endDate, userId }));
        }
    }, [userId, startDate, endDate, dispatch]);

    const getTypeConfig = (type) => {
        const configs = {
            1: { label: "DAILY CHECK IN", bg: "bg-gradient-to-r from-green-500 to-emerald-500", icon: "🎯" },
            2: { label: "AD VIEW REWARD", bg: "bg-gradient-to-r from-yellow-500 to-amber-500", icon: "📺" },
            3: { label: "LOGIN REWARD", bg: "bg-gradient-to-r from-orange-500 to-red-500", icon: "🔑" },
            4: { label: "REFERRAL REWARD", bg: "bg-gradient-to-r from-blue-500 to-cyan-500", icon: "👥" },
            5: { label: "COIN PLAN", bg: "bg-gradient-to-r from-purple-500 to-pink-500", icon: "💎" }
        };
        return configs[type] || { label: "UNKNOWN", bg: "bg-gradient-to-r from-gray-400 to-slate-400", icon: "❓" };
    };

    const referralHistoryTable = [
        {
            Header: "#",
            Cell: ({ index }) => (
                <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg">
                    <span className="text-gray-600 font-semibold text-sm">
                        {page * parseInt(index) + 1}
                    </span>
                </div>
            ),
            width: 80
        },
        {
            Header: "TRANSACTION",
            Cell: ({ row }) => {
                const typeConfig = getTypeConfig(row?.type);
                return (
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${typeConfig.bg} flex items-center justify-center text-white font-bold text-lg`}>
                            {typeConfig.icon}
                        </div>
                        <div className="flex-1">
                            <div className="font-semibold text-gray-800 text-sm">
                                {typeConfig.label}
                            </div>
                            <div className="text-gray-500 text-xs font-mono">
                                {row?.uniqueId || "N/A"}
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            Header: "AMOUNT",
            Cell: ({ row }) => (
                <div className="flex items-center gap-2 justify-end text-green-600">
                    <IconCoin size={18} className="text-yellow-500" />
                    <span className="font-bold text-lg">
                        +{row?.coin || 0}
                    </span>
                </div>
            ),
            width: 120
        },
        {
            Header: "DATE",
            Cell: ({ row }) => (
                <div className="flex flex-col items-end">
                    <span className="text-gray-800 font-medium text-sm">
                        {moment(row?.date).format("DD MMM YYYY")}
                    </span>
                    <span className="text-gray-500 text-xs">
                        {moment(row?.date).format("HH:mm")}
                    </span>
                </div>
            ),
            width: 120
        },
    ];

    return (
        <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-green-600 text-sm font-semibold">Total Referrals</div>
                            <div className="text-2xl font-bold text-green-700">{stats.totalReferrals}</div>
                        </div>
                        <IconUserPlus size={32} className="text-green-500" />
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-yellow-600 text-sm font-semibold">Total Coins Earned</div>
                            <div className="text-2xl font-bold text-yellow-700">+{stats.totalCoins}</div>
                        </div>
                        <IconCoin size={32} className="text-yellow-500" />
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-blue-600 text-sm font-semibold">Average per Referral</div>
                            <div className="text-2xl font-bold text-blue-700">{stats.averageCoins}</div>
                        </div>
                        <IconTrendingUp size={32} className="text-blue-500" />
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
                {/* Table Header */}
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-green-50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-xl">
                                <IconUsers size={24} className="text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">
                                    Referral Reward History
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Detailed record of all referral-based rewards
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <IconCalendar size={16} />
                            <span>{startDate} - {endDate}</span>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="p-6">
                    {data?.length > 0 ? (
                        <Table
                            mapData={referralHistoryTable}
                            data={data}
                            PerPage={size}
                            Page={page}
                            type={"client"}
                        />
                    ) : (
                        <div className="text-center py-16">
                            <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <IconUsers size={40} className="text-green-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Referral Activity</h3>
                            <p className="text-gray-500 max-w-md mx-auto">
                                This user hasn't earned any rewards from referrals yet. 
                                Referral rewards will appear here when they successfully refer new users.
                            </p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {data?.length > 0 && (
                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                        <Pagination
                            type={"server"}
                            activePage={page}
                            rowsPerPage={size}
                            setPage={setPage}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReferralHistory;