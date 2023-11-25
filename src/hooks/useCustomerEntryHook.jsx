import React, { useContext, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { ButtonGroup } from "react-bootstrap";
import CustomerEntry from "../components/CustomerEntryModal/CustomerEntry";
import CustomerBranchEntry from "../components/CustomerEntryModal/CustomerBranchEntry";
import { AppConfigurationContext } from "../context/AppConfigurationContext";
import { FormProvider, useForm } from "react-hook-form";
import CustomerAccountEntry from "../components/CustomerEntryModal/CustomerAccountsEntry";

const customerEntryDefaultValues = {
  CustomerName: "",
  CustomerBusinessName: "",
  CustomerBusinessAddress: "",
  ContactPerson1Name: "",
  ContactPerson1Email: "",
  ContactPerson1No: "",
  Description: "",
  InActive: false,
};

const customerBranchDefaultValues = {
  CustomerBranchTitle: "",
  Customers: [],
  BranchAddress: "",
  BranchCode: "",
  ContactPersonName: "",
  ContactPersonNo: "",
  ContactPersonEmail: "",
  Description: "",
  InActive: false,
};
const customerAccountDefaultValues = {
  accountsDetail: [],
};

const customersEntryData = {
  // CustomerName: "Muhammad Ahsan",
  // CustomerBusinessName: "Ahsan Medicine",
  // CustomerBusinessAddress: "Gulgasht",
  // ContactPerson1Name: "Muhammad hsan",
  // ContactPerson1Email: "ahsan@gmail.com",
  // ContactPerson1No: "0315-6332346",
  // Description: "description about ahsan medicine!",
  // InActive: false,
};

const customerBranchData = {
  // CustomerBranchTitle: "Ahsan Medicine (Gulgasht)",
  // Customers: {
  //   CustomerID: 1,
  //   CustomerName: "Muhammad Ahsan",
  // },
  // BranchAddress: "Gulgashst",
  // BranchCode: "CODE_7",
  // ContactPersonName: "Muhammad Ahsan",
  // ContactPersonNo: "0324-23242223",
  // ContactPersonEmail: "ahsan@gmail.com",
  // Description: "description about customer branch",
  // InActive: false,
};
const customerAccountsData = [
  {
    AccountTitle: "Ahsan Medicine Account",
  },
];

const useCustomerEntryHook = () => {
  const [visible, setVisible] = useState(false);
  const [dialogIndex, setDialogIndex] = useState(0);
  const { pageTitles } = useContext(AppConfigurationContext);

  const customerEntryFrom = useForm(customerEntryDefaultValues);
  const customerAccountsForm = useForm({
    defaultValues: customerAccountDefaultValues,
  });
  const customerBranchFrom = useForm(customerBranchDefaultValues);

  function customerHandleSubmit(data) {
    if (dialogIndex < dialogs.length - 1) {
      setDialogIndex(dialogIndex + 1);
    }
  }

  function customerAccountsSubmit(data) {
    console.log(data);
    if (dialogIndex < dialogs.length - 1) {
      setDialogIndex(dialogIndex + 1);
    }
  }

  function customerBranchSubmit(data) {
    if (dialogIndex === dialogs.length - 1) {
      setDialogIndex(dialogIndex + 1);
    }
  }

  function handleCancelClick() {
    setDialogIndex(0);
    customerEntryFrom.reset(customerEntryDefaultValues);
    customerBranchFrom.reset(customerBranchDefaultValues);
    customerAccountsForm.reset(customerAccountsForm);
  }

  const dialogs = [
    {
      header: "Customer Entry",
      content: (
        <>
          <FormProvider {...customerEntryFrom}>
            <CustomerEntry customersEntryData={null} />
          </FormProvider>
        </>
      ),
    },
    {
      header: "Customer Accounts",
      content: (
        <>
          <FormProvider {...customerAccountsForm}>
            <CustomerAccountEntry
              pageTitles={pageTitles}
              customerAccountsData={null}
            />
          </FormProvider>
        </>
      ),
    },
    {
      header: "Customer Branches",
      content: (
        <>
          <FormProvider {...customerBranchFrom}>
            <CustomerBranchEntry
              pageTitles={pageTitles}
              customerBranchData={null}
            />
          </FormProvider>
        </>
      ),
    },
  ];

  const footerContent = (
    <ButtonGroup className="gap-1">
      <Button
        label="Cancel"
        icon="pi pi-times"
        onClick={() => {
          setVisible(false);
          handleCancelClick();
        }}
        className="p-button-text text-center"
      />
      <Button
        label="Previous"
        icon="pi pi-arrow-left"
        onClick={() => {
          if (dialogIndex > 0) {
            setDialogIndex(dialogIndex - 1);
          }
        }}
        disabled={dialogIndex === 0}
        className="p-button-p text-center"
      />
      <Button
        label="Next"
        icon="pi pi-arrow-left"
        onClick={() => {
          if (dialogIndex < dialogs.length - 1) {
            setDialogIndex(dialogIndex + 1);
          }
        }}
        disabled={dialogIndex === dialogs.length - 1}
        className="p-button-p text-center"
      />
      <Button
        label={"Save"}
        icon="pi pi-arrow-right"
        type="submit"
        onClick={() => {
          if (dialogIndex === 0) {
            customerEntryFrom.handleSubmit(customerHandleSubmit)();
          } else if (dialogIndex === 1) {
            customerAccountsForm.handleSubmit(customerAccountsSubmit)();
          } else if (dialogIndex === 2) {
            customerBranchFrom.handleSubmit(customerBranchSubmit)();
          }

          if (dialogIndex < dialogs.length - 1) {
            setDialogIndex(dialogIndex + 1);
          }
        }}
        className="p-button-p text-center"
      />
    </ButtonGroup>
  );

  return {
    setVisible,
    render: (
      <>
        <div className="card flex justify-content-center">
          <Dialog
            header={dialogs[dialogIndex].header}
            visible={visible}
            maximizable
            style={{ width: "80vw", height: "70vh" }}
            onHide={() => setVisible(false)}
            footer={footerContent}
          >
            {dialogs[dialogIndex].content}
          </Dialog>
        </div>
      </>
    ),
  };
};

export default useCustomerEntryHook;
