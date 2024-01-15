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
    toast.success("Lead sucessfully deleted!");
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
        toast.success("Lead updated successfully!");
      } else {
        toast.success("Lead created successfully!");
      }
      return { success: true, RecordID: data?.LeadIntroductionID };
    } else {
      toast.error(data.message);
      return { success: false, RecordID: LeadIntroductionID };
    }
  } catch (e) {}
}

export async function addLeadIntroductionOnAction({
  from,
  formData,
  userID,
  LeadIntroductionID,
}) {
  let Status = "";
  console.log(from, formData, userID, LeadIntroductionID);
  let newFormData = new FormData();
  if (from === "Forward") {
    newFormData.append("UserID", formData.UserID);
    newFormData.append("MeetingPlace", formData.MeetingPlace);
    newFormData.append("MeetingTime", formData.MeetingTime.toUTCString());
    newFormData.append("RecommendedProductID", formData.ProductInfoID);
    newFormData.append("Description", formData.Description ?? "");
    Status = "Forwarded";
  } else if (from === "Quoted" || from === "Finalized") {
    newFormData.append("AttachmentFile", formData.AttachmentFile[0]);
    newFormData.append("Amount", formData.Amount ?? 1900);
    newFormData.append("Description", formData.Description);
    Status = from === "Quoted" ? "Quoted" : "Finalized";
  } else if (from === "Closed") {
    newFormData.append("Amount", formData.Amount ?? 100);
    newFormData.append("Description", formData.Description);
    Status = "Closed";
  }
  newFormData.append("LeadIntroductionDetailID", 0);
  newFormData.append("EntryUserID", +userID);
  newFormData.append("LeadIntroductionID", LeadIntroductionID);
  newFormData.append("Status", Status);

  const { data } = await axios.post(
    apiUrl + `/${CONTROLLER}/LeadIntroductionOnAction`,
    newFormData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  if (data.success === true) {
    if (LeadIntroductionID !== 0) {
      toast.success("Lead forwared successfully!");
    } else {
      toast.success("Lead forwared successfully!");
    }
    return { success: true };
  } else {
    toast.error(data.message);
    return { success: false };
  }
}

// newFormData.append("DepartmentID", formData.DepartmentID),
// newFormData.append("UserID", formData.UserID),
// newFormData.append("MeetingPlace", formData.MeetingPlace),
// newFormData.append("MeetingTime", formData.MeetingTime),
// newFormData.append("RecommendedProductID", formData.RecommendedProductID),
// newFormData.append("Description", formData.Description),
