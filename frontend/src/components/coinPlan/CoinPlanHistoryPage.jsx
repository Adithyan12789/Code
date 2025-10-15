import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { closeDialog } from '../../store/dialogueSlice';
import {
  addCoinPlan,
  getCoinPlan,
  updateCoinPlan,
} from '../../store/coinPlanSlice';
import { toast } from 'react-toastify';

// SVG Icons
const CoinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
    <path d="M15 9.5C15 10.8807 13.6569 12 12 12C10.3431 12 9 10.8807 9 9.5C9 8.11929 10.3431 7 12 7C13.6569 7 15 8.11929 15 9.5Z" stroke="currentColor" strokeWidth="2"/>
    <path d="M9 9.5V12.5C9 13.8807 10.3431 15 12 15C13.6569 15 15 13.8807 15 12.5V9.5" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const BonusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2"/>
    <path d="M4 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M22 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 4V2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 22V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M17.6569 6.34314L19.0711 4.92893" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M4.92893 19.0711L6.34314 17.6569" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M17.6569 17.6569L19.0711 19.0711" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M4.92893 4.92893L6.34314 6.34314" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const PriceIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 8C16 9.10457 15.1046 10 14 10C12.8954 10 12 9.10457 12 8C12 6.89543 12.8954 6 14 6C15.1046 6 16 6.89543 16 8Z" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 16C12 17.1046 11.1046 18 10 18C8.89543 18 8 17.1046 8 16C8 14.8954 8.89543 14 10 14C11.1046 14 12 14.8954 12 16Z" stroke="currentColor" strokeWidth="2"/>
    <path d="M8 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M3 20.4V3.6C3 3.26863 3.26863 3 3.6 3H20.4C20.7314 3 21 3.26863 21 3.6V20.4C21 20.7314 20.7314 21 20.4 21H3.6C3.26863 21 3 20.7314 3 20.4Z" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const OfferIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 9H15V15H9V9Z" stroke="currentColor" strokeWidth="2"/>
    <path d="M3 3H21V21H3V3Z" stroke="currentColor" strokeWidth="2"/>
    <path d="M15 3V9" stroke="currentColor" strokeWidth="2"/>
    <path d="M9 3V9" stroke="currentColor" strokeWidth="2"/>
    <path d="M15 15V21" stroke="currentColor" strokeWidth="2"/>
    <path d="M9 15V21" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const KeyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 9H15.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M15 15C17.2091 15 19 13.2091 19 11C19 8.79086 17.2091 7 15 7C12.7909 7 11 8.79086 11 11C11 11.3417 11.0348 11.6754 11.101 12H7C5.89543 12 5 12.8954 5 14V17C5 18.1046 5.89543 19 7 19H17C18.1046 19 19 18.1046 19 17V16.5" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const CoinPlanDialogue = ({ page, size }) => {
  const { dialogue: open, dialogueData } = useSelector(
    (state) => state.dialogue
  );
  const [coin, setCoin] = useState('');
  const [bonusCoin, setBonusCoin] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [error, setError] = useState({});
  const [amount, setAmount] = useState('');
  const dispatch = useDispatch();
  const [productKey, setProductKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleCloseAds = () => {
    dispatch(closeDialog());
  };
  
  const validate = () => {
    let error = {};
    let isValid = true;
    if (!offerPrice) {
      isValid = false;
      error.offerPrice = 'Offer Price Is Required !';
    }
    if (!bonusCoin) {
      isValid = false;
      error.bonusCoin = 'Bonus Coin Is Required !';
    }
    if (!amount) {
      isValid = false;
      error.amount = 'Amount Is Required !';
    }
    if (!productKey) {
      isValid = false;
      error.productKey = 'Product Key Is Required !';
    }
    if (!coin) {
      isValid = false;
      error.coin = 'Coin Is Required !';
    }
    if (+offerPrice > +amount) {
      isValid = false;
      error['offerPrice'] = 'Offer price should be less than amount';
    }
    setError(error);
    return isValid;
  };

  useEffect(() => {
    if (dialogueData) {
      setCoin(dialogueData?.coin);
      setBonusCoin(dialogueData?.bonusCoin);
      setOfferPrice(dialogueData?.offerPrice);
      setAmount(dialogueData?.price);
      setProductKey(dialogueData?.productKey);
    }
  }, [dialogueData]);

  const handleSubmit = async () => {
    if (validate()) {
      setIsSubmitting(true);
      try {
        let data = {
          offerPrice: +offerPrice,
          bonusCoin: +bonusCoin,
          price: +amount,
          productKey: productKey,
          coin: coin,
          coinPlanId: dialogueData?._id,
        };
        
        if (dialogueData) {
          const res = await dispatch(updateCoinPlan(data)).unwrap();
          if (res?.status) {
            toast.success(res?.message);
            handleCloseAds();
            dispatch(getCoinPlan({ page, size }));
          } else {
            toast.error(res?.message || 'Update failed');
          }
        } else {
          const res = await dispatch(addCoinPlan(data)).unwrap();
          if (res?.status) {
            toast.success(res?.message);
            handleCloseAds();
            dispatch(getCoinPlan({ page, size }));
          } else {
            toast.error(res?.message || 'Add failed');
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
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleCloseAds}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden">
          <div className="relative bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-6 border-b border-white border-opacity-10">
              <div className="flex items-center gap-3">
                <CoinIcon />
                <h2 className="text-2xl font-bold">
                  {dialogueData ? 'Edit Coin Plan' : 'Add Coin Plan'}
                </h2>
              </div>
              <p className="text-red-100 mt-2 ml-8 text-sm">
                {dialogueData ? 'Update coin package details' : 'Create a new coin package'}
              </p>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto bg-red-50 p-8">
              <form>
                <div className="space-y-6">
                  {/* Two Column Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Bonus Coin */}
                    <div>
                      <label className="flex items-center gap-2 mb-2 font-semibold text-red-700 text-sm">
                        <BonusIcon />
                        Bonus Coin *
                      </label>
                      <input
                        type="number"
                        onChange={(e) => {
                          setBonusCoin(e.target.value);
                          setError({ ...error, bonusCoin: '' });
                        }}
                        name="bonusCoin"
                        value={bonusCoin}
                        placeholder="Enter bonus coins"
                        className="w-full px-4 py-3 border border-red-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      />
                      {error?.bonusCoin && (
                        <span className="text-red-600 text-sm mt-1 block">
                          {error?.bonusCoin}
                        </span>
                      )}
                    </div>

                    {/* Coin */}
                    <div>
                      <label className="flex items-center gap-2 mb-2 font-semibold text-red-700 text-sm">
                        <CoinIcon />
                        Coin *
                      </label>
                      <input
                        type="number"
                        onChange={(e) => {
                          setCoin(e.target.value);
                          setError({ ...error, coin: '' });
                        }}
                        name="coin"
                        value={coin}
                        placeholder="Enter coins"
                        className="w-full px-4 py-3 border border-red-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      />
                      {error?.coin && (
                        <span className="text-red-600 text-sm mt-1 block">
                          {error?.coin}
                        </span>
                      )}
                    </div>

                    {/* Offer Price */}
                    <div>
                      <label className="flex items-center gap-2 mb-2 font-semibold text-red-700 text-sm">
                        <OfferIcon />
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
                        className="w-full px-4 py-3 border border-red-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      />
                      {error?.offerPrice && (
                        <span className="text-red-600 text-sm mt-1 block">
                          {error?.offerPrice}
                        </span>
                      )}
                    </div>

                    {/* Price */}
                    <div>
                      <label className="flex items-center gap-2 mb-2 font-semibold text-red-700 text-sm">
                        <PriceIcon />
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
                        className="w-full px-4 py-3 border border-red-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      />
                      {error?.amount && (
                        <span className="text-red-600 text-sm mt-1 block">
                          {error?.amount}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Product Key */}
                  <div>
                    <label className="flex items-center gap-2 mb-2 font-semibold text-red-700 text-sm">
                      <KeyIcon />
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
                      placeholder="Enter product key identifier"
                      className="w-full px-4 py-3 border border-red-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    />
                    {error?.productKey && (
                      <span className="text-red-600 text-sm mt-1 block">
                        {error?.productKey}
                      </span>
                    )}
                  </div>

                  {/* Validation Note */}
                  {error?.offerPrice && error.offerPrice.includes('less than amount') && (
                    <div className="bg-red-100 border border-red-300 rounded-lg p-4 text-red-700 text-sm">
                      💡 Offer price must be less than the actual price to create a valid discount.
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="border-t border-red-200 bg-white px-8 py-6">
              <div className="flex justify-end gap-4">
                <button
                  onClick={handleCloseAds}
                  disabled={isSubmitting}
                  className="px-7 py-3 border border-red-300 text-red-700 rounded-xl font-semibold hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  Close
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-7 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:transform-none"
                >
                  {isSubmitting ? 'Processing...' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinPlanDialogue;