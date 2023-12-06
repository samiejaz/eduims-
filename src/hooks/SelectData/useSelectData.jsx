import { useQuery } from "@tanstack/react-query";
import {
  fetchAllActivationCustomersForSelect,
  fetchAllBusinessUnitsForSelect,
  fetchAllCustomerAccountsForSelect,
  fetchAllCustomersBranch,
  fetchAllOldCustomersForSelect,
  fetchAllProductCategoriesForSelect,
  fetchAllProductsForSelect,
  fetchAllServicesForSelect,
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
export function useServicesInfoSelectData() {
  const servicesInfoSelectData = useQuery({
    queryKey: ["servicesInfo"],
    queryFn: () => fetchAllServicesForSelect(),
    initialData: [],
  });
  return servicesInfoSelectData;
}
