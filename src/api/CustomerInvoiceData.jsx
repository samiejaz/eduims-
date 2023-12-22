import axios from "axios";
import { toast } from "react-toastify";
import { format, parseISO } from "date-fns";

const apiUrl = import.meta.env.VITE_APP_API_URL;

const CONTROLLER = "CustomerInvoice";
const WHEREMETHOD = "GetCustomerInvoiceWhere";
const DELETEMETHOD = "InvoiceDescriptionDelete";

// URL: /CustomerInvoice/GetCustomerInvoicesData?LoginUserID=??
export async function fetchAllCustomerInvoices(LoginUserID) {
  const { data } = await axios.post(
    `${apiUrl}/${CONTROLLER}/GetCustomerInvoicesData?LoginUserID=${LoginUserID}`
  );
  let newData = data.data.map((item) => {
    return {
      CustomerInvoiceID: item.CustomerInvoiceID,
      InvoiceNo: item.InvoiceNo,
      SessionBasedVoucherNo: item.SessionBasedVoucherNo,
      InvoiceTitle: item.InvoiceTitle,
      CustomerName: item.CustomerName,
      AccountTitle: item.AccountTitle,
      EntryDate: format(parseISO(item.EntryDate), "dd-MMM-yyyy"),
      TotalNetAmount: item.TotalNetAmount,
    };
  });
  return newData ?? [];
}

// URL: /EduIMS/GetCustomerInvoiceWhere?CustomerInvoiceID=??&LoginUserID=??
export async function fetchCustomerInvoiceById(CustomerInvoiceID, LoginUserID) {
  try {
    const { data } = await axios.post(
      `${apiUrl}/${CONTROLLER}/${WHEREMETHOD}?CustomerInvoiceID=${CustomerInvoiceID}&LoginUserID=${LoginUserID}`
    );
    return data;
  } catch (error) {}
}

export async function fetchMaxInvoiceNo(LoginUserID) {
  try {
    const { data } = await axios.post(
      `${apiUrl}/${CONTROLLER}/GetInvoiceNo?LoginUserID=${LoginUserID}`
    );
    return data;
  } catch (error) {
    toast.error(error);
  }
}
export async function fetchMaxSessionBasedVoucherNo(LoginUserID) {
  try {
    const { data } = await axios.post(
      `${apiUrl}/${CONTROLLER}/GetSessionBasedInvoiceNo?LoginUserID=${LoginUserID}`
    );
    return data;
  } catch (error) {
    toast.error(error);
  }
}
// URL: /EduIMS/CustomerBranchDelete?CustomerInvoiceID=??&LoginUserID=??
export async function deleteInvoiceDeafultDescriptionsByID(
  invoiceDefaultDescription
) {
  const { data } = await axios.post(
    `${apiUrl}/${CONTROLLER}/${DELETEMETHOD}?CustomerInvoiceID=${invoiceDefaultDescription.DescriptionID}&LoginUserID=${invoiceDefaultDescription.LoginUserID}`
  );

  if (data.success === true) {
    toast.success("Description sucessfully deleted!");
    return true;
  } else {
    toast.error(data.message);
    return false;
  }
}
