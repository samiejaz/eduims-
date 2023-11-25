import React, { useEffect } from "react";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import { preventFormByEnterKeySubmission } from "../../utils/CommonFunctions";
import { Form, Row, Col, ButtonGroup, Button, Table } from "react-bootstrap";
import { CustomerAccountDataTableHeader } from "./CustomerAccountsEntryHeader";

function CustomerAccountEntry(props) {
  const { pageTitles, customerAccountsData } = props;

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "accountsDetail",
  });

  function onSubmit(data) {
    console.log(data);
  }

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
      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={preventFormByEnterKeySubmission}
      >
        <Row className="mt-2">
          <Table bordered hover size="sm" responsive>
            <thead className="rounded-2">
              <tr className="text-center rounded-2">
                {/* <th className="p-2 bg-info text-white">No</th> */}
                <th
                  className="p-2 text-white rounded-2 "
                  style={{ background: "#6366f1" }}
                >
                  Account Title
                </th>
                <th
                  className="p-2 text-white rounded-2"
                  style={{ width: "80px", background: "#6366f1" }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {fields.map((item, index) => {
                return (
                  <tr key={item.id}>
                    {/* <td className="text-center" style={{ width: "60px" }}>
                      <p className="text-center">{index + 1}</p>
                    </td> */}
                    <td>
                      <Form.Control
                        type="text"
                        required
                        className="form-control"
                        {...register(`accountsDetail.${index}.AccountTitle`)}
                      />
                    </td>
                    <td>
                      <ButtonGroup>
                        <Button variant="success" onClick={() => append(index)}>
                          +
                        </Button>
                        <Button variant="danger" onClick={() => remove(index)}>
                          -
                        </Button>
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
