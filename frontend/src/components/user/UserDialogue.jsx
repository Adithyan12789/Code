import { useDispatch, useSelector } from 'react-redux';
import { closeDialog } from '../../store/dialogueSlice';
import Input from '../../extra/Input';
import { useEffect, useState } from 'react';
import Button from '../../extra/Button';
import Selector from '../../extra/Selector';
import { editUser, getAllUsers } from '../../store/userSlice';
import { toast } from 'react-toastify';

const UserDialogue = ({ startDate, endDate, page, size }) => {
  const dispatch = useDispatch();
  const { dialogue: open, dialogueData } = useSelector((state) => state.dialogue);

  const [values, setValues] = useState({});
  const [gender, setGender] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  useEffect(() => {
    setValues(dialogueData);
    setGender(dialogueData?.gender);
  }, [dialogueData]);

  const handleClose = () => {
    dispatch(closeDialog());
  };

  const validation = () => {
    let error = {};
    let isValid = true;

    if (!values?.name) {
      isValid = false;
      error['name'] = 'Please enter name';
    }
    if (!values?.username) {
      isValid = false;
      error['username'] = 'Please enter username';
    }
    setErrors(error);
    return isValid;
  };

  const handleSubmit = async () => {
    if (validation()) {
      setIsLoading(true);
      const data = {
        username: values?.username,
        name: values?.name,
        gender,
        age: values?.age,
        bio: values?.bio,
        userId: dialogueData?._id,
      };
      
      try {
        const result = await dispatch(editUser(data));
        if (result?.payload?.status) {
          toast.success(result?.payload?.message);
          dispatch(closeDialog());
          dispatch(getAllUsers({ startDate, endDate, page, size }));
        } else {
          toast.error(result?.payload?.message);
        }
      } catch (error) {
        toast.error('An error occurred while updating user', error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40 p-4">
      {/* Modern Glass Morphism Container */}
      <div className="relative w-full max-w-2xl rounded-3xl bg-white/95 backdrop-blur-xl shadow-2xl border border-white/20 overflow-hidden animate-scaleIn">
        
        {/* Header with Modern Gradient */}
        <div className="relative px-8 py-6 bg-gradient-to-r from-rose-500 via-red-500 to-pink-500 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold tracking-tight">Edit User Profile</h3>
                <p className="text-rose-100 text-sm mt-1">Update user information and preferences</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-xl hover:bg-white/20 transition-all duration-200 transform hover:rotate-90 hover:scale-110 group"
            >
              <svg className="w-5 h-5 group-hover:stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body with Modern Layout */}
        <div className="px-8 py-8 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column - Personal Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-1.5 h-6 bg-gradient-to-b from-rose-500 to-red-500 rounded-full"></div>
                <h4 className="text-lg font-semibold text-gray-800">Personal Information</h4>
              </div>

              {/* Username Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Username
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    name="username"
                    value={values?.username || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3.5 bg-gray-50/80 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-all duration-200 placeholder-gray-400 text-gray-700 font-medium group-hover:bg-white group-hover:border-gray-300"
                    placeholder="Enter username"
                  />
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-rose-500/20 transition-all duration-200 pointer-events-none"></div>
                </div>
                {errors?.username && (
                  <p className="text-sm text-rose-600 flex items-center gap-2 animate-pulse">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    {errors?.username}
                  </p>
                )}
              </div>

              {/* Name Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Full Name
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    name="name"
                    value={values?.name || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3.5 bg-gray-50/80 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-all duration-200 placeholder-gray-400 text-gray-700 font-medium group-hover:bg-white group-hover:border-gray-300"
                    placeholder="Enter full name"
                  />
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-rose-500/20 transition-all duration-200 pointer-events-none"></div>
                </div>
                {errors?.name && (
                  <p className="text-sm text-rose-600 flex items-center gap-2 animate-pulse">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    {errors?.name}
                  </p>
                )}
              </div>

              {/* Age Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Age
                </label>
                <div className="relative group">
                  <input
                    type="number"
                    name="age"
                    value={values?.age || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3.5 bg-gray-50/80 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-all duration-200 placeholder-gray-400 text-gray-700 font-medium group-hover:bg-white group-hover:border-gray-300 appearance-none"
                    placeholder="Enter age"
                  />
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-rose-500/20 transition-all duration-200 pointer-events-none"></div>
                </div>
              </div>
            </div>

            {/* Right Column - Additional Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-1.5 h-6 bg-gradient-to-b from-rose-500 to-red-500 rounded-full"></div>
                <h4 className="text-lg font-semibold text-gray-800">Additional Information</h4>
              </div>

              {/* Gender Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Gender
                </label>
                <div className="relative group">
                  <select
                    value={gender}
                    onChange={(e) => {
                      setGender(e.target.value);
                      setErrors({ ...errors, gender: '' });
                    }}
                    className="w-full px-4 py-3.5 bg-gray-50/80 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-all duration-200 text-gray-700 font-medium group-hover:bg-white group-hover:border-gray-300 appearance-none cursor-pointer"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-rose-500/20 transition-all duration-200 pointer-events-none"></div>
                </div>
                {errors?.gender && (
                  <p className="text-sm text-rose-600 flex items-center gap-2 animate-pulse">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    {errors?.gender}
                  </p>
                )}
              </div>

              {/* Bio Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  Bio
                </label>
                <div className="relative group">
                  <textarea
                    name="bio"
                    value={values?.bio || ''}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-3.5 bg-gray-50/80 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-all duration-200 placeholder-gray-400 text-gray-700 font-medium group-hover:bg-white group-hover:border-gray-300 resize-none"
                    placeholder="Tell us about yourself..."
                  />
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-rose-500/20 transition-all duration-200 pointer-events-none"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Modern Buttons */}
        <div className="px-8 py-6 bg-gradient-to-r from-gray-50/80 to-gray-100/80 border-t border-gray-200/50 backdrop-blur-sm">
          <div className="flex justify-end gap-4">
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="px-8 py-3.5 rounded-2xl border border-gray-300 text-gray-700 font-semibold bg-white/90 hover:bg-white hover:border-gray-400 hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-red-500 text-white font-semibold shadow-lg hover:shadow-xl hover:from-rose-600 hover:to-red-600 transform hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-3"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Updating...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDialogue;