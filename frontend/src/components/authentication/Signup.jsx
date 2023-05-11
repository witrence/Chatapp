import { useState } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";

const Signup = (props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState(null);

  const navigate = useNavigate();

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
  const submitHandler = async (e) => {
    e.preventDefault();
    // cheking if all fields are filled
    if (!name || !email || !password || !confirmPassword) {
      console.log("Please fill all the fields before signng up !");
      return;
    }
    // is passwords do not match
    if (password !== confirmPassword) {
      console.log("Passwords do not match !!!!");
      return;
    }

    // sending data to database
    try {
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

      console.log("REGISTRATION SUCCESSFULLY DONE !!!");
      localStorage.setItem("userInfo", JSON.stringify(data));

      navigate("/chats");
      /****************************** */
    } catch (err) {
      console.log("Some error occurred while registering !!! :(");
      console.log(err.response.data.message);
    }
  };

  const changePasswordVisibility = (e) => {
    e.preventDefault();
    setPasswordVisibility(!passwordVisibility);
  };
  return (
    <div className={props.className}>
      {/* <span className="title">Signup Here</span> */}
      <form>
        <label>Name</label>
        <input
          onChange={(event) => {
            setName(event.target.value);
          }}
          type="name"
          placeholder="Enter your name"
        />

        <label>Email</label>
        <input
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Enter your email"
        />

        <label>Upload your profile picture</label>
        <input
          onChange={(e) => postPic(e.target.files[0])}
          type="file"
          accept="image/*"
        />

        <label>Password</label>
        <input
          onChange={(e) => setPassword(e.target.value)}
          type={passwordVisibility ? "text" : "password"}
          placeholder="Enter your password"
        />

        <label>Confirm Password</label>
        <input
          onChange={(e) => setConfirmPassword(e.target.value)}
          type={passwordVisibility ? "text" : "password"}
          placeholder="confirm password"
        />
        <button onClick={changePasswordVisibility}>Show/Hide Password</button>
        {/* ************************************** */}
        <button onClick={submitHandler}>Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
