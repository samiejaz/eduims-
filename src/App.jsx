import { Route, Routes } from "react-router-dom";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Login from "./pages/Login";
import BusinessUnits from "./pages/BusinessUnits/BusinessUnits";
import GenSessionInfo from "./pages/SessionInfo/GenSessionInfo";
import BankAccountOpening from "./pages/BankAccountOpening/BankAccountOpening";
import GenUsers from "./pages/GenUsers/GenUsers";
import GenOldCustomerEntry from "./pages/GenOldCustomers/GenOldCustomerEntry";
import GenProductCategory from "./pages/ProductCategory/ProductCategory";
import GenServiceCategory from "./pages/ServiceCategory/GenServiceCategory";
import ProductInfo from "./pages/ProductInfo/ProductInfo";
import ServiceInfo from "./pages/ServiceInfo/ServiceInfo";
import CustomerBranch from "./pages/CustomerBranch/CustomerBranch";
import { ToastContainer } from "react-toastify";
import GenCustomerEntry from "./pages/CustomerEntry/CustomerEntry";
import SignUp from "./pages/MDBLOGIN4";
import CompanyInfo from "./pages/CompanyInfo/CompanyInfo";
import CustomerInvoice from "./pages/CustomerInvoice/CustomerInvoice";
import InvoiceDefaultDescriptions from "./pages/InvoiceDefaultDescriptions/InvoiceDefaultDescriptions";
import Dashboard from "./pages/Dashboard/Dashboard";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="auth" element={<SignUp />} />
        <Route path="/" element={<ProtectedRoutes />}>
          <Route index element={<Dashboard />} />
          {/* <Route
            path="/customers/customerEntry"
            element={<Customerinfopage />}
          /> */}
          <Route
            path="/customers/oldCustomerEntry"
            element={<GenOldCustomerEntry />}
          />
          <Route
            path="/customers/customerEntry"
            element={<GenCustomerEntry />}
          />
          <Route path="/users/usersentry" element={<GenUsers />} />
          <Route path="/customers/businessUnits" element={<BusinessUnits />} />
          <Route path="/customers/sessionInfo" element={<GenSessionInfo />} />
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
            element={<GenProductCategory />}
          />
          <Route
            path="/general/invoiceDescriptions"
            element={<InvoiceDefaultDescriptions />}
          />
          <Route path="/general/productInfo" element={<ProductInfo />} />
          <Route
            path="/general/serviceCategories"
            element={<GenServiceCategory />}
          />
          <Route path="/general/servicesInfo" element={<ServiceInfo />} />
          <Route path="/general/companyInfo" element={<CompanyInfo />} />

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
