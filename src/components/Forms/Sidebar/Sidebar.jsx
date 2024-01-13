import {
  Container,
  Nav,
  Navbar,
  NavDropdown,
  Dropdown,
  SplitButton,
  Button,
  Form,
  Modal,
} from "react-bootstrap";

import "./sidebar.css";

import { LinkContainer } from "react-router-bootstrap";
import { useEffect, useState } from "react";

import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import axios from "axios";
import { AppConfigurationContext } from "../../../context/AppConfigurationContext";
import useUserProfile from "../../../hooks/useUserProfile";
import { ROUTE_URLS } from "../../../utils/enums";
import signalRConnectionManager from "../../../services/SignalRService";

const apiUrl = import.meta.env.VITE_APP_API_URL;

function Sidebar({ logoImage, userImage }) {
  const connection = signalRConnectionManager.getConnection();

  useEffect(() => {
    connection.on("ReceiveNotification", (message) => {
      toast.success(message);
    });

    return () => {
      connection.off("ReceiveNotification");
    };
  }, [connection]);

  const { logoutUser, user } = useContext(AuthContext);
  const { pageTitles } = useContext(AppConfigurationContext);
  const {
    handleCloseProfile,
    handleShowProfile,
    render: UserProfileModal,
  } = useUserProfile();

  const [showToast, setShowToast] = useState(false);
  const [changepass, setChangepass] = useState(false);
  const closechangepass = () => {
    setValue("newPassword", "");
    setValue("oldPassword", "");
    setValue("repeatNewPassword", "");
    setChangepass(false);
  };
  const showchangepass = () => setChangepass(true);

  useEffect(() => {
    if (showToast) {
      toast.error("Invalid Old Password", {
        autoClose: 2000,
      });
      setShowToast(false);
    }
  }, [showToast]);

  const { register, handleSubmit, setValue } = useForm();
  const changePasswordMutation = useMutation({
    mutationFn: async (formData) => {
      if (formData.repeatNewPassword !== formData.newPassword) {
        toast.error("New passwords must be same!", {
          autoClose: 1000,
        });
      } else {
        const { data } = await axios.post(apiUrl + "/EduIMS/ChangePassword", {
          LoginUserID: user.userID,
          OldPassword: formData.oldPassword,
          NewPassword: formData.newPassword,
        });

        if (data.success === false) {
          setShowToast(true);
        } else {
          closechangepass();
          toast.success("Password changed sucessfully!", {
            autoClose: 2000,
          });
        }
      }
    },
  });

  function handleChangePasswordSubmit(data) {
    changePasswordMutation.mutate(data);
  }

  const Personname = user.username;
  return (
    <div>
      <Navbar>
        <Container>
          <LinkContainer to={"/"}>{logoImage}</LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto z-3 " style={{ marginLeft: "30px" }}>
              <LinkContainer to={"/"}>
                <Nav.Link className="scale-up-center">Dashboard</Nav.Link>
              </LinkContainer>

              <NavDropdown
                id="basic-nav-dropdown"
                title="Customers"
                className="scale-up-center"
              >
                <LinkContainer to={"/customers/customerEntry"}>
                  <NavDropdown.Item className="scale-up-center">
                    Customer Entry
                  </NavDropdown.Item>
                </LinkContainer>

                <LinkContainer to={"/customers/oldCustomerEntry"}>
                  <NavDropdown.Item className="scale-up-center">
                    Old Customer Entry
                  </NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Divider />
                <LinkContainer to={"/general/country"}>
                  <NavDropdown.Item className="scale-up-center">
                    Country
                  </NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to={"/general/tehsil"}>
                  <NavDropdown.Item className="scale-up-center">
                    Tehsil
                  </NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Divider />
                <LinkContainer to={"/general/businessnature"}>
                  <NavDropdown.Item className="scale-up-center">
                    Business Nature
                  </NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to={"/general/businesssegment"}>
                  <NavDropdown.Item className="scale-up-center">
                    Business Segment
                  </NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to={ROUTE_URLS.BUSINESS_TYPE}>
                  <NavDropdown.Item className="scale-up-center">
                    Business Type
                  </NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Divider />
                <LinkContainer to={ROUTE_URLS.LEED_SOURCE_ROUTE}>
                  <NavDropdown.Item className="scale-up-center">
                    Leed Source
                  </NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to={ROUTE_URLS.LEAD_INTRODUCTION_ROUTE}>
                  <NavDropdown.Item className="scale-up-center">
                    Leed Introduction
                  </NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>

              <NavDropdown
                id="basic-nav-dropdown"
                title="Users"
                className="scale-up-center"
              >
                <LinkContainer to={"/users/usersentry"}>
                  <NavDropdown.Item className="scale-up-center">
                    Users Entry
                  </NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to={ROUTE_URLS.USER_ROUTE}>
                  <NavDropdown.Item className="scale-up-center">
                    Users
                  </NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to={ROUTE_URLS.DEPARTMENT}>
                  <NavDropdown.Item className="scale-up-center">
                    Department
                  </NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
              <NavDropdown
                id="basic-nav-dropdown"
                title="General"
                className="scale-up-center"
              >
                <LinkContainer to={"/general/appConfiguration"}>
                  <NavDropdown.Item className="scale-up-center">
                    App Configuration
                  </NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to={"/general/companyInfo"}>
                  <NavDropdown.Item className="scale-up-center">
                    Company Info
                  </NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to={"/customers/businessUnits"}>
                  <NavDropdown.Item className="scale-up-center">
                    Business Units
                  </NavDropdown.Item>
                </LinkContainer>

                <LinkContainer to="/customers/sessionInfo">
                  <NavDropdown.Item className="scale-up-center">
                    Session Info
                  </NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/customers/bankAccountOpening">
                  <NavDropdown.Item className="scale-up-center">
                    Bank Account Opening
                  </NavDropdown.Item>
                </LinkContainer>

                <NavDropdown.Divider />

                <LinkContainer to="/general/productCategories">
                  <NavDropdown.Item className="scale-up-center">
                    {pageTitles?.product || "Product"} Categories
                  </NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/general/productInfo">
                  <NavDropdown.Item className="scale-up-center">
                    {pageTitles?.product || "Product"} Info
                  </NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/general/invoiceDescriptions">
                  <NavDropdown.Item className="scale-up-center">
                    Invoice Descriptions
                  </NavDropdown.Item>
                </LinkContainer>

                <NavDropdown.Divider />

                <LinkContainer to="/customers/receiptVoucher">
                  <NavDropdown.Item className="scale-up-center">
                    Receipt Voucher
                  </NavDropdown.Item>
                </LinkContainer>

                <NavDropdown.Divider />

                <LinkContainer to="/customers/customerInvoice">
                  <NavDropdown.Item className="scale-up-center">
                    Customer Invoice
                  </NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>

          <Navbar.Collapse className="justify-content-end">
            <span style={{ margin: "8px" }}>Logged In As:</span>
            <SplitButton
              type="button"
              title={Personname}
              style={{ marginRight: "20px", marginLeft: "20px" }}
            >
              <Dropdown.Item onClick={handleShowProfile}>Profile</Dropdown.Item>

              <Dropdown.Item onClick={showchangepass}>
                Change Password
              </Dropdown.Item>
              <Dropdown.Item onClick={() => logoutUser()} active>
                Sign Out
              </Dropdown.Item>
            </SplitButton>
            {userImage}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Modal for Profile */}
      {UserProfileModal}
      {/* Modal for Change Password */}

      <Modal show={changepass} onHide={closechangepass}>
        <Form onSubmit={handleSubmit(handleChangePasswordSubmit)}>
          <Modal.Header closeButton>
            <Modal.Title>Change Password</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3" controlId="oldPassword">
              <Form.Label>Old Password</Form.Label>
              <Form.Control
                type="password"
                autoFocus
                required
                placeholder="Enter old password"
                {...register("oldPassword")}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="newPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                autoFocus
                required
                placeholder="Enter new password"
                {...register("newPassword")}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="repeatNewPassword">
              <Form.Label>Repeat New Password</Form.Label>
              <Form.Control
                type="password"
                autoFocus
                required
                placeholder="Repeat new password"
                {...register("repeatNewPassword")}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closechangepass}>
              Close
            </Button>
            <Button variant="warning" type="submit">
              Change Password
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default Sidebar;
