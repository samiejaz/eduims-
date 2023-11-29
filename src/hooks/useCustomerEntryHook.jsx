import React, { useContext, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { ButtonGroup } from "react-bootstrap";
import CustomerEntry from "../components/CustomerEntryModal/CustomerEntry";
import CustomerBranchEntry from "../components/CustomerEntryModal/CustomerBranchEntry";

import { FormProvider, useForm } from "react-hook-form";
import CustomerAccountEntry from "../components/CustomerEntryModal/CustomerAccountsEntry";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

const apiUrl = import.meta.env.VITE_APP_API_URL;

const useCustomerEntryHook = () => {
  const queryClient = useQueryClient();
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
        CustomerID: CustomerID ?? 0,
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
        if (CustomerID) {
          toast.success("Customer updated successfully!");
        } else {
          toast.success("Customer saved successfully!");
        }
        setDialogIndex(dialogIndex + 1);
        // queryClient.invalidateQueries({ queryKey: ["Customers"] });
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

  function handleCancelClick() {
    queryClient.invalidateQueries({ queryKey: ["Customers"] });
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
      header: "Customer Branches",
      content: (
        <>
          <FormProvider {...customerBranchFrom}>
            <CustomerBranchEntry CustomerID={CustomerID} />
          </FormProvider>
        </>
      ),
    },
    // {
    //   header: "Customer Accounts",
    //   content: (
    //     <>
    //       <FormProvider {...customerAccountsForm}>
    //         <CustomerAccountEntry CustomerID={CustomerID} />
    //       </FormProvider>
    //     </>
    //   ),
    // },
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
      {dialogIndex === 0 ? (
        <>
          <Button
            label={"Next"}
            type={"button"}
            icon="pi pi-arrow-right"
            onClick={() => {
              if (dialogIndex === 0) {
                customerEntryFrom.handleSubmit(customerHandleSubmit)();
              }
            }}
            className="p-button-p text-center"
            disabled={dialogIndex === dialogs.length - 1}
          />
        </>
      ) : (
        <>
          <Button
            label={"Next"}
            type={"button"}
            icon="pi pi-arrow-right"
            onClick={() => {
              if (dialogIndex < dialogs.length - 1) {
                setDialogIndex(dialogIndex + 1);
              }
            }}
            className="p-button-p text-center"
            disabled={dialogIndex === dialogs.length - 1}
          />
        </>
      )}
    </ButtonGroup>
  );

  function dialogHeight() {
    switch (dialogIndex) {
      case 0:
        return "70vh";
      case 1:
        return "80vh";
      default:
        return "90vh";
    }
  }

  return {
    setVisible,
    render: (
      <>
        <Dialog
          header={dialogs[dialogIndex].header}
          visible={visible}
          maximizable
          style={{ width: "80vw", height: dialogHeight() }}
          onHide={() => {
            setVisible(false);
            queryClient.invalidateQueries({ queryKey: ["Customers"] });
          }}
          footer={footerContent}
        >
          {dialogs[dialogIndex].content}
        </Dialog>
      </>
    ),
  };
};

export default useCustomerEntryHook;
