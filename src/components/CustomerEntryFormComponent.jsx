import useCustomerEntryHook from "../hooks/useCustomerEntryHook";

export function CustomerEntryForm() {
  const { render, setVisible } = useCustomerEntryHook();

  return (
    <>
      <button onClick={() => setVisible(true)} className="btn btn-primary ">
        Add Customer
      </button>
      {render}
    </>
  );
}
