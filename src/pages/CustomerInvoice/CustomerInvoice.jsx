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
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  fetchAllBusinessUnitsForSelect,
  fetchAllCustomerAccountsForSelect,
  fetchAllCustomerBranchesData,
  fetchAllOldCustomersForSelect,
  fetchAllProductsForSelect,
  fetchAllServicesForSelect,
} from "../../api/SelectData";
import {
  InvoiceDataContext,
  InvoiceDataProivder,
} from "./CustomerInvoiceDataContext";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { fetchAllCustomerBranches } from "../../api/CustomerBranchData";
import { toast } from "react-toastify";

let renderCount = 0;
const apiUrl = import.meta.env.VITE_APP_API_URL;
function CustomerInvoice() {
  const { pageTitles } = useContext(AppConfigurationContext);
  document.title = "Customer Invoice";
  return (
    //<SessionInfoDataProivder>
    <TabHeader
      Search={<CustomerInvoiceSearch />}
      Entry={<CustomerInvoiceFormMaster pageTitles={pageTitles} />}
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

function CustomerInvoiceFormMaster({ pageTitles }) {
  return (
    <InvoiceDataProivder>
      <CustomerInvoiceForm pageTitles={pageTitles} />
    </InvoiceDataProivder>
  );
}

function CustomerInvoiceForm({ pageTitles }) {
  renderCount++;
  const [InvoiceType, setInvoiceType] = useState();
  const [CustomerID, setCustomerID] = useState(0);
  const [AccountID, setAccountID] = useState(0);

  const { BusinessUnitID } = useContext(InvoiceDataContext);
  const { user } = useContext(AuthContext);

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
  const invoiceHeaderForm = useForm({
    defaultValues: {
      InvoiceType: [],
      BusinessUnit: [],
      CustomerBranch: [],
      ProductInfo: [],
      ServiceInfo: [],
      Qty: 1,
      Rate: 0,
      CGS: 0,
      Discount: 0,
      Amount: 0,
      NetAmount: 0,
      DetailDescription: "",
    },
  });
  const { append, fields, remove } = useFieldArray({
    control: method.control,
    name: "detail",
  });

  const { data: customerSelectData } = useQuery({
    queryKey: ["oldcustomers"],
    queryFn: () => fetchAllOldCustomersForSelect(),
    initialData: [],
  });

  const { data: CustomerAccounts } = useQuery({
    queryKey: ["customerAccounts", CustomerID],
    queryFn: () => fetchAllCustomerAccountsForSelect(CustomerID),
    enabled: CustomerID !== 0,
    initialData: [],
  });

  const { data: businessSelectData } = useQuery({
    queryKey: ["businessUnits"],
    queryFn: () => fetchAllBusinessUnitsForSelect(),
    initialData: [],
  });
  const { data: productsInfoSelectData } = useQuery({
    queryKey: ["productsInfo", BusinessUnitID],
    queryFn: () => fetchAllProductsForSelect(BusinessUnitID),
    initialData: [],
  });
  const { data: servicesInfoSelectData } = useQuery({
    queryKey: ["servicesInfo"],
    queryFn: () => fetchAllServicesForSelect(),
    initialData: [],
  });
  const { data: customerBranchSelectData } = useQuery({
    queryKey: ["customerBranches", AccountID],
    queryFn: () => fetchAllCustomerBranchesData(AccountID),
    enabled: AccountID !== 0,
    initialData: [],
  });

  const customerInvoiceMutation = useMutation({
    mutationFn: async (formData) => {
      let InvoiceDetail = formData?.detail?.map((item) => {
        return {
          RowID: item.RowID,
          BusinessUnitID: item.BusinessUnit.BusinessUnitID,
          CustomerBranch: item.CustomerBranch.CustomerBranchID,
          ProductToInvoiceID: item.ProductInfo.ProductInfoID,
          ServiceToInvoiceID: item.ServiceInfo.ProductInfoID,
          Quantity: item.Qty,
          Rate: item.Rate,
          CGS: item.CGS,
          Amount: item.Amount,
          Discount: item.Discount,
          NetAmount: item.NetAmount,
          DetailDescription: item.DetailDescription,
        };
      });

      let DataToSend = {
        CustomerInvoiceID: 0,
        SessionID: formData?.Session?.SessionID,
        InvoiceNo: formData?.InvoiceNo,
        InvoiceDate: formData?.InvoiceDate || new Date(),
        InvoiceDueDate: formData?.DueDate || new Date(),
        InvoiceType: formData?.InvoiceType?.value,
        CustomerID: formData?.Customer?.CustomerID,
        AccountID: formData?.CustomerLedgers?.AccountID,
        InvoiceTitle: formData?.InvoiceTitle,
        Description: formData?.Description,
        EntryUserID: user.userID,
        TotalRate: formData?.Total_Rate,
        TotalCGS: formData?.Total_CGS,
        TotalDiscount: formData?.Total_Discount,
        TotalNetAmount: formData?.Total_Amount,
        InvoiceDetail: JSON.stringify(InvoiceDetail),
      };

      const { data } = await axios.post(
        apiUrl + `/CustomerInvoice/CustomerInvoiceInsertUpdate`,
        DataToSend
      );

      if (data.success === true) {
        toast.success("Invoice created successfully!");
        method.reset();
        invoiceHeaderForm.reset();
      } else {
        toast.error(data.message);
      }
    },
  });

  function onSubmit(data) {
    customerInvoiceMutation.mutate(data);
  }
  const typesOptions = [
    { label: pageTitles?.product || "Product", value: "Product" },
    { label: "Service", value: "Service" },
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
              render={({ field: { onChange, value, ref } }) => (
                <ReactSelect
                  options={typesOptions}
                  required
                  value={value}
                  ref={ref}
                  onChange={(selectedOption) => {
                    onChange(selectedOption);
                    setInvoiceType(selectedOption);
                    method.setFocus("Customer");
                    remove();
                  }}
                  placeholder="Select a type"
                  noOptionsMessage={() => "No types found!"}
                  openMenuOnFocus
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
              render={({ field: { onChange, value, ref } }) => (
                <ReactSelect
                  options={customerSelectData}
                  required
                  getOptionValue={(option) => option.CustomerID}
                  getOptionLabel={(option) => option.CustomerName}
                  value={value}
                  ref={ref}
                  onChange={(selectedOption) => {
                    onChange(selectedOption);
                    setCustomerID(selectedOption?.CustomerID);
                    method.setFocus("CustomerLedgers");
                    remove();
                  }}
                  placeholder="Select a customer"
                  noOptionsMessage={() => "No customers found!"}
                  isClearable
                  openMenuOnFocus
                />
              )}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="CustomerLedgers">
            <Form.Label>Customer Ledgers </Form.Label>
            <Controller
              control={method.control}
              name="CustomerLedgers"
              render={({ field: { onChange, value, ref } }) => (
                <ReactSelect
                  options={CustomerAccounts}
                  required
                  ref={ref}
                  getOptionValue={(option) => option.AccountID}
                  getOptionLabel={(option) => option.AccountTitle}
                  value={value}
                  onChange={(selectedOption) => {
                    onChange(selectedOption);
                    setAccountID(selectedOption?.AccountID);
                    method.setFocus("Description");
                    remove();
                  }}
                  placeholder="Select a customer"
                  noOptionsMessage={() => "No ledgers found!"}
                  isClearable
                  openMenuOnFocus
                />
              )}
            />
          </Form.Group>
        </Row>
        <Row className="p-3" style={{ marginTop: "-25px" }}>
          <Form.Group as={Col} controlId="Description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as={"textarea"}
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
        <FormProvider {...invoiceHeaderForm}>
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
        </FormProvider>
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
