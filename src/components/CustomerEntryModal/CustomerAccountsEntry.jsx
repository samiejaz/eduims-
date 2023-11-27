import { useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { preventFormByEnterKeySubmission } from "../../utils/CommonFunctions";
import { Row, ButtonGroup, Table } from "react-bootstrap";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { CustomerAccountDataTableHeader } from "./CustomerAccountsEntryHeader";

function CustomerAccountEntry(props) {
  const { pageTitles, customerAccountsData, CustomerID } = props;

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useFormContext();

  useEffect(() => {
    console.log(CustomerID);
  }, [CustomerID]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "accountsDetail",
  });

  useEffect(() => {
    if (customerAccountsData) {
      console.log(customerAccountsData);
      setValue("Account Title", customerAccountsData?.CustomerBranchTitle);
    }
  }, [customerAccountsData]);

  let isEnable = true;

  return (
    <>
      <div>
        <CustomerAccountDataTableHeader
          pageTitles={pageTitles}
          append={append}
        />
      </div>
      <form onKeyDown={preventFormByEnterKeySubmission}>
        <Row className="mt-2">
          <Table bordered hover size="sm" responsive>
            <thead className="rounded-2">
              <tr className="text-center rounded-2">
                {/* <th className="p-2 bg-info text-white">No</th> */}
                <th
                  className="p-2 text-white rounded-2 "
                  style={{ background: "#0ea5e9" }}
                >
                  Account Title
                </th>
                <th
                  className="p-2 text-white rounded-2"
                  style={{ width: "80px", background: "#0ea5e9" }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {fields.map((item, index) => {
                return (
                  <tr key={item.id}>
                    <td>
                      <InputText
                        // type="text"
                        required
                        className="form-control"
                        {...register(`accountsDetail.${index}.AccountTitle`)}
                      />
                    </td>
                    <td>
                      <ButtonGroup>
                        <Button
                          icon="pi pi-plus"
                          className="rounded-2 py-2"
                          severity="success"
                          aria-label="Cancel"
                          onClick={() => append(index)}
                        />
                        <Button
                          icon="pi pi-times"
                          className="rounded-2 py-2"
                          severity="danger"
                          aria-label="Cancel"
                          onClick={() => remove(index)}
                        />
                      </ButtonGroup>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Row>
      </form>
    </>
  );
}

export default CustomerAccountEntry;
