import axios from "axios";
import { toast } from "react-toastify";

const apiUrl = import.meta.env.VITE_APP_API_URL;

const CONTROLLER = "EduIMS";
const WHEREMETHOD = "GetCustomerAccountWhere";
const DELETEMETHOD = "CustomerBranchDelete";

// URL: /EduIMS/GetCustomerAccountWhere?LoginUserID=??
export async function fetchAllCustomerAccounts(LoginUserID) {
  const { data } = await axios.post(
    `${apiUrl}/${CONTROLLER}/${WHEREMETHOD}?LoginUserID=${LoginUserID}`
  );
  return data.data ?? [];
}

// URL: /EduIMS/GetCustomerAccountWhere?AccountID=??&LoginUserID=??
export async function fetchCustomerAccountByID(CustomerID, LoginUserID) {
  console.log("Fetching", CustomerID);
  try {
    const { data } = await axios.post(
      `${apiUrl}/${CONTROLLER}/${WHEREMETHOD}?CustomerID=${CustomerID}&LoginUserID=${LoginUserID}`
    );
    return data;
  } catch (error) {
    toast.error(error.message);
  }
}
// URL: /EduIMS/CustomerBranchDelete?AccountID=??&LoginUserID=??
export async function deleteCustomerBranchByID(serviceInfo) {
  const { data } = await axios.post(
    `${apiUrl}/${CONTROLLER}/${DELETEMETHOD}?AccountID=${serviceInfo.AccountID}&LoginUserID=${serviceInfo.LoginUserID}`
  );

  if (data.success === true) {
    toast.success("Branch sucessfully deleted!");
    return true;
  } else {
    toast.error(data.message);
    return false;
  }
}
