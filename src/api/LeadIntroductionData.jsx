import axios from "axios";
import { toast } from "react-toastify";

const apiUrl = import.meta.env.VITE_APP_API_URL;

const CONTROLLER = "gen_LeadIntroduction";
const WHEREMETHOD = "GetLeadIntroductionWhere";
const DELETEMETHOD = "LeadIntroductionDelete";
const POSTMEHTOD = "LeadIntroductionInsertUpdate";

// URL: /gen_LeadIntroduction/GetLeadIntroductionWhere?LoginUserID=??
export async function fetchAllLeadIntroductions(LoginUserID) {
  //   const { data } = await axios.post(
  //     `${apiUrl}/${CONTROLLER}/${WHEREMETHOD}?LoginUserID=${LoginUserID}`
  //   );
  //   return data.data ?? [];
  return [];
}

// URL: /gen_LeadIntroduction/GetLeadIntroductionWhere?LeadIntroductionID=??&LoginUserID=??
export async function fetchLeadIntroductionById(
  LeadIntroductionID = 0,
  LoginUserID
) {
  //   if (LeadIntroductionID !== undefined || LeadIntroductionID !== 0) {
  //     const { data } = await axios.post(
  //       `${apiUrl}/${CONTROLLER}/${WHEREMETHOD}?LeadIntroductionID=${LeadIntroductionID}&LoginUserID=${LoginUserID}`
  //     );
  //     return data.data ?? [];
  //   } else {
  //     return [];
  //   }
  return [];
}
// URL: /gen_LeadIntroduction/LeadIntroductionDelete?LeadIntroductionID=??&LoginUserID=??
export async function deleteLeadIntroductionByID(serviceInfo) {
  //   const { data } = await axios.post(
  //     `${apiUrl}/${CONTROLLER}/${DELETEMETHOD}?LeadIntroductionID=${serviceInfo.LeadIntroductionID}&LoginUserID=${serviceInfo.LoginUserID}`
  //   );

  //   if (data.success === true) {
  //     toast.success("Business Type sucessfully deleted!");
  //     return true;
  //   } else {
  //     toast.error(data.message);
  //     return false;
  //   }
  return [];
}
// URL: /gen_LeadIntroduction/LeadIntroductionInsertUpdate
export async function addNewLeadIntroduction({
  formData,
  userID,
  LeadIntroductionID = 0,
}) {
  let DataToSend = {
    LeadIntroductionTitle: formData.LeadIntroductionTitle,
    InActive: formData.InActive === true ? 1 : 0,
    EntryUserID: userID,
  };

  if (LeadIntroductionID === 0 || LeadIntroductionID === undefined) {
    DataToSend.LeadIntroductionID = 0;
  } else {
    DataToSend.LeadIntroductionID = LeadIntroductionID;
  }

  const { data } = await axios.post(
    apiUrl + `/${CONTROLLER}/${POSTMEHTOD}`,
    DataToSend
  );

  if (data.success === true) {
    if (LeadIntroductionID !== 0) {
      toast.success("Business Type updated successfully!");
    } else {
      toast.success("Business Type created successfully!");
    }
    return { success: true, RecordID: data?.LeadIntroductionID };
  } else {
    toast.error(data.message);
    return { success: false, RecordID: LeadIntroductionID };
  }
}
