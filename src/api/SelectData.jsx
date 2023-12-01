import axios from "axios";

const apiUrl = import.meta.env.VITE_APP_API_URL;

export async function fetchAllBusinessUnitsForSelect() {
  const { data } = await axios.post(apiUrl + "/Select/SelectBusinessUnit");
  return data.data || [];
}

export async function fetchAllProductCategoriesForSelect() {
  const { data } = await axios.post(apiUrl + "/Select/SelectProductCategory");
  return data.data;
}

export async function fetchAllServicesCategoriesForSelect() {
  const { data } = await axios.post(apiUrl + "/Select/SelectServiceCategory");
  return data.data || [];
}

export async function fetchAllOldCustomersForSelect() {
  const { data } = await axios.post(apiUrl + "/Select/SelectCustomers");
  return data.data || [];
}
export async function fetchAllSessionsForSelect() {
  const { data } = await axios.post(apiUrl + "/Select/SelectSessionInfo");
  return data.data || [];
}

export async function fetchAllCustomerAccountsForSelect(CustomerID) {
  if (CustomerID === undefined) {
    CustomerID = 0;
  }
  const { data } = await axios.post(
    apiUrl + "/Select/GetCustomerAccounts?CustomerID=" + CustomerID
  );
  return data.data || [];
}
export async function fetchAllProductsForSelect(BusinessUnitID) {
  let whereClause = "";
  if (BusinessUnitID !== undefined) {
    whereClause = "?BusinessUnitID=" + BusinessUnitID;
  }
  const { data } = await axios.post(
    apiUrl + "/Select/SelectProducts" + whereClause
  );
  return data.data || [];
}
export async function fetchAllCustomerBranchesData(AccountID) {
  let whereClause = "";

  if (AccountID !== undefined) {
    whereClause = "?AccountID=" + AccountID;
  }
  const { data } = await axios.post(
    apiUrl + "/Select/SelectCustomerBranches" + whereClause
  );

  return data.data || [];
}
export async function fetchAllServicesForSelect(BusinessUnitID) {
  let whereClause = "";
  if (BusinessUnitID !== undefined) {
    whereClause = "?BusinessUnitID=" + BusinessUnitID;
  }
  const { data } = await axios.post(
    apiUrl + "/Select/SelectServices" + whereClause
  );
  return data.data || [];
}

export async function fetchAllActivationCustomersForSelect(CustomerID) {
  let whereClause;

  if (CustomerID === undefined) {
    whereClause = "?CustomerID=" + 0;
  } else {
    whereClause = "?CustomerID=" + CustomerID;
  }
  const { data } = await axios.post(
    apiUrl + "/Select/GetClientDataFromActDb" + whereClause
  );

  return data.data;
}
export async function fetchAllSoftwareCustomersForSelect(CustomerID) {
  let whereClause;
  if (CustomerID === undefined) {
    whereClause = "?CustomerID=" + 0;
  } else {
    whereClause = "?CustomerID=" + CustomerID;
  }

  const { data } = await axios.post(
    apiUrl + "/Select/GetClientDataFromsoftDb" + whereClause
  );
  return data.data;
}
