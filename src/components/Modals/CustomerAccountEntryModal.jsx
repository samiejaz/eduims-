import { Dialog } from "primereact/dialog";
import { useState } from "react";
import CustomerAccountEntry from "../CustomerEntryModal/CustomerAccountsEntry";
import { Button } from "primereact/button";

export function useCustomerAccountEntryModal() {
  const [visible, setVisible] = useState(false);

  return {
    setVisible,
    render: (
      <>
        <Dialog
          header={"Customer Ledger Entry"}
          visible={visible}
          maximizable
          style={{ width: "70vw", height: "60vh" }}
          onHide={() => {
            setVisible(false);
          }}
        >
          <CustomerAccountEntry CustomerID={0} />
        </Dialog>
      </>
    ),
  };
}

export function CustomerAccountEntryModal() {
  const { setVisible, render } = useCustomerAccountEntryModal();

  return (
    <>
      <Button
        tooltip="Add new account"
        icon="pi pi-plus"
        severity="success"
        size="small"
        className="rounded-2"
        onClick={() => setVisible(true)}
        style={{
          padding: "1px 0px",
          fontSize: "small",
          width: "30px",
          marginLeft: "10px",
        }}
      />
      <div>{render}</div>
    </>
  );
}
