/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";

export default function MultiButton({ multiButtonSelect, setMultiButtonSelect, label }) {
  const handleAlignment = (event, newAlignment) => {
    if (newAlignment !== null && newAlignment !== undefined) {
      setMultiButtonSelect(newAlignment);

      // store selection in localStorage unless certain types
      if (
        newAlignment === "Fake User" ||
        newAlignment === "User" ||
        newAlignment === "Profile" ||
        newAlignment === "Avatar" ||
        newAlignment === ""
      ) {
        return;
      }

      if (typeof window !== "undefined") {
        localStorage.setItem(
          "multiButton",
          JSON.stringify(newAlignment ? newAlignment : label[0])
        );
      }
    }
  };

  // Restore saved selection
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("multiButton");
      if (saved) {
        setMultiButtonSelect(JSON.parse(saved));
      } else {
        setMultiButtonSelect(label[0]);
      }
    }
  }, []);

  return (
    <div className="multiButton flex flex-wrap gap-2 p-2 bg-gray-100 rounded-xl">
      {label?.map((item, index) => (
        <button
          key={index}
          onClick={(e) => handleAlignment(e, item)}
          className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-200 
            ${
              multiButtonSelect === item
                ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-blue-50"
            }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
