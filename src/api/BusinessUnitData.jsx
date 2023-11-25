import axios from "axios";

const apiUrl = import.meta.env.VITE_APP_API_URL;

const CONTROLLER = "EduIMS";
const WHEREMETHOD = "GetCustomerBranchWhere";
const DELETEMETHOD = "CustomerBranchDelete";

export async function getBusinessUnitImg(LoginUserID) {
  const { data } = await axios.post(
    apiUrl + "/EduIMS/GetDBMultiImage?LoginUserID=" + LoginUserID
  );
  return data;
}
export async function fetchAllBusinessUnits(LoginUserID) {
  const { data } = await axios.post(
    apiUrl + "/EduIMS/GetBusinessUnitWhere?LoginUserID=" + LoginUserID
  );
  return data.data ?? [];
}

export async function fetchBusinessUnitById(BusinessUnitID, LoginUserID) {
  try {
    const { data } = await axios.post(
      apiUrl +
        `/EduIMS/GetBusinessUnitWhere?BusinessUnitID=${BusinessUnitID}&LoginUserID=${LoginUserID}`
    );
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteBusinessUnit(business) {
  const { data } = await axios.post(
    apiUrl +
      `/EduIMS/BusinessUnitsDelete?BusinessUnitID=${business.BusinessUnitID}&LoginUserID=${business.LoginUserID}`
  );
}
