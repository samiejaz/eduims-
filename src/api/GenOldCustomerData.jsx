import axios from "axios";
import { toast } from "react-toastify";

const apiUrl = import.meta.env.VITE_APP_API_URL;

export async function fetchAllCleints() {
  try {
    const { data } = await axios.post(
      apiUrl + "/EduIMS/GetClientDataFromDBesnew"
    );
    return data;
  } catch (error) {}
}
export async function fetchAllOldCustomers(LoginUserID) {
  try {
    const { data } = await axios.post(
      apiUrl + "/EduIMS/GetOldCustomersWhere?LoginUserID=" + LoginUserID
    );
    return data.data ?? [];
  } catch (error) {
    toast.error(error.message);
  }
}
export async function fetchOldCustomerById(CustomerID, LoginUserID) {
  try {
    const { data } = await axios.post(
      `${apiUrl}/EduIMS/GetOldCustomersWhere?CustomerID=${CustomerID}&LoginUserID=${LoginUserID}`
    );
    return data;
  } catch (error) {
    toast.error(error.message);
  }
}

export async function deleteOldCustomerByID(oldCustomer) {
  await axios.post(
    apiUrl + "/EduIMS/CustomerDelete?CustomerID=" + oldCustomer.OldCustomerID
  );
}
