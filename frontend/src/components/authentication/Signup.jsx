import "./Signup.scss";

import { useEffect, useState } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";

const Signup = (props) => {
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  // form validation
  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
  };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});

  const [pic, setPic] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const postPic = (pic) => {
    // if pic does not exist or chosen
    if (pic === undefined) {
      console.log("Please select an image !");
      return;
    }

    if (pic.type === "image/jpeg" || pic.type === "image/png") {
      const data = new FormData();

      data.append("file", pic);
      data.append("upload_preset", "Chat-App");
      data.append("cloud_name", "dddpxb7en"); // name of cloudinary account, can be changed
      fetch("https://api.cloudinary.com/v1_1/dddpxb7en/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          console.log(data.url.toString());
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      // if selected image is not jpg or png
      console.log("Select jpg or png image only !");
      return;
    }
  };

  const handleCanSubmit = (e) => {
    e.preventDefault();
    setFormErrors(validate(formValues));
  };

  const submitHandler = async () => {
    // sending data to database
    try {
      const name = formValues.name,
        email = formValues.email,
        password = formValues.password;
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user",
        {
          name,
          email,
          password,
          pic,
        },
        config
      );

      // console.log("REGISTRATION SUCCESSFULLY DONE !!!");
      localStorage.setItem("userInfo", JSON.stringify(data));

      navigate("/chats");
      /****************************** */
    } catch (err) {
      // console.log("Some error occurred while registering !!! :(");
      console.log(err.response.data.message);
    }
  };

  useEffect(() => {
    if (
      Object.keys(formErrors).length === 0 &&
      formValues.name !== "" &&
      formValues.email !== "" &&
      formValues.password !== "" &&
      formValues.confirmpassword !== ""
    ) {
      submitHandler();
    }
  }, [formErrors]);

  const validate = (values) => {
    const errors = {};
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!values.name) {
      errors.name = "Name is required";
    }
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

    if (values.confirmpassword !== values.password) {
      errors.confirmpassword = "Passwords do not match";
    }

    return errors;
  };

  // const signUpAsGuest = () => {};

  const changePasswordVisibility = (e) => {
    e.preventDefault();
    setPasswordVisibility(!passwordVisibility);
  };
  return (
    <div className={props.className}>
      <form onSubmit={handleCanSubmit}>
        <label>Name</label>
        <input
          name="name"
          type="text"
          onChange={handleChange}
          placeholder="Enter your name"
        />
        <p className="validation-error">{formErrors.name}</p>

        <label>Email</label>
        <input
          name="email"
          onChange={handleChange}
          type="text"
          placeholder="Enter your email"
        />
        <p className="validation-error">{formErrors.email}</p>

        <label>Upload your profile picture</label>
        <input
          onChange={(e) => postPic(e.target.files[0])}
          type="file"
          accept="image/*"
        />

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
          onChange={handleChange}
          type={passwordVisibility ? "text" : "password"}
          placeholder="Enter your password"
        />
        <p className="validation-error">{formErrors.password}</p>

        <label>Confirm Password</label>
        <input
          name="confirmpassword"
          onChange={handleChange}
          type={passwordVisibility ? "text" : "password"}
          placeholder="Confirm password"
        />
        <p className="validation-error">{formErrors.confirmpassword}</p>
        {/* <button onClick={changePasswordVisibility}>

        </button> */}

        {/* ************************************** */}
        <button onClick={handleCanSubmit}>Sign Up</button>
        {/* <button onClick={signUpAsGuest}>Sign Up as Guest</button> */}
      </form>
    </div>
  );
};

export default Signup;
