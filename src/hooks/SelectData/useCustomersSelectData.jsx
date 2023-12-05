import { useQuery } from "@tanstack/react-query";
import {
  fetchAllActivationCustomersForSelect,
  fetchAllCustomersBranch,
  fetchAllOldCustomersForSelect,
  fetchAllSoftwareCustomersForSelect,
} from "../../api/SelectData";

export function useActivationClientsSelectData(OldCustomerID = 0) {
  const activationClients = useQuery({
    queryKey: ["activationClients", OldCustomerID],
    queryFn: () => fetchAllActivationCustomersForSelect(OldCustomerID),
    initialData: [],
  });
  return activationClients;
}

export function useSoftwareClientsSelectData(OldCustomerID = 0) {
  const softwareClients = useQuery({
    queryKey: ["softwareClients", OldCustomerID],
    queryFn: () => fetchAllSoftwareCustomersForSelect(OldCustomerID),
    initialData: [],
  });
  return softwareClients;
}

export function useOldCustomerSelectData() {
  const oldCustomers = useQuery({
    queryKey: ["oldcustomers"],
    queryFn: () => fetchAllOldCustomersForSelect(),
    initialData: [],
  });
  return oldCustomers;
}

export function useAllCustomersBranchSelectData() {
  const customersBranch = useQuery({
    queryKey: ["customersBranch"],
    queryFn: () => fetchAllCustomersBranch(),
    initialData: [],
  });
  return customersBranch;
}
