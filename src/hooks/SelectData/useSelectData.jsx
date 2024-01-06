import { useQuery } from "@tanstack/react-query";
import {
  fetchAllActivationCustomersForSelect,
  fetchAllBankAccountsForSelect,
  fetchAllBusinessUnitsForSelect,
  fetchAllCustomerAccountsForSelect,
  fetchAllCustomerInvoices,
  fetchAllCustomersBranch,
  fetchAllInvoiceInstallmetns,
  fetchAllOldCustomersForSelect,
  fetchAllProductCategoriesForSelect,
  fetchAllProductsForSelect,
  fetchAllServicesForSelect,
  fetchAllSessionsForSelect,
  fetchAllSoftwareCustomersForSelect,
} from "../../api/SelectData";

// Activation Customers
export function useActivationClientsSelectData(OldCustomerID = 0) {
  const activationClients = useQuery({
    queryKey: ["activationClients", OldCustomerID],
    queryFn: () => fetchAllActivationCustomersForSelect(OldCustomerID),
    initialData: [],
  });
  return activationClients;
}

// Software Mgt. Customers
export function useSoftwareClientsSelectData(OldCustomerID = 0) {
  const softwareClients = useQuery({
    queryKey: ["softwareClients", OldCustomerID],
    queryFn: () => fetchAllSoftwareCustomersForSelect(OldCustomerID),
    initialData: [],
  });
  return softwareClients;
}
// All Customers
export function useOldCustomerSelectData() {
  const oldCustomers = useQuery({
    queryKey: ["oldcustomers"],
    queryFn: () => fetchAllOldCustomersForSelect(),
    initialData: [],
  });
  return oldCustomers;
}

// All Customer Branches
export function useAllCustomersBranchSelectData() {
  const customersBranch = useQuery({
    queryKey: ["customersBranch"],
    queryFn: () => fetchAllCustomersBranch(),
    initialData: [],
  });
  return customersBranch;
}

// Customer Accounts
export function useCustomerLedgersSelectData(CustomerID = 0) {
  const CustomerAccounts = useQuery({
    queryKey: ["customerAccounts", CustomerID],
    queryFn: () => fetchAllCustomerAccountsForSelect(CustomerID),
    enabled: CustomerID !== 0,
    initialData: [],
  });
  return CustomerAccounts;
}
// All Sessions
export function useSessionSelectData() {
  const sessionSelectData = useQuery({
    queryKey: ["sessionsData"],
    queryFn: () => fetchAllSessionsForSelect(),
    initialData: [],
  });

  return sessionSelectData;
}

// All Business Units
export function useBusinessUnitsSelectData() {
  const businessSelectData = useQuery({
    queryKey: ["businessUnits"],
    queryFn: () => fetchAllBusinessUnitsForSelect(),
    initialData: [],
  });
  return businessSelectData;
}

// All Products
export function useProductsInfoSelectData(BusinessUnitID = 0) {
  const productsInfoSelectData = useQuery({
    queryKey: ["productsInfo", BusinessUnitID],
    queryFn: () => fetchAllProductsForSelect(BusinessUnitID),
    initialData: [],
  });
  return productsInfoSelectData;
}

// All Product Categories
export function useProductsCategoriesSelectData() {
  const productCategories = useQuery({
    queryKey: ["productCategories"],
    queryFn: () => fetchAllProductCategoriesForSelect(),
    initialData: [],
  });

  return productCategories;
}

// All Services
export function useServicesInfoSelectData(BusinessUnitID = 0) {
  const servicesInfoSelectData = useQuery({
    queryKey: ["servicesInfo", BusinessUnitID],
    queryFn: () => fetchAllServicesForSelect(BusinessUnitID),
    initialData: [],
  });
  return servicesInfoSelectData;
}

// All Invoices
export function useCustomerInvoicesSelectData(CustomerID = 0) {
  // const customerInvoicesSelectData = useQuery({
  //   queryKey: ["customerInvoices", CustomerID],
  //   queryFn: () => fetchAllCustomerInvoices(CustomerID),
  //   initialData: [],
  // });
  return [];
}
// All Invoices
export function useCustomerInvoiceInstallments(CustomerID = 0, AccountID = 0) {
  const customerInvoiceInstallmentsSelectData = useQuery({
    queryKey: ["customerLedgers", CustomerID, AccountID],
    queryFn: () => fetchAllInvoiceInstallmetns(CustomerID, AccountID),
    initialData: [],
  });
  return customerInvoiceInstallmentsSelectData;
}

//Bank Accounts
export function useBankAccountsSelectData() {
  const bankAccountsSelectData = useQuery({
    queryKey: ["bankAccounts"],
    queryFn: () => fetchAllBankAccountsForSelect(),
    initialData: [],
  });
  return bankAccountsSelectData;
}
