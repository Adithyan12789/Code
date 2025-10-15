import React, { useEffect, useState } from "react";
import axios from "axios";
import Login from "./Login";
import Registration from "./Registration";

const Home = () => {
  const [login, setLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get("/api/admin/login/fetchLoginOrNot") // ✅ Add slash for relative API call
      .then((res) => {
        setLogin(res.data.login);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="mainLoaderBox loader-new bg-white">
        <div className="loading">
          <div className="d1"></div>
          <div className="d2"></div>
        </div>
      </div>
    );
  }

  return login ? <Login /> : <Registration />;
};

export default Home;
