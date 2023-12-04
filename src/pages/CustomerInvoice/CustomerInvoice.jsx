import { Form, Row, Col, Spinner } from "react-bootstrap";

import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import TabHeader from "../../components/TabHeader";
import ReactSelect from "react-select";
import CustomerInvoiceDetailTable from "./CustomerInvoiceDetailTable";
import { useContext, useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import { AppConfigurationContext } from "../../context/AppConfigurationContext";
import { DevTool } from "@hookform/devtools";

import { CustomerEntryForm } from "../../components/CustomerEntryFormComponent";
import CustomerInvoiceHeader from "./CustomerInvoiceHeader";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllBusinessUnitsForSelect,
  fetchAllCustomerAccountsForSelect,
  fetchAllCustomerBranchesData,
  fetchAllOldCustomersForSelect,
  fetchAllProductsForSelect,
  fetchAllServicesForSelect,
  fetchAllSessionsForSelect,
} from "../../api/SelectData";
import {
  CustomerInvoiceDataContext,
  CustomerInvoiceDataProivder,
  InvoiceDataContext,
  InvoiceDataProivder,
} from "./CustomerInvoiceDataContext";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

import { toast } from "react-toastify";
import { ActiveKeyContext } from "../../context/ActiveKeyContext";
import useEditModal from "../../hooks/useEditModalHook";
import useDeleteModal from "../../hooks/useDeleteModalHook";
import {
  fetchAllCustomerInvoices,
  fetchCustomerInvoiceById,
  fetchMaxInvoiceNo,
} from "../../api/CustomerInvoiceData";
import { FilterMatchMode } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import ActionButtons from "../../components/ActionButtons";
import { parseISO } from "date-fns";
import { CustomSpinner } from "../../components/CustomSpinner";
import ButtonRow from "../../components/ButtonRow";
import { Button } from "primereact/button";

const apiUrl = import.meta.env.VITE_APP_API_URL;
function CustomerInvoice() {
  const { pageTitles } = useContext(AppConfigurationContext);
  document.title = "Customer Invoice";
  return (
    <CustomerInvoiceDataProivder>
      <TabHeader
        Search={<CustomerInvoiceSearch />}
        Entry={<CustomerInvoiceFormMaster pageTitles={pageTitles} />}
        SearchTitle={"Customer Invoice Search"}
        EntryTitle={"Add New Customer Invoice"}
      />
    </CustomerInvoiceDataProivder>
    // </SessionInfoDataProivder>
  );
}

/*
  Pending

  1) Add validation to each cell in datatable
  



*/

function CustomerInvoiceSearch() {
  const queryClient = useQueryClient();

  const { user } = useContext(AuthContext);
  const { setKey } = useContext(ActiveKeyContext);

  const [filters, setFilters] = useState({
    InvoiceTitle: {
      value: null,
      matchMode: FilterMatchMode.CONTAINS,
    },
    InvoiceNo: {
      value: null,
      matchMode: FilterMatchMode.CONTAINS,
    },
    CustomerName: {
      value: null,
      matchMode: FilterMatchMode.CONTAINS,
    },
    AccountTitle: {
      value: null,
      matchMode: FilterMatchMode.CONTAINS,
    },
    TotalNetAmount: {
      value: null,
      matchMode: FilterMatchMode.CONTAINS,
    },
  });

  const {
    render: EditModal,
    handleShow: handleEditShow,
    handleClose: handleEditClose,
    setIdToEdit,
  } = useEditModal(handleEdit);

  const {
    render: DeleteModal,
    handleShow: handleDeleteShow,
    handleClose: handleDeleteClose,
    setIdToDelete,
  } = useDeleteModal(handleDelete);

  const { setIsEnable, setCustomerInvoiceID } = useContext(
    CustomerInvoiceDataContext
  );

  const {
    data: CustomerInvoices,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["customerInvoices"],
    queryFn: () => fetchAllCustomerInvoices(user.userID),
    initialData: [],
  });

  const deleteMutation = useMutation({
    // mutationFn: deleteInvoiceDeafultDescriptionsByID,
    // onSuccess: (data) => {
    //   if (data === true) {
    //     queryClient.invalidateQueries({
    //       queryKey: ["invoiceDefaultDescriptions"],
    //     });
    //   }
    // },
  });

  function handleEdit(CustomerInvoiceID) {
    setCustomerInvoiceID(CustomerInvoiceID);
    setIsEnable(true);
    setKey("entry");
    handleEditClose();
    setIdToEdit(0);
  }
  function handleDelete(CustomerInvoiceID) {
    deleteMutation.mutate({
      CustomerInvoiceID,
      LoginUserID: user.userID,
    });
    handleDeleteClose();
    setIdToDelete(0);
    setCustomerInvoiceID(null);
  }
  function handleView(CustomerInvoiceID) {
    setKey("entry");
    setCustomerInvoiceID(CustomerInvoiceID);
    setIsEnable(false);
  }

  return (
    <>
      {isFetching || isLoading ? (
        <>
          <div className="d-flex align-content-center justify-content-center h-100 w-100 m-auto">
            <Spinner
              animation="border"
              size="lg"
              role="status"
              aria-hidden="true"
            />
          </div>
        </>
      ) : (
        <>
          <DataTable
            showGridlines
            value={CustomerInvoices}
            dataKey="CustomerInvoiceID"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            removableSort
            emptyMessage="No invoices found!"
            filters={filters}
            filterDisplay="row"
            resizableColumns
            size="small"
            selectionMode="single"
            tableStyle={{ minWidth: "50rem" }}
          >
            <Column
              body={(rowData) =>
                ActionButtons(
                  rowData.CustomerInvoiceID,
                  handleDeleteShow,
                  handleEditShow,
                  handleView
                )
              }
              header="Actions"
              resizeable={false}
              style={{ minWidth: "7rem", maxWidth: "7rem", width: "7rem" }}
            ></Column>
            <Column
              field="InvoiceNo"
              filter
              filterPlaceholder="Search by invoice no"
              sortable
              header="Invoice No"
            ></Column>
            <Column
              field="InvoiceTitle"
              filter
              filterPlaceholder="Search by invoice title"
              sortable
              header="Invoice Title"
            ></Column>
            <Column
              field="CustomerName"
              filter
              filterPlaceholder="Search by customer name"
              sortable
              header="Customer Name"
            ></Column>
            <Column
              field="AccountTitle"
              filter
              filterPlaceholder="Search by customer ledger"
              sortable
              header="Ledger"
            ></Column>
            <Column field="EntryDate" sortable header="Entry Date"></Column>
            <Column
              field="TotalNetAmount"
              filter
              filterPlaceholder="Search by customer ledger"
              sortable
              header="Total Net Amount"
            ></Column>
          </DataTable>
          {EditModal}
          {DeleteModal}
        </>
      )}
    </>
  );
}

function CustomerInvoiceFormMaster({ pageTitles }) {
  return (
    <InvoiceDataProivder>
      <CustomerInvoiceForm pageTitles={pageTitles} />
    </InvoiceDataProivder>
  );
}

function CustomerInvoiceForm({ pageTitles }) {
  const queryClient = useQueryClient();
  const [InvoiceType, setInvoiceType] = useState();
  const [CustomerID, setCustomerID] = useState(0);
  const [AccountID, setAccountID] = useState(0);
  const [CustomerInvoice, setCustomerInvoice] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [printLoading, setPrintLoading] = useState(false);
  const { BusinessUnitID } = useContext(InvoiceDataContext);
  const { user } = useContext(AuthContext);
  const { setKey } = useContext(ActiveKeyContext);

  const { isEnable, setIsEnable, setCustomerInvoiceID, CustomerInvoiceID } =
    useContext(CustomerInvoiceDataContext);

  const { data: sessionSelectData } = useQuery({
    queryKey: ["sessionsData"],
    queryFn: () => fetchAllSessionsForSelect(),
    initialData: [],
  });

  useEffect(() => {
    async function fetchCustomerInvoice() {
      if (
        CustomerInvoiceID !== undefined &&
        CustomerInvoiceID !== null &&
        CustomerInvoiceID !== 0
      ) {
        setIsLoading(true);
        const data = await fetchCustomerInvoiceById(
          CustomerInvoiceID,
          user.userID
        );
        if (!data) {
          setKey("search");
          toast.error("Network Error Occured!");
        }

        if (data.success === true) {
          setCustomerInvoice(data);
          setIsLoading(false);
          setAccountID(data?.Master[0].AccountID);
          setCustomerID(data?.Master[0].CustomerID);
          if (data?.Master[0].InvoiceType === "Product") {
            setInvoiceType({ label: "Product", value: "Product" });
          }
        } else {
          method.reset();
          setCustomerInvoice([]);
          toast.error("No Data Found!", {
            autoClose: 1500,
          });
          setIsEnable(true);
          setKey("search");
        }
      } else {
        setCustomerInvoice([]);
        setTimeout(() => {
          method.reset();
          setIsEnable(true);
        }, 200);
      }
    }
    async function fetchInvoiceNo() {
      const data = await fetchMaxInvoiceNo();
      method.setValue("InvoiceNo", data.data[0]?.InvoiceNo);
    }
    if (CustomerInvoiceID !== 0) {
      fetchCustomerInvoice();
    } else {
      fetchInvoiceNo();
    }
  }, [CustomerInvoiceID]);

  // const sessionSelectData = [
  //   {
  //     SessionID: 1,
  //     SessionTitle: "Session 1",
  //   },
  //   {
  //     SessionID: 2,
  //     SessionTitle: "Session 2",
  //   },
  // ];

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
  const method = useForm({
    defaultValues: {
      Session: {
        SessionID: sessionSelectData[0]?.SessionID,
        SessionTitle: sessionSelectData[0]?.SessionTitle,
      },
      InvoiceNo: 1,
      Customer: [],
      InvoiceType: [],
      CustomerLedgers: [],
      Description: "",
      Total_Rate: 0,
      Total_CGS: 0,
      Total_Discount: 0,
      Total_Amount: 0,
      InvoiceTitle: "",
      detail: [],
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
      if (formData?.detail.length === 0) {
        toast.error("Please add atleast 1 item!", {
          position: "top-left",
        });
      } else {
        let InvoiceDetail = formData?.detail?.map((item, index) => {
          return {
            RowID: index + 1,
            BusinessUnitID: item.BusinessUnit.BusinessUnitID,
            CustomerBranch: item.CustomerBranch.CustomerBranchID,
            ProductToInvoiceID: item.ProductInfo.ProductInfoID,
            ServiceToInvoiceID:
              item.ServiceInfo.length === 0
                ? null
                : item.ServiceInfo.ProductInfoID,
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
          SessionID:
            formData?.Session?.SessionID || sessionSelectData[0]?.SessionID,
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

        if (
          CustomerInvoice?.length !== 0 &&
          CustomerInvoice?.Master[0]?.CustomerInvoiceID !== undefined
        ) {
          DataToSend.CustomerInvoiceID =
            CustomerInvoice?.Master[0]?.CustomerInvoiceID;
        } else {
          DataToSend.CustomerInvoiceID = 0;
        }

        const { data } = await axios.post(
          apiUrl + `/CustomerInvoice/CustomerInvoiceInsertUpdate`,
          DataToSend
        );

        if (data.success === true) {
          setCustomerInvoiceID(0);
          setCustomerInvoice([]);
          method.reset();
          invoiceHeaderForm.reset();
          setKey("search");
          queryClient.invalidateQueries({ queryKey: ["customerInvoices"] });
          if (CustomerInvoice?.Master[0]?.CustomerInvoiceID !== undefined) {
            toast.success("Invoice updated successfully!");
          } else {
            toast.success("Invoice created successfully!");
          }
        } else {
          toast.error(data.message);
        }
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

  useEffect(() => {
    if (CustomerInvoiceID !== 0 && CustomerInvoice?.Master) {
      // Master Values
      method.setValue("InvoiceTitle", CustomerInvoice?.Master[0]?.InvoiceTitle);
      method.setValue("InvoiceNo", CustomerInvoice?.Master[0]?.InvoiceNo);
      method.setValue("InvoiceType", {
        label:
          CustomerInvoice?.Master[0]?.InvoiceType === "Product"
            ? pageTitles?.product
            : CustomerInvoice?.Master[0]?.InvoiceType,
        value: CustomerInvoice?.Master[0]?.InvoiceType,
      });
      method.setValue("Customer", {
        CustomerID: CustomerInvoice?.Master[0]?.CustomerID,
        CustomerName: CustomerInvoice?.Master[0]?.CustomerName,
      });
      method.setValue("Session", {
        SessionID: CustomerInvoice?.Master[0]?.SessionID,
        SessionTitle: CustomerInvoice?.Master[0]?.SessionTitle,
      });
      method.setValue("CustomerLedgers", {
        AccountID: CustomerInvoice?.Master[0]?.AccountID,
        AccountTitle: CustomerInvoice?.Master[0]?.AccountTitle,
      });
      method.setValue("Description", CustomerInvoice?.Master[0]?.Description);
      method.setValue(
        "InoviceDate",
        parseISO(CustomerInvoice?.Master[0]?.InvoiceDate)
      );
      method.setValue(
        "DueDate",
        parseISO(CustomerInvoice?.Master[0]?.InvoiceDueDate)
      );
      method.setValue(
        "Total_Amount",
        CustomerInvoice?.Master[0]?.TotalNetAmount
      );
      method.setValue("Total_CGS", CustomerInvoice?.Master[0]?.TotalCGS);
      method.setValue(
        "Total_Discount",
        CustomerInvoice?.Master[0]?.TotalDiscount
      );
      method.setValue("Total_Rate", CustomerInvoice?.Master[0]?.TotalRate);

      // Detail Values
      method.setValue(
        "detail",
        CustomerInvoice?.Detail.map((invoice, index) => {
          filteredProductsBasedOnRow(invoice.BusinessUnitID, index);
          return {
            ProductInfo: {
              ProductInfoID: invoice.ProductToInvoiceID,
              ProductInfoTitle: invoice.ProductTitle,
            },
            ServiceInfo: {
              ProductInfoID: invoice.ServiceToInvoiceID,
              ProductInfoTitle: invoice.ServiceTitle,
            },
            CustomerBranch: {
              CustomerBranchID: invoice.CustomerBranchID,
              CustomerBranchTitle: invoice.CustomerBranchTitle,
            },
            BusinessUnit: {
              BusinessUnitID: invoice.BusinessUnitID,
              BusinessUnitName: invoice.BusinessUnitName,
            },
            Qty: invoice.Quantity,
            ...invoice,
          };
        })
      );
    }
  }, [CustomerInvoiceID, CustomerInvoice]);
  async function filteredProductsBasedOnRow(SelectedBusinessUnitID, index) {
    const data = await fetchAllProductsForSelect(SelectedBusinessUnitID);
    method.setValue(`detail.${index}.products`, JSON.stringify(data));
  }
  function handleEdit() {
    setIsEnable(true);
  }

  function handleAddNew() {
    setCustomerInvoice([]);
    setCustomerInvoiceID(0);
    method.reset();
    invoiceHeaderForm.reset();
    method.setValue("InvoiceDate", new Date());
    method.setValue("DueDate", new Date());
    method.setValue("Session", sessionSelectData[0]);
    setIsEnable(true);
  }

  function handleCancel() {
    setCustomerInvoice([]);
    setCustomerInvoiceID(0);
    method.reset();
    invoiceHeaderForm.reset();
    method.setValue("InvoiceDate", new Date());
    method.setValue("DueDate", new Date());
    method.setValue("Session", sessionSelectData[0]);
    setIsEnable(true);
  }

  function handleDelete() {
    // deleteMutation.mutate({
    //   SessionID,
    //   LoginUserID: user.userID,
    // });
  }

  async function handleOpenPdfInNewTab(InvoiceID) {
    setPrintLoading(true);
    const { data } = await axios.post(
      `http://192.168.9.110:90/api/Reports/InvoicePrint?CustomerInvoiceID=${InvoiceID}&Export=p`
    );

    const win = window.open("");
    let html = "";

    html += "<html>";
    html += '<body style="margin:0!important">';
    html +=
      '<embed width="100%" height="100%" src="data:application/pdf;base64,' +
      data +
      '" type="application/pdf" />';
    html += "</body>";
    html += "</html>";
    setPrintLoading(false);
    setTimeout(() => {
      win.document.write(html);
    }, 0);
  }

  return (
    <>
      {isLoading ? (
        <>
          <CustomSpinner />
        </>
      ) : (
        <>
          {CustomerInvoiceID > 0 && !isEnable ? (
            <>
              <div className="mb-2 text-end">
                <Button
                  label={printLoading ? "Loading..." : "Print"}
                  severity="warning"
                  icon="pi pi-print"
                  className="rounded"
                  type="button"
                  loading={printLoading}
                  loadingIcon="pi pi-spin pi-print"
                  onClick={() => handleOpenPdfInNewTab(CustomerInvoiceID)}
                ></Button>
              </div>
            </>
          ) : (
            <></>
          )}
          <h4 className="p-3 mb-4 bg-light text-dark text-center  shadow-sm rounded-2">
            Customer Invoice
          </h4>

          {/* <CustomerEntryForm /> */}

          <form onSubmit={method.handleSubmit(onSubmit)} id="parenForm">
            <Row className="p-3" style={{ marginTop: "-25px" }}>
              <Form.Group as={Col} controlId="Session">
                <Form.Label>Session</Form.Label>
                <span className="text-danger fw-bold ">*</span>
                <Controller
                  control={method.control}
                  name="Session"
                  rules={{ required: "Please select a session" }}
                  render={({ field: { onChange, value } }) => (
                    <ReactSelect
                      isDisabled={!isEnable}
                      options={sessionSelectData}
                      required
                      getOptionValue={(option) => option.SessionID}
                      getOptionLabel={(option) => option.SessionTitle}
                      value={value || sessionSelectData[0]}
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
                  {...method.register("InvoiceNo")}
                  disabled
                  required
                />
              </Form.Group>
              <Form.Group as={Col} controlId="InoviceDate">
                <Form.Label>Invoice Date</Form.Label>

                <div>
                  <Controller
                    disabled={!isEnable}
                    control={method.control}
                    name="InoviceDate"
                    render={({ field }) => (
                      <ReactDatePicker
                        disabled={!isEnable}
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
                        disabled={!isEnable}
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
                  disabled={!isEnable}
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
                      isDisabled={!isEnable}
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
                <span className="text-danger">
                  {method?.errors?.Type?.message}
                </span>
              </Form.Group>

              <Form.Group as={Col} controlId="Customer">
                <Form.Label>
                  Customer Name
                  <span className="text-danger fw-bold ">*</span>
                  {isEnable && (
                    <>
                      <CustomerEntryForm IconButton={true} />
                    </>
                  )}
                </Form.Label>

                <Controller
                  control={method.control}
                  name="Customer"
                  render={({ field: { onChange, value, ref } }) => (
                    <ReactSelect
                      isDisabled={!isEnable}
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
                <span className="text-danger fw-bold ">*</span>
                <Controller
                  control={method.control}
                  name="CustomerLedgers"
                  render={({ field: { onChange, value, ref } }) => (
                    <ReactSelect
                      isDisabled={!isEnable}
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
                  disabled={!isEnable}
                  className="form-control"
                  {...method.register("Description")}
                />
              </Form.Group>
            </Row>
          </form>
          {isEnable && (
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
          )}

          <>
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
                  InvoiceType={InvoiceType}
                  isEnable={isEnable}
                />
              </FormProvider>
            </Row>
          </>

          <ButtonRow
            isDirty={method.isDirty}
            isValid={true}
            editMode={isEnable}
            isSubmitting={customerInvoiceMutation.isPending}
            handleAddNew={handleAddNew}
            handleCancel={handleCancel}
            viewRecord={!isEnable}
            editRecord={isEnable && (CustomerInvoiceID > 0 ? true : false)}
            newRecord={CustomerInvoiceID === 0 ? true : false}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            customOnClick={() => {
              method.handleSubmit(onSubmit)();
            }}
          />
        </>
      )}
    </>
  );
}

export default CustomerInvoice;
