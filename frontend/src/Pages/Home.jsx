import "./Home.scss";

import { useEffect, useState } from "react";

import Login from "../components/authentication/Login";
import Signup from "../components/authentication/Signup";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  // if user is already in localstorage, means it is logged in.
  // no navigate the page from homepage to chats page
  useEffect(() => {
    // getting the current user credentials from the local storage
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (userInfo) {
      navigate("/chats");
    }
  }, [navigate]);

  const [displayInorUp, setDisplayInorUp] = useState(false); // false means login

  const switchtosignupHandler = () => {
    setDisplayInorUp(true);
  };
  const switchtosigninHandler = () => {
    setDisplayInorUp(false);
  };

  return (
    <div className="home">
      <div className="logo">CHAT APP</div>
      <div className="buttons-Sign-Up-In">
        <button
          className={`login ${displayInorUp || "active"}`}
          onClick={switchtosigninHandler}
        >
          Login
        </button>
        <button
          className={`login ${displayInorUp && "active"}`}
          onClick={switchtosignupHandler}
        >
          Signup
        </button>
      </div>
      <div className="display-Sign-In-Up">
        {displayInorUp && <Signup className="temp" />}
        {!displayInorUp && <Login className="temp" />}
      </div>
    </div>
  );
};

export default Home;
