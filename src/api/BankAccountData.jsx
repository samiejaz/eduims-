import axios from "axios";

const apiUrl = import.meta.env.VITE_APP_API_URL;

const CONTROLLER = "EduIMS";
const WHEREMETHOD = "GetBankAccountWhere";
const DELETEMETHOD = "BankAccountDelete";

// URL: /EduIMS/GetBankAccountWhere?BankAccountID=??
export async function fetchAllBankAccounts(LoginUserID) {
  const { data } = await axios.post(
    `${apiUrl}/${CONTROLLER}/${WHEREMETHOD}?LoginUserID=${LoginUserID}`
  );
  return data.data ?? [];
}

// URL: /EduIMS/GetCustomerBranchWhere?BankAccountID=??&LoginUserID=??
export async function fetchBankAccountById(BankAccountID, LoginUserID) {
  try {
    const { data } = await axios.post(
      `${apiUrl}/${CONTROLLER}/${WHEREMETHOD}?BankAccountID=${BankAccountID}&LoginUserID=${LoginUserID}`
    );
    return data;
  } catch (error) {}
}

// URL: /EduIMS/BankAccountDelete?BankAccountID=??&LoginUserID=??
export async function deleteBankAccountByID(bankAccount) {
  await axios.post(
    `${apiUrl}/${CONTROLLER}/${DELETEMETHOD}?BankAccountID=${bankAccount.BankAccountID}&LoginUserID=${bankAccount.LoginUserID}`
  );
}
