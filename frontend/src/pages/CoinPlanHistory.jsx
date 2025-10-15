/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { RootLayout } from '../components/layout/Layout';
import Table from "../extra/Table";
import moment from "moment";

const CoinPlanHistory = () => {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(20);
    const [name, setName] = useState("");
    
    useEffect(() => {
        const coinPlanHistory = JSON.parse(sessionStorage.getItem("coinPlanHistory"));
        if (coinPlanHistory) {
            setData(coinPlanHistory.coinPlanPurchase || []);
            setName(coinPlanHistory.name || "");
        }
    }, []);

    const coinPlanTable = [
        {
            Header: "No",
            body: "no",
            Cell: ({ index }) => (
                <span className="text-nowrap">
                    {(page - 1) * size + parseInt(index) + 1}
                </span>
            ),
        },
        {
            Header: "Unique ID",
            body: "uniqueId",
            Cell: ({ row }) => (
                <span className="text-nowrap">{row?.uniqueId || "-"}</span>
            )
        },
        {
            Header: "Price ($)",
            body: "price",
            Cell: ({ row }) => (
                <span className="text-nowrap">${row?.price || "-"}</span>
            ),
        },
        {
            Header: "Coin",
            body: "coin",
            Cell: ({ row }) => (
                <span className="text-nowrap">{row?.coin || "-"}</span>
            ),
        },
        {
            Header: "Date",
            body: "date",
            Cell: ({ row }) => (
                <span className="text-nowrap">
                    {row?.date ? moment(row.date).format("DD/MM/YYYY") : "-"}
                </span>
            ),
        },
    ];

    const handleRowsPerPage = (value) => {
        setSize(value);
    };

    const handlePageChange = (pageNumber) => {
        setPage(pageNumber);
    };

    return (
        <RootLayout>
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    {/* Header Section */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <div>
                                <h5 className="text-xl font-semibold text-gray-900 mb-1">
                                    {name}'s Coin Plan Purchase History
                                </h5>
                                <p className="text-sm text-gray-600">
                                    View all coin plan purchase records
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="p-6">
                        <div className="overflow-x-auto">
                            <Table
                                data={data}
                                mapData={coinPlanTable}
                                serverPerPage={size}
                                serverPage={page}
                                type={"server"}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </RootLayout>
    );
};

export default CoinPlanHistory;