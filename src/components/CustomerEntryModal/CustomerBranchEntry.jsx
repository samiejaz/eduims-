import React, { useEffect } from "react";
import { Controller, useForm, useFormContext } from "react-hook-form";
import { preventFormByEnterKeySubmission } from "../../utils/CommonFunctions";
import { Form, Row, Col } from "react-bootstrap";
import { fetchAllOldCustomersForSelect } from "../../api/SelectData";
import { useQuery } from "@tanstack/react-query";
import Select from "react-select";

function CustomerBranchEntry(props) {
  const { pageTitles, customerBranchData } = props;

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  function onSubmit(data) {
    console.log(data);
  }

  const { data } = useQuery({
    queryKey: ["oldcustomers"],
    queryFn: () => fetchAllOldCustomersForSelect(),
    initialData: [],
  });

  useEffect(() => {
    if (customerBranchData) {
      console.log(customerBranchData);
      if (customerBranchData?.Customers?.CustomerID !== 0) {
        setValue("Customers", {
          CustomerID: customerBranchData?.Customers?.CustomerID,
          CustomerName: customerBranchData?.Customers?.CustomerName,
        });
      }
      setValue("CustomerBranchTitle", customerBranchData?.CustomerBranchTitle);
      setValue("BranchAddress", customerBranchData?.BranchAddress);
      setValue("ContactPersonName", customerBranchData?.ContactPersonName);
      setValue("ContactPersonNo", customerBranchData?.ContactPersonNo);
      setValue("ContactPersonEmail", customerBranchData?.ContactPersonEmail);
      setValue("Description", customerBranchData?.Description);

      setValue("InActive", customerBranchData?.InActive);
    }
  }, [customerBranchData]);

  let isEnable = true;

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={preventFormByEnterKeySubmission}
      >
        <Row>
          <Form.Group as={Col} controlId="CustomerBranchTitle">
            <Form.Label>
              Customer {pageTitles?.branch || "Branch"} Title
            </Form.Label>
            <span className="text-danger fw-bold ">*</span>
            <Form.Control
              type="text"
              placeholder=""
              required
              className="form-control"
              {...register("CustomerBranchTitle", {
                // disabled: !isEnable,
              })}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="Customers">
            <Form.Label>{pageTitles?.branch || "Accounts"}</Form.Label>
            <span className="text-danger fw-bold ">*</span>
            <Controller
              control={control}
              name="Customers"
              render={({ field: { onChange, value } }) => (
                <Select
                  required
                  isDisabled={watch("CreateNewAccount")}
                  options={data}
                  getOptionValue={(option) => option.CustomerID}
                  getOptionLabel={(option) => option.CustomerName}
                  value={value}
                  onChange={(selectedOption) => onChange(selectedOption)}
                  placeholder="Select a customer"
                  noOptionsMessage={() => "No customers found!"}
                  isClearable
                />
              )}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="CreateNewAccount">
            <Form.Label></Form.Label>
            <div className="form-control" style={{ marginTop: "5px" }}>
              <Form.Check
                aria-label="CreateNewAccount"
                label="Create New Account"
                {...register("CreateNewAccount", {
                  // disabled: !isEnable,
                })}
              />
            </div>
          </Form.Group>
        </Row>

        <Row>
          <Form.Group controlId="BranchAddress">
            <Form.Label>
              Customer {pageTitles?.branch || "Branch"} Address
            </Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              {...register("BranchAddress", {
                // disabled: !isEnable,
              })}
            />
          </Form.Group>
        </Row>

        <Row>
          <Form.Group as={Col} controlId="ContactPersonName">
            <Form.Label>Contact Person Name</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              {...register("ContactPersonName", {
                // disabled: !isEnable,
              })}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="ContactPersonNo">
            <Form.Label>Contact Person No</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              {...register("ContactPersonNo", {
                // disabled: !isEnable,
              })}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="ContactPersonEmail">
            <Form.Label>Contact Person Email</Form.Label>
            <Form.Control
              type="email"
              placeholder=""
              {...register("ContactPersonEmail", {
                // disabled: !isEnable,
              })}
            />
          </Form.Group>
        </Row>

        <Row>
          <Form.Group as={Col} controlId="Description">
            <Form.Label>Descripiton</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              name="email"
              {...register("Description", {
                // disabled: !isEnable,
              })}
            />
          </Form.Group>
        </Row>

        <Row>
          <Form.Group as={Col} controlId="InActive" className="mt-2">
            <Form.Check
              aria-label="InActive"
              label="InActive"
              {...register("InActive", {
                // disabled: !isEnable,
              })}
            />
          </Form.Group>
        </Row>
      </form>
    </>
  );
}

export default CustomerBranchEntry;
