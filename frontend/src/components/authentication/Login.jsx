import "./Login.scss";

import { useNavigate } from "react-router-dom";
import axios from "axios";

import { useEffect, useState } from "react";

const Login = (props) => {
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  const initialValues = { email: "", password: "" };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleCanSubmit = (e) => {
    e.preventDefault();
    setFormErrors(validate(formValues));
  };

  const submitHandler = async () => {
    // form validation done in handlecansubmit function
    try {
      const email = formValues.email,
        password = formValues.password;
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
    } catch (err) {
      setSubmitError(err.response.data.message);
    }
  };

  useEffect(() => {
    if (
      Object.keys(formErrors).length === 0 &&
      formValues.email !== "" &&
      formValues.password !== ""
    ) {
      submitHandler();
    }
  }, [formErrors]);

  const validate = (values) => {
    const errors = {};
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!values.email) {
      errors.email = "Email is required!";
    } else if (!regex.test(values.email)) {
      errors.email = "Not a valid email format!";
    }
    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 6) {
      errors.password = "Atleast 6 characters required!";
    }

    return errors;
  };

  const changePasswordVisibility = (e) => {
    e.preventDefault();
    setPasswordVisibility(!passwordVisibility);
  };

  return (
    <div className={props.className}>
      <form onSubmit={handleCanSubmit}>
        <label>Email</label>
        <input
          type="text"
          name="email"
          value={formValues.email}
          onChange={handleChange}
          placeholder="Enter your email"
        />
        <p className="validation-error">{formErrors.email}</p>

        <div className="password-label">
          <label>Password</label>
          <span
            title="Show/Hide Password"
            onClick={changePasswordVisibility}
            className="material-icons-outlined show-hide-password"
          >
            {passwordVisibility ? "visibility_on" : "visibility_off"}
          </span>
        </div>
        <input
          name="password"
          value={formValues.password}
          onChange={handleChange}
          type={passwordVisibility ? "text" : "password"}
          placeholder="Enter your password"
        />

        <p className="validation-error">{formErrors.password}</p>

        <button className="sign-in-button" onClick={handleCanSubmit}>
          Sign In
        </button>
        <p className="validation-error">{submitError}</p>
      </form>
    </div>
  );
};

export default Login;
