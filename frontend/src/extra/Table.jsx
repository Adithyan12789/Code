/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { IconSortAscending, IconSortDescending, IconGripVertical } from "@tabler/icons-react";

export default function Table(props) {
  const {
    data,
    checkBoxShow,
    mapData,
    Page,
    PerPage,
    type,
    style,
    onChildValue,
    selectAllChecked,
    handleSelectAll,
    isDraggable = false,
    lastElementRef,
    className = "",
  } = props;
  
  const [sortColumn, setSortColumn] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [checkBox, setCheckBox] = useState();

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortColumn || !data?.length) return data ?? [];
    
    return [...data].sort((a, b) => {
      const valueA = a[sortColumn];
      const valueB = b[sortColumn];

      if (valueA < valueB) {
        return sortOrder === "asc" ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortOrder === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortColumn, sortOrder]);

  const startIndex = ((Page ?? 1) - 1) * (PerPage ?? 20);
  const endIndex = startIndex + (PerPage ?? 20);

  const currentPageData = Array.isArray(data) 
    ? data.slice(startIndex, endIndex) 
    : [];

  const getDisplayData = () => {
    if (type === "server") {
      return PerPage > 0 
        ? (sortedData ?? []).slice(Page * PerPage, Page * PerPage + PerPage)
        : sortedData ?? [];
    } else {
      return currentPageData;
    }
  };

  const displayData = getDisplayData();
  const totalItems = data?.length ?? 0;

  return (
    <div className={`w-full ${className}`}>
      {/* Modern Table Container */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Enhanced Table Header */}
            <thead className="bg-gradient-to-r from-slate-50 to-blue-50/50 border-b border-gray-200/60">
              <tr>
                {(mapData ?? []).map((res, index) => (
                  <th 
                    key={`${res?.Header}-${index}`}
                    className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap cursor-pointer transition-colors duration-200 hover:bg-white/50"
                    onClick={() => res?.sortable !== false && handleSort(res?.body)}
                  >
                    <div className="flex items-center gap-2">
                      {/* Drag Handle for Draggable Rows */}
                      {isDraggable && index === 0 && (
                        <IconGripVertical size={16} className="text-gray-400" />
                      )}
                      
                      {/* Checkbox for Select All */}
                      {res?.Header === "checkBox" ? (
                        <input
                          type="checkbox"
                          checked={selectAllChecked ?? false}
                          onChange={handleSelectAll}
                          className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                      ) : (
                        <>
                          <span className="text-gray-700 font-bold">
                            {res?.Header ?? ""}
                          </span>
                          {res?.sortable !== false && (
                            <div className="flex flex-col">
                              <IconSortAscending 
                                size={12} 
                                className={`-mb-1 ${
                                  sortColumn === res?.body && sortOrder === 'asc' 
                                    ? 'text-blue-600' 
                                    : 'text-gray-400'
                                }`}
                              />
                              <IconSortDescending 
                                size={12} 
                                className={`-mt-1 ${
                                  sortColumn === res?.body && sortOrder === 'desc' 
                                    ? 'text-blue-600' 
                                    : 'text-gray-400'
                                }`}
                              />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="bg-white divide-y divide-gray-200/50">
              {(displayData?.length ?? 0) > 0 ? (
                <>
                  {displayData.map((i, k) => (
                    isDraggable ? (
                      <Draggable
                        key={i?._id ?? k}
                        draggableId={(i?._id ?? k).toString()}
                        index={k}
                      >
                        {(provided, snapshot) => (
                          <tr
                            ref={(el) => {
                              provided.innerRef(el);
                              if (k === displayData.length - 1 && lastElementRef) {
                                lastElementRef?.(el);
                              }
                            }}
                            {...provided.draggableProps}
                            className={`
                              transition-all duration-300 group
                              ${snapshot.isDragging 
                                ? 'bg-blue-50/80 shadow-xl transform rotate-1 border-2 border-blue-200' 
                                : 'hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-transparent border-l-4 border-l-transparent hover:border-l-blue-500'
                              }
                            `}
                            style={provided.draggableProps.style}
                          >
                            {(mapData ?? []).map((res, colIndex) => (
                              <td
                                key={res?.body ?? colIndex}
                                className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 group-hover:text-gray-700 transition-colors duration-200"
                                {...(colIndex === 0 ? provided.dragHandleProps : {})}
                              >
                                <div className="flex items-center gap-2">
                                  {colIndex === 0 && isDraggable && (
                                    <IconGripVertical size={16} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                  )}
                                  {res?.Cell ? (
                                    <res.Cell row={i} index={k} />
                                  ) : (
                                    <span className={`text-gray-600 group-hover:text-gray-800 ${res?.class ?? ''}`}>
                                      {i?.[res?.body] ?? ''}
                                    </span>
                                  )}
                                </div>
                              </td>
                            ))}
                          </tr>
                        )}
                      </Draggable>
                    ) : (
                      <tr 
                        key={k}
                        className="hover:bg-gradient-to-r hover:from-gray-50/50 hover:to-transparent border-l-4 border-l-transparent hover:border-l-gray-300 transition-all duration-200 group"
                      >
                        {(mapData ?? []).map((res, colIndex) => (
                          <td 
                            key={res?.body ?? colIndex}
                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 group-hover:text-gray-700 transition-colors duration-200"
                          >
                            {res?.Cell ? (
                              <res.Cell row={i} index={k} />
                            ) : (
                              <span className={`text-gray-600 group-hover:text-gray-800 ${res?.class ?? ''}`}>
                                {i?.[res?.body] ?? ''}
                              </span>
                            )}
                          </td>
                        ))}
                      </tr>
                    )
                  ))}
                </>
              ) : (
                <tr>
                  <td
                    colSpan={mapData?.length ?? 16}
                    className="px-6 py-16 text-center"
                  >
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
                        <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                      </div>
                      <span className="text-xl font-semibold text-gray-500 mb-2">No Data Available</span>
                      <span className="text-gray-400 text-sm">There are no records to display at the moment</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Summary */}
        {totalItems > 0 && (
          <div className="px-6 py-3 bg-gradient-to-r from-gray-50 to-blue-50/30 border-t border-gray-200/50">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                Showing {Math.min(startIndex + 1, totalItems)} to {Math.min(endIndex, totalItems)} of {totalItems} entries
              </span>
              <span className="text-xs bg-white px-2 py-1 rounded-lg border">
                Page {Page}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}