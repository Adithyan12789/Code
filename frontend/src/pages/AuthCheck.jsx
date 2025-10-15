"use client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthCheck = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuth = sessionStorage.getItem("isAuth");
    if (!isAuth || isAuth !== "true") {
      navigate("/");
    }
  }, [navigate]); // ✅ add navigate as dependency

  return <>{children}</>;
};

export default AuthCheck;
