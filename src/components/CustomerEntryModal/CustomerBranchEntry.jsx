import React, { useEffect, useState } from "react";
import {
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { preventFormByEnterKeySubmission } from "../../utils/CommonFunctions";
import { Form, Row, Col } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import Select from "react-select";
import axios from "axios";
import { toast } from "react-toastify";

function CustomerBranchEntry(props) {
  console.log("Branch Re-rendered");
  const { pageTitles, customerBranchData, CustomerID } = props;
  // let CustomerID;
  // let pageTitles;
  // let customerBranchData;

  React.useEffect(() => {
    console.log("anObject changed");
  }, [pageTitles]);

  React.useEffect(() => {
    console.log("aFn changed");
  }, [customerBranchData]);

  React.useEffect(() => {
    console.log("aValue changed");
  }, [CustomerID]);

  const { register, control, handleSubmit, setValue, watch } = useFormContext();

  function onSubmit(data) {
    console.log(data);
  }

  const { data: CustomerAccounts } = useQuery({
    queryKey: ["customerAccounts", CustomerID],
    queryFn: async () => {
      let { data } = await axios.get(
        "http://localhost:3000/getAccounts?CustomerID=" + CustomerID
      );
      if (data.success === true) {
        toast.success("Accounts Populated!");
        return data.data;
      }
    },
    enabled: CustomerID !== 0,
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

  const { fields } = useFieldArray({
    control,
    name: "branchesDetail",
  });

  let checkBox = useWatch({
    control,
    name: "CreateNewAccount",
  });

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
            <Form.Label>{pageTitles?.branch || "CustomerAccounts"}</Form.Label>
            <span className="text-danger fw-bold ">*</span>
            <Controller
              control={control}
              name="CustomerAccounts"
              render={({ field: { onChange, value } }) => (
                <Select
                  required
                  // isDisabled={watch("CreateNewAccount")}
                  isDisabled={!checkBox}
                  options={CustomerAccounts}
                  getOptionValue={(option) => option.AccountID}
                  getOptionLabel={(option) => option.AccountTitle}
                  value={value}
                  onChange={(selectedOption) => onChange(selectedOption)}
                  placeholder="Select a customer"
                  noOptionsMessage={() => "No customers found!"}
                  isClearable
                  isMulti
                />
              )}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="CreateNewAccount">
            <Form.Label></Form.Label>
            {/* <div className="form-control" style={{ marginTop: "5px" }}>
          </div> */}
            <Controller
              control={control}
              name="CreateNewAccount"
              render={({ field: { onChange, value } }) => (
                <Form.Check
                  aria-label="CreateNewAccount"
                  label="Create New Account"
                  value={value}
                  onChange={(v) => onChange(v)}
                />
              )}
            />
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

export default React.memo(CustomerBranchEntry);
