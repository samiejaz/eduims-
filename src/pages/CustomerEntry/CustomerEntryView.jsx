import { FormProvider, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import CustomerEntry from "../../components/CustomerEntryModal/CustomerEntry";
import CustomerAccountEntry from "../../components/CustomerEntryModal/CustomerAccountsEntry";
import CustomerBranchEntry from "../../components/CustomerEntryModal/CustomerBranchEntry";

export default function GenNewCustomerView() {
  const params = useParams();
  const methods = useForm();
  return (
    <>
      <FormProvider {...methods}>
        <div className="d-flex flex-column gap-2">
          <div className="p-2 bg-light shadow">
            <CustomerEntry CustomerID={params.CustomerID} />
          </div>
          <div className="p-2 bg-light shadow">
            <CustomerAccountEntry CustomerID={params.CustomerID} />
          </div>
          <div className="p-2 bg-light shadow">
            <CustomerBranchEntry CustomerID={params.CustomerID} />
          </div>
        </div>
      </FormProvider>
    </>
  );
}
