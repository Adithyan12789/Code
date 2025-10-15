/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getUserCoinHistory } from "../../store/userSlice";
import Table from "../../extra/Table";
import moment from "moment";
import Pagination from "../../extra/Pagination";
import { 
    IconCoin, 
    IconHistory, 
    IconTrendingUp, 
    IconTrendingDown,
    IconCalendar,
    IconFilter
} from "@tabler/icons-react";

const CoinHistory = ({ startDate, endDate }) => {
    const { userId } = useParams();
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(20);
    const dispatch = useDispatch();
    const { coinHistory } = useSelector((state) => state.users);
    const [data, setData] = useState([]);
    const [stats, setStats] = useState({ credits: 0, debits: 0, net: 0 });

    useEffect(() => {
        setData(coinHistory);
        
        // Calculate stats
        const credits = coinHistory?.filter(d => d.type !== 6)?.reduce((sum, item) => sum + (item.coin || 0), 0) || 0;
        const debits = coinHistory?.filter(d => d.type === 6)?.reduce((sum, item) => sum + (item.coin || 0), 0) || 0;
        setStats({
            credits,
            debits,
            net: credits - debits
        });
    }, [coinHistory]);

    useEffect(() => {
        if (userId) {
            dispatch(getUserCoinHistory({ startDate, endDate, userId }));
        }
    }, [userId, startDate, endDate, dispatch]);

    const getTypeConfig = (type) => {
        const configs = {
            1: { label: "DAILY CHECK IN", bg: "bg-gradient-to-r from-green-500 to-emerald-500", icon: "🎯" },
            2: { label: "AD VIEW REWARD", bg: "bg-gradient-to-r from-yellow-500 to-amber-500", icon: "📺" },
            3: { label: "LOGIN REWARD", bg: "bg-gradient-to-r from-orange-500 to-red-500", icon: "🔑" },
            4: { label: "REFERRAL REWARD", bg: "bg-gradient-to-r from-blue-500 to-cyan-500", icon: "👥" },
            5: { label: "COIN PLAN", bg: "bg-gradient-to-r from-purple-500 to-pink-500", icon: "💎" },
            6: { label: "UNLOCK VIDEO", bg: "bg-gradient-to-r from-red-500 to-rose-500", icon: "🎬" },
            7: { label: "AUTO UNLOCK", bg: "bg-gradient-to-r from-sky-500 to-blue-500", icon: "⚡" },
            8: { label: "VIDEO DEDUCT", bg: "bg-gradient-to-r from-gray-500 to-slate-500", icon: "📹" }
        };
        return configs[type] || { label: "N/A", bg: "bg-gradient-to-r from-gray-400 to-slate-400", icon: "❓" };
    };

    const coinHistoryTable = [
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
                const isDeduction = row?.type === 6;
                return (
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${typeConfig.bg} flex items-center justify-center text-white font-bold text-sm`}>
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
            Cell: ({ row }) => {
                const isDeduction = row?.type === 6;
                return (
                    <div className={`flex items-center gap-2 justify-end ${
                        isDeduction ? 'text-red-600' : 'text-green-600'
                    }`}>
                        {isDeduction ? (
                            <IconTrendingDown size={18} className="text-red-500" />
                        ) : (
                            <IconTrendingUp size={18} className="text-green-500" />
                        )}
                        <span className="font-bold text-lg">
                            {isDeduction ? `-${row?.coin}` : `+${row?.coin}`}
                        </span>
                    </div>
                );
            },
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
                            <div className="text-green-600 text-sm font-semibold">Total Credits</div>
                            <div className="text-2xl font-bold text-green-700">+{stats.credits}</div>
                        </div>
                        <IconTrendingUp size={32} className="text-green-500" />
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-red-600 text-sm font-semibold">Total Debits</div>
                            <div className="text-2xl font-bold text-red-700">-{stats.debits}</div>
                        </div>
                        <IconTrendingDown size={32} className="text-red-500" />
                    </div>
                </div>
                
                <div className={`bg-gradient-to-r ${
                    stats.net >= 0 ? 'from-blue-50 to-cyan-50 border-blue-200' : 'from-orange-50 to-amber-50 border-orange-200'
                } border rounded-2xl p-6`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className={`${
                                stats.net >= 0 ? 'text-blue-600' : 'text-orange-600'
                            } text-sm font-semibold`}>Net Balance</div>
                            <div className={`text-2xl font-bold ${
                                stats.net >= 0 ? 'text-blue-700' : 'text-orange-700'
                            }`}>
                                {stats.net >= 0 ? '+' : ''}{stats.net}
                            </div>
                        </div>
                        <IconCoin size={32} className={stats.net >= 0 ? 'text-blue-500' : 'text-orange-500'} />
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
                {/* Table Header */}
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-xl">
                                <IconHistory size={24} className="text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">
                                    Coin Transaction History
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Detailed record of all coin transactions
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <IconCalendar size={16} />
                            <span>{startDate} - {endDate}</span>
                            <IconFilter size={16} className="ml-2" />
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="p-6">
                    <Table
                        mapData={coinHistoryTable}
                        data={data}
                        PerPage={size}
                        Page={page}
                        type={"client"}
                    />
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <Pagination
                        type={"server"}
                        activePage={page}
                        rowsPerPage={size}
                        setPage={setPage}
                    />
                </div>
            </div>
        </div>
    );
};

export default CoinHistory;