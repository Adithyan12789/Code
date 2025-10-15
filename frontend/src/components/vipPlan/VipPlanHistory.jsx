/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Table from "../../extra/Table";
import Pagination from "../../extra/Pagination";
import moment from "moment";
import { getAllVipPlan } from "../../store/vipPlanSlice";
import { getSetting } from "../../store/settingSlice";

const VipPlanHistory = () => {
    const dispatch = useDispatch();
    const { setting } = useSelector((state) => state.setting);
    const [page, setPage] = useState(1);
    const [data, setData] = useState([]);
    const [startDate, setStartDate] = useState("All");
    const [endDate, setEndDate] = useState("All");
    const [size, setSize] = useState(20);
    
    const { vipAllPlan, totalEarnings, total } = useSelector((state) => state.vipPlan);
    
    useEffect(() => {
        setData(vipAllPlan);
    }, [vipAllPlan]);
    
    useEffect(() => {
        dispatch(getAllVipPlan({ startDate, endDate, page, size }));
    }, [startDate, page, size, dispatch]);
    
    useEffect(() => {
        dispatch(getSetting());
    }, [dispatch]);

    const handlePageChange = (pageNumber) => {
        setPage(pageNumber);
    };

    const handleRowsPerPage = (value) => {
        setPage(1);
        setSize(value);
    };

    const vipPlanTable = [
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
                <span className="text-nowrap">
                    {row?.uniqueId || "-"}
                </span>
            )
        },
        {
            Header: "Username",
            body: "username",
            Cell: ({ row }) => (
                <span className="text-nowrap">
                    {row?.username || "-"}
                </span>
            )
        },
        {
            Header: "Name",
            body: "name",
            Cell: ({ row }) => (
                <span className="text-nowrap">
                    {row?.name || "-"}
                </span>
            )
        },
        {
            Header: "Payment Gateway",
            body: "paymentGateway",
            Cell: ({ row }) => (
                <span className="text-nowrap">
                    {row?.paymentGateway || "-"}
                </span>
            )
        },
        {
            Header: "Price",
            body: "price",
            Cell: ({ row }) => (
                <span className="text-nowrap">
                    {row?.price ? `${setting?.currency?.symbol || '$'}${row.price}` : "-"}
                </span>
            )
        },
        {
            Header: "Offer Price",
            body: "offerPrice",
            Cell: ({ row }) => (
                <span className="text-nowrap">
                    {row?.offerPrice ? `${setting?.currency?.symbol || '$'}${row.offerPrice}` : "-"}
                </span>
            )
        },
        {
            Header: "Validity",
            body: "validity",
            Cell: ({ row }) => (
                <span className="text-nowrap">
                    {row?.validity || "-"}
                </span>
            )
        },
        {
            Header: "Validity Type",
            body: "validityType",
            Cell: ({ row }) => (
                <span className="text-nowrap capitalize">
                    {row?.validityType || "-"}
                </span>
            )
        },
        {
            Header: "Date",
            body: "createdAt",
            Cell: ({ row }) => (
                <span className="text-nowrap">
                    {row?.createdAt ? moment(row.createdAt).format("DD/MM/YYYY") : "-"}
                </span>
            )
        },
    ];

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Header Section */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h5 className="text-xl font-semibold text-gray-900">
                            VIP Plan History
                        </h5>
                        <p className="text-sm text-gray-600 mt-1">
                            View all VIP plan subscription records
                        </p>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2">
                        <p className="text-green-800 font-medium text-sm">
                            Admin Earnings: {totalEarnings} {setting?.currency?.symbol || '$'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="p-6">
                <div className="overflow-x-auto">
                    <Table
                        data={data}
                        mapData={vipPlanTable}
                        serverPerPage={size}
                        serverPage={page}
                        type={"server"}
                    />
                </div>

                {/* Pagination */}
                <div className="mt-6">
                    <Pagination
                        type={"server"}
                        activePage={page}
                        rowsPerPage={size}
                        userTotal={total}
                        setPage={setPage}
                        handleRowsPerPage={handleRowsPerPage}
                        handlePageChange={handlePageChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default VipPlanHistory;