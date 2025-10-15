import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { closeDialog } from '../../store/dialogueSlice';
import {
  addDailyRewardCoin,
  editDailyRewardCoin,
  getDailyRewardCoin,
} from '../../store/rewardSlice';

const DailyRewardCoinDialogue = () => {
  const dispatch = useDispatch();
  const { dialogue: open, dialogueData } = useSelector((state) => state.dialogue);
  
  const [day, setDay] = useState('');
  const [dailyRewardCoin, setDailyRewardCoin] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (dialogueData) {
      setDay(dialogueData?.day?.toString() || '');
      setDailyRewardCoin(dialogueData?.dailyRewardCoin?.toString() || '');
    }
  }, [dialogueData]);

  const handleClose = () => {
    dispatch(closeDialog());
    resetForm();
  };

  const resetForm = () => {
    setDay('');
    setDailyRewardCoin('');
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!day) newErrors.day = 'Day is required';
    if (!dailyRewardCoin) newErrors.dailyRewardCoin = 'Daily reward coin is required';
    if (dailyRewardCoin && parseInt(dailyRewardCoin) <= 0) {
      newErrors.dailyRewardCoin = 'Coin amount must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (dialogueData) {
      const data = {
        dailyRewardCoin: parseInt(dailyRewardCoin),
        dailyRewardCoinId: dialogueData?._id,
      };
      dispatch(editDailyRewardCoin(data)).then((res) => {
        if (res?.payload?.status) {
          toast.success(res?.payload?.message);
          dispatch(closeDialog());
          dispatch(getDailyRewardCoin());
          resetForm();
        } else {
          toast.error(res?.payload?.message);
        }
      });
    } else {
      const data = {
        day: parseInt(day),
        dailyRewardCoin: parseInt(dailyRewardCoin),
      };
      dispatch(addDailyRewardCoin(data)).then((res) => {
        if (res?.payload?.status) {
          toast.success(res?.payload?.message);
          dispatch(getDailyRewardCoin());
          dispatch(closeDialog());
          resetForm();
        } else {
          toast.error(res?.payload?.message);
        }
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const dayOptions = [
    { value: '1', label: 'Day 1 - First Login' },
    { value: '2', label: 'Day 2' },
    { value: '3', label: 'Day 3' },
    { value: '4', label: 'Day 4' },
    { value: '5', label: 'Day 5' },
    { value: '6', label: 'Day 6' },
    { value: '7', label: 'Day 7 - Highest Reward' },
  ];

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
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-auto overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-rose-600 px-6 py-5">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">📅</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white">
                  {dialogueData ? 'Edit Daily Reward' : 'Create Daily Reward'}
                </h3>
                <p className="text-red-100 text-opacity-90 text-sm mt-1">
                  {dialogueData 
                    ? 'Update daily coin reward settings' 
                    : 'Set up daily coin rewards for consecutive login days'
                  }
                </p>
              </div>
              <button
                onClick={handleClose}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 bg-white">
            <form onSubmit={(e) => e.preventDefault()} onKeyPress={handleKeyPress}>
              <div className="space-y-6">
                {/* Day Selector */}
                <div>
                  <label className="block text-sm font-medium text-red-700 mb-2">
                    Day <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={day}
                    onChange={(e) => {
                      setDay(e.target.value);
                      if (errors.day) setErrors(prev => ({ ...prev, day: '' }));
                    }}
                    disabled={!!dialogueData}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${
                      errors.day 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-300 focus:border-transparent'
                    } ${dialogueData ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}
                  >
                    <option value="">Select a day...</option>
                    {dayOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.day && (
                    <p className="text-red-600 text-sm mt-2 flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{errors.day}</span>
                    </p>
                  )}
                  {dialogueData && (
                    <p className="text-gray-500 text-xs mt-2">
                      Day cannot be changed for existing rewards
                    </p>
                  )}
                </div>

                {/* Daily Reward Coin Input */}
                <div>
                  <label className="block text-sm font-medium text-red-700 mb-2">
                    Daily Reward Coins <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={dailyRewardCoin}
                    onChange={(e) => {
                      setDailyRewardCoin(e.target.value);
                      if (errors.dailyRewardCoin) setErrors(prev => ({ ...prev, dailyRewardCoin: '' }));
                    }}
                    placeholder="Enter coin amount"
                    min="1"
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${
                      errors.dailyRewardCoin 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-300 focus:border-transparent'
                    }`}
                  />
                  {errors.dailyRewardCoin && (
                    <p className="text-red-600 text-sm mt-2 flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{errors.dailyRewardCoin}</span>
                    </p>
                  )}
                </div>

                {/* Info Box */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 text-sm">💡</span>
                    </div>
                    <div>
                      <p className="text-blue-800 text-sm font-medium">Daily Reward Information</p>
                      <p className="text-blue-600 text-sm mt-1">
                        {dialogueData 
                          ? `Editing reward for Day ${day}. Users receive this amount after ${day} consecutive login${day === '1' ? '' : 's'}.`
                          : 'Set increasing rewards for consecutive login days. Day 1 starts the streak, Day 7 offers the highest reward to encourage daily engagement.'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Preview */}
                {day && dailyRewardCoin && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-800 text-sm font-medium">Reward Preview</p>
                        <p className="text-green-600 text-sm">
                          Users will receive <span className="font-bold">{dailyRewardCoin} coins</span> on Day {day}
                        </p>
                      </div>
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-bold">{dailyRewardCoin}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
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
                {dialogueData ? 'Update Reward' : 'Create Reward'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyRewardCoinDialogue;