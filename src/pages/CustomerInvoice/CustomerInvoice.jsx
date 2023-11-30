import { Form, Row, Col, Button } from "react-bootstrap";
import { Button as PrimeButton } from "primereact/button";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import TabHeader from "../../components/TabHeader";
import ReactSelect from "react-select";
import CustomerInvoiceDetailTable from "./CustomerInvoiceDetailTable";
import { useContext, useState } from "react";
import ReactDatePicker from "react-datepicker";
import { AppConfigurationContext } from "../../context/AppConfigurationContext";
import { DevTool } from "@hookform/devtools";
import useCustomerEntryHook from "../../hooks/useCustomerEntryHook";
import { CustomerEntryForm } from "../../components/CustomerEntryFormComponent";
import CustomerInvoiceHeader from "./CustomerInvoiceHeader";

let renderCount = 0;
function CustomerInvoice() {
  const { pageTitles } = useContext(AppConfigurationContext);
  document.title = "Customer Invoice";
  return (
    //<SessionInfoDataProivder>
    <TabHeader
      Search={<CustomerInvoiceSearch />}
      Entry={<CustomerInvoiceForm pageTitles={pageTitles} />}
      SearchTitle={"Customer Invoice Search"}
      EntryTitle={"Add New Customer Invoice"}
    />
    // </SessionInfoDataProivder>
  );
}

/*
  Pending

  1) Add validation to each cell in datatable
  



*/

function CustomerInvoiceSearch() {}

function CustomerInvoiceForm({ pageTitles }) {
  renderCount++;
  const [customerBranchesData, setCustomerBranchesData] = useState([]);
  const [InvoiceType, setInvoiceType] = useState();

  const sessionSelectData = [
    {
      SessionID: 1,
      SessionTitle: "Session 1",
    },
    {
      SessionID: 2,
      SessionTitle: "Session 2",
    },
  ];
  const method = useForm({
    defaultValues: {
      Session: sessionSelectData[0],
      InvoiceNo: 1,
      Customer: [],
      RefNo: null,
      Description: "",
      Total_Rate: 0,
      Total_CGS: 0,
      Total_Discount: 0,
      Total_Amount: 0,
      detail: [],
    },
  });
  const { append, fields, remove } = useFieldArray({
    control: method.control,
    name: "detail",
  });

  const customerSelectData = [
    {
      CustomerID: 1,
      CustomerName: "Customer 1",
    },
    {
      CustomerID: 2,
      CustomerName: "Customer 2",
    },
  ];

  const customerBranchSelectData = [
    {
      CustomerBranchID: 1,
      CustomerBranchTitle: `${pageTitles?.branch || "Customer Branch"} 1`,
      CustomerID: 1,
    },
    {
      CustomerBranchID: 2,
      CustomerBranchTitle: `${pageTitles?.branch || "Customer Branch"} 2`,
      CustomerID: 2,
    },
  ];

  function onSubmit(data) {
    console.log(data);
    method.reset();
  }
  const typesOptions = [
    { label: pageTitles?.product || "Product", value: "Product" },
    { label: "Service", value: "Service" },
  ];

  const businessSelectData = [
    {
      BusinessUnitID: 1,
      BusinessUnitName: "Business Unit 1",
    },
    {
      BusinessUnitID: 2,
      BusinessUnitName: "Business Unit 2",
    },
  ];

  const productsInfoSelectData = [
    {
      ProductInfoID: 1,
      ProductInfoTitle: `${pageTitles?.product || "Product"} 1`,
      BusinessUnitID: 1,
    },
    {
      ProductInfoID: 2,
      ProductInfoTitle: `${pageTitles?.product || "Product"} 2`,
      BusinessUnitID: 2,
    },
    {
      ProductInfoID: 3,
      ProductInfoTitle: `${pageTitles?.product || "Product"} 3`,
      BusinessUnitID: 1,
    },
    {
      ProductInfoID: 4,
      ProductInfoTitle: `${pageTitles?.product || "Product"} 4`,
      BusinessUnitID: 2,
    },
  ];

  const servicesInfoSelectData = [
    {
      ServiceInfoID: 1,
      ServiceInfoTitle: `Service 1`,
      BusinessUnitID: 1,
    },
    {
      ServiceInfoID: 2,
      ServiceInfoTitle: `Service 2`,
      BusinessUnitID: 2,
    },
    {
      ServiceInfoID: 3,
      ServiceInfoTitle: `Service 3`,
      BusinessUnitID: 1,
    },
    {
      ServiceInfoID: 4,
      ServiceInfoTitle: `Service 4`,
      BusinessUnitID: 2,
    },
  ];

  return (
    <>
      <h4 className="p-3 mb-4 bg-light text-dark text-center  shadow-sm rounded-2">
        Customer Invoice ({renderCount})
      </h4>

      {/* <CustomerEntryForm /> */}

      <form onSubmit={method.handleSubmit(onSubmit)} id="parenForm">
        <Row className="p-3" style={{ marginTop: "-25px" }}>
          <Form.Group as={Col} controlId="Session">
            <Form.Label>Session</Form.Label>
            <Controller
              control={method.control}
              name="Session"
              render={({ field: { onChange, value } }) => (
                <ReactSelect
                  defaultValue={sessionSelectData[0]}
                  options={sessionSelectData}
                  getOptionValue={(option) => option.SessionID}
                  getOptionLabel={(option) => option.SessionTitle}
                  value={value}
                  onChange={(selectedOption) => onChange(selectedOption)}
                  placeholder="Select a session"
                  noOptionsMessage={() => "No session found!"}
                />
              )}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="InvoiceNo">
            <Form.Label>Invoice No</Form.Label>
            <Form.Control
              type="number"
              value={1}
              {...method.register("InvoiceNo")}
              disabled
              required
            />
          </Form.Group>
          <Form.Group as={Col} controlId="">
            <Form.Label>Invoice Date</Form.Label>
            <div>
              <Controller
                control={method.control}
                name="InoviceDate"
                render={({ field }) => (
                  <ReactDatePicker
                    placeholderText="Select date"
                    onChange={(date) => field.onChange(date)}
                    selected={field.value || new Date()}
                    dateFormat={"dd-MMM-yyyy"}
                    className="binput"
                  />
                )}
              />
            </div>
          </Form.Group>

          <Form.Group as={Col} controlId="DueDate">
            <Form.Label>DueDate</Form.Label>
            <div>
              <Controller
                control={method.control}
                name="DueDate"
                render={({ field }) => (
                  <ReactDatePicker
                    placeholderText="Select due date"
                    onChange={(date) => field.onChange(date)}
                    selected={field.value || new Date()}
                    dateFormat={"dd-MMM-yyyy"}
                    className="binput"
                  />
                )}
              />
            </div>
          </Form.Group>
        </Row>
        <Row className="p-3" style={{ marginTop: "-25px" }}>
          <Form.Group as={Col} controlId="InvoiceTitle">
            <Form.Label>Invoice Title</Form.Label>
            <span className="text-danger fw-bold ">*</span>
            <Form.Control
              type="text"
              {...method.register("InvoiceTitle", {
                required: "Please enter the title!",
              })}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="InvoiceType">
            <Form.Label>Invoice Type</Form.Label>
            <span className="text-danger fw-bold ">*</span>
            <Controller
              control={method.control}
              name="InvoiceType"
              rules={{ required: "Please select a type!" }}
              render={({ field: { onChange, value } }) => (
                <ReactSelect
                  options={typesOptions}
                  value={value}
                  onChange={(selectedOption) => {
                    onChange(selectedOption);
                    setInvoiceType(selectedOption);
                  }}
                  placeholder="Select a type"
                  noOptionsMessage={() => "No types found!"}
                />
              )}
            />
            <span className="text-danger">{method?.errors?.Type?.message}</span>
          </Form.Group>

          <Form.Group as={Col} controlId="Customer">
            <Form.Label>
              Customer Name
              <CustomerEntryForm IconButton={true} />
            </Form.Label>
            <Controller
              control={method.control}
              name="Customer"
              render={({ field: { onChange, value } }) => (
                <ReactSelect
                  options={customerSelectData}
                  getOptionValue={(option) => option.CustomerID}
                  getOptionLabel={(option) => option.CustomerName}
                  value={value}
                  onChange={(selectedOption) => {
                    onChange(selectedOption);
                    let filteredBranches = customerBranchSelectData.filter(
                      (b) => b.CustomerID === selectedOption?.CustomerID
                    );
                    setCustomerBranchesData(filteredBranches);
                  }}
                  placeholder="Select a customer"
                  noOptionsMessage={() => "No customers found!"}
                  isClearable
                />
              )}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="CustomerLedgers">
            <Form.Label>Customer Ledgers </Form.Label>
            <Controller
              control={method.control}
              name="CustomerLedgers"
              render={({ field: { onChange, value } }) => (
                <ReactSelect
                  options={customerSelectData}
                  getOptionValue={(option) => option.CustomerID}
                  getOptionLabel={(option) => option.CustomerName}
                  value={value}
                  onChange={(selectedOption) => {
                    onChange(selectedOption);
                    let filteredBranches = customerBranchSelectData.filter(
                      (b) => b.CustomerID === selectedOption?.CustomerID
                    );
                    setCustomerBranchesData(filteredBranches);
                  }}
                  placeholder="Select a customer"
                  noOptionsMessage={() => "No customers found!"}
                  isClearable
                />
              )}
            />
          </Form.Group>
        </Row>
        <Row className="p-3" style={{ marginTop: "-25px" }}>
          {/* <Form.Group as={Col} controlId="RefNo">
              <Form.Label>Ref No</Form.Label>
              <Form.Control
                type="text"
                {...method.register("RefNo")}
                pattern="^[0-9]*$"
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                }}
                required
              />
            </Form.Group> */}
          <Form.Group as={Col} controlId="Description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as={"textarea"}
              required
              rows={2}
              className="form-control"
              {...method.register("Description")}
            />
          </Form.Group>
        </Row>
      </form>
      <div
        style={{
          padding: "1rem",
          borderRadius: "6px",
        }}
        className="bg-light shadow-sm"
      >
        <h5 className="p-3 mb-4 bg-light text-dark text-center  ">
          Detail Entry
        </h5>
        <CustomerInvoiceHeader
          businessSelectData={businessSelectData}
          productsInfoSelectData={productsInfoSelectData}
          servicesInfoSelectData={servicesInfoSelectData}
          customerBranchSelectData={customerBranchSelectData}
          append={append}
          fields={fields}
          pageTitles={pageTitles}
          InvoiceType={InvoiceType}
        />
      </div>

      <Row className="p-3" style={{ marginTop: "-25px" }}>
        <FormProvider {...method}>
          <CustomerInvoiceDetailTable
            businessSelectData={businessSelectData}
            productsInfoSelectData={productsInfoSelectData}
            servicesInfoSelectData={servicesInfoSelectData}
            customerBranchSelectData={customerBranchSelectData}
            pageTitles={pageTitles}
            fields={fields}
            append={append}
            remove={remove}
          />
        </FormProvider>
      </Row>

      <Row className="p-3" style={{ marginTop: "-25px" }}>
        <div style={{ textAlign: "end" }}>
          <Button
            variant="success"
            style={{ width: "20%" }}
            type="submit"
            form="parenForm"
          >
            Save
          </Button>
        </div>
      </Row>

      <DevTool control={method.control} />
    </>
  );
}

export default CustomerInvoice;
