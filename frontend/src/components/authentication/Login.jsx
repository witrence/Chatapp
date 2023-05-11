import "./Login.scss";

import { useNavigate } from "react-router-dom";
import axios from "axios";

import { useState } from "react";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState(true);

  const navigate = useNavigate();
  const submitHandler = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      console.log("Enter email/password carefully !!");
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "api/user/login",
        { email, password },
        config
      );
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/chats");
      /*     *******************************     */
    } catch (err) {
      console.log("Error in loggin in");
      console.log(err.response.message.data);
    }
  };

  const changePasswordVisibility = (e) => {
    e.preventDefault();
    setPasswordVisibility(!passwordVisibility);
  };

  return (
    <div className={props.className}>
      {/* <span className="title">Loginn Here</span> */}
      <form>
        <label>Email</label>
        <input
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Enter your email"
        />

        <label>Enter your password</label>
        <input
          onChange={(e) => setPassword(e.target.value)}
          type={passwordVisibility ? "text" : "password"}
          placeholder="password"
        />
        <button onClick={changePasswordVisibility}>Show/Hide Password</button>

        <button onClick={submitHandler}>Sign In</button>
      </form>
    </div>
  );
};

export default Login;
