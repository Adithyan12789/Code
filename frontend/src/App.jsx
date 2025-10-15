import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Providers } from "./Provider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { baseURL, secretKey } from "./util/config";
import Loader from "./extra/Loader";
import AuthCheck from "./pages/AuthCheck";

// Import your pages/components
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Registration from "./pages/Registration";

// User Management
import User from "./pages/User";
import ViewProfile from "./pages/ViewProfile";
import ViewProfileHistory from "./pages/ViewProfileHistory";

// News Management
import NewsCategory from "./pages/NewsCategory";
import NewsChannelList from "./pages/NewsChannelList";
import ViewShortVideo from "./pages/ViewShortVideo";
import NewsList from "./pages/NewsList";

// Package Management
import CoinPlan from "./pages/CoinPlan";
import VipPlan from "./pages/VipPlan";
import OrderHistory from "./pages/OrderHistory";
import CoinPlanHistory from "./pages/CoinPlanHistory";

// General
import Reward from "./pages/Reward";
import Setting from "./pages/Setting";
// import ForgotPassword from "./pages/ForgotPassword";

const App = () => {
  const token = localStorage.getItem("token");

  // Set default axios config
  axios.defaults.baseURL = baseURL;
  axios.defaults.headers.common["key"] = secretKey;
  axios.defaults.headers.common["Authorization"] = token ? token : "";

  useEffect(() => {
    // Optional initial logic
  }, []);

  return (
    <Providers>
      <Router>
        <ToastContainer />
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={token ? <Navigate to="/dashboard" /> : <Login />}
          />
          <Route
            path="/register"
            element={token ? <Navigate to="/dashboard" /> : <Registration />}
          />
          {/* <Route path="/forgot-password" element={token ? <Navigate to="/dashboard" /> : <ForgotPassword />} /> */}
          <Route
            path="/login"
            element={token ? <Navigate to="/dashboard" /> : <Login />}
          />

          {/* Protected Routes */}

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              <AuthCheck>
                <Dashboard />
              </AuthCheck>
            }
          />

          {/* User Management Routes */}
          <Route
            path="/user"
            element={
              <AuthCheck>
                <User />
              </AuthCheck>
            }
          />
          <Route
            path="/viewProfile/:userId"
            element={
              <AuthCheck>
                <ViewProfile />
              </AuthCheck>
            }
          />
          <Route
            path="/viewProfileHistory/:userId"
            element={
              <AuthCheck>
                <ViewProfileHistory />
              </AuthCheck>
            }
          />

          {/* News Management Routes */}
          <Route
            path="/newsCategory"
            element={
              <AuthCheck>
                <NewsCategory />
              </AuthCheck>
            }
          />
          <Route
            path="/newsChannelList"
            element={
              <AuthCheck>
                <NewsChannelList />
              </AuthCheck>
            }
          />
          <Route
            path="/ViewShortVideo/:id"
            element={
              <AuthCheck>
                <ViewShortVideo />
              </AuthCheck>
            }
          />
          <Route
            path="/newsList"
            element={
              <AuthCheck>
                <NewsList />
              </AuthCheck>
            }
          />

          {/* Package Management Routes */}
          <Route
            path="/coinPlan"
            element={
              <AuthCheck>
                <CoinPlan />
              </AuthCheck>
            }
          />
          <Route
            path="/vipPlan"
            element={
              <AuthCheck>
                <VipPlan />
              </AuthCheck>
            }
          />
          <Route
            path="/orderHistory"
            element={
              <AuthCheck>
                <OrderHistory />
              </AuthCheck>
            }
          />
          <Route
            path="/coinPlanHistory"
            element={
              <AuthCheck>
                <CoinPlanHistory />
              </AuthCheck>
            }
          />

          {/* General Routes */}
          <Route
            path="/reward"
            element={
              <AuthCheck>
                <Reward />
              </AuthCheck>
            }
          />
          <Route
            path="/setting"
            element={
              <AuthCheck>
                <Setting />
              </AuthCheck>
            }
          />
          <Route
            path="/profile"
            element={
              <AuthCheck>
                <Profile />
              </AuthCheck>
            }
          />

          {/* Catch-all: redirect unknown routes */}
          <Route
            path="*"
            element={<Navigate to={token ? "/dashboard" : "/"} />}
          />
        </Routes>
        <Loader />
      </Router>
    </Providers>
  );
};

export default App;
