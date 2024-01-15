import { Route, Routes, useNavigate } from "react-router-dom";
import ProtectedRoutes from "./components/ProtectedRoutes";
import { useEffect } from "react";
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
  ReceiptVoucher,
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
import DP, { DPForm } from "./pages/dp/DP";
import { CountryDetail, CountryForm } from "./pages/Country/Country";
import { useUserData } from "./context/AuthContext";
import { TehsilDetail, TehsilForm } from "./pages/Tehsil/Tehsil";
import {
  BusinessNatureDetail,
  BusinessNatureForm,
} from "./pages/BusinessNature/BusinessNature";
import {
  BusinessSegmentDetail,
  BusinessSegmentForm,
} from "./pages/BusinessSegment/BusinessSegment";
import { ROUTE_URLS } from "./utils/enums";
import {
  BusinessTypeDetail,
  BusinessTypeForm,
} from "./pages/BusinessType/BusinessType";
import {
  DepartmentDetail,
  DepartmentForm,
} from "./pages/Departments/Department";
import {
  LeadSourceDetail,
  LeadSourceForm,
} from "./pages/LeadSource/LeadSource";
import {
  LeadIntroductionDetail,
  LeadIntroductionForm,
} from "./pages/LeadsIntroduction/LeadsIntroduction";
// import ChatRoom from "./test/Chat";
import { UserDetail, UserForm } from "./pages/GenUsers/Users";
import signalRConnectionManager from "./services/SignalRService";
import FileViewer from "./pages/FileViewer";

const App = () => {
  const { pageTitles } = useContext(AppConfigurationContext);

  const navigate = useNavigate();
  const user = useUserData();
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
      perform: () => navigate("/customers/receiptVoucher", {}),
    },
    {
      id: "dp",
      name: "Receipt Voucher",
      shortcut: ["d"],
      keywords: "dp",
      perform: () => navigate("/customers/dp", {}),
    },
  ];

  useEffect(() => {
    signalRConnectionManager.startConnection();

    return () => {
      //signalRConnectionManager.stopConnection();
    };
  }, []);

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
              path={ROUTE_URLS.CUSTOMERS.OLD_CUSTOMER_ENTRY}
              element={<GenOldCustomers />}
            />
            <Route
              path={ROUTE_URLS.CUSTOMERS.CUSTOMER_ENTRY}
              element={<GenCustomerEntry />}
            />
            <Route
              path={`${ROUTE_URLS.CUSTOMERS.CUSTOMER_ENTRY}/:CustomerID`}
              element={<GenNewCustomerView />}
            />
            {/* <Route path={`${ROUTE_URLS.USER_ROUTE}`} element={<GenUsers />} /> */}

            <Route
              path={`${ROUTE_URLS.GENERAL.SESSION_INFO}`}
              element={<SessionInfo />}
            />
            {/* <Route
              path="/customers/customerBranch"
              element={<CustomerBranch />}
            /> */}
            <Route
              path={`${ROUTE_URLS.ACCOUNTS.BANK_ACCOUNT_OPENING}`}
              element={<BankAccountOpening />}
            />
            <Route
              path={`${ROUTE_URLS.ACCOUNTS.CUSTOMER_INVOICE}`}
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
              path={`${ROUTE_URLS.ACCOUNTS.RECIEPT_VOUCHER_ROUTE}`}
              element={<ReceiptVoucher />}
            />
            <Route
              path={`${ROUTE_URLS.ACCOUNTS.RECIEPT_VOUCHER_ROUTE}/:ReceiptVoucherID`}
              element={
                <ReceiptEntryForm pageTitles={pageTitles} mode={"view"} />
              }
            />
            <Route
              path={`${ROUTE_URLS.ACCOUNTS.RECIEPT_VOUCHER_ROUTE}/edit/:ReceiptVoucherID`}
              element={
                <ReceiptEntryForm pageTitles={pageTitles} mode={"edit"} />
              }
            />
            <Route
              path={`${ROUTE_URLS.ACCOUNTS.RECIEPT_VOUCHER_ROUTE}/new`}
              element={
                <ReceiptEntryForm pageTitles={pageTitles} mode={"new"} />
              }
            />
            {/* DP */}
            <Route path="/customers/dp" element={<DP />} />
            <Route
              path="/customers/dp/:ReceiptVoucherID"
              element={<DPForm pageTitles={pageTitles} mode={"view"} />}
            />
            <Route
              path="/customers/dp/edit/:ReceiptVoucherID"
              element={<DPForm pageTitles={pageTitles} mode={"edit"} />}
            />
            <Route
              path="/customers/dp/new"
              element={<DPForm pageTitles={pageTitles} mode={"new"} />}
            />
            <Route
              path={`${ROUTE_URLS.ACCOUNTS.CUSTOMER_INVOICE}/:CustomerInvoiceID`}
              element={
                <CustomerInvoiceFormMaster
                  pageTitles={pageTitles}
                  mode={"view"}
                />
              }
            />
            <Route
              path={`${ROUTE_URLS.ACCOUNTS.CUSTOMER_INVOICE}/edit/:CustomerInvoiceID`}
              element={
                <CustomerInvoiceFormMaster
                  pageTitles={pageTitles}
                  mode={"edit"}
                />
              }
            />
            <Route
              path={`${ROUTE_URLS.ACCOUNTS.CUSTOMER_INVOICE}/new`}
              element={
                <CustomerInvoiceFormMaster
                  pageTitles={pageTitles}
                  mode={"new"}
                />
              }
            />
            <Route
              path={`${ROUTE_URLS.GENERAL.PRODUCT_CATEGORY_ROUTE}`}
              element={<ProductCategory />}
            />
            <Route
              path={`${ROUTE_URLS.UTILITIES.INVOICE_DESCRIPTIONS}`}
              element={<InvoiceDefaultDescriptions />}
            />
            <Route
              path={`${ROUTE_URLS.GENERAL.PRODUCT_INFO_ROUTE}`}
              element={<ProductInfo />}
            />
            {/* <Route
              path="/general/serviceCategories"
              element={<ServiceCategory />}
            />
            <Route path="/general/servicesInfo" element={<ServiceInfo />} /> */}
            <Route
              path={`${ROUTE_URLS.GENERAL.COMPANY_INFO_ROUTE}`}
              element={<CompanyInfo />}
            />
            <Route
              path={`${ROUTE_URLS.UTILITIES.APP_CONFIGURATION_ROUTE}`}
              element={<AppConfiguration />}
            />

            {/* Country */}
            <Route
              path={`${ROUTE_URLS.COUNTRY_ROUTE}`}
              element={<CountryDetail />}
            />
            <Route
              path={`${ROUTE_URLS.COUNTRY_ROUTE}/:CountryID`}
              element={
                <CountryForm
                  pageTitles={pageTitles}
                  mode={"view"}
                  user={user}
                />
              }
            />
            <Route
              path={`${ROUTE_URLS.COUNTRY_ROUTE}/edit/:CountryID`}
              element={
                <CountryForm
                  pageTitles={pageTitles}
                  mode={"edit"}
                  user={user}
                />
              }
            />
            <Route
              path={`${ROUTE_URLS.COUNTRY_ROUTE}/new`}
              element={
                <CountryForm pageTitles={pageTitles} mode={"new"} user={user} />
              }
            />
            {/* Country END */}
            {/* Tehsil */}
            <Route
              path={`${ROUTE_URLS.TEHSIL_ROUTE}`}
              element={<TehsilDetail />}
            />
            <Route
              path={`${ROUTE_URLS.TEHSIL_ROUTE}/:TehsilID`}
              element={
                <TehsilForm pageTitles={pageTitles} mode={"view"} user={user} />
              }
            />
            <Route
              path={`${ROUTE_URLS.TEHSIL_ROUTE}/edit/:TehsilID`}
              element={
                <TehsilForm pageTitles={pageTitles} mode={"edit"} user={user} />
              }
            />
            <Route
              path={`${ROUTE_URLS.TEHSIL_ROUTE}/new`}
              element={
                <TehsilForm pageTitles={pageTitles} mode={"new"} user={user} />
              }
            />
            {/* Tehsil END */}
            {/* Business Nature */}
            <Route
              path={`${ROUTE_URLS.BUSINESS_NATURE_ROUTE}`}
              element={<BusinessNatureDetail />}
            />
            <Route
              path={`${ROUTE_URLS.BUSINESS_NATURE_ROUTE}/:BusinessNatureID`}
              element={
                <BusinessNatureForm
                  pageTitles={pageTitles}
                  mode={"view"}
                  user={user}
                />
              }
            />
            <Route
              path={`${ROUTE_URLS.BUSINESS_NATURE_ROUTE}/edit/:BusinessNatureID`}
              element={
                <BusinessNatureForm
                  pageTitles={pageTitles}
                  mode={"edit"}
                  user={user}
                />
              }
            />
            <Route
              path={`${ROUTE_URLS.BUSINESS_NATURE_ROUTE}/new`}
              element={
                <BusinessNatureForm
                  pageTitles={pageTitles}
                  mode={"new"}
                  user={user}
                />
              }
            />
            {/* Business Nature END */}
            {/* Business Nature */}
            <Route
              path={`${ROUTE_URLS.BUSINESS_SEGMENT_ROUTE}`}
              element={<BusinessSegmentDetail />}
            />
            <Route
              path={`${ROUTE_URLS.BUSINESS_SEGMENT_ROUTE}/:BusinessSegmentID`}
              element={
                <BusinessSegmentForm
                  pageTitles={pageTitles}
                  mode={"view"}
                  user={user}
                />
              }
            />
            <Route
              path={`${ROUTE_URLS.BUSINESS_SEGMENT_ROUTE}/edit/:BusinessSegmentID`}
              element={
                <BusinessSegmentForm
                  pageTitles={pageTitles}
                  mode={"edit"}
                  user={user}
                />
              }
            />
            <Route
              path={`${ROUTE_URLS.BUSINESS_SEGMENT_ROUTE}/new`}
              element={
                <BusinessSegmentForm
                  pageTitles={pageTitles}
                  mode={"new"}
                  user={user}
                />
              }
            />
            {/* Business Nature END */}
            {/* Business Type */}
            <Route
              path={ROUTE_URLS.BUSINESS_TYPE}
              element={<BusinessTypeDetail />}
            />
            <Route
              path={`${ROUTE_URLS.BUSINESS_TYPE}/:BusinessTypeID`}
              element={
                <BusinessTypeForm
                  pageTitles={pageTitles}
                  mode={"view"}
                  user={user}
                />
              }
            />
            <Route
              path={`${ROUTE_URLS.BUSINESS_TYPE}/edit/:BusinessTypeID`}
              element={
                <BusinessTypeForm
                  pageTitles={pageTitles}
                  mode={"edit"}
                  user={user}
                />
              }
            />
            <Route
              path={`${ROUTE_URLS.BUSINESS_TYPE}/new`}
              element={
                <BusinessTypeForm
                  pageTitles={pageTitles}
                  mode={"new"}
                  user={user}
                />
              }
            />
            {/* Business Type END */}
            {/* Department */}
            <Route
              path={ROUTE_URLS.DEPARTMENT}
              element={<DepartmentDetail />}
            />
            <Route
              path={`${ROUTE_URLS.DEPARTMENT}/:DepartmentID`}
              element={
                <DepartmentForm
                  pageTitles={pageTitles}
                  mode={"view"}
                  user={user}
                />
              }
            />
            <Route
              path={`${ROUTE_URLS.DEPARTMENT}/edit/:DepartmentID`}
              element={
                <DepartmentForm
                  pageTitles={pageTitles}
                  mode={"edit"}
                  user={user}
                />
              }
            />
            <Route
              path={`${ROUTE_URLS.DEPARTMENT}/new`}
              element={
                <DepartmentForm
                  pageTitles={pageTitles}
                  mode={"new"}
                  user={user}
                />
              }
            />
            {/* Department END */}
            {/* Department */}
            <Route
              path={ROUTE_URLS.LEED_SOURCE_ROUTE}
              element={<LeadSourceDetail />}
            />
            <Route
              path={`${ROUTE_URLS.LEED_SOURCE_ROUTE}/:LeadSourceID`}
              element={
                <LeadSourceForm
                  pageTitles={pageTitles}
                  mode={"view"}
                  user={user}
                />
              }
            />
            <Route
              path={`${ROUTE_URLS.LEED_SOURCE_ROUTE}/edit/:LeadSourceID`}
              element={
                <LeadSourceForm
                  pageTitles={pageTitles}
                  mode={"edit"}
                  user={user}
                />
              }
            />
            <Route
              path={`${ROUTE_URLS.LEED_SOURCE_ROUTE}/new`}
              element={
                <LeadSourceForm
                  pageTitles={pageTitles}
                  mode={"new"}
                  user={user}
                />
              }
            />
            {/* Department END */}
            {/* Leads Introduction */}
            <Route
              path={ROUTE_URLS.LEAD_INTRODUCTION_ROUTE}
              element={<LeadIntroductionDetail />}
            />
            <Route
              path={`${ROUTE_URLS.LEAD_INTRODUCTION_ROUTE}/:LeadIntroductionID`}
              element={
                <LeadIntroductionForm
                  pageTitles={pageTitles}
                  mode={"view"}
                  user={user}
                />
              }
            />
            <Route
              path={`${ROUTE_URLS.LEAD_INTRODUCTION_ROUTE}/edit/:LeadIntroductionID`}
              element={
                <LeadIntroductionForm
                  pageTitles={pageTitles}
                  mode={"edit"}
                  user={user}
                />
              }
            />
            <Route
              path={`${ROUTE_URLS.LEAD_INTRODUCTION_ROUTE}/new`}
              element={
                <LeadIntroductionForm
                  pageTitles={pageTitles}
                  mode={"new"}
                  user={user}
                />
              }
            />
            {/* Leads Introduction END */}
            {/* Users */}
            <Route path={ROUTE_URLS.USER_ROUTE} element={<UserDetail />} />
            <Route
              path={`${ROUTE_URLS.USER_ROUTE}/:UserID`}
              element={
                <UserForm pageTitles={pageTitles} mode={"view"} user={user} />
              }
            />
            <Route
              path={`${ROUTE_URLS.USER_ROUTE}/edit/:UserID`}
              element={
                <UserForm pageTitles={pageTitles} mode={"edit"} user={user} />
              }
            />
            <Route
              path={`${ROUTE_URLS.USER_ROUTE}/new`}
              element={
                <UserForm pageTitles={pageTitles} mode={"new"} user={user} />
              }
            />
            {/* User END */}
            {/* <Route path={`/chat`} element={<ChatRoom />} /> */}
            <Route path="/fileviewer" element={<FileViewer />} />
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
