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
//
export async function fetchMonthlyMaxReceiptNo(BusinesssUnitID) {
  try {
    const { data } = await axios.post(
      `${apiUrl}/${CONTROLLER}/GetReceiptNo?BusinesssUnitID=${BusinesssUnitID}`
    );
    return data;
  } catch (error) {
    toast.error(error);
  }
}

//
export async function addNewReceiptVoucher({
  formData,
  userID,
  ReceiptVoucherID = 0,
}) {
  console.log(formData);
  if (formData.receiptDetail.length > 0) {
    try {
      let ReceiptVoucherDetail = formData.receiptDetail.map((item, index) => {
        return {
          RowID: index + 1,
          DetailBusinessUnitID: item.BusinessUnitID,
          Amount: parseFloat(0 + item.Amount),
          DetailDescription: item.Description,
        };
      });

      let DataToSend = {
        SessionID: formData.SessionID,
        BusinessUnitID: formData.BusinessUnitID,
        VoucherNo: formData.VoucherNo,
        VoucherDate: formData.VoucherDate,
        ReceiptMode: formData.ReceiptMode,
        InstrumentType:
          formData.InstrumentType?.length > 0 ? formData.InstrumentType : null,
        CustomerID: formData.Customer,
        AccountID: formData.CustomerLedgers,
        ReceivedInBankID: formData.ReceivedInBankID,
        InstrumentNo: formData.InstrumentNo,
        InstrumentDate: formData.InstrumentDate,
        TotalNetAmount: formData.TotalNetAmount,
        Description: formData.Description,
        EntryUserID: userID,
        ReceiptVoucherDetail: JSON.stringify(ReceiptVoucherDetail),
      };

      if (ReceiptVoucherID === 0 || ReceiptVoucherID === undefined) {
        DataToSend.ReceiptVoucherID = 0;
      } else {
        DataToSend.ReceiptVoucherID = ReceiptVoucherID;
      }

      const { data } = await axios.post(
        apiUrl + `/${CONTROLLER}/ReceiptVoucherInsertUpdate`,
        DataToSend
      );

      if (data.success === true) {
        if (ReceiptVoucherID !== 0) {
          toast.success("ReceiptVoucher updated successfully!");
        } else {
          toast.success("ReceiptVoucher created successfully!");
        }
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      toast.error(error.message);
    }
  } else {
    toast.error("Please add atleast 1 row!");
  }
}
