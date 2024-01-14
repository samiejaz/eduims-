import { Outlet } from "react-router-dom";
import { Navbar } from "react-bootstrap";
import Logo from "../images/logo.png";
import User from "../images/profilelogo.png";
import Sidebar from "../components/Forms/Sidebar/Sidebar";
import { Avatar } from "primereact/avatar";
import CSidebar from "./Sidebar/CSidebar";
import { useRef } from "react";

function RootLayout() {
  const sidebarRef = useRef();

  return (
    <>
      <div>
        <CSidebar sideBarRef={sidebarRef}></CSidebar>
        {/* <Sidebar logoImage={<LogoImage />} userImage={<UserImage />} />{" "} */}
        <section className="c-home-section">
          <div className="c-home-content">
            <div className="mt-4">
              <i
                className="pi pi-bars"
                onClick={() => {
                  if (sidebarRef.current.className.includes("c-close")) {
                    sidebarRef.current.className = "c-sidebar";
                    localStorage.setItem("isSidebarOpen", true);
                  } else {
                    sidebarRef.current.className = "c-sidebar c-close";
                    localStorage.removeItem("isSidebarOpen");
                  }
                }}
              ></i>
            </div>
          </div>
          <div className="px-3">
            <Outlet />
          </div>
        </section>
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
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      {user ? (
        <>
          {/* <Avatar
            image={"data:image/png;base64," + user.image}
            size="large"
            shape="circle"
          /> */}
          {/* <img  
            alt="User Profile"
            src={"data:image/png;base64," + user.image}
            width="40"
            height="40"
            className="d-inline-block align-top rounded-5"
          /> */}
        </>
      ) : (
        <>
          <img
            alt="User Profile"
            src={User}
            width="40"
            height="40"
            className="d-inline-block align-top rounded-5"
          />
        </>
      )}
    </>
  );
}

export default RootLayout;
