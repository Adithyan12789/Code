import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { closeDialog } from "../../store/dialogueSlice";
import { addCurrency, getCurrency, updateCurrency } from "../../store/currencySlice";
import { toast } from "react-toastify";

const CurrencyDialogue = ({ page, size }) => {
    const { dialogue: open, dialogueData } = useSelector((state) => state.dialogue);
    const dispatch = useDispatch();
    
    const [name, setName] = useState("");
    const [symbol, setSymbol] = useState("");
    const [currencyCode, setCurrencyCode] = useState("");
    const [countryCode, setCountryCode] = useState("");
    
    const [error, setError] = useState({
        name: "",
        symbol: "",
        currencyCode: "",
        countryCode: "",
    });

    useEffect(() => {
        if (dialogueData) {
            setName(dialogueData?.name || "");
            setSymbol(dialogueData?.symbol || "");
            setCurrencyCode(dialogueData?.currencyCode || "");
            setCountryCode(dialogueData?.countryCode || "");
        }
    }, [dialogueData]);

    const handleClose = () => {
        dispatch(closeDialog());
        resetForm();
    };

    const resetForm = () => {
        setName("");
        setSymbol("");
        setCurrencyCode("");
        setCountryCode("");
        setError({
            name: "",
            symbol: "",
            currencyCode: "",
            countryCode: "",
        });
    };

    const validateForm = () => {
        const newError = {};
        
        if (!name.trim()) newError.name = "Name is required";
        if (!symbol.trim()) newError.symbol = "Symbol is required";
        if (!currencyCode.trim()) newError.currencyCode = "Currency code is required";
        if (!countryCode.trim()) newError.countryCode = "Country code is required";

        setError(newError);
        return Object.keys(newError).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;

        const currencyData = {
            name: name.trim(),
            symbol: symbol.trim(),
            currencyCode: currencyCode.trim().toUpperCase(),
            countryCode: countryCode.trim().toUpperCase(),
            currencyId: dialogueData?._id,
        };

        const action = dialogueData 
            ? updateCurrency(currencyData)
            : addCurrency(currencyData);

        dispatch(action).then((res) => {
            if (res?.payload?.status) {
                toast.success(res?.payload?.message);
                dispatch(closeDialog());
                dispatch(getCurrency({ page, size }));
                resetForm();
            } else {
                toast.error(res?.payload?.message);
            }
        });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleInputChange = (field, value) => {
        switch (field) {
            case 'name':
                setName(value);
                if (value.trim()) setError(prev => ({ ...prev, name: "" }));
                break;
            case 'symbol':
                setSymbol(value);
                if (value.trim()) setError(prev => ({ ...prev, symbol: "" }));
                break;
            case 'currencyCode':
                setCurrencyCode(value);
                if (value.trim()) setError(prev => ({ ...prev, currencyCode: "" }));
                break;
            case 'countryCode':
                setCountryCode(value);
                if (value.trim()) setError(prev => ({ ...prev, countryCode: "" }));
                break;
            default:
                break;
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={handleClose}
            />
            
            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-auto">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-red-600 to-rose-600 px-6 py-4 rounded-t-2xl">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-white">
                                {dialogueData ? "Edit Currency" : "Add New Currency"}
                            </h3>
                            <button
                                onClick={handleClose}
                                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors duration-200"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-6">
                        <form onSubmit={(e) => e.preventDefault()} onKeyPress={handleKeyPress}>
                            <div className="space-y-4">
                                {/* Name Field */}
                                <div>
                                    <label className="block text-sm font-medium text-red-700 mb-2">
                                        Currency Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        placeholder="e.g., US Dollar, Euro"
                                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${
                                            error.name 
                                                ? 'border-red-300 bg-red-50' 
                                                : 'border-gray-300 focus:border-transparent'
                                        }`}
                                    />
                                    {error.name && (
                                        <p className="text-red-600 text-sm mt-2 flex items-center space-x-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>{error.name}</span>
                                        </p>
                                    )}
                                </div>

                                {/* Symbol Field */}
                                <div>
                                    <label className="block text-sm font-medium text-red-700 mb-2">
                                        Currency Symbol <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={symbol}
                                        onChange={(e) => handleInputChange('symbol', e.target.value)}
                                        placeholder="e.g., $, €, £"
                                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${
                                            error.symbol 
                                                ? 'border-red-300 bg-red-50' 
                                                : 'border-gray-300 focus:border-transparent'
                                        }`}
                                    />
                                    {error.symbol && (
                                        <p className="text-red-600 text-sm mt-2 flex items-center space-x-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>{error.symbol}</span>
                                        </p>
                                    )}
                                </div>

                                {/* Currency Code Field */}
                                <div>
                                    <label className="block text-sm font-medium text-red-700 mb-2">
                                        Currency Code <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={currencyCode}
                                        onChange={(e) => handleInputChange('currencyCode', e.target.value)}
                                        placeholder="e.g., USD, EUR, GBP"
                                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${
                                            error.currencyCode 
                                                ? 'border-red-300 bg-red-50' 
                                                : 'border-gray-300 focus:border-transparent'
                                        }`}
                                    />
                                    {error.currencyCode && (
                                        <p className="text-red-600 text-sm mt-2 flex items-center space-x-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>{error.currencyCode}</span>
                                        </p>
                                    )}
                                </div>

                                {/* Country Code Field */}
                                <div>
                                    <label className="block text-sm font-medium text-red-700 mb-2">
                                        Country Code <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={countryCode}
                                        onChange={(e) => handleInputChange('countryCode', e.target.value)}
                                        placeholder="e.g., US, GB, DE"
                                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${
                                            error.countryCode 
                                                ? 'border-red-300 bg-red-50' 
                                                : 'border-gray-300 focus:border-transparent'
                                        }`}
                                    />
                                    {error.countryCode && (
                                        <p className="text-red-600 text-sm mt-2 flex items-center space-x-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>{error.countryCode}</span>
                                        </p>
                                    )}
                                </div>

                                {/* Help Text */}
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                    <div className="flex items-start space-x-3">
                                        <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div>
                                            <p className="text-blue-800 text-sm font-medium">Currency Information</p>
                                            <p className="text-blue-600 text-sm mt-1">
                                                Add currency details to enable multi-currency support in your application.
                                                Ensure codes follow ISO standards for better compatibility.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 px-6 py-4 rounded-b-2xl border-t border-gray-200">
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={handleClose}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-6 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl hover:from-red-600 hover:to-rose-600 transition-all duration-200 shadow-sm hover:shadow-md font-semibold"
                            >
                                {dialogueData ? "Update Currency" : "Add Currency"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CurrencyDialogue;