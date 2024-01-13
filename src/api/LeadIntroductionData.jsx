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
      BusinessNature: formData.BusinessNatureID,
      ContactPersonName: formData.ContactPersonName,
      ContactPersonEmail: formData.ContactPersonEmail,
      RequirementDetails: formData.RequirementDetails,
      LeadSourceID: formData.LeadSourceID,
      InActive: formData.InActive === true ? 1 : 0,
      EntryUserID: userID,
    };
    DataToSend.ContactPersonMobileNo =
      formData.ContactPersonMobileNo.replaceAll("-", "");
    if (formData?.IsWANumberSameAsMobile) {
      DataToSend.ContactPersonWhatsAppNo =
        formData.ContactPersonWhatsAppNo[0].replaceAll("-", "");
    } else {
      DataToSend.ContactPersonWhatsAppNo =
        formData.ContactPersonWhatsAppNo.replaceAll("-", "");
    }
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
  } catch (e) {}
}

async function addLeadIntroductionOnAction({
  from,
  formData,
  LeedIntroductionID,
}) {
  let DataToSend = {};
  if (from === "Forward") {
    DataToSend = {
      DepartmentID: formData.DepartmentID,
      UserID: formData.UserID,
      MeetingPlace: formData.MeetingPlace,
      MeetingTime: formData.MeetingTime,
      RecommendedProductID: formData.RecommendedProductID,
      Description: formData.Description,
    };
  } else if (from === "Quoted" || formData === "Finalized") {
    DataToSend = {
      AttachmentFile: formData.AttachmentFile,
      Amount: formData.Amount,
      Description: formData.Description,
    };
  } else if (from === "Closed") {
    DataToSend = {
      Amount: formData.Amount,
      Description: formData.Description,
    };
  }
  DataToSend.LeadIntroductionDetailID = 0;
  DataToSend.LeedIntroductionID = LeedIntroductionID;
}

// newFormData.append("DepartmentID", formData.DepartmentID),
// newFormData.append("UserID", formData.UserID),
// newFormData.append("MeetingPlace", formData.MeetingPlace),
// newFormData.append("MeetingTime", formData.MeetingTime),
// newFormData.append("RecommendedProductID", formData.RecommendedProductID),
// newFormData.append("Description", formData.Description),
