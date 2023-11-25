import { Form, Row, Col, Button } from "react-bootstrap";
import { Controller, FormProvider, useForm } from "react-hook-form";
import TabHeader from "../../components/TabHeader";
import ReactSelect from "react-select";
import CustomerInvoiceDetailTable from "./CustomerInvoiceDetailTable";
import { useContext, useState } from "react";
import ReactDatePicker from "react-datepicker";
import { AppConfigurationContext } from "../../context/AppConfigurationContext";
import { DevTool } from "@hookform/devtools";
import useCustomerEntryHook from "../../hooks/useCustomerEntryHook";

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
  const { render, setVisible } = useCustomerEntryHook();

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
      CustomerBranchTitle: `Customer ${pageTitles?.branch || "Branch"} 1`,
      CustomerID: 1,
    },
    {
      CustomerBranchID: 2,
      CustomerBranchTitle: `Customer ${pageTitles?.branch || "Branch"} 2`,
      CustomerID: 2,
    },
  ];

  function onSubmit(data) {
    console.log(data);
    method.reset();
  }

  return (
    <>
      <h4 className="p-3 mb-4 bg-light text-dark text-center  shadow-sm rounded-2">
        Customer Invoice ({renderCount})
      </h4>

      <button onClick={() => setVisible(true)} className="btn btn-primary ">
        Add Customer
      </button>

      <FormProvider {...method}>
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

            <Form.Group as={Col} controlId="Customer">
              <Form.Label>Customer Name</Form.Label>
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

            <Form.Group as={Col} controlId="RefNo">
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
            </Form.Group>
          </Row>
          <Row className="p-3" style={{ marginTop: "-25px" }}>
            <Form.Group as={Col} controlId="Description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="textarea"
                {...method.register("Description")}
              />
            </Form.Group>
          </Row>
        </form>
        <Row className="p-3" style={{ marginTop: "-25px" }}>
          <CustomerInvoiceDetailTable
            customerBranchSelectData={customerBranchesData}
            pageTitles={pageTitles}
          />
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
      </FormProvider>
      <DevTool control={method.control} />

      {render}
    </>
  );
}

export default CustomerInvoice;
