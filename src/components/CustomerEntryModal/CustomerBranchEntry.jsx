import React, { createContext, useContext, useEffect, useState } from "react";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { preventFormByEnterKeySubmission } from "../../utils/CommonFunctions";
import { Form, Row, Col, ButtonGroup, Table } from "react-bootstrap";
import { Button } from "primereact/button";
import { useQuery } from "@tanstack/react-query";
import Select from "react-select";
import axios from "axios";
import { toast } from "react-toastify";

const BranchEntryContext = createContext();

const BranchEntryProiver = ({ children }) => {
  const [createdBranchID, setCreatedBranchID] = useState(0);
  return (
    <BranchEntryContext.Provider
      value={{ createdBranchID, setCreatedBranchID }}
    >
      {children}
    </BranchEntryContext.Provider>
  );
};

function CustomerBranchEntry() {
  return (
    <>
      <BranchEntryProiver>
        <CustomerBranchEntryHeader />
        <CustomerBranchDetailTable />
      </BranchEntryProiver>
    </>
  );
}

export default CustomerBranchEntry;

function CustomerBranchEntryHeader() {
  const { setCreatedBranchID } = useContext(BranchEntryContext);
  let CustomerID = 0;
  let pageTitles = {};
  const { register, control, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      CustomerBranchTitle: "",
      BranchAddress: "",
      ContactPersonName: "",
      ContactPersonNo: "",
      ContactPersonEmail: "",
      Description: "",
      InActive: false,
      CreateNewAccount: false,
      CustomerAccounts: [],
    },
  });

  function onSubmit(data) {
    console.log(data);
    setCreatedBranchID(1);
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
                  // required
                  isDisabled={watch("CreateNewAccount")}
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

        <Row className="mt-2 mb-2">
          <ButtonGroup className="gap-2">
            <Button
              label="Add"
              className="rounded text-center"
              severity="success"
            />
            <Button
              label="Clear"
              className="rounded text-center"
              severity="danger"
              type="button"
              onClick={() => reset()}
            />
          </ButtonGroup>
        </Row>
      </form>
    </>
  );
}

function CustomerBranchDetailTable() {
  console.log("branch entry detail");
  const { createdBranchID, setCreatedBranchID } =
    useContext(BranchEntryContext);
  console.log(createdBranchID);

  const methods = useForm();
  const { fields, append, remove } = useFieldArray({
    name: "branchDetail",
  });

  useEffect(() => {
    if (createdBranchID !== 0) {
      append({
        RowID: 1,
        CustomerBranchTitle: "Title",
      });
    }

    return () => {
      setCreatedBranchID(0);
    };
  }, [createdBranchID]);
  // const { data } = useQuery({
  //   queryKey: "branchDetailEntry",
  //   queryFn: () => {
  //     let data = ["repoData"];
  //     return data;
  //   },
  //   enabled: createdBranchID !== 0,
  //   initialData: [],
  // });

  // console.log(data);

  return (
    <>
      <FormProvider {...methods}>
        <form>
          <Table>
            <thead>
              <tr>
                <th>No.</th>
                <th>Branch Title</th>
                <th>Customer Accounts</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => {
                return (
                  <tr key={field.id}>
                    <CustomerBranchDetailTableRow
                      field={field}
                      remove={remove}
                      index={index}
                    />
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </form>
      </FormProvider>
    </>
  );
}
function CustomerBranchDetailTableRow(props) {
  const { register } = useFormContext();
  const { remove, index } = props;

  return (
    <>
      <td>
        <input
          type="text"
          disabled
          {...register(`branchDetail.${index}.RowID`)}
        />
      </td>
      <td>
        <Form.Control {...register(`branchDetail.${index}.BranchTitle`)} />
      </td>
      <td>
        {/* <Controller
          control={control}
          name={`branchDetail.${index}.CustomerAccounts`}
          render={({ field: { onChange, value } }) => (
            <Select
              required
              isDisabled={watch("CreateNewAccount")}
              options={CustomerAccounts}
              getOptionValue={(option) => option.AccountID}
              getOptionLabel={(option) => option.AccountTitle}
              value={value}
              onChange={(selectedOption) => onChange(selectedOption)}
              placeholder="Select an account"
              noOptionsMessage={() => "No accounts found!"}
              isClearable
              isMulti
            />
          )}
        /> */}
      </td>
      <td>
        <ButtonGroup>
          <Button
            icon="pi pi-plus"
            className="rounded-2 py-2"
            severity="success"
            aria-label="Cancel"
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
    </>
  );
}
