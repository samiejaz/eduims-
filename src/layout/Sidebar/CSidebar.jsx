import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./sidebar.css";
import { ROUTE_URLS } from "../../utils/enums";

const CSidebar = ({ sideBarRef }) => {
  // const navLinks = [
  //   {
  //     icon: "pi pi-home",
  //     text: "Dashboard",
  //     link: "/dashboard",
  //     subLinks: ["Category"],
  //   },
  //   {
  //     icon: "pi pi-th-large",
  //     text: "Category",
  //     link: "/category",
  //     subLinks: ["/category", "/html-css", "/javascript", "/php-mysql"],
  //   },
  //   {
  //     icon: "pi pi-book",
  //     text: "Posts",
  //     link: "/posts",
  //     subLinks: ["/posts", "/web-design", "/login-form", "/card-design"],
  //   },
  //   {
  //     icon: "pi pi-chart-line",
  //     text: "Analytics",
  //     link: "/analytics",
  //     subLinks: ["/analytics"],
  //   },
  //   {
  //     icon: "pi pi-chart-bar",
  //     text: "Chart",
  //     link: "/chart",
  //     subLinks: ["/chart"],
  //   },
  //   {
  //     icon: "pi pi-plug",
  //     text: "Plugins",
  //     link: "/plugins",
  //     subLinks: ["/plugins", "/ui-face", "/pigments", "/box-icons"],
  //   },
  //   {
  //     icon: "pi pi-compass",
  //     text: "Explore",
  //     link: "/explore",
  //     subLinks: ["/explore"],
  //   },
  //   {
  //     icon: "pi pi-clock",
  //     text: "History",
  //     link: "/history",
  //     subLinks: ["/history"],
  //   },
  //   {
  //     icon: "pi pi-cog",
  //     text: "Setting",
  //     link: "/setting",
  //     subLinks: ["/setting"],
  //   },
  // ];

  useEffect(() => {
    async function configurationSetup() {
      let isSidebarOpen = localStorage.getItem("isSidebarOpen");
      if (isSidebarOpen) {
        sideBarRef.current.className = "c-sidebar";
      }
    }
    configurationSetup();

    return () => {
      localStorage.removeItem("isSidebarOpen");
    };
  }, []);

  function toggleSubmenu(e) {
    let parent = e.target.parentNode.parentNode;
    // if (parent.className.includes("c-showMenu")) {
    //   parent.className = "";
    // } else {
    //   parent.className = "c-showMenu";
    // }
    parent.classList.toggle("c-showMenu");
  }

  return (
    <>
      <div ref={sideBarRef} className={`c-sidebar c-close`}>
        <div className="c-logo-details">
          <span className="c-logo_name" style={{ marginLeft: "30px" }}>
            EDUIMS
          </span>
        </div>
        <ul className="c-nav-links">
          <li>
            <Link to={ROUTE_URLS.DASHBOARD}>
              <i className="pi pi-home"></i>
              <span className="c-link_name">Dashboard</span>
            </Link>
            <ul className="c-sub-menu c-blank">
              <li>
                <Link className="c-link_name" to={ROUTE_URLS.DASHBOARD}>
                  Dashboard
                </Link>
              </li>
            </ul>
          </li>
          {/* General */}
          <li className="">
            <div className="c-iocn-link">
              <a href="#">
                <i className="pi pi-cog"></i>
                <span className="c-link_name">General</span>
              </a>
              <i
                className="pi pi-chevron-down c-arrow"
                onClick={toggleSubmenu}
              ></i>
            </div>
            <ul className="c-sub-menu">
              <li>
                <a className="c-link_name" href="#">
                  General
                </a>
              </li>
              <li>
                <Link to={ROUTE_URLS.COUNTRY_ROUTE}>Country</Link>
              </li>
              <li>
                <Link to={ROUTE_URLS.TEHSIL_ROUTE}>Tehsil</Link>
              </li>
              <hr style={{ color: "white", padding: "0", margin: "0" }} />
              <li>
                <Link to={ROUTE_URLS.GENERAL.BUSINESS_UNITS}>Company Info</Link>
              </li>
              <li>
                <Link to={ROUTE_URLS.GENERAL.BUSINESS_UNITS}>
                  Business Unit
                </Link>
              </li>
              <li>
                <Link to={ROUTE_URLS.BUSINESS_NATURE_ROUTE}>
                  Business Nature
                </Link>
              </li>
              <li>
                <Link to={ROUTE_URLS.BUSINESS_NATURE_ROUTE}>Business Type</Link>
              </li>
              <li>
                <Link to={ROUTE_URLS.BUSINESS_NATURE_ROUTE}>
                  Business Segments
                </Link>
              </li>
              <hr style={{ color: "white", padding: "0", margin: "0" }} />
              <li>
                <Link to={ROUTE_URLS.LEED_SOURCE_ROUTE}>Leads Source</Link>
              </li>
              <li>
                <Link to={ROUTE_URLS.LEAD_INTRODUCTION_ROUTE}>
                  Leads Introduction
                </Link>
              </li>
              <hr style={{ color: "white", padding: "0", margin: "0" }} />
              <li>
                <Link to={ROUTE_URLS.USER_ROUTE}>Users</Link>
              </li>
              <li>
                <Link to={ROUTE_URLS.DEPARTMENT}>Department</Link>
              </li>
            </ul>
          </li>

          {/* Customers */}
          <li className="">
            <div className="c-iocn-link">
              <a href="#">
                <i className="pi pi-users"></i>
                <span className="c-link_name">Customers</span>
              </a>
              <i
                className="pi pi-chevron-down c-arrow"
                onClick={toggleSubmenu}
              ></i>
            </div>
            <ul className="c-sub-menu">
              <li>
                <a className="c-link_name" href="#">
                  Customers
                </a>
              </li>
              <li>
                <Link to={ROUTE_URLS.CUSTOMERS.CUSTOMER_ENTRY}>
                  Customer Entry
                </Link>
              </li>
              <li>
                <Link to={ROUTE_URLS.CUSTOMERS.OLD_CUSTOMER_ENTRY}>
                  Old Customer Entry
                </Link>
              </li>
              <hr style={{ color: "white", padding: "0", margin: "0" }} />
              <li>
                <Link to={ROUTE_URLS.CUSTOMERS.CUSTOMER_INVOICE}>
                  Customer Invoice
                </Link>
              </li>
              <li>
                <Link to={ROUTE_URLS.CUSTOMERS.RECIEPT_VOUCHER_ROUTE}>
                  Receipt Voucher
                </Link>
              </li>
            </ul>
          </li>

          <li>
            <div className="c-profile-details">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div className="c-profile_name" style={{ marginLeft: "5px" }}>
                    Muhammad Huzaifa Sajid
                  </div>
                  <div className="c-job" style={{ marginLeft: "5px" }}>
                    Development
                  </div>
                </div>
                <i className="pi pi-sign-out"></i>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </>
  );
};

export default CSidebar;

function submenuItem() {
  function toggleSubmenu(e) {
    let parent = e.target.parentNode.parentNode;
    parent.classList.toggle("c-showMenu");
  }

  return (
    <>
      <li className="">
        <div className="c-iocn-link">
          <a href="#">
            <i className="pi pi-check"></i>
            <span className="c-link_name">Customers</span>
          </a>
          <i className="pi pi-chevron-down c-arrow" onClick={toggleSubmenu}></i>
        </div>
        <ul className="c-sub-menu">
          <li>
            <a className="c-link_name" href="#">
              Customers
            </a>
          </li>
          <li>
            <Link to={ROUTE_URLS.BUSINESS_NATURE_ROUTE}>Business Nature</Link>
          </li>
          <li>
            <Link to={ROUTE_URLS.BUSINESS_NATURE_ROUTE}>Business Nature</Link>
          </li>
          <li>
            <Link to={ROUTE_URLS.BUSINESS_NATURE_ROUTE}>Business Nature</Link>
          </li>
        </ul>
      </li>
    </>
  );
}
