import axios from "axios";
import { toast } from "react-toastify";

const apiUrl = import.meta.env.VITE_APP_API_URL;

const CONTROLLER = "data_ReceiptVoucher";
const WHEREMETHOD = "GetReceiptVoucherData";
const DELETEMETHOD = "ReceiptVoucherDelete";

// URL: /data_ReceiptVoucher/GetReceiptVoucherWhere?LoginUserID=??
export async function fetchAllReceiptVoucheres(LoginUserID) {
  const { data } = await axios.post(
    `${apiUrl}/${CONTROLLER}/${WHEREMETHOD}?LoginUserID=${LoginUserID}`
  );
  return data.data ?? [];
}

// URL: /data_ReceiptVoucher/GetReceiptVoucherWhere?ReceiptVoucherID=??&LoginUserID=??
export async function fetchReceiptVoucherById(ReceiptVoucherID, LoginUserID) {
  const { data } = await axios.post(
    `${apiUrl}/${CONTROLLER}/GetReceiptVoucherWhere?ReceiptVoucherID=${ReceiptVoucherID}&LoginUserID=${LoginUserID}`
  );

  return data ?? [];
}
// URL: /data_ReceiptVoucher/ReceiptVoucherDelete?ReceiptVoucherID=??&LoginUserID=??
export async function deleteReceiptVoucherByID(serviceInfo) {
  const { data } = await axios.post(
    `${apiUrl}/${CONTROLLER}/${DELETEMETHOD}?ReceiptVoucherID=${serviceInfo.ReceiptVoucherID}&LoginUserID=${serviceInfo.LoginUserID}`
  );

  if (data.success === true) {
    toast.success("Branch sucessfully deleted!");
    return true;
  } else {
    toast.error(data.message);
    return false;
  }
}
