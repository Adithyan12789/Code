/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getSetting, updateSetting } from "../../store/settingSlice";

const RefralBonus = () => {
    const { setting } = useSelector((state) => state.setting);
    const dispatch = useDispatch();
    
    const [referralRewardCoins, setReferralRewardCoins] = useState('');
    const [error, setError] = useState({ referralRewardCoins: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        dispatch(getSetting());
    }, [dispatch]);

    useEffect(() => {
        setReferralRewardCoins(setting?.referralRewardCoins?.toString() || '');
    }, [setting]);

    const validateForm = () => {
        const newError = {};
        const referralRewardCoinsValue = parseInt(referralRewardCoins);

        if (!referralRewardCoins.trim()) {
            newError.referralRewardCoins = "Referral reward coins are required";
        } else if (referralRewardCoinsValue <= 0) {
            newError.referralRewardCoins = "Amount must be greater than 0";
        } else if (referralRewardCoinsValue > 1000000) {
            newError.referralRewardCoins = "Amount is too large";
        }

        setError(newError);
        return Object.keys(newError).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);
        
        try {
            const settingDataSubmit = {
                settingId: setting?._id || '',
                referralRewardCoins: parseInt(referralRewardCoins),
            };

            const res = await dispatch(updateSetting(settingDataSubmit));
            
            if (res?.payload?.status) {
                toast.success(res?.payload?.message);
            } else {
                toast.error(res?.payload?.message);
            }
        } catch (error) {
            toast.error("Failed to update referral reward settings");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-red-600 to-rose-600 p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex-1">
                                <h1 className="text-2xl font-bold text-white mb-2">
                                    Referral Reward System
                                </h1>
                                <p className="text-red-100 text-opacity-90">
                                    Configure coin rewards for user referrals to grow your community
                                </p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="bg-white bg-opacity-20 rounded-xl px-4 py-2">
                                    <span className="text-white font-semibold text-sm">
                                        User Growth
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Configuration Card */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-6">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-red-800">Referral Reward Configuration</h3>
                                    <p className="text-red-600 text-sm">Set coin rewards for successful user referrals</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Referral Formula Display */}
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                                    <div className="text-center">
                                        <h4 className="text-lg font-bold text-blue-800 mb-4">Referral Formula</h4>
                                        <div className="flex items-center justify-center space-x-4">
                                            <div className="bg-white rounded-xl p-4 border border-blue-200 shadow-sm">
                                                <div className="text-center">
                                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                                        <span className="text-blue-600 font-bold">1</span>
                                                    </div>
                                                    <p className="text-blue-700 text-sm font-medium">Successful Referral</p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center justify-center">
                                                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                </svg>
                                            </div>

                                            <div className="bg-white rounded-xl p-4 border border-green-200 shadow-sm">
                                                <div className="text-center">
                                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                                        <span className="text-green-600 font-bold text-lg">=</span>
                                                    </div>
                                                    <p className="text-green-700 text-sm font-medium">Coin Reward</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Referral Reward Input */}
                                <div>
                                    <label className="block text-sm font-medium text-red-700 mb-2">
                                        Coin Reward per Referral <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={referralRewardCoins}
                                            onChange={(e) => {
                                                setReferralRewardCoins(e.target.value);
                                                if (error.referralRewardCoins) {
                                                    setError(prev => ({ ...prev, referralRewardCoins: '' }));
                                                }
                                            }}
                                            onKeyPress={handleKeyPress}
                                            placeholder="Enter coin amount for each successful referral"
                                            min="1"
                                            max="1000000"
                                            className={`w-full px-4 py-3 pl-12 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${
                                                error.referralRewardCoins 
                                                    ? 'border-red-300 bg-red-50' 
                                                    : 'border-gray-300 focus:border-transparent'
                                            }`}
                                        />
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                            </svg>
                                        </div>
                                    </div>
                                    {error.referralRewardCoins && (
                                        <p className="text-red-600 text-sm mt-2 flex items-center space-x-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>{error.referralRewardCoins}</span>
                                        </p>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        onClick={() => {
                                            setReferralRewardCoins(setting?.referralRewardCoins?.toString() || '');
                                            setError({ referralRewardCoins: '' });
                                        }}
                                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
                                    >
                                        Reset
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className={`px-6 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl transition-all duration-200 shadow-sm hover:shadow-md font-semibold ${
                                            isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:from-red-600 hover:to-rose-600'
                                        }`}
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center space-x-2">
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                <span>Saving...</span>
                                            </div>
                                        ) : (
                                            'Save Settings'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Info and Stats Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Current Setting Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-green-200 p-6">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-green-600">Current Reward</p>
                                    <p className="text-2xl font-bold text-green-800">
                                        {setting?.referralRewardCoins || 0}
                                    </p>
                                </div>
                            </div>
                            <p className="text-green-600 text-sm">
                                Coins awarded per successful referral
                            </p>
                        </div>

                        {/* Impact Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-purple-200 p-6">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-purple-600">Growth Impact</p>
                                    <p className="text-lg font-bold text-purple-800">Very High</p>
                                </div>
                            </div>
                            <p className="text-purple-600 text-sm">
                                Referral programs drive organic user growth
                            </p>
                        </div>

                        {/* Best Practices Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-amber-200 p-6">
                            <div className="flex items-start space-x-3">
                                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-amber-600">Best Practices</p>
                                    <ul className="text-amber-600 text-sm mt-2 space-y-1">
                                        <li>• Set attractive but sustainable rewards</li>
                                        <li>• Higher rewards increase sharing</li>
                                        <li>• Consider your user acquisition cost</li>
                                        <li>• Monitor referral conversion rates</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preview Section */}
                {referralRewardCoins && !error.referralRewardCoins && (
                    <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-lg font-bold text-indigo-800 mb-2">Referral Reward Preview</h4>
                                <p className="text-indigo-600">
                                    Users will receive <span className="font-bold text-indigo-800">{referralRewardCoins} coins</span> for each successful referral
                                </p>
                                <p className="text-indigo-500 text-sm mt-2">
                                    This encourages users to invite friends and grow the community
                                </p>
                            </div>
                            <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                                <div className="text-center">
                                    <span className="text-white font-bold text-xl block">{referralRewardCoins}</span>
                                    <span className="text-white text-xs">coins</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RefralBonus;