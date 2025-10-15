import { useDispatch, useSelector } from 'react-redux';
import { closeDialog } from '../../store/dialogueSlice';
import { useEffect, useState } from 'react';
import {
  addVipPlan,
  getVipPlan,
  updateVipPlan,
} from '../../store/vipPlanSlice';
import { toast } from 'react-toastify';

const VipPlanDialogue = ({ page, size }) => {
  const dispatch = useDispatch();
  const [offerPrice, setOfferPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [productKey, setProductKey] = useState('');
  const [tags, setTags] = useState('');
  const [validityType, setValidityType] = useState('');
  const [validity, setValidity] = useState('');
  const [error, setError] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { dialogue: open, dialogueData } = useSelector(
    (state) => state.dialogue
  );

  const handleCloseAds = () => {
    dispatch(closeDialog());
  };

  useEffect(() => {
    if (dialogueData) {
      setOfferPrice(dialogueData?.offerPrice || '');
      setAmount(dialogueData?.price || '');
      setProductKey(dialogueData?.productKey || '');
      setTags(dialogueData?.tags || '');
      setValidityType(dialogueData?.validityType || '');
      setValidity(dialogueData?.validity || '');
    }
  }, [dialogueData]);

  const validate = () => {
    let error = {};
    let isValid = true;

    if (!offerPrice) {
      isValid = false;
      error['offerPrice'] = 'Please enter offer price';
    }
    if (!amount) {
      isValid = false;
      error['amount'] = 'Please enter amount';
    }
    if (offerPrice > amount) {
      isValid = false;
      error['offerPrice'] = 'Offer price should be less than amount';
    }
    if (!validity) {
      isValid = false;
      error['validity'] = 'Please enter validity';
    }
    if (!validityType) {
      isValid = false;
      error['validityType'] = 'Please select validity type';
    }
    if (!productKey) {
      isValid = false;
      error['productKey'] = 'Please enter product key';
    }
    if (!tags) {
      isValid = false;
      error['tags'] = 'Please enter tags';
    }

    setError(error);
    return isValid;
  };

  const handleSubmit = async () => {
    if (validate()) {
      setIsSubmitting(true);
      try {
        let data = {
          offerPrice: offerPrice,
          price: amount,
          validityType: validityType,
          validity: validity,
          productKey: productKey,
          tags: tags,
          vipPlanId: dialogueData?._id,
        };

        if (dialogueData) {
          const res = await dispatch(updateVipPlan(data)).unwrap();
          if (res?.status) {
            toast.success(res?.message);
            handleCloseAds();
            dispatch(getVipPlan({ page, size }));
          } else {
            toast.error(res?.message || 'Update failed');
          }
        } else {
          const res = await dispatch(addVipPlan(data)).unwrap();
          if (res?.status) {
            toast.success(res?.message);
            handleCloseAds();
            dispatch(getVipPlan({ page, size }));
          } else {
            toast.error(res?.message || 'Creation failed');
          }
        }
      } catch (error) {
        toast.error('An error occurred');
        console.log("error: ", error)
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-opacity-50 transition-opacity backdrop-blur-sm"
        onClick={handleCloseAds}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <div className="relative bg-gradient-to-r from-red-500 to-red-600 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            
            {/* Header */}
            <div className="px-8 py-6 text-white">
              <div className="flex items-center gap-3">
                <div className="bg-white bg-opacity-20 rounded-full w-8 h-8 flex items-center justify-center text-lg">
                  👑
                </div>
                <h2 className="text-2xl font-semibold">
                  {dialogueData ? 'Edit VIP Plan' : 'Create VIP Plan'}
                </h2>
              </div>
              <p className="text-pink-100 mt-2 ml-11 text-sm">
                {dialogueData ? 'Update your premium membership details' : 'Add a new premium membership plan'}
              </p>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto bg-white p-8 max-h-[60vh]">
              <form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Offer Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Offer Price *
                    </label>
                    <input
                      type="number"
                      onChange={(e) => {
                        setOfferPrice(e.target.value);
                        setError({ ...error, offerPrice: '' });
                      }}
                      name="offerPrice"
                      value={offerPrice}
                      placeholder="Enter offer price"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    />
                    {error?.offerPrice && (
                      <span className="text-red-600 text-sm mt-1 block">
                        {error?.offerPrice}
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price *
                    </label>
                    <input
                      type="number"
                      name="price"
                      onChange={(e) => {
                        setAmount(e.target.value);
                        setError({ ...error, amount: '' });
                      }}
                      value={amount}
                      placeholder="Enter actual price"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    />
                    {error?.amount && (
                      <span className="text-red-600 text-sm mt-1 block">
                        {error?.amount}
                      </span>
                    )}
                  </div>

                  {/* Validity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Validity *
                    </label>
                    <input
                      type="number"
                      onChange={(e) => {
                        setValidity(e.target.value);
                        setError({ ...error, validity: '' });
                      }}
                      name="validity"
                      value={validity}
                      placeholder="Enter validity duration"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    />
                    {error?.validity && (
                      <span className="text-red-600 text-sm mt-1 block">
                        {error?.validity}
                      </span>
                    )}
                  </div>

                  {/* Validity Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Validity Type *
                    </label>
                    <select
                      value={validityType}
                      onChange={(e) => {
                        setValidityType(e.target.value);
                        setError({ ...error, validityType: '' });
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select Validity Type</option>
                      <option value="month">Month</option>
                      <option value="year">Year</option>
                    </select>
                    {error?.validityType && (
                      <span className="text-red-600 text-sm mt-1 block">
                        {error?.validityType}
                      </span>
                    )}
                  </div>
                </div>

                {/* Full Width Fields */}
                <div className="space-y-6">
                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags *
                    </label>
                    <input
                      type="text"
                      onChange={(e) => {
                        setTags(e.target.value);
                        setError({ ...error, tags: '' });
                      }}
                      name="tags"
                      value={tags}
                      placeholder="Enter tags separated by commas"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    />
                    {error?.tags && (
                      <span className="text-red-600 text-sm mt-1 block">
                        {error?.tags}
                      </span>
                    )}
                  </div>

                  {/* Product Key */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Key *
                    </label>
                    <input
                      type="text"
                      onChange={(e) => {
                        setProductKey(e.target.value);
                        setError({ ...error, productKey: '' });
                      }}
                      name="productKey"
                      value={productKey}
                      placeholder="Enter unique product identifier"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    />
                    {error?.productKey && (
                      <span className="text-red-600 text-sm mt-1 block">
                        {error?.productKey}
                      </span>
                    )}
                  </div>
                </div>

                {/* Validation Note */}
                {error?.offerPrice && error.offerPrice.includes('less than amount') && (
                  <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
                    💡 Offer price must be less than the actual price to create a valid discount.
                  </div>
                )}
              </form>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleCloseAds}
                  disabled={isSubmitting}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:transform-none min-w-[150px]"
                >
                  {isSubmitting ? 'Processing...' : (dialogueData ? 'Update Plan' : 'Create Plan')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VipPlanDialogue;