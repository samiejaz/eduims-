import { Route, Routes } from "react-router-dom";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Login from "./pages/Login";
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
import PDFViewer from "./pages/PDFViewer";

const App = () => {
  return (
    <>
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
          <Route path="/customers/businessUnits" element={<BusinessUnits />} />
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
          <Route path="/pdf" element={<PDFViewer />} />

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
    </>
  );
};

export default App;
