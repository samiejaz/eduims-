import { Form, Row, Col, Spinner } from "react-bootstrap";
import { Button } from "primereact/button";
import { Accordion, AccordionTab } from "primereact/accordion";

import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import TabHeader from "../../components/TabHeader";
import ReactSelect from "react-select";
import CustomerInvoiceDetailTable from "./CustomerInvoiceDetailTable";
import React, { useContext, useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import { AppConfigurationContext } from "../../context/AppConfigurationContext";

import { CustomerEntryForm } from "../../components/CustomerEntryFormComponent";
import CustomerInvoiceHeader from "./CustomerInvoiceHeader";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllCustomerBranchesData,
  fetchAllProductsForSelect,
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
  fetchMaxSessionBasedVoucherNo,
} from "../../api/CustomerInvoiceData";
import { FilterMatchMode } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import ActionButtons from "../../components/ActionButtons";
import { parseISO } from "date-fns";
import { CustomSpinner } from "../../components/CustomSpinner";
import ButtonRow from "../../components/ButtonRow";
import {
  useBusinessUnitsSelectData,
  useCustomerLedgersSelectData,
  useOldCustomerSelectData,
  useProductsInfoSelectData,
  useServicesInfoSelectData,
} from "../../hooks/SelectData/useSelectData";
import { CustomerInvoiceInstallmentForm } from "../../components/CustomerInoivceInstallmentsComponent";
import MultipleDemo from "./CustomerInvoiceAccordian";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import BasicDemo from "./CustomerInvoiceToolbar";
import CustomerInvoiceDock from "./CustomerInvoiceDock";
import ButtonToolBar from "./CustomerInvoiceToolbar";
import { Checkbox } from "primereact/checkbox";
import TextInput from "../../components/Forms/TextInput";

const apiUrl = import.meta.env.VITE_APP_API_URL;
function CustomerInvoice() {
  const { pageTitles } = useContext(AppConfigurationContext);
  document.title = "Customer Invoice";
  return (
    <>
      <CustomerInvoiceDataProivder>
        <CustomerInvoiceSearch />
      </CustomerInvoiceDataProivder>
    </>
  );
}

/*
  Pending

  1) Add validation to each cell in datatable




*/

function CustomerInvoiceSearch() {
  const queryClient = useQueryClient();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

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
    navigate("/customers/customerInvoice/edit/" + CustomerInvoiceID);
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
    navigate("/customers/customerInvoice/" + CustomerInvoiceID);
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
          <div className="d-flex text-dark p-3 mb-4 ">
            <h3 className="text-center my-auto">Customer Invoice Entry</h3>

            <div className="text-end my-auto" style={{ marginLeft: "10px" }}>
              <Button
                label="Add New"
                icon="pi pi-plus"
                type="button"
                className="rounded"
                onClick={() => navigate(`/customers/customerInvoice/new`)}
              />
            </div>
          </div>

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
              field="SessionBasedVoucherNo"
              filter
              filterPlaceholder="Search by invoice no"
              sortable
              header="Invoice No"
            ></Column>
            <Column
              field="InvoiceNo"
              filter
              filterPlaceholder="Search by ref no"
              sortable
              header="Ref No"
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
              filterPlaceholder="Search by net amount"
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

export function CustomerInvoiceFormMaster({ pageTitles, mode }) {
  return (
    <InvoiceDataProivder>
      <CustomerInvoiceForm pageTitles={pageTitles} mode={mode} />
    </InvoiceDataProivder>
  );
}

function CustomerInvoiceForm({ pageTitles, mode }) {
  const queryClient = useQueryClient();
  const [CustomerID, setCustomerID] = useState(0);
  const [AccountID, setAccountID] = useState(0);
  const [CustomerInvoice, setCustomerInvoice] = useState([]);
  const [CustomerInvoiceID, setCustomerInvoiceID] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [printLoading, setPrintLoading] = useState(false);
  const { BusinessUnitID } = useContext(InvoiceDataContext);
  const { user } = useContext(AuthContext);
  const [isEnable, setIsEnable] = useState(false);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    function pageSetup() {
      if (mode === "view") {
        setIsEnable(false);
        setCustomerInvoiceID(params?.CustomerInvoiceID);
      }
      if (mode === "edit") {
        setIsEnable(true);
        setCustomerInvoiceID(params?.CustomerInvoiceID);
      }
      if (mode === "new") {
        method.reset();
        invoiceHeaderForm.reset();
        fetchInvoiceNo();
        fetchSessionBasedVoucherNo();
        setCustomerInvoice([]);
        setCustomerInvoiceID(0);
        setIsEnable(true);
      }
    }
    async function fetchInvoiceNo() {
      const data = await fetchMaxInvoiceNo(user?.userID);
      method.setValue("InvoiceNo", data.data[0]?.Column1);
    }
    async function fetchSessionBasedVoucherNo() {
      const data = await fetchMaxSessionBasedVoucherNo(user?.userID);
      method.setValue("SessionBasedInvoiceNo", data.data[0]?.Column1);
    }
    pageSetup();
  }, [mode]);

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
        }
      } else {
        setCustomerInvoice([]);
        setTimeout(() => {
          method.reset();
          setIsEnable(true);
        }, 200);
      }
    }

    if (CustomerInvoiceID !== 0) {
      fetchCustomerInvoice();
    }
  }, [CustomerInvoiceID]);

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
      installments: [],
    },
  });
  const { append, fields, remove } = useFieldArray({
    control: method.control,
    name: "detail",
  });
  const installmentsFieldArray = useFieldArray({
    control: method.control,
    name: "installments",
  });

  const customerSelectData = useOldCustomerSelectData();
  const CustomerAccounts = useCustomerLedgersSelectData(CustomerID);
  const businessSelectData = useBusinessUnitsSelectData();
  const productsInfoSelectData = useProductsInfoSelectData(BusinessUnitID);
  const servicesInfoSelectData = useServicesInfoSelectData(BusinessUnitID);

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
            InvoiceType: item.InvoiceType.value,
            BusinessUnitID: item.BusinessUnit.BusinessUnitID,
            BranchID: item.CustomerBranch.BranchID,
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
            IsFree: item.IsFree ? 1 : 0,
          };
        });

        let InstallmentDetail = formData?.installments?.map((item, index) => {
          return {
            InstallmentRowID: index + 1,
            InstallmentDueDate: item.IDate ?? new Date(),
            InstallmentAmount: item.Amount,
          };
        });

        let DataToSend = {
          SessionID:
            formData?.Session?.SessionID || sessionSelectData[0]?.SessionID,
          InvoiceNo: formData?.InvoiceNo || 1,
          InvoiceDate: formData?.InvoiceDate || new Date(),
          InvoiceDueDate: formData?.DueDate || new Date(),
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
          InvoiceInstallmentDetail: JSON.stringify(InstallmentDetail),
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
          console.log(data);
          queryClient.invalidateQueries({ queryKey: ["customerInvoices"] });
          if (CustomerInvoiceID !== 0) {
            toast.success("Invoice updated successfully!");
            navigate(`/customers/customerInvoice/${CustomerInvoiceID}`);
          } else {
            toast.success("Invoice created successfully!");
            navigate(`/customers/customerInvoice/${data?.CustomerInvoiceID}`);
          }
          // setCustomerInvoiceID(data?.CustomerInvoiceID);
        } else {
          toast.error(data.message);
        }
      }
    },
  });

  function onSubmit(data) {
    let TotalInstallMentAmount =
      method.getValues(`InstallmentTotalRemaining`) || 0;
    if (
      TotalInstallMentAmount === 0 ||
      (TotalInstallMentAmount !== 0 && data.installments.length === 0)
    ) {
      customerInvoiceMutation.mutate(data);
    } else if (TotalInstallMentAmount > 0) {
      toast.error("Installment Amounts must be equal to Total Net Amount", {
        position: "top-right",
      });
    } else {
      toast.error("Installment Amounts cannot exceed Total Net Amount", {
        position: "top-right",
      });
    }
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
      method.setValue(
        "SessionBasedInvoiceNo",
        CustomerInvoice?.Master[0]?.SessionBasedVoucherNo
      );
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
        "installments",
        CustomerInvoice?.InstallmentDetail.map((item, index) => {
          console.log(item);
          return {
            IDate: parseISO(item.DueDate),
            Amount: item.Amount,
          };
        })
      );
      method.setValue(
        "detail",
        CustomerInvoice?.Detail?.map((invoice, index) => {
          filteredProductsBasedOnRow(invoice.BusinessUnitID, index);
          return {
            InvoiceType: {
              label: invoice.InvoiceTypeTitle,
              value: invoice.InvoiceTypeTitle,
            },
            ProductInfo: {
              ProductInfoID: invoice.ProductToInvoiceID,
              ProductInfoTitle: invoice.ProductTitle,
            },
            ServiceInfo: {
              ProductInfoID: invoice.ServiceToInvoiceID,
              ProductInfoTitle: invoice.ServiceTitle,
            },
            CustomerBranch: {
              BranchID: invoice.BranchID,
              BranchTitle: invoice.BranchTitle,
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
    navigate(`/customers/customerInvoice/edit/${CustomerInvoiceID}`);
  }

  function handleAddNew() {
    navigate(`/customers/customerInvoice/new`);
    method.setValue("InvoiceDate", new Date());
    method.setValue("DueDate", new Date());
    method.setValue("Session", sessionSelectData[0]);
  }

  function handleCancel() {
    if (mode === "new") {
      navigate(`/customers/customerInvoice`);
    } else if (mode === "edit") {
      navigate(`/customers/customerInvoice/${CustomerInvoiceID}`);
    }
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

  function handleSubmit() {
    method.handleSubmit(onSubmit)();
  }

  return (
    <div>
      {isLoading ? (
        <>
          <CustomSpinner />
        </>
      ) : (
        <>
          {/* <CustomerInvoiceDock /> */}
          {/* <div className="mb-2 text-end">
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
      </div> */}
          <div className="shadow-sm mb-2">
            <ButtonToolBar
              editDisable={mode !== "view"}
              cancelDisable={mode === "view"}
              addNewDisable={mode === "edit" || mode === "new"}
              deleteDisable={mode === "edit" || mode === "new"}
              saveDisable={mode === "view"}
              saveLabel={mode === "edit" ? "Update" : "Save"}
              showPrint={true}
              printLoading={printLoading}
              printDisable={mode === "new" || mode === "edit"}
              handlePrint={() => handleOpenPdfInNewTab(CustomerInvoiceID)}
              handleGoBack={() => navigate("/customers/customerInvoice")}
              handleEdit={() => handleEdit()}
              handleCancel={() => {
                handleCancel();
              }}
              handleAddNew={() => {
                handleAddNew();
              }}
              handleSave={() => handleSubmit()}
            />
          </div>
          <Accordion multiple activeIndex={[0]}>
            {/* {CustomerInvoiceID > 0 && !isEnable ? (
            <>
           
            </>
          ) : (
            <></>
          )}
          <h4 className="p-3 mb-4 bg-light text-dark text-center  shadow-sm rounded-2">
            Customer Invoice
          </h4> */}
            {/* <CustomerEntryForm /> */}
            <AccordionTab header="Master">
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
                          onChange={(selectedOption) =>
                            onChange(selectedOption)
                          }
                          placeholder="Select a session"
                          noOptionsMessage={() => "No session found!"}
                        />
                      )}
                    />
                  </Form.Group>

                  <Form.Group as={Col} controlId="SessionBasedInvoiceNo">
                    <Form.Label>Invoice No</Form.Label>
                    <Form.Control
                      type="number"
                      size="sm"
                      //style={{ padding: "1px" }}
                      {...method.register("SessionBasedInvoiceNo")}
                      disabled
                    />
                  </Form.Group>
                  <Form.Group as={Col} controlId="InvoiceNo">
                    <Form.Label>Ref No</Form.Label>
                    <Form.Control
                      type="text"
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
                    <Form.Label>
                      DueDate
                      <CustomerInvoiceInstallmentForm
                        method={method}
                        installmentsFieldArray={installmentsFieldArray}
                      />
                    </Form.Label>

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
                          options={customerSelectData.data}
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
                          options={CustomerAccounts.data}
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
            </AccordionTab>
            <AccordionTab header="Detail">
              {isEnable && (
                <div
                  style={{
                    padding: "1rem",
                    borderRadius: "6px",
                  }}
                  className="bg-light shadow-sm"
                >
                  {/* <h5 className="p-3 mb-4 bg-light text-dark text-center  ">
                Detail Entry
              </h5> */}
                  <FormProvider {...invoiceHeaderForm}>
                    <CustomerInvoiceHeader
                      businessSelectData={businessSelectData.data}
                      productsInfoSelectData={productsInfoSelectData.data}
                      servicesInfoSelectData={servicesInfoSelectData.data}
                      customerBranchSelectData={customerBranchSelectData}
                      typesOption={typesOptions}
                      append={append}
                      fields={fields}
                      pageTitles={pageTitles}
                    />
                  </FormProvider>
                </div>
              )}

              <>
                <Row className="p-3" style={{ marginTop: "-25px" }}>
                  <FormProvider {...method}>
                    <CustomerInvoiceDetailTable
                      businessSelectData={businessSelectData.data}
                      productsInfoSelectData={productsInfoSelectData.data}
                      servicesInfoSelectData={servicesInfoSelectData.data}
                      customerBranchSelectData={customerBranchSelectData}
                      typesOption={typesOptions}
                      pageTitles={pageTitles}
                      fields={fields}
                      append={append}
                      remove={remove}
                      isEnable={isEnable}
                    />
                  </FormProvider>
                </Row>
              </>
            </AccordionTab>
          </Accordion>
          {/* )} */}
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
            customOnClick={method.handleSubmit(onSubmit)}
          />
        </>
      )}
    </div>
  );
}

export default CustomerInvoice;
