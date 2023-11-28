import { FormProvider } from "react-hook-form";
import CustomerAccountEntry from "./CustomerAccountsEntry";
import CustomerEntry from "./CustomerEntry";
import { useState } from "react";
import CustomerBranchEntry from "./CustomerBranchEntry";

function useDialogsForCustomerEntry(
  customerEntryFrom,
  customerAccountsForm,
  customerBranchFrom
) {
  console.log("Dialog re-rendered");
  const [dialogIndex, setDialogIndex] = useState(0);

  const dialogs = [
    {
      header: "Customer Entry",
      content: (
        <>
          <FormProvider {...customerEntryFrom}>
            <CustomerEntry />
          </FormProvider>
        </>
      ),
    },
    {
      header: "Customer Accounts",
      content: (
        <>
          <FormProvider {...customerAccountsForm}>
            <CustomerAccountEntry />
          </FormProvider>
        </>
      ),
    },
    {
      header: "Customer Branches",
      content: (
        <>
          <CustomerBranchEntry />
        </>
      ),
    },
  ];

  return {
    dialogs,
    dialogIndex,
    setDialogIndex,
  };
}

export default useDialogsForCustomerEntry;
