import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Table from "../../extra/Table";
import Pagination from "../../extra/Pagination";
import { getUserWiseCoinPlan } from "../../store/coinPlanSlice";
import moment from "moment";
import { 
    IconCoin, 
    IconCalendar, 
    IconReceipt, 
    IconCreditCard,
    IconTrendingUp,
    IconCash,
    IconPackage
} from "@tabler/icons-react";

const CoinPlanHistory = ({ startDate, endDate }) => {
    const [page, setPage] = useState(1);
    const [data, setData] = useState([]);
    const [size, setSize] = useState(20);
    const { userId } = useParams();
    const dispatch = useDispatch();
    
    const { userCoinPlan } = useSelector((state) => state.coinPlan);

    useEffect(() => {
        setData(userCoinPlan ?? []);
    }, [userCoinPlan]);

    useEffect(() => {
        if (userId) {
            dispatch(getUserWiseCoinPlan({ page, size, startDate, endDate, userId }));
        }
    }, [userId, page, startDate, endDate, size, dispatch]);

    const handlePageChange = (pageNumber) => {
        setPage(pageNumber);
    };

    const handleRowsPerPage = (value) => {
        setPage(1);
        setSize(value);
    };

    // Calculate comprehensive stats
    const stats = React.useMemo(() => {
        const totalCoins = data?.reduce((sum, item) => sum + (item?.coin || 0), 0) || 0;
        const totalAmount = data?.reduce((sum, item) => sum + (item?.price || 0), 0) || 0;
        const totalTransactions = data?.length || 0;
        const averagePurchase = totalTransactions > 0 ? (totalAmount / totalTransactions).toFixed(2) : 0;
        
        return {
            totalCoins,
            totalAmount,
            totalTransactions,
            averagePurchase
        };
    }, [data]);

    const coinPlanTable = [
        {
            Header: "#",
            Cell: ({ index }) => (
                <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg">
                    <span className="text-gray-600 font-semibold text-sm">
                        {(page - 1) * size + parseInt(index) + 1}
                    </span>
                </div>
            ),
            width: 80
        },
        {
            Header: "TRANSACTION",
            Cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white">
                        <IconReceipt size={20} />
                    </div>
                    <div className="flex-1">
                        <div className="font-semibold text-gray-800 text-sm">
                            Coin Plan Purchase
                        </div>
                        <div className="text-gray-500 text-xs font-mono">
                            {row?.uniqueId || "N/A"}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            Header: "PAYMENT",
            Cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <IconCreditCard size={18} className="text-gray-500" />
                    <span className="text-gray-700 font-medium capitalize text-sm">
                        {row?.paymentGateway?.replace(/_/g, ' ') || "Unknown"}
                    </span>
                </div>
            ),
        },
        {
            Header: "COINS",
            Cell: ({ row }) => (
                <div className="flex items-center gap-2 justify-end">
                    <IconCoin size={18} className="text-yellow-500" />
                    <span className="font-bold text-lg text-yellow-600">
                        {row?.coin?.toLocaleString()}
                    </span>
                </div>
            ),
            width: 120
        },
        {
            Header: "AMOUNT",
            Cell: ({ row }) => (
                <div className="text-right">
                    <span className="font-bold text-lg text-green-600">
                        ${row?.price?.toFixed(2)}
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
                        {moment(row?.createdAt || row?.date).format("DD MMM YYYY")}
                    </span>
                    <span className="text-gray-500 text-xs">
                        {moment(row?.createdAt || row?.date).format("HH:mm")}
                    </span>
                </div>
            ),
            width: 140
        },
    ];

    return (
        <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-purple-600 text-sm font-semibold">Total Transactions</div>
                            <div className="text-2xl font-bold text-purple-700">{stats.totalTransactions}</div>
                        </div>
                        <IconPackage size={32} className="text-purple-500" />
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-yellow-600 text-sm font-semibold">Total Coins</div>
                            <div className="text-2xl font-bold text-yellow-700">{stats.totalCoins.toLocaleString()}</div>
                        </div>
                        <IconCoin size={32} className="text-yellow-500" />
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-green-600 text-sm font-semibold">Total Spent</div>
                            <div className="text-2xl font-bold text-green-700">${stats.totalAmount.toFixed(2)}</div>
                        </div>
                        <IconCash size={32} className="text-green-500" />
                    </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-blue-600 text-sm font-semibold">Avg. Purchase</div>
                            <div className="text-2xl font-bold text-blue-700">${stats.averagePurchase}</div>
                        </div>
                        <IconTrendingUp size={32} className="text-blue-500" />
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
                {/* Table Header */}
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-purple-50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-xl">
                                <IconCoin size={24} className="text-purple-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">
                                    Coin Plan Purchase History
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Detailed record of all coin package purchases
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
                            data={data}
                            mapData={coinPlanTable}
                            PerPage={size}
                            Page={page}
                            type={"server"}
                        />
                    ) : (
                        <div className="text-center py-16">
                            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <IconCoin size={40} className="text-purple-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Purchase History</h3>
                            <p className="text-gray-500 max-w-md mx-auto">
                                This user hasn't purchased any coin plans yet. 
                                Their purchase history will appear here once they start buying coin packages.
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
                            handleRowsPerPage={handleRowsPerPage}
                            handlePageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default CoinPlanHistory;