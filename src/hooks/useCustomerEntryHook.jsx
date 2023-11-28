import React, { useContext, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { ButtonGroup } from "react-bootstrap";
import CustomerEntry from "../components/CustomerEntryModal/CustomerEntry";
import CustomerBranchEntry from "../components/CustomerEntryModal/CustomerBranchEntry";
import { AppConfigurationContext } from "../context/AppConfigurationContext";
import { FormProvider, useForm } from "react-hook-form";
import CustomerAccountEntry from "../components/CustomerEntryModal/CustomerAccountsEntry";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

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

const apiUrl = import.meta.env.VITE_APP_API_URL;

const useCustomerEntryHook = () => {
  const { user } = useContext(AuthContext);

  const [visible, setVisible] = useState(false);
  const [CustomerID, setCustomerID] = useState(0);
  const [dialogIndex, setDialogIndex] = useState(0);

  const customerEntryFrom = useForm(customerEntryDefaultValues);
  const customerAccountsForm = useForm({
    defaultValues: customerAccountDefaultValues,
  });
  const customerBranchFrom = useForm(customerBranchDefaultValues);
  let customerMutaion = useMutation({
    mutationFn: async (formData) => {
      let DataToSend = {
        CustomerID: 0,
        ContactPerson1Email: formData?.ContactPerson1Email,
        ContactPerson1Name: formData?.ContactPerson1Name,
        ContactPerson1No: formData?.ContactPerson1No,
        CustomerBusinessAddress: formData?.CustomerBusinessAddress,
        CustomerBusinessName: formData.CustomerBusinessName,
        CustomerName: formData.CustomerName,
        Description: formData?.Description,
        InActive: formData?.InActive === false ? 0 : 1,
        EntryUserID: user.userID,
      };

      const { data } = await axios.post(
        apiUrl + "/EduIMS/NewCustomerInsert",
        DataToSend
      );

      if (data.success === true) {
        setCustomerID(data.CustomerID);
        toast.success("Customer saved successfully!");
        setDialogIndex(dialogIndex + 1);
      } else {
        toast.error(data.message, {
          autoClose: 1500,
        });
      }
    },
    onError: (error) => {
      console.log(error);
      toast.error("Error while saving data!");
    },
  });

  function customerHandleSubmit(data) {
    customerMutaion.mutate(data);
  }

  function customerAccountsSubmit(data) {
    accountsMutation.mutate(data);
  }

  function customerBranchSubmit(data) {
    if (dialogIndex === dialogs.length - 1) {
      setDialogIndex(dialogIndex + 1);
    }
  }

  function handleCancelClick() {
    setDialogIndex(0);
    setCustomerID(0);
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
            <CustomerAccountEntry CustomerID={CustomerID} />
          </FormProvider>
        </>
      ),
    },
    {
      header: "Customer Branches",
      content: (
        <>
          <FormProvider {...customerBranchFrom}>
            <CustomerBranchEntry />
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
        icon="pi pi-arrow-right"
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
        type="submit"
        onClick={() => {
          if (dialogIndex === 0) {
            customerEntryFrom.handleSubmit(customerHandleSubmit)();
          } else if (dialogIndex === 1) {
            customerAccountsForm.handleSubmit(customerAccountsSubmit)();
          } else if (dialogIndex === 2) {
            customerBranchFrom.handleSubmit(customerBranchSubmit)();
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
