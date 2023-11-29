import useCustomerEntryHook from "../hooks/useCustomerEntryHook";
import { Button as PrimeButton } from "primereact/button";

export function CustomerEntryForm({ IconButton = false }) {
  const { render, setVisible } = useCustomerEntryHook();

  return (
    <>
      {IconButton ? (
        <>
          <PrimeButton
            tooltip="Add new customer"
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
        </>
      ) : (
        <>
          <button onClick={() => setVisible(true)} className="btn btn-primary ">
            Add Customer
          </button>
        </>
      )}
      {render}
    </>
  );
}
