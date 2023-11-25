import React from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Tab, Tabs } from "react-bootstrap";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import Logo from "../images/logo.png";
import { toast } from "react-toastify";

const Login = (props) => {
  const navigate = useNavigate();
  const { user, loginUser } = useContext(AuthContext);
  const { register, handleSubmit, formState, setValue } = useForm();
  const { errors } = formState;

  if (user !== null) {
    navigate("/", { replace: true });
  }

  const apiUrl = process.env.REACT_APP_API_URL;

  const mutation = useMutation({
    mutationFn: async (formData) => {
      const { data } = await axios.post(
        apiUrl + "/EduIMS/VerifyLogin",
        formData
      );
      if (data.success === true) {
        const dataToSerialize = {
          username: data.data[0].FirstName + " " + data.data[0].LastName,
          userID: data.data[0].LoginUserID,
        };
        loginUser(dataToSerialize);
        toast.success("Login sucessful", {
          autoClose: 1500,
          position: "top-right",
        });
      } else {
        toast.error(data.Message, {
          autoClose: 1500,
          position: "top-right",
        });
        setValue("Password", "");
      }
    },
  });

  function onSubmit(data) {
    mutation.mutate(data);
  }

  return (
    <div className="bg__image">
      <div className="px-4 py-5 px-md-5 text-center text-lg-start row d-flex justify-content-center">
        <div className="card " style={{ width: "35rem" }}>
          <div className="card-body py-5 px-md-5 p-4">
            <Tabs
              defaultActiveKey="Login"
              id="uncontrolled-tab-example"
              className="mb-5"
              fill
            >
              <Tab eventKey="Login" title="Login">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  method="post"
                  noValidate
                >
                  <div className="text-center">
                    <img
                      alt="EDU IMS Logo"
                      src={Logo}
                      width="250"
                      height="50"
                      className="d-inline-block align-top"
                    />
                  </div>
                  <div className="row">
                    <h3
                      className="fw-bold mb-3 pb-3 text-center font-weight-bold"
                      style={{ marginTop: "15px" }}
                    >
                      Log In
                    </h3>
                  </div>
                  <div
                    className="form-outline mb-4"
                    style={{ marginTop: "20px" }}
                  >
                    <div className="form-outline">
                      <label className="form-label" htmlFor="usernlForame">
                        Username/Email
                      </label>
                      <input
                        type="text"
                        id="LoginName"
                        name="LoginName"
                        className="form-control"
                        placeholder="Enter your username/email..."
                        {...register("LoginName", {
                          required: "Username is required!",
                        })}
                      />
                      <p className="text-danger">{errors.LoginName?.message}</p>
                    </div>
                  </div>
                  <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="password">
                      Password
                    </label>
                    <input
                      type="password"
                      id="Password"
                      name="Password"
                      className="form-control"
                      placeholder="Enter your password..."
                      {...register("Password", {
                        required: "Password is required!",
                      })}
                    />
                    <p className="text-danger">{errors.Password?.message}</p>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary w-100 mb-4 "
                    style={{ marginTop: "20px" }}
                  >
                    Log In
                  </button>
                </form>
                <p className="ms-5">
                  Don't have an account?
                  <a href="#!" class="link-info">
                    <span> Register here</span>
                  </a>
                </p>
              </Tab>

              {/* <Tab eventKey="CreateAccount" title="CreateAccount">
                <form>
                  <div className="row">
                    <h3
                      className="fw-bold mb-3 pb-3 text-center font-weight-bold"
                      style={{ marginTop: "15px" }}
                    >
                      Create your account
                    </h3>
                  </div>
                  <div className="row" style={{ marginTop: "20px" }}>
                    <div className="col-md-6 mb-4">
                      <div className="form-outline">
                        <label className="form-label" htmlFor="form3Example1">
                          First Name
                        </label>
                        <input
                          type="text"
                          id="firstname"
                          className="form-control"
                          required
                          placeholder="First Name"
                        />
                      </div>
                    </div>

                    <div className="col-md-6 mb-4">
                      <div className="form-outline">
                        <label className="form-label" htmlFor="form3Example2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="lastname"
                          className="form-control"
                          required
                          placeholder="Last Name"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="form3Example3">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="emailAddress"
                      className="form-control"
                      required
                      placeholder="someone@gmail.com"
                    />
                  </div>

                  <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="form3Example4">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      className="form-control"
                      required
                      placeholder="Password"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-block mb-4 "
                    style={{ marginTop: "20px" }}
                  >
                    Create Account
                  </button>
                </form>
              </Tab> */}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
