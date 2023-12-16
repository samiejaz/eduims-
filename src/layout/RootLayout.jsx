import { Outlet } from "react-router-dom";
import { Navbar } from "react-bootstrap";
import Logo from "../images/logo.png";
import User from "../images/profilelogo.png";
import Sidebar from "../components/Forms/Sidebar/Sidebar";

function RootLayout() {
  return (
    <>
      <div style={{ padding: "1rem" }}>
        <Sidebar logoImage={<LogoImage />} userImage={<UserImage />} />
        {/* <BasicDemo /> */}
        <div>
          <Outlet />
        </div>
      </div>
    </>
  );
}

function LogoImage() {
  return (
    <>
      <Navbar.Brand>
        <img
          alt="EDU IMS Logo"
          src={Logo}
          width="130"
          height="30"
          className="d-inline-block align-top"
        />
      </Navbar.Brand>
    </>
  );
}

function UserImage() {
  return (
    <>
      <img
        alt="User Profile"
        src={User}
        width="40"
        height="40"
        className="d-inline-block align-top rounded-5"
      />
    </>
  );
}

export default RootLayout;
