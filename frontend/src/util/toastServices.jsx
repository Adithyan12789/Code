/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// toastServices.js
import { createRoot } from 'react-dom/client';

let currentToast = null;
let toastContainer = null;

// Toast types with corresponding styles
const toastTypes = {
  success: {
    bgColor: 'bg-green-500',
    borderColor: 'border-green-600',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    )
  },
  error: {
    bgColor: 'bg-red-500',
    borderColor: 'border-red-600',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    )
  },
  warning: {
    bgColor: 'bg-yellow-500',
    borderColor: 'border-yellow-600',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    )
  },
  info: {
    bgColor: 'bg-blue-500',
    borderColor: 'border-blue-600',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    )
  }
};

// Toast component
const Toast = ({ message, type, onClose, isLeaving }) => {
  const toastStyle = toastTypes[type] || toastTypes.info;

  return (
    <div className={`
      flex items-center w-full max-w-sm p-4 mb-3 text-white rounded-lg shadow-lg
      ${toastStyle.bgColor} border-l-4 ${toastStyle.borderColor}
      transform transition-all duration-300 ease-in-out
      ${isLeaving ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
      hover:shadow-xl cursor-pointer
    `}
    onClick={onClose}
    >
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8">
        {toastStyle.icon}
      </div>
      <div className="ml-3 text-sm font-normal flex-1">
        {message}
      </div>
      <button
        type="button"
        className="ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 focus:ring-white p-1.5 inline-flex h-8 w-8 hover:bg-white hover:bg-opacity-20 transition-colors"
        onClick={onClose}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

// Progress bar component
const ProgressBar = ({ duration, isPaused }) => (
  <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200 bg-opacity-50">
    <div
      className={`h-full bg-white bg-opacity-70 transition-all duration-100 ${isPaused ? 'transition-none' : ''}`}
      style={{
        width: '100%',
        animation: `shrink ${duration}ms linear forwards`,
      }}
    />
    <style>
      {`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}
    </style>
  </div>
);

// Initialize toast container
const initializeToastContainer = () => {
  if (typeof document === 'undefined') return null;

  let container = document.getElementById('custom-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'custom-toast-container';
    container.className = 'fixed top-4 right-4 z-50 w-80 max-w-full';
    document.body.appendChild(container);
  }
  
  return container;
};

// Main toast function
export const setToast = (type, message) => {
  if (typeof document === 'undefined') return;

  const container = initializeToastContainer();
  if (!container) return;

  const toastId = Date.now().toString();
  const duration = 2000;

  const removeToast = (toastId, isManualClose = false) => {
    const toastElement = document.getElementById(`toast-${toastId}`);
    if (toastElement) {
      // Add leaving animation
      toastElement.classList.add('translate-x-full', 'opacity-0');
      
      setTimeout(() => {
        const root = toastElement._reactRoot;
        if (root) {
          root.unmount();
        }
        toastElement.remove();
        
        if (currentToast === toastId) {
          currentToast = null;
        }
      }, 300);
    }
  };

  // If there's a current toast, remove it
  if (currentToast) {
    removeToast(currentToast);
  }

  currentToast = toastId;

  // Create toast element
  const toastElement = document.createElement('div');
  toastElement.id = `toast-${toastId}`;
  toastElement.className = 'relative';

  const root = createRoot(toastElement);
  toastElement._reactRoot = root;

  let isPaused = false;
  let timeoutId;

  const startTimer = () => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      removeToast(toastId);
    }, duration);
  };

  const pauseTimer = () => {
    isPaused = true;
    if (timeoutId) clearTimeout(timeoutId);
  };

  const resumeTimer = () => {
    isPaused = false;
    startTimer();
  };

  // Render the toast
  root.render(
    <div
      onMouseEnter={pauseTimer}
      onMouseLeave={resumeTimer}
    >
      <Toast
        message={message}
        type={type}
        onClose={() => removeToast(toastId, true)}
      />
      <ProgressBar duration={duration} isPaused={isPaused} />
    </div>
  );

  container.appendChild(toastElement);
  startTimer();

  return toastId;
};

// Convenience methods
export const toast = {
  success: (message) => setToast('success', message),
  error: (message) => setToast('error', message),
  warning: (message) => setToast('warning', message),
  info: (message) => setToast('info', message),
};

// Optional: Batch toast removal
export const removeAllToasts = () => {
  const container = document.getElementById('custom-toast-container');
  if (container) {
    container.innerHTML = '';
  }
  currentToast = null;
};

// Optional: Update existing toast
export const updateToast = (toastId, newMessage, newType = 'info') => {
  const toastElement = document.getElementById(`toast-${toastId}`);
  if (toastElement && toastElement._reactRoot) {
    toastElement._reactRoot.render(
      <Toast
        message={newMessage}
        type={newType}
        onClose={() => removeToast(toastId, true)}
      />
    );
  }
};

export default setToast;