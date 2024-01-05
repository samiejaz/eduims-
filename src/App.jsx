import { Route, Routes, useNavigate } from "react-router-dom";
import ProtectedRoutes from "./components/ProtectedRoutes";
import { useEventListener } from "primereact/hooks";
import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import SignUp from "./pages/MDBLOGIN4";
import Dashboard from "./pages/Dashboard/Dashboard";
import GenNewCustomerView from "./pages/CustomerEntry/CustomerEntryView";
import {
  AppConfiguration,
  BankAccountOpening,
  BusinessUnits,
  SessionInfo,
  GenUsers,
  GenOldCustomers,
  ProductCategory,
  ProductInfo,
  ServiceCategory,
  ServiceInfo,
  CustomerBranch,
  CustomerInvoice,
  InvoiceDefaultDescriptions,
  CompanyInfo,
  GenCustomerEntry,
} from "./pages";
import { CustomerInvoiceFormMaster } from "./pages/CustomerInvoice/CustomerInvoice";
import { useContext } from "react";
import { AppConfigurationContext } from "./context/AppConfigurationContext";
import { BusinessUnitsForm } from "./pages/BusinessUnits/BusinessUnits";
import {
  KBarProvider,
  KBarPortal,
  KBarPositioner,
  KBarAnimator,
  KBarSearch,
} from "kbar";
import { ReceiptEntryForm } from "./pages/RecieptEntry/RecieptEntry";

const App = () => {
  const { pageTitles } = useContext(AppConfigurationContext);
  const [pressed, setPressed] = useState(false);
  const [value, setValue] = useState("");
  const navigate = useNavigate();
  const actions = [
    {
      id: "businessUnit",
      name: "Business Units",
      shortcut: ["b"],
      keywords: "businessunits",
      perform: () => navigate("/customers/businessUnits"),
    },
    {
      id: "CustomerInvoice",
      name: "Customer Invoice",
      shortcut: ["i"],
      keywords: "customerinvoice",
      perform: () => navigate("/customers/customerInvoice", {}),
    },
    {
      id: "receiptvoucher",
      name: "Receipt Voucher",
      shortcut: ["r"],
      keywords: "receiptvoucher",
      perform: () => navigate("/customers/receiptVoucher/new", {}),
    },
  ];
  // const onKeyDown = (e) => {
  //   setPressed(true);

  //   if (e.code === "Space") {
  //     setValue("space");

  //     return;
  //   }

  //   setValue(e.key);
  // };

  // const [bindKeyDown, unbindKeyDown] = useEventListener({
  //   type: "keydown",
  //   listener: (e) => {
  //     onKeyDown(e);
  //   },
  // });

  // const [bindKeyUp, unbindKeyUp] = useEventListener({
  //   type: "keyup",
  //   listener: (e) => {
  //     setPressed(false);
  //   },
  // });

  // useEffect(() => {
  //   bindKeyDown();
  //   bindKeyUp();

  //   return () => {
  //     unbindKeyDown();
  //     unbindKeyUp();
  //   };
  // }, [bindKeyDown, bindKeyUp, unbindKeyDown, unbindKeyUp]);

  return (
    <>
      <KBarProvider actions={actions}>
        <KBarPortal>
          <KBarPositioner>
            <KBarAnimator>
              <KBarSearch />
            </KBarAnimator>
          </KBarPositioner>
        </KBarPortal>
        <Routes>
          <Route path="auth" element={<SignUp />} />
          <Route path="/" element={<ProtectedRoutes />}>
            <Route index element={<Dashboard />} />
            <Route
              path="/customers/oldCustomerEntry"
              element={<GenOldCustomers />}
            />
            <Route
              path="/customers/customerEntry"
              element={<GenCustomerEntry />}
            />
            <Route
              path="/customers/customerEntry/:CustomerID"
              element={<GenNewCustomerView />}
            />
            <Route path="/users/usersentry" element={<GenUsers />} />

            <Route path="/customers/sessionInfo" element={<SessionInfo />} />
            <Route
              path="/customers/customerBranch"
              element={<CustomerBranch />}
            />
            <Route
              path="/customers/bankAccountOpening"
              element={<BankAccountOpening />}
            />
            <Route
              path="/customers/customerInvoice"
              element={<CustomerInvoice />}
            />
            <Route
              path="/customers/businessUnits"
              element={<BusinessUnits />}
            />
            <Route
              path="/customers/businessUnits/:BusinessUnitID"
              element={
                <BusinessUnitsForm pageTitles={pageTitles} mode={"view"} />
              }
            />
            <Route
              path="/customers/businessUnits/edit/:BusinessUnitID"
              element={
                <BusinessUnitsForm pageTitles={pageTitles} mode={"edit"} />
              }
            />
            <Route
              path="/customers/businessUnits/new"
              element={
                <BusinessUnitsForm pageTitles={pageTitles} mode={"new"} />
              }
            />
            {/* Receipt Routes */}
            <Route
              path="/customers/receiptVoucher"
              element={<BusinessUnits />}
            />
            <Route
              path="/customers/receiptVoucher/:ReceiptVoucherID"
              element={
                <ReceiptEntryForm pageTitles={pageTitles} mode={"view"} />
              }
            />
            <Route
              path="/customers/receiptVoucher/edit/:ReceiptVoucherID"
              element={
                <ReceiptEntryForm pageTitles={pageTitles} mode={"edit"} />
              }
            />
            <Route
              path="/customers/receiptVoucher/new"
              element={
                <ReceiptEntryForm pageTitles={pageTitles} mode={"new"} />
              }
            />
            <Route
              path="/customers/customerInvoice/:CustomerInvoiceID"
              element={
                <CustomerInvoiceFormMaster
                  pageTitles={pageTitles}
                  mode={"view"}
                />
              }
            />
            <Route
              path="/customers/customerInvoice/edit/:CustomerInvoiceID"
              element={
                <CustomerInvoiceFormMaster
                  pageTitles={pageTitles}
                  mode={"edit"}
                />
              }
            />
            <Route
              path="/customers/customerInvoice/new"
              element={
                <CustomerInvoiceFormMaster
                  pageTitles={pageTitles}
                  mode={"new"}
                />
              }
            />
            <Route
              path="/general/productCategories"
              element={<ProductCategory />}
            />
            <Route
              path="/general/invoiceDescriptions"
              element={<InvoiceDefaultDescriptions />}
            />
            <Route path="/general/productInfo" element={<ProductInfo />} />
            <Route
              path="/general/serviceCategories"
              element={<ServiceCategory />}
            />
            <Route path="/general/servicesInfo" element={<ServiceInfo />} />
            <Route path="/general/companyInfo" element={<CompanyInfo />} />
            <Route
              path="/general/appConfiguration"
              element={<AppConfiguration />}
            />

            {/* <Route path="/users/departmententry" element={<Department />} /> */}
            {/* <Route path="/customers/segmentsEntry" element={<Segments />} />
          <Route
            path="/customers/businessNature"
            element={<BusinessNature />}
          />
          <Route path="/customers/businessType" element={<BusinessType />} />
          <Route path="/customers/provinceEntry" element={<Province />} />
          <Route path="/customers/cityEntry" element={<City />} />
          <Route path="/customers/countryEntry" element={<Country />} />
  <Route path="/customers/softwareEntry" element={<Softwares />} /> */}
          </Route>
        </Routes>
        <ToastContainer
          position="top-center"
          pauseOnHover={false}
          autoClose={1000}
          theme="light"
          closeOnClick
        />
      </KBarProvider>
    </>
  );
};

export default App;
