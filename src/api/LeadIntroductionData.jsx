import axios from "axios";
import { toast } from "react-toastify";

const apiUrl = import.meta.env.VITE_APP_API_URL;

const CONTROLLER = "data_LeadIntroduction";
const WHEREMETHOD = "GetLeadIntroductionWhere";
const DELETEMETHOD = "LeadIntroductionDelete";
const POSTMEHTOD = "LeadIntroductionInsertUpdate";

// URL: /data_LeadIntroduction/GetLeadIntroductionWhere?LoginUserID=??
export async function fetchAllLeadIntroductions(LoginUserID) {
  const { data } = await axios.post(
    `${apiUrl}/${CONTROLLER}/${WHEREMETHOD}?LoginUserID=${LoginUserID}`
  );
  console.log(data);
  return data.data ?? [];
}

// URL: /data_LeadIntroduction/GetLeadIntroductionWhere?LeadIntroductionID=??&LoginUserID=??
export async function fetchLeadIntroductionById(
  LeadIntroductionID = 0,
  LoginUserID
) {
  if (LeadIntroductionID !== undefined || LeadIntroductionID !== 0) {
    const { data } = await axios.post(
      `${apiUrl}/${CONTROLLER}/${WHEREMETHOD}?LeadIntroductionID=${LeadIntroductionID}&LoginUserID=${LoginUserID}`
    );
    return data.data ?? [];
  } else {
    return [];
  }
}
// URL: /data_LeadIntroduction/LeadIntroductionDelete?LeadIntroductionID=??&LoginUserID=??
export async function deleteLeadIntroductionByID(serviceInfo) {
  const { data } = await axios.post(
    `${apiUrl}/${CONTROLLER}/${DELETEMETHOD}?LeadIntroductionID=${serviceInfo.LeadIntroductionID}&LoginUserID=${serviceInfo.LoginUserID}`
  );

  if (data.success === true) {
    toast.success("Business Type sucessfully deleted!");
    return true;
  } else {
    toast.error(data.message);
    return false;
  }
}
// URL: /data_LeadIntroduction/LeadIntroductionInsertUpdate
export async function addNewLeadIntroduction({
  formData,
  userID,
  LeadIntroductionID = 0,
}) {
  try {
    let DataToSend = {
      CompanyName: formData.CompanyName,
      CountryID: formData.CountryID,
      TehsilID: formData.TehsilID,
      BusinessTypeID: formData.BusinessTypeID,
      CompanyAddress: formData.CompanyAddress,
      CompanyWebsite: formData.CompanyWebsite,
      BusinessNature: formData.BusinessNature.toString(),
      ContactPersonName: formData.ContactPersonName,
      ContactPersonEmail: formData.ContactPersonEmail,
      RequirementDetails: formData.RequirementDetails,
      LeadSourceID: formData.LeadSourceID,
      InActive: formData.InActive === true ? 1 : 0,
      EntryUserID: userID,
    };
    console.log(formData);
    DataToSend.ContactPersonMobileNo =
      formData.ContactPersonMobileNo.replaceAll("-", "");
    DataToSend.ContactPersonWhatsAppNo =
      formData.ContactPersonWhatsAppNo.replaceAll("-", "");
    console.log(DataToSend);
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
  } catch (e) {
    console.log(e);
  }
}
