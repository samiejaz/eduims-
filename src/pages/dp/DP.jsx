import { Row, Form, Col, Spinner } from "react-bootstrap";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { toast } from "react-toastify";
import {
  useForm,
  Controller,
  useFieldArray,
  useFormContext,
  FormProvider,
  useWatch,
} from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ActionButtons from "../../components/ActionButtons";
import { FilterMatchMode } from "primereact/api";
import { useContext, useEffect, useMemo, useState } from "react";
import useEditModal from "../../hooks/useEditModalHook";
import useDeleteModal from "../../hooks/useDeleteModalHook";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import ReactDatePicker from "react-datepicker";
import TextInput from "../../components/Forms/TextInput";
import NumberInput from "../../components/Forms/NumberInput";
import {
  useBankAccountsSelectData,
  useCustomerInvoiceInstallments,
  useCustomerLedgersSelectData,
  useOldCustomerSelectData,
  useSessionSelectData,
} from "../../hooks/SelectData/useSelectData";
import DetailHeaderActionButtons from "../../components/DetailHeaderActionButtons";
import CDropdown from "../../components/Forms/CDropdown";
import CTextArea from "../../components/Forms/CTextArea";
import { DevTool } from "@hookform/devtools";
import {
  fetchAllReceiptVoucheres,
  fetchMaxReceiptNo,
  fetchReceiptVoucherById,
} from "../../api/ReceiptVoucherData";
import ButtonToolBar from "../CustomerInvoice/CustomerInvoiceToolbar";
import { parseISO } from "date-fns";
import { Tag } from "primereact/tag";
import React from "react";
const receiptModeOptions = [
  { value: "Cash", label: "Cash" },
  { value: "Online", label: "Online Transfer" },
  { value: "Instrument", label: "Instrument" },
];

const receiptTypeOptions = [
  { label: "Recovery", value: "Recovery" },
  { label: "Advance", value: "Advance" },
];

const instrumentTypeOptions = [
  { value: "Cheque", label: "Cheque" },
  { value: "DD", label: "DD" },
];

let parentRoute = "/customers/receiptVoucher";
let editRoute = "/customers/receiptVoucher/edit/";
let newRoute = "/customers/receiptVoucher/new";
let cashDetailColor = "#22C55E";
let onlineDetailColor = "#F59E0B";
let chequeDetailColor = "#3B82F6";
let ddDetailColor = "#8f48d2";

function DP() {
  document.title = "Reciept Vouchers";
  return (
    <div className="bg__image mt-3">
      <div className=" px-md-5 bg__image">
        <div className=" px-md-4">
          <DPSearch />
        </div>
      </div>
    </div>
  );
}
const apiUrl = import.meta.env.VITE_APP_API_URL;
function DPSearch() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
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

  const [filters, setFilters] = useState({
    VoucherNo: { value: null, matchMode: FilterMatchMode.CONTAINS },
    CustomerName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    AccountTitle: { value: null, matchMode: FilterMatchMode.CONTAINS },
    ReceiptMode: { value: null, matchMode: FilterMatchMode.CONTAINS },
    TotalNetAmount: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const { user } = useContext(AuthContext);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["receiptVouchers"],
    queryFn: () => fetchAllReceiptVoucheres(user.userID),
    initialData: [],
  });

  const deleteMutation = useMutation({
    mutationFn: async (business) => {
      const { data } = await axios.post(
        apiUrl +
          `/EduIMS/DPDelete?ReceiptVoucherID=${business.ReceiptVoucherID}&LoginUserID=${user.userID}`
      );
      if (data.success === true) {
        queryClient.invalidateQueries({ queryKey: ["DP"] });
        toast.success("Business successfully deleted!");
      } else {
        toast.error(data.message, {
          autoClose: 2000,
        });
      }
    },
  });

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  function handleDelete(id) {
    deleteMutation.mutate({ ReceiptVoucherID: id, LoginUserID: user.userID });
    handleDeleteClose();
    setIdToDelete(0);
  }

  function handleEdit(id) {
    navigate(editRoute + id);
    handleEditClose();
    setIdToEdit(0);
  }

  function handleView(id) {
    navigate(parentRoute + "/" + id);
  }

  const statusBodyTemplate = (rowData) => {
    return (
      <Tag
        value={rowData.ReceiptMode}
        severity={getSeverity(rowData.ReceiptMode)}
      />
    );
  };

  const getSeverity = (status) => {
    switch (status) {
      case "Online":
        return "warning";

      case "Cash":
        return "success";

      case "Instument":
        return "help";
      case "DD":
        return "danger";
    }
  };

  return (
    <>
      {isLoading || isFetching ? (
        <>
          <div className="h-100 w-100">
            <div className="d-flex align-content-center justify-content-center ">
              <Spinner
                animation="border"
                size="lg"
                role="status"
                aria-hidden="true"
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="d-flex text-dark  mb-4 ">
            <h2 className="text-center my-auto">Receipt Vouchers</h2>
            <div className="text-end my-auto" style={{ marginLeft: "10px" }}>
              <Button
                label="Add New"
                icon="pi pi-plus"
                type="button"
                className="rounded"
                onClick={() => navigate(newRoute)}
              />
            </div>
          </div>
          <DataTable
            showGridlines
            value={data}
            dataKey="ReceiptVoucherID"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            removableSort
            emptyMessage="No receipts found!"
            filters={filters}
            filterDisplay="row"
            resizableColumns
            size="small"
            selectionMode="single"
            style={{ backgroundColor: "red" }}
            className={"thead"}
            tableStyle={{ minWidth: "50rem" }}
          >
            <Column
              body={(rowData) =>
                ActionButtons(
                  rowData.ReceiptVoucherID,
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
              field="VoucherNo"
              filter
              filterPlaceholder="Search by voucher no"
              sortable
              header="Voucher No"
            ></Column>
            <Column
              field="ReceiptMode"
              filter
              filterPlaceholder="Search by receipt mode"
              sortable
              header="Receipt Mode"
              showFilterMenu={false}
              filterMenuStyle={{ width: "14rem" }}
              style={{ minWidth: "12rem" }}
              body={statusBodyTemplate}
            ></Column>

            <Column
              field="CustomerName"
              sortable
              header="Customer Name"
              filter
              filterPlaceholder="Search by Customer"
            ></Column>
            <Column
              field="AccountTitle"
              sortable
              header="Ledger"
              filter
              filterPlaceholder="Search by ledger"
            ></Column>
            <Column
              field="TotalNetAmount"
              sortable
              header="Total Reciept Amount"
              filter
              filterPlaceholder="Search by receipt amount"
            ></Column>
          </DataTable>
          {EditModal}
          {DeleteModal}
        </>
      )}
    </>
  );
}

const defaultValues = {
  ReceiptVoucherName: "",
  Address: "",
  LandlineNo: "",
  MobileNo: "",
  Email: "",
  Website: "",
  AuthorityPersonName: "",
  AuthorityPersonNo: "",
  AuthorityPersonEmail: "",
  NTNno: "",
  STRNo: "",
  Description: "",
  InActive: false,
};

let renderCount = 0;
export function DPFormO({ pagesTitle, mode }) {
  document.title = "Receipt Voucher Entry";
  renderCount++;
  const queryClient = useQueryClient();
  const [ReceiptVoucher, setReceiptVoucher] = useState({ data: [] });
  const [ReceiptVoucherID, setReceiptVoucherID] = useState(0);
  const [CustomerID, setCustomerID] = useState(0);
  const [AccountID, setAccountID] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isEnable, setIsEnable] = useState(false);
  const [receiptMode, setReceiptMode] = useState("");
  const params = useParams();
  const navigate = useNavigate();
  // Form
  const method = useForm({
    defaultValues: {
      Session: [],
      Customer: [],
      CustomerLedger: [],
      ReceiptMode: [],
      ReceiptNo: "",
      ReceiptDate: new Date(),
      Description: "",
    },
  });

  const { user } = useContext(AuthContext);

  const customerSelectData = useOldCustomerSelectData();
  const sessionSelectData = useSessionSelectData();
  const customerLedgersData = useCustomerLedgersSelectData(CustomerID);
  const customerInvoiceInsallments = useCustomerInvoiceInstallments(
    CustomerID,
    AccountID
  );
  const bankAccountsSelectData = useBankAccountsSelectData();

  useEffect(() => {
    if (receiptMode === "Online") {
      method.unregister("cashDetail");
      method.unregister("chequeDetail");
      method.unregister("dDDetail");
    } else if (receiptMode === "Cheque") {
      method.unregister("onlineDetail");
      method.unregister("cashDetail");
      method.unregister("dDDetail");
    } else if (receiptMode === "Cash") {
      method.unregister("onlineDetail");
      method.unregister("chequeDetail");
      method.unregister("dDDetail");
    } else if (receiptMode === "DD") {
      method.unregister("onlineDetail");
      method.unregister("chequeDetail");
      method.unregister("cashDetail");
    }
  }, [receiptMode]);

  const {
    removeAllRows,
    render: CashModeDetail,
    appendSingleRow,
    appendAllRows,
  } = useCashModeDetail(
    method.control,
    isEnable,
    customerInvoiceInsallments.data,
    method.setValue
  );
  const {
    removeAllRows: removeAllOnlineRows,
    render: OnlineModeDetail,
    appendSingleRow: appendOnlineRow,
    appendAllRows: appendAllOnlineRows,
  } = useOnlineModeDetail(
    method.control,
    isEnable,
    customerInvoiceInsallments.data,
    bankAccountsSelectData.data,
    method.setValue
  );
  const {
    removeAllRows: removeAllChequeRows,
    render: ChequeModeDetail,
    appendSingleRow: appendSingleChequeRow,
    appendAllRows: appendAllChequeRows,
  } = useChequeModeDetail(
    method.control,
    isEnable,
    customerInvoiceInsallments.data,
    bankAccountsSelectData.data,
    method.setValue
  );

  useEffect(() => {
    async function pageSetup() {
      if (mode === "view") {
        setIsEnable(false);
        setReceiptVoucherID(params?.ReceiptVoucherID);
      }
      if (mode === "edit") {
        setIsEnable(true);
        setReceiptVoucherID(params?.ReceiptVoucherID);
      }
      if (mode === "new") {
        setReceiptVoucher([]);
        setReceiptVoucherID(0);
        method.reset();
        fetchReceiptNo();
        setReceiptMode([]);
        setIsEnable(true);
        method.setValue("Session", sessionSelectData?.data[0]?.SessionID ?? 1);
      }
    }
    async function fetchReceiptNo() {
      const data = await fetchMaxReceiptNo(user?.userID);
      method.setValue("ReceiptNo", data.data[0]?.VoucherNo);
    }
    pageSetup();
  }, [mode]);

  useEffect(() => {
    async function fetchReceiptVoucher() {
      if (
        ReceiptVoucherID !== undefined &&
        ReceiptVoucherID !== null &&
        ReceiptVoucherID !== 0
      ) {
        setIsLoading(true);
        const data = await fetchReceiptVoucherById(
          ReceiptVoucherID,
          user.userID
        );
        if (!data) {
          toast.error("Network Error Occured!", {
            position: "bottom-left",
          });
        }

        setReceiptVoucher(data);

        setIsLoading(false);
      } else {
        setReceiptVoucher([]);
        setTimeout(() => {
          method.reset(defaultValues);
          setIsEnable(true);
        }, 200);
      }
    }
    if (ReceiptVoucherID !== 0) {
      fetchReceiptVoucher();
    }
  }, [ReceiptVoucherID]);

  const receiptVoucherMutation = useMutation({
    mutationFn: async (formData) => {
      if (1 === 0) {
        toast.error("Please add atleast 1 item!", {
          position: "top-left",
        });
      } else {
        let ReceiptVoucherDetail = [];
        if (formData?.cashDetail?.length > 0) {
          ReceiptVoucherDetail = formData?.cashDetail?.map((item, index) => {
            return {
              RowID: index + 1,
              RecoveryType: item.ReceiptType,
              CustomerInvoiceID:
                customerInvoiceInsallments.data.filter(
                  (value) =>
                    value.InvoiceInstallmentID === item?.CustomerInstallments
                )[0]?.CustomerInvoiceID ?? null,
              InvoiceInstallmentID:
                item.CustomerInstallments?.length === 0
                  ? null
                  : item.CustomerInstallments,
              FromBank: null,
              ReceivedInBankID: null,
              TransactionID: null,
              InstrumentNo: null,
              InstrumentDate: null,
              Amount: item.CashAmount,
              DetailDescription: item.CashDescription,
            };
          });
        } else if (formData?.onlineDetail?.length > 0) {
          ReceiptVoucherDetail = formData?.onlineDetail?.map((item, index) => {
            return {
              RowID: index + 1,
              RecoveryType: item.ReceiptType,
              CustomerInvoiceID:
                customerInvoiceInsallments.data.filter(
                  (value) =>
                    value.InvoiceInstallmentID === item?.InvoiceInstallmentID
                )[0]?.CustomerInvoiceID ?? null,
              InvoiceInstallmentID:
                item.InvoiceInstallmentID?.length === 0
                  ? null
                  : item.InvoiceInstallmentID,
              FromBank: item.FromBank,
              ReceivedInBankID: item.ReceivedInBankID,
              TransactionID: item.TransactionID,
              InstrumentNo: null,
              InstrumentDate: null,
              Amount: item.Amount,
              DetailDescription: item.DetailDescription,
            };
          });
        } else if (formData?.chequeDetail?.length > 0) {
          ReceiptVoucherDetail = formData?.chequeDetail?.map((item, index) => {
            return {
              RowID: index + 1,
              RecoveryType: item.ReceiptType,
              CustomerInvoiceID:
                customerInvoiceInsallments.data.filter(
                  (value) =>
                    value.InvoiceInstallmentID === item?.InvoiceInstallmentID
                )[0]?.CustomerInvoiceID ?? null,
              InvoiceInstallmentID:
                item.InvoiceInstallmentID?.length === 0
                  ? null
                  : item.InvoiceInstallmentID,
              FromBank: item.FromBank,
              ReceivedInBankID: item.ReceivedInBankID,
              TransactionID: null,
              InstrumentNo: item.TransactionID,
              InstrumentDate: item.InstrumentDate,
              Amount: item.Amount,
              DetailDescription: item.DetailDescription,
            };
          });
        }
        let DataToSend = {
          SessionID: formData?.Session || sessionSelectData[0]?.SessionID,
          VoucherNo: formData?.ReceiptNo,
          VoucherDate: formData?.ReceiptDate || new Date(),
          CustomerID: formData?.Customer,
          AccountID: formData?.CustomerLedger,
          ReceiptMode: formData?.ReceiptMode,
          InstrumentType:
            formData?.InstrumentType?.length === 0
              ? null
              : formData?.InstrumentType,
          TotalNetAmount: formData?.Total_Amount,
          Description: formData?.Description,
          EntryUserID: user?.userID,
          ReceiptVoucherDetail: JSON.stringify(ReceiptVoucherDetail),
        };

        if (
          ReceiptVoucher?.length !== 0 &&
          ReceiptVoucher?.Master[0]?.ReceiptVoucherID !== undefined
        ) {
          DataToSend.ReceiptVoucherID =
            ReceiptVoucher?.Master[0]?.ReceiptVoucherID;
        } else {
          DataToSend.ReceiptVoucherID = 0;
        }

        const { data } = await axios.post(
          apiUrl + `/data_ReceiptVoucher/ReceiptVoucherInsertUpdate`,
          DataToSend
        );

        if (data.success === true) {
          queryClient.invalidateQueries({ queryKey: ["customerInvoices"] });
          if (ReceiptVoucherID !== 0) {
            toast.success("Receipt updated successfully!");
            navigate(`${parentRoute}/${ReceiptVoucherID}`);
          } else {
            toast.success("Receipt created successfully!");
            navigate(`${parentRoute}/${data?.ReceiptVoucherID}`);
          }
        } else {
          toast.error(data.message);
        }
      }
    },
    onError: (err) => {
      toast.error("Something went wrong", {
        autoClose: 1000,
      });
    },
  });

  const deleteMutation = useMutation({
    // mutationFn: async () => {
    //   const { data } = await axios.post(
    //     apiUrl +
    //       `/EduIMS/DPDelete?ReceiptVoucherID=${ReceiptVoucherID}&LoginUserID=${user.userID}`
    //   );
    //   if (data.success === true) {
    //     queryClient.invalidateQueries({ queryKey: ["DP"] });
    //     toast.success("Business successfully deleted!");
    //     setReceiptVoucher(undefined);
    //     setReceiptVoucherID(0);
    //     method.reset();
    //     setIsEnable(true);
    //     setKey("search");
    //   } else {
    //     toast.error(data.message, {
    //       autoClose: 2000,
    //     });
    //   }
    // },
  });

  function handleEdit() {
    navigate(`${editRoute}${ReceiptVoucherID}`);
  }

  function handleAddNew() {
    navigate(newRoute);
  }

  function handleCancel() {
    if (mode === "new") {
      navigate(parentRoute);
    } else if (mode === "edit") {
      navigate(`${parentRoute}/${ReceiptVoucherID}`);
    }
  }

  useEffect(() => {
    if (ReceiptVoucherID !== 0 && ReceiptVoucher?.Master) {
      method.setValue("Session", ReceiptVoucher?.Master[0]?.SessionID);
      method.setValue("Customer", ReceiptVoucher?.Master[0]?.CustomerID);
      setCustomerID(ReceiptVoucher?.Master[0]?.CustomerID);
      setAccountID(ReceiptVoucher?.Master[0]?.AccountID);
      method.setValue("CustomerLedger", ReceiptVoucher?.Master[0]?.AccountID);
      method.setValue("ReceiptMode", ReceiptVoucher?.Master[0]?.ReceiptMode);
      method.setValue(
        "InstrumentType",
        ReceiptVoucher?.Master[0]?.InstrumentType
      );
      method.setValue(
        "ReceiptDate",
        parseISO(ReceiptVoucher?.Master[0]?.VoucherDate)
      );
      method.setValue("Description", ReceiptVoucher?.Master[0]?.Description);
      method.setValue("ReceiptNo", ReceiptVoucher?.Master[0]?.VoucherNo);
      setReceiptMode(
        ReceiptVoucher?.Master[0]?.ReceiptMode === "Instrument"
          ? ReceiptVoucher?.Master[0]?.InstrumentType || null
          : ReceiptVoucher?.Master[0]?.ReceiptMode
      );

      if (ReceiptVoucher?.Master[0]?.ReceiptMode === "Online") {
        appendAllOnlineRows(ReceiptVoucher?.Detail);
      } else if (ReceiptVoucher?.Master[0]?.ReceiptMode === "Cash") {
        appendAllRows(ReceiptVoucher?.Detail);
      } else if (ReceiptVoucher?.Master[0]?.ReceiptMode === "Instrument") {
        appendAllChequeRows(ReceiptVoucher?.Detail);
      }
    }
  }, [ReceiptVoucher, ReceiptVoucherID]);

  function handleDelete() {
    deleteMutation.mutate({
      ReceiptVoucherID: ReceiptVoucherID,
      LoginUserID: user.userID,
    });
    navigate(parentRoute);
  }

  function onSubmit(data) {
    receiptVoucherMutation.mutate(data);
  }

  function ShowSection() {
    if (receiptMode === "Cash") {
      return (
        <>
          {isEnable && (
            <>
              <div className="card p-2 bg-light mt-2">
                <CashModeFields
                  appendSingleRow={appendSingleRow}
                  customerInvoiceInsallments={customerInvoiceInsallments.data}
                  unregister={method.unregister}
                />
              </div>
            </>
          )}
          <FormProvider {...method}>{CashModeDetail}</FormProvider>
        </>
      );
    } else if (receiptMode === "Online") {
      return (
        <>
          {isEnable && (
            <>
              <div className="card p-2 bg-light mt-2">
                <OnlineTransferFields
                  appendSingleRow={appendOnlineRow}
                  customerInvoiceInsallments={customerInvoiceInsallments.data}
                  bankAccountsSelectData={bankAccountsSelectData.data}
                  unregister={method.unregister}
                />
              </div>
            </>
          )}
          <FormProvider {...method}>{OnlineModeDetail}</FormProvider>
        </>
      );
    } else if (receiptMode === "Cheque") {
      return (
        <>
          {isEnable && (
            <>
              <div className="card p-2 bg-light mt-2">
                <ChequeFields
                  appendSingleRow={appendSingleChequeRow}
                  customerInvoiceInsallments={customerInvoiceInsallments.data}
                  bankAccountsSelectData={bankAccountsSelectData.data}
                  unregister={method.unregister}
                />
              </div>
            </>
          )}
          <FormProvider {...method}>{ChequeModeDetail}</FormProvider>
        </>
      );
    } else if (receiptMode === "DD") {
      return (
        <>
          {isEnable && (
            <>
              <div className="card p-2 bg-light mt-2">
                <ChequeFields
                  appendSingleRow={appendSingleChequeRow}
                  customerInvoiceInsallments={customerInvoiceInsallments.data}
                  bankAccountsSelectData={bankAccountsSelectData.data}
                  unregister={method.unregister}
                />
              </div>
            </>
          )}
          <FormProvider {...method}>{ChequeModeDetail}</FormProvider>
        </>
      );
    }
  }

  /*
    Master: Pass AccountID to header
    DetailHeader: Fetch Data for dropdown & when user enters the data in this form and add or append the data should be entered in detail
    Detail: is a table and the user can remove or update row
  */

  return (
    <>
      {isLoading ? (
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
          <div className="mt-4">
            <ButtonToolBar
              editDisable={mode !== "view"}
              cancelDisable={mode === "view"}
              addNewDisable={mode === "edit" || mode === "new"}
              deleteDisable={mode === "edit" || mode === "new"}
              saveDisable={mode === "view"}
              saveLabel={mode === "edit" ? "Update" : "Save"}
              handleGoBack={() => navigate(parentRoute)}
              handleEdit={() => handleEdit()}
              handleCancel={() => {
                handleCancel();
              }}
              handleAddNew={() => {
                handleAddNew();
              }}
              handleSave={() => method.handleSubmit(onSubmit)()}
              GoBackLabel="Receipts"
              utilityContent={
                <>
                  <p>{renderCount}</p>
                </>
              }
            />
          </div>
          <form id="receiptVoucher" className="mt-4">
            <Row>
              <Form.Group className="col-xl-2" as={Col} controlId="Session">
                <Form.Label style={{ fontSize: "14px", fontWeight: "bold" }}>
                  Session
                  <span className="text-danger fw-bold ">*</span>
                </Form.Label>
                <div>
                  <CDropdown
                    control={method.control}
                    name={`Session`}
                    optionLabel="SessionTitle"
                    optionValue="SessionID"
                    placeholder="Select a session"
                    options={sessionSelectData.data}
                    required={true}
                    disabled={!isEnable}
                    focusOptions={() => method.setFocus("Customer")}
                  />
                </div>
              </Form.Group>
              <Form.Group className="col-xl-3" as={Col} controlId="Customer">
                <Form.Label>
                  Customer
                  <span className="text-danger fw-bold ">*</span>
                </Form.Label>
                <div>
                  <CDropdown
                    control={method.control}
                    name={"Customer"}
                    options={customerSelectData.data}
                    optionLabel="CustomerName"
                    optionValue="CustomerID"
                    placeholder="Select a customer"
                    showOnFocus={true}
                    required={true}
                    filter={true}
                    onChange={(e) => {
                      setCustomerID(e.value);
                      removeAllRows();
                      removeAllOnlineRows();
                      removeAllChequeRows();
                      //removeAllDDRows();
                    }}
                    disabled={!isEnable}
                    focusOptions={() => method.setFocus("CustomerLedger")}
                  />
                </div>
              </Form.Group>
              <Form.Group
                className="col-xl-3"
                as={Col}
                controlId="CustomerLedger"
              >
                <Form.Label>
                  Customer Ledger
                  <span className="text-danger fw-bold ">*</span>
                </Form.Label>
                <div>
                  <CDropdown
                    control={method.control}
                    name={"CustomerLedger"}
                    options={customerLedgersData.data}
                    optionLabel="AccountTitle"
                    optionValue="AccountID"
                    placeholder="Select a ledger"
                    showOnFocus={true}
                    required={true}
                    filter={true}
                    onChange={(e) => {
                      setAccountID(e.value);
                      removeAllRows();
                      removeAllOnlineRows();
                      removeAllChequeRows();
                      //removeAllDDRows();
                    }}
                    disabled={!isEnable}
                    focusOptions={() => method.setFocus("ReceiptMode")}
                  />
                </div>
              </Form.Group>
              <Form.Group
                className="col-xl-2 "
                as={Col}
                controlId="ReceiptMode"
              >
                <Form.Label>
                  Receipt Mode
                  <span className="text-danger fw-bold ">*</span>
                </Form.Label>
                <div>
                  <CDropdown
                    control={method.control}
                    options={receiptModeOptions}
                    optionValue="value"
                    optionLabel="label"
                    name={`ReceiptMode`}
                    placeholder="Select receipt mode"
                    onChange={(e) => {
                      setReceiptMode(e.value);
                      method.setValue("InstrumentType", []);
                      removeAllRows();
                      removeAllOnlineRows();
                      removeAllChequeRows();
                      //removeAllDDRows();
                    }}
                    showOnFocus={true}
                    disabled={!isEnable}
                    focusOptions={() =>
                      method.setFocus(
                        receiptMode === "Instrument"
                          ? "InstrumentType"
                          : "Description"
                      )
                    }
                  />
                </div>
              </Form.Group>
              <Form.Group className="col-xl-2 " as={Col} controlId="Session">
                <Form.Label style={{ fontSize: "14px", fontWeight: "bold" }}>
                  Instrument Type
                </Form.Label>
                <div>
                  <CDropdown
                    control={method.control}
                    name={`InstrumentType`}
                    placeholder="Select a type"
                    options={instrumentTypeOptions}
                    required={method.watch("ReceiptMode") === "Instrument"}
                    disabled={
                      !isEnable ||
                      !(method.watch("ReceiptMode") === "Instrument")
                    }
                    focusOptions={() => method.setFocus("Description")}
                    onChange={(e) => {
                      setReceiptMode(e.value);
                      removeAllRows();
                      removeAllOnlineRows();
                      removeAllChequeRows();
                      //removeAllDDRows();
                    }}
                  />
                </div>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={Col} controlId="ReceiptNo">
                <Form.Label>Receipt No</Form.Label>

                <div>
                  <TextInput
                    control={method.control}
                    ID={"ReceiptNo"}
                    isEnable={false}
                  />
                </div>
              </Form.Group>
              <Form.Group as={Col} controlId="ReceiptDate">
                <Form.Label>Date</Form.Label>
                <div>
                  <Controller
                    disabled={!isEnable}
                    control={method.control}
                    name="ReceiptDate"
                    render={({ field }) => (
                      <ReactDatePicker
                        disabled={!isEnable}
                        placeholderText="Select date"
                        onChange={(date) => field.onChange(date)}
                        selected={field.value || new Date()}
                        dateFormat={"dd-MMM-yyyy"}
                        className={!isEnable ? "disabled-field" : "binput"}
                      />
                    )}
                  />
                </div>
              </Form.Group>

              <Form.Group as={Col} controlId="Description" className="col-9">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as={"textarea"}
                  rows={1}
                  disabled={!isEnable}
                  className="form-control"
                  style={{
                    padding: "0.3rem 0.4rem",
                    fontSize: "0.8em",
                  }}
                  {...method.register("Description")}
                />
              </Form.Group>
            </Row>

            <ShowSection />
          </form>
          <DevTool control={method.control} />
        </>
      )}
    </>
  );
}

export default DP;

function CashModeFields({
  appendSingleRow,
  customerInvoiceInsallments,
  unregister,
}) {
  const [receiptType, setReceiptType] = useState(false);

  useEffect(() => {
    unregister("onlineDetail");
    unregister("chequeDetail");
    unregister("dDDetail");
  }, [unregister]);

  const method = useForm({
    defaultValues: {
      ReceiptType: [],
      CustomerInstallments: [],
      CashAmount: 0,
      CashDescription: "",
    },
  });

  function onAdd(data) {
    appendSingleRow({
      ReceiptType: data.ReceiptType,
      CustomerInstallments: data.CustomerInstallments,
      CashAmount: data.CashAmount,
      CashDescription: data.CashDescription,
    });
    method.reset();
  }

  return (
    <>
      <Row className="mb-1">
        <Form.Group as={Col} controlId="ReceiptType" className="col-xl-3">
          <Form.Label>Receipt Type</Form.Label>
          <div>
            <CDropdown
              control={method.control}
              options={receiptTypeOptions}
              name="ReceiptType"
              placeholder="Select a type"
              required={true}
              showOnFocus={true}
              onChange={(e) => {
                setReceiptType(e.value === "Advance");
                if (e.value === "Advance") {
                  method.setValue("CustomerInstallments", []);
                }
              }}
              focusOptions={() => {
                method.setFocus(
                  method.watch("ReceiptType") === "Advance"
                    ? "CashAmount"
                    : "CustomerInstallments"
                );
              }}
            />
          </div>
        </Form.Group>
        <Form.Group
          className="col-xl-3"
          as={Col}
          controlId="CustomerInstallments"
        >
          <Form.Label>Customer Installments</Form.Label>
          <div>
            <CDropdown
              control={method.control}
              options={customerInvoiceInsallments}
              optionLabel="InstallmentTitle"
              optionValue="InvoiceInstallmentID"
              name="CustomerInstallments"
              placeholder="Select an insallment"
              showOnFocus={true}
              disabled={receiptType}
              focusOptions={() => method.setFocus("CashAmount")}
            />
          </div>
        </Form.Group>

        <Form.Group className="col-xl-3" as={Col} controlId="CashAmount">
          <Form.Label>Amount</Form.Label>
          <div>
            <NumberInput
              control={method.control}
              id={`CashAmount`}
              required={true}
              focusOptions={() => method.setFocus("CashDescription")}
            />
          </div>
        </Form.Group>
      </Row>
      <Row>
        <Form.Group as={Col} controlId="CashDescription">
          <Form.Label>Description</Form.Label>

          <div>
            <CTextArea name={`CashDescription`} control={method.control} />
          </div>
        </Form.Group>
        <Form.Group className="col-xl-3" as={Col} controlId="Actions">
          <Form.Label></Form.Label>
          <DetailHeaderActionButtons
            handleAdd={() => method.handleSubmit(onAdd)()}
            handleClear={() => method.reset()}
          />
        </Form.Group>
      </Row>
    </>
  );
}

function CashModeDetail({
  isEnable,
  cashFieldsArray,
  customerInvoiceInsallments,
}) {
  const method = useFormContext();

  return (
    <>
      <table className="table table-responsive mt-3">
        <thead>
          <tr>
            <th
              className="p-2 text-white text-center "
              style={{ width: "2rem", background: cashDetailColor }}
            >
              Sr No.
            </th>
            <th
              className="p-2 text-white text-center "
              style={{ width: "30%", background: cashDetailColor }}
            >
              Receipt Type
            </th>
            <th
              className="p-2 text-white text-center "
              style={{ width: "30%", background: cashDetailColor }}
            >
              Customer Installment
            </th>
            <th
              className="p-2 text-white text-center "
              style={{ width: "4%", background: cashDetailColor }}
            >
              Amount
            </th>
            <th
              className="p-2 text-white text-center "
              style={{ width: "30%", background: cashDetailColor }}
            >
              Description
            </th>
            <th
              className="p-2 text-white text-center "
              style={{ width: "5%", background: cashDetailColor }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {cashFieldsArray.fields.map((item, index) => {
            return (
              <tr key={item.id}>
                <td>
                  <input
                    id="RowID"
                    readOnly
                    className="form-control"
                    style={{ padding: "0.25rem 0.4rem", fontSize: "0.9em" }}
                    value={index + 1}
                    disabled={!isEnable}
                  />
                </td>
                <td>
                  <CDropdown
                    control={method.control}
                    options={receiptTypeOptions}
                    name={`cashDetail.${index}.ReceiptType`}
                    placeholder="Select a type"
                    required={true}
                    showOnFocus={true}
                    disabled={!isEnable}
                    onChange={(e) => {
                      if (e.value === "Advance") {
                        method.setValue(
                          `cashDetail.${index}.CustomerInstallments`,
                          []
                        );
                      }
                    }}
                    focusOptions={() => {
                      method.setFocus(
                        method.watch(`cashDetail.${index}.ReceiptType`) ===
                          "Advance"
                          ? `cashDetail.${index}.CashAmount`
                          : `cashDetail.${index}.CustomerInstallments`
                      );
                    }}
                  />
                </td>
                <td>
                  <CDropdown
                    control={method.control}
                    name={`cashDetail.${index}.CustomerInstallments`}
                    options={customerInvoiceInsallments}
                    optionValue="InvoiceInstallmentID"
                    optionLabel="InstallmentTitle"
                    placeholder="Select an installment"
                    required={
                      method.watch(`cashDetail.${index}.ReceiptType`) !==
                      "Advance"
                    }
                    disabled={
                      !isEnable ||
                      method.watch(`cashDetail.${index}.ReceiptType`) ===
                        "Advance"
                    }
                  />
                </td>
                <td>
                  <NumberInput
                    control={method.control}
                    id={`cashDetail.${index}.CashAmount`}
                    disabled={!isEnable}
                  />
                </td>
                <td>
                  <Form.Control
                    as={"textarea"}
                    rows={1}
                    disabled={!isEnable}
                    className="form-control"
                    {...method.register(`cashDetail.${index}.CashDescription`)}
                    style={{
                      fontSize: "0.8em",
                    }}
                  />
                </td>
                <td>
                  <Button
                    icon="pi pi-minus"
                    severity="danger"
                    size="sm"
                    type="button"
                    style={{
                      padding: "0.25rem .7rem",
                      borderRadius: "16px",
                      fontSize: "0.9em",
                    }}
                    disabled={!isEnable}
                    onClick={() => cashFieldsArray.remove(index)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
// Online Transfer Fields
function OnlineTransferFields({
  appendSingleRow,
  customerInvoiceInsallments,
  bankAccountsSelectData,
  unregister,
}) {
  const [receiptType, setReceiptType] = useState(false);
  const method = useForm({
    ReceiptType: [],
    FromBank: "",
    ReceivedInBankID: [],
    TransactionID: "",
    InvoiceInstallmentID: [],
    Amount: 0,
    DetailDescription: "",
  });

  useEffect(() => {
    unregister("cashDetail");
    unregister("chequeDetail");
    unregister("dDDetail");
  }, [unregister]);

  function onAdd(data) {
    appendSingleRow(data);
    method.setFocus("Customer");
    method.reset();
  }
  return (
    <>
      <Row className="mb-1">
        <Form.Group as={Col} controlId="ReceiptType" className="col-xl-3">
          <Form.Label>Receipt Type</Form.Label>
          <div>
            <CDropdown
              control={method.control}
              options={receiptTypeOptions}
              name="ReceiptType"
              placeholder="Select a type"
              required={true}
              showOnFocus={true}
              onChange={(e) => {
                setReceiptType(e.value === "Advance");
                if (e.value === "Advance") {
                  method.setValue("InvoiceInstallmentID", []);
                }
              }}
              focusOptions={() => {
                method.setFocus(
                  method.watch("ReceiptType") === "Advance"
                    ? "Amount"
                    : "InvoiceInstallmentID"
                );
              }}
            />
          </div>
        </Form.Group>
        <Form.Group
          className="col-xl-3"
          as={Col}
          controlId="InvoiceInstallmentID"
        >
          <Form.Label>Customer Installments</Form.Label>
          <div>
            <CDropdown
              control={method.control}
              options={customerInvoiceInsallments}
              optionLabel="InstallmentTitle"
              optionValue="InvoiceInstallmentID"
              name="InvoiceInstallmentID"
              placeholder="Select an insallment"
              showOnFocus={true}
              disabled={receiptType}
              required={method.watch("ReceiptType") !== "Advance"}
              focusOptions={() => method.setFocus("Amount")}
            />
          </div>
        </Form.Group>

        <Form.Group className="col-xl-3" as={Col} controlId="Amount">
          <Form.Label>Amount</Form.Label>
          <div>
            <NumberInput
              control={method.control}
              id={`Amount`}
              required={true}
              enterKeyOptions={() => method.setFocus("FromBank")}
            />
          </div>
        </Form.Group>
      </Row>
      <Row>
        <Form.Group className="col-xl-3 " as={Col} controlId="FromBank">
          <Form.Label>From Bank</Form.Label>
          <div>
            <TextInput
              ID={"FromBank"}
              control={method.control}
              required={true}
              focusOptions={() => method.setFocus("ReceivedInBankID")}
            />
          </div>
        </Form.Group>
        <Form.Group className="col-xl-3 " as={Col} controlId="ReceivedInBankID">
          <Form.Label>Recieved In Back</Form.Label>
          <div>
            <CDropdown
              control={method.control}
              options={bankAccountsSelectData}
              optionValue="BankAccountID"
              optionLabel="BankAccountTitle"
              name="ReceivedInBankID"
              placeholder="Select a bank"
              required={true}
              focusOptions={() => method.setFocus("TransactionID")}
            />
          </div>
        </Form.Group>

        <Form.Group className="col-xl-3 " as={Col} controlId="TransactionID">
          <Form.Label>Transaction ID</Form.Label>
          <div>
            <TextInput
              ID={"TransactionID"}
              control={method.control}
              focusOptions={() => method.setFocus("DetailDescription")}
              required={true}
            />
          </div>
        </Form.Group>
      </Row>
      <Row>
        <Form.Group as={Col} controlId="DetailDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as={"textarea"}
            rows={1}
            className="small-textarea"
            style={{
              padding: "0.2rem 0.4rem",
              fontSize: "0.9em",
            }}
            {...method.register("DetailDescription")}
          />
        </Form.Group>
        <Form.Group className="col-xl-3" as={Col} controlId="Actions">
          <Form.Label></Form.Label>
          <DetailHeaderActionButtons
            handleAdd={() => method.handleSubmit(onAdd)()}
            handleClear={() => method.reset()}
          />
        </Form.Group>
      </Row>
    </>
  );
}
function OnlineTransferFieldsDetail({
  onlineFieldArray,
  isEnable,
  customerInvoiceInsallments,
  banksSelectData,
  removeSingleRow,
}) {
  return (
    <>
      <table className="table table-responsive mt-2">
        <thead>
          <tr>
            <th
              className="p-2 text-white text-center "
              style={{ width: "2%", background: onlineDetailColor }}
            >
              Sr No.
            </th>
            <th
              className="p-2  text-white text-center "
              style={{ width: "10%", background: onlineDetailColor }}
            >
              Receipt Type
            </th>
            <th
              className="p-2  text-white text-center "
              style={{ width: "15%", background: onlineDetailColor }}
            >
              Customer Installment
            </th>
            <th
              className="p-2  text-white text-center "
              style={{ width: "4%", background: onlineDetailColor }}
            >
              Amount
            </th>
            <th
              className="p-2  text-white text-center "
              style={{ width: "10%", background: onlineDetailColor }}
            >
              From Bank
            </th>
            <th
              className="p-2  text-white text-center "
              style={{ width: "20%", background: onlineDetailColor }}
            >
              Received In Bank
            </th>
            <th
              className="p-2  text-white text-center "
              style={{ width: "4%", background: onlineDetailColor }}
            >
              Transaction ID
            </th>
            <th
              className="p-2  text-white text-center "
              style={{ width: "10%", background: onlineDetailColor }}
            >
              Description
            </th>
            <th
              className="p-2  text-white text-center "
              style={{ width: "4%", background: onlineDetailColor }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {onlineFieldArray.fields.map((item, index) => {
            return (
              <OnlineTransferFieldsDetailRow
                key={item.id}
                item={item}
                index={index}
                customerInvoiceInsallments={customerInvoiceInsallments}
                banksSelectData={banksSelectData}
                removeSingleRow={removeSingleRow}
                isEnable={isEnable}
              />
            );
          })}
        </tbody>
      </table>
    </>
  );
}
function OnlineTransferFieldsDetailRow({
  item,
  index,
  customerInvoiceInsallments,
  banksSelectData,
  removeSingleRow,
  isEnable,
}) {
  const method = useFormContext();

  return (
    <>
      <tr key={item.id}>
        <td>
          <input
            id="RowID"
            readOnly
            className="form-control"
            style={{ padding: "0.25rem 0.4rem", fontSize: "0.9em" }}
            value={index + 1}
            disabled={!isEnable}
          />
        </td>
        <td>
          <CDropdown
            control={method.control}
            options={receiptTypeOptions}
            name={`onlineDetail.${index}.ReceiptType`}
            placeholder="Select a type"
            required={true}
            showOnFocus={true}
            onChange={(e) => {
              if (e.value === "Advance") {
                method.setValue(
                  `onlineDetail.${index}.CustomerInstallments`,
                  []
                );
              }
            }}
            focusOptions={() => {
              method.setFocus(
                method.watch(`onlineDetail.${index}.ReceiptType`) === "Advance"
                  ? `onlineDetail.${index}.CashAmount`
                  : `onlineDetail.${index}.CustomerInstallments`
              );
            }}
            disabled={!isEnable}
          />
        </td>
        <td>
          <CDropdown
            control={method.control}
            name={`onlineDetail.${index}.InvoiceInstallmentID`}
            options={customerInvoiceInsallments}
            optionValue="InvoiceInstallmentID"
            optionLabel="InstallmentTitle"
            placeholder="Select an installment"
            required={
              method.watch(`onlineDetail.${index}.ReceiptType`) !== "Advance"
            }
            disabled={
              !isEnable ||
              method.watch(`onlineDetail.${index}.ReceiptType`) === "Advance"
            }
            focusOptions={() => method.setFocus(`onlineDetail.${index}.Amount`)}
          />
        </td>
        <td>
          <NumberInput
            control={method.control}
            id={`onlineDetail.${index}.Amount`}
            enterKeyOptions={() =>
              method.setFocus(`onlineDetail.${index}.FromBank`)
            }
            required={true}
            disabled={!isEnable}
          />
        </td>
        <td>
          <TextInput
            ID={`onlineDetail.${index}.FromBank`}
            control={method.control}
            required={true}
            focusOptions={() =>
              method.setFocus(`onlineDetail.${index}.ReceivedInBankID`)
            }
            isEnable={isEnable}
          />
        </td>
        <td>
          <CDropdown
            control={method.control}
            options={banksSelectData}
            optionValue="BankAccountID"
            optionLabel="BankAccountTitle"
            name={`onlineDetail.${index}.ReceivedInBankID`}
            placeholder="Select a bank"
            required={true}
            focusOptions={() =>
              method.setFocus(`onlineDetail.${index}.TransactionID`)
            }
            disabled={!isEnable}
          />
        </td>
        <td>
          <TextInput
            ID={`onlineDetail.${index}.TransactionID`}
            control={method.control}
            focusOptions={() =>
              method.setFocus(`onlineDetail.${index}.DetailDescription`)
            }
            required={true}
            isEnable={isEnable}
          />
        </td>
        <td>
          <Form.Control
            as={"textarea"}
            rows={1}
            disabled={!isEnable}
            className="form-control"
            {...method.register(`onlineDetail.${index}.DetailDescription`)}
            style={{
              fontSize: "0.8em",
            }}
          />
        </td>
        <td>
          <Button
            icon="pi pi-minus"
            severity="danger"
            size="sm"
            type="button"
            style={{
              padding: "0.25rem .7rem",
              borderRadius: "16px",
              fontSize: "0.9em",
            }}
            onClick={() => removeSingleRow(index)}
          />
        </td>
      </tr>
    </>
  );
}
// Cheque Fields
function ChequeFields({
  appendSingleRow,
  customerInvoiceInsallments,
  bankAccountsSelectData,
  unregister,
}) {
  const [receiptType, setReceiptType] = useState(false);
  const method = useForm({
    ReceiptType: [],
    FromBank: "",
    ReceivedInBankID: [],
    TransactionID: "",
    InvoiceInstallmentID: [],
    Amount: 0,
    DetailDescription: "",
  });

  useEffect(() => {
    unregister("cashDetail");
    unregister("onlineDetail");
    unregister("dDDetail");
  }, [unregister]);

  function onAdd(data) {
    appendSingleRow(data);
    method.setFocus("ReceiptType");
    method.reset();
  }
  return (
    <>
      <Row className="mb-1">
        <Form.Group as={Col} controlId="ReceiptType" className="col-xl-3">
          <Form.Label>Receipt Type</Form.Label>
          <div>
            <CDropdown
              control={method.control}
              options={receiptTypeOptions}
              name="ReceiptType"
              placeholder="Select a type"
              required={true}
              showOnFocus={true}
              onChange={(e) => {
                setReceiptType(e.value === "Advance");
                if (e.value === "Advance") {
                  method.setValue("InvoiceInstallmentID", []);
                }
              }}
              focusOptions={() => {
                method.setFocus(
                  method.watch("ReceiptType") === "Advance"
                    ? "Amount"
                    : "InvoiceInstallmentID"
                );
              }}
            />
          </div>
        </Form.Group>
        <Form.Group
          className="col-xl-3"
          as={Col}
          controlId="InvoiceInstallmentID"
        >
          <Form.Label>Customer Installments</Form.Label>
          <div>
            <CDropdown
              control={method.control}
              options={customerInvoiceInsallments}
              optionLabel="InstallmentTitle"
              optionValue="InvoiceInstallmentID"
              name="InvoiceInstallmentID"
              placeholder="Select an insallment"
              showOnFocus={true}
              disabled={receiptType}
              required={method.watch("ReceiptType") !== "Advance"}
              focusOptions={() => method.setFocus("Amount")}
            />
          </div>
        </Form.Group>

        <Form.Group className="col-xl-3" as={Col} controlId="Amount">
          <Form.Label>Amount</Form.Label>
          <div>
            <NumberInput
              control={method.control}
              id={`Amount`}
              //   required={true}
              enterKeyOptions={() => method.setFocus("FromBank")}
            />
          </div>
        </Form.Group>
      </Row>
      <Row>
        <Form.Group className="col-xl-3 " as={Col} controlId="FromBank">
          <Form.Label>Instrument Of</Form.Label>
          <div>
            <TextInput
              ID={"FromBank"}
              control={method.control}
              required={true}
              focusOptions={() => method.setFocus("ReceivedInBankID")}
            />
          </div>
        </Form.Group>
        <Form.Group className="col-xl-3 " as={Col} controlId="ReceivedInBankID">
          <Form.Label>To Bank</Form.Label>
          <div>
            <CDropdown
              control={method.control}
              options={bankAccountsSelectData}
              optionValue="BankAccountID"
              optionLabel="BankAccountTitle"
              name="ReceivedInBankID"
              placeholder="Select a bank"
              required={true}
              focusOptions={() => method.setFocus("TransactionID")}
            />
          </div>
        </Form.Group>

        <Form.Group className="col-xl-3 " as={Col} controlId="TransactionID">
          <Form.Label>Instrument No</Form.Label>
          <div>
            <TextInput
              ID={"TransactionID"}
              control={method.control}
              focusOptions={() => method.setFocus("DetailDescription")}
              required={true}
            />
          </div>
        </Form.Group>
        <Form.Group className="col-xl-3 " as={Col} controlId="InstrumentDate">
          <Form.Label>Instrument Date</Form.Label>
          <div>
            <Controller
              control={method.control}
              name="InstrumentDate"
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
      <Row>
        <Form.Group as={Col} controlId="DetailDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as={"textarea"}
            rows={1}
            className="small-textarea"
            style={{
              padding: "0.2rem 0.4rem",
              fontSize: "0.9em",
            }}
            {...method.register("DetailDescription")}
          />
        </Form.Group>
        <Form.Group className="col-xl-3" as={Col} controlId="Actions">
          <Form.Label></Form.Label>
          <DetailHeaderActionButtons
            handleAdd={() => method.handleSubmit(onAdd)()}
            handleClear={() => method.reset()}
          />
        </Form.Group>
      </Row>
    </>
  );
}
function ChequeFieldsDetail({
  chequeFieldArray,
  isEnable,
  customerInvoiceInsallments,
  banksSelectData,
  removeSingleRow,
}) {
  return (
    <>
      <table className="table table-responsive mt-2">
        <thead>
          <tr>
            <th
              className="p-2 text-white text-center "
              style={{ width: "2%", background: chequeDetailColor }}
            >
              Sr No.
            </th>
            <th
              className="p-2 text-white text-center "
              style={{ width: "5%", background: chequeDetailColor }}
            >
              Receipt Type
            </th>
            <th
              className="p-2 text-white text-center "
              style={{ width: "15%", background: chequeDetailColor }}
            >
              Customer Installment
            </th>
            <th
              className="p-2 text-white text-center "
              style={{ width: "4%", background: chequeDetailColor }}
            >
              Amount
            </th>
            <th
              className="p-2 text-white text-center "
              style={{ width: "7%", background: chequeDetailColor }}
            >
              Instrument Of
            </th>
            <th
              className="p-2 text-white text-center "
              style={{ width: "20%", background: chequeDetailColor }}
            >
              To Bank
            </th>
            <th
              className="p-2 text-white text-center "
              style={{ width: "10%", background: chequeDetailColor }}
            >
              Instrument No
            </th>
            <th
              className="p-2 text-white text-center "
              style={{ width: "7%", background: chequeDetailColor }}
            >
              Instrument Date
            </th>
            <th
              className="p-2 text-white text-center "
              style={{ width: "10%", background: chequeDetailColor }}
            >
              Description
            </th>
            <th
              className="p-2 text-white text-center "
              style={{ width: "4%", background: chequeDetailColor }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {chequeFieldArray.fields.map((item, index) => {
            return (
              <ChequeFieldsDetailRow
                key={item.id}
                item={item}
                index={index}
                customerInvoiceInsallments={customerInvoiceInsallments}
                banksSelectData={banksSelectData}
                removeSingleRow={removeSingleRow}
                isEnable={isEnable}
              />
            );
          })}
        </tbody>
      </table>
    </>
  );
}
function ChequeFieldsDetailRow({
  item,
  index,
  customerInvoiceInsallments,
  banksSelectData,
  removeSingleRow,
  isEnable,
}) {
  const method = useFormContext();

  return (
    <>
      <tr key={item.id}>
        <td>
          <input
            id="RowID"
            readOnly
            className="form-control"
            style={{ padding: "0.25rem 0.4rem", fontSize: "0.9em" }}
            value={index + 1}
            disabled={!isEnable}
          />
        </td>
        <td>
          <CDropdown
            control={method.control}
            options={receiptTypeOptions}
            name={`chequeDetail.${index}.ReceiptType`}
            placeholder="Select a type"
            required={true}
            showOnFocus={true}
            onChange={(e) => {
              if (e.value === "Advance") {
                method.setValue(
                  `chequeDetail.${index}.CustomerInstallments`,
                  []
                );
              }
            }}
            focusOptions={() => {
              method.setFocus(
                method.watch(`chequeDetail.${index}.ReceiptType`) === "Advance"
                  ? `chequeDetail.${index}.CashAmount`
                  : `chequeDetail.${index}.CustomerInstallments`
              );
            }}
            disabled={!isEnable}
          />
        </td>
        <td>
          <CDropdown
            control={method.control}
            name={`chequeDetail.${index}.InvoiceInstallmentID`}
            options={customerInvoiceInsallments}
            optionValue="InvoiceInstallmentID"
            optionLabel="InstallmentTitle"
            placeholder="Select an installment"
            required={
              method.watch(`chequeDetail.${index}.ReceiptType`) !== "Advance"
            }
            disabled={
              !isEnable ||
              method.watch(`chequeDetail.${index}.ReceiptType`) === "Advance"
            }
            focusOptions={() => method.setFocus(`chequeDetail.${index}.Amount`)}
          />
        </td>
        <td>
          <NumberInput
            control={method.control}
            id={`chequeDetail.${index}.Amount`}
            enterKeyOptions={() =>
              method.setFocus(`chequeDetail.${index}.FromBank`)
            }
            required={true}
            disabled={!isEnable}
          />
        </td>
        <td>
          <TextInput
            ID={`chequeDetail.${index}.FromBank`}
            control={method.control}
            required={true}
            focusOptions={() =>
              method.setFocus(`chequeDetail.${index}.ReceivedInBankID`)
            }
            isEnable={isEnable}
          />
        </td>
        <td>
          <CDropdown
            control={method.control}
            options={banksSelectData}
            optionValue="BankAccountID"
            optionLabel="BankAccountTitle"
            name={`chequeDetail.${index}.ReceivedInBankID`}
            placeholder="Select a bank"
            required={true}
            focusOptions={() =>
              method.setFocus(`chequeDetail.${index}.TransactionID`)
            }
            disabled={!isEnable}
          />
        </td>
        <td>
          <TextInput
            ID={`chequeDetail.${index}.TransactionID`}
            control={method.control}
            focusOptions={() =>
              method.setFocus(`chequeDetail.${index}.DetailDescription`)
            }
            required={true}
            isEnable={isEnable}
          />
        </td>
        <td>
          <Controller
            control={method.control}
            name={`chequeDetail.${index}.InstrumentDate`}
            render={({ field }) => (
              <ReactDatePicker
                disabled={!isEnable}
                placeholderText="Select date"
                onChange={(date) => field.onChange(date)}
                selected={field.value}
                dateFormat={"dd-MMM-yyyy"}
                className={!isEnable ? "disabled-field" : "binput"}
              />
            )}
          />
        </td>
        <td>
          <Form.Control
            as={"textarea"}
            rows={1}
            disabled={!isEnable}
            className="form-control"
            {...method.register(`chequeDetail.${index}.DetailDescription`)}
            style={{
              fontSize: "0.8em",
            }}
          />
        </td>
        <td>
          <Button
            icon="pi pi-minus"
            severity="danger"
            size="sm"
            type="button"
            style={{
              padding: "0.25rem .7rem",
              borderRadius: "16px",
              fontSize: "0.9em",
            }}
            onClick={() => removeSingleRow(index)}
            disabled={!isEnable}
          />
        </td>
      </tr>
    </>
  );
}
// DD Fields
function DDFields({
  appendSingleRow,
  customerInvoiceInsallments,

  unregister,
}) {
  const [receiptType, setReceiptType] = useState(false);
  const method = useForm({
    ReceiptType: [],
    FromBank: "",
    ReceivedInBankID: [],
    TransactionID: "",
    InvoiceInstallmentID: [],
    Amount: 0,
    DetailDescription: "",
  });

  useEffect(() => {
    unregister("cashDetail");
    unregister("chequeDetail");
    unregister("onlineDetail");
  }, [unregister]);

  function onAdd(data) {
    appendSingleRow(data);
    method.setFocus("Customer");
    unregister("cashDetail");
    method.reset();
  }
  return (
    <>
      <Row className="mb-1">
        <Form.Group as={Col} controlId="ReceiptType" className="col-xl-3">
          <Form.Label>Receipt Type</Form.Label>
          <div>
            <CDropdown
              control={method.control}
              options={receiptTypeOptions}
              name="ReceiptType"
              placeholder="Select a type"
              required={true}
              showOnFocus={true}
              onChange={(e) => {
                setReceiptType(e.value === "Advance");
                if (e.value === "Advance") {
                  method.setValue("InvoiceInstallmentID", []);
                }
              }}
              focusOptions={() => {
                method.setFocus(
                  method.watch("ReceiptType") === "Advance"
                    ? "Amount"
                    : "InvoiceInstallmentID"
                );
              }}
            />
          </div>
        </Form.Group>
        <Form.Group
          className="col-xl-3"
          as={Col}
          controlId="InvoiceInstallmentID"
        >
          <Form.Label>Customer Installments</Form.Label>
          <div>
            <CDropdown
              control={method.control}
              options={customerInvoiceInsallments}
              optionLabel="InstallmentTitle"
              optionValue="InvoiceInstallmentID"
              name="InvoiceInstallmentID"
              placeholder="Select an insallment"
              showOnFocus={true}
              disabled={receiptType}
              required={method.watch("ReceiptType") !== "Advance"}
              focusOptions={() => method.setFocus("Amount")}
            />
          </div>
        </Form.Group>

        <Form.Group className="col-xl-3" as={Col} controlId="Amount">
          <Form.Label>Amount</Form.Label>
          <div>
            <NumberInput
              control={method.control}
              id={`Amount`}
              required={true}
              enterKeyOptions={() => method.setFocus("FromBank")}
            />
          </div>
        </Form.Group>
      </Row>

      <Row>
        <Form.Group as={Col} controlId="DetailDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as={"textarea"}
            rows={1}
            className="small-textarea"
            style={{
              padding: "0.2rem 0.4rem",
              fontSize: "0.9em",
            }}
            {...method.register("DetailDescription")}
          />
        </Form.Group>
        <Form.Group className="col-xl-3" as={Col} controlId="Actions">
          <Form.Label></Form.Label>
          <DetailHeaderActionButtons
            handleAdd={() => method.handleSubmit(onAdd)()}
            handleClear={() => method.reset()}
          />
        </Form.Group>
      </Row>
    </>
  );
}
function DDFieldsDetail({
  ddFieldArray,
  isEnable,
  customerInvoiceInsallments,
  removeSingleRow,
}) {
  return (
    <>
      <table className="table table-responsive mt-2">
        <thead>
          <tr>
            <th
              className="p-2 text-white text-center "
              style={{ width: "2%", background: ddDetailColor }}
            >
              Sr No.
            </th>
            <th
              className="p-2 text-white text-center "
              style={{ width: "10%", background: ddDetailColor }}
            >
              Receipt Type
            </th>
            <th
              className="p-2 text-white text-center "
              style={{ width: "15%", background: ddDetailColor }}
            >
              Customer Installment
            </th>
            <th
              className="p-2 text-white text-center "
              style={{ width: "4%", background: ddDetailColor }}
            >
              Amount
            </th>
            <th
              className="p-2 text-white text-center "
              style={{ width: "10%", background: ddDetailColor }}
            >
              Description
            </th>
            <th
              className="p-2 text-white text-center "
              style={{ width: "4%", background: ddDetailColor }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {ddFieldArray.fields.map((item, index) => {
            return (
              <DDFieldsDetailRow
                key={item.id}
                item={item}
                index={index}
                customerInvoiceInsallments={customerInvoiceInsallments}
                removeSingleRow={removeSingleRow}
                isEnable={isEnable}
              />
            );
          })}
        </tbody>
      </table>
    </>
  );
}
function DDFieldsDetailRow({
  item,
  index,
  customerInvoiceInsallments,
  removeSingleRow,
  isEnable,
}) {
  const method = useFormContext();

  return (
    <>
      <tr key={item.id}>
        <td>
          <input
            id="RowID"
            readOnly
            className="form-control"
            style={{ padding: "0.25rem 0.4rem", fontSize: "0.9em" }}
            value={index + 1}
            disabled={!isEnable}
          />
        </td>
        <td>
          <CDropdown
            control={method.control}
            options={receiptTypeOptions}
            name={`dDDetail.${index}.ReceiptType`}
            placeholder="Select a type"
            required={true}
            showOnFocus={true}
            onChange={(e) => {
              if (e.value === "Advance") {
                method.setValue(`dDDetail.${index}.CustomerInstallments`, []);
              }
            }}
            focusOptions={() => {
              method.setFocus(
                method.watch(`dDDetail.${index}.ReceiptType`) === "Advance"
                  ? `dDDetail.${index}.CashAmount`
                  : `dDDetail.${index}.CustomerInstallments`
              );
            }}
            disabled={!isEnable}
          />
        </td>
        <td>
          <CDropdown
            control={method.control}
            name={`dDDetail.${index}.InvoiceInstallmentID`}
            options={customerInvoiceInsallments}
            optionValue="InvoiceInstallmentID"
            optionLabel="InstallmentTitle"
            placeholder="Select an installment"
            required={
              method.watch(`dDDetail.${index}.ReceiptType`) !== "Advance"
            }
            disabled={
              !isEnable ||
              method.watch(`dDDetail.${index}.ReceiptType`) === "Advance"
            }
            focusOptions={() => method.setFocus(`dDDetail.${index}.Amount`)}
          />
        </td>
        <td>
          <NumberInput
            control={method.control}
            id={`dDDetail.${index}.Amount`}
            enterKeyOptions={() =>
              method.setFocus(`dDDetail.${index}.FromBank`)
            }
            required={true}
            disabled={!isEnable}
          />
        </td>

        <td>
          <Form.Control
            as={"textarea"}
            rows={1}
            disabled={!isEnable}
            className="form-control"
            {...method.register(`dDDetail.${index}.DetailDescription`)}
            style={{
              fontSize: "0.8em",
            }}
          />
        </td>
        <td>
          <Button
            icon="pi pi-minus"
            severity="danger"
            size="sm"
            type="button"
            style={{
              padding: "0.25rem .7rem",
              borderRadius: "16px",
              fontSize: "0.9em",
            }}
            onClick={() => removeSingleRow(index)}
          />
        </td>
      </tr>
    </>
  );
}
// Detail Hooks
function useCashModeDetail(
  control,
  isEnable,
  customerInvoiceInsallments,
  setValue
) {
  const useCashFieldDetailArray = useFieldArray({
    control: control,
    name: "cashDetail",
    rules: {
      required: true,
    },
  });

  function appendAllRows(data) {
    setValue(
      "cashDetail",
      data?.map((item, index) => {
        return {
          ReceiptType: item.RecoveryType,
          CustomerInstallments: item.InvoiceInstallmentID,
          FromBank: item.FromBank,
          ReceivedInBankID: item.ReceivedInBankID,
          TransactionID: item.TransactionID,
          CashAmount: item.Amount,
          CashDescription: item.DetailDescription,
        };
      })
    );
  }

  function appendSingleRow(data) {
    useCashFieldDetailArray.append({
      ReceiptType: data.ReceiptType,
      CustomerInstallments: data.CustomerInstallments,
      CashAmount: data.CashAmount,
      CashDescription: data.CashDescription,
    });
  }

  function removeAllRows() {
    useCashFieldDetailArray.remove();
  }

  function removeSingleRow(index) {
    useCashFieldDetailArray.remove(index);
  }

  return {
    fields: useCashFieldDetailArray.fields,
    appendAllRows,
    appendSingleRow,
    newRowIndex: useCashFieldDetailArray.fields.length + 1,
    removeAllRows,
    removeSingleRow,
    render: (
      <>
        <CashModeDetail
          cashFieldsArray={useCashFieldDetailArray}
          isEnable={isEnable}
          customerInvoiceInsallments={customerInvoiceInsallments}
        />
        <GetCashDetailTotal control={control} />
      </>
    ),
  };
}

function useOnlineModeDetail(
  control,
  isEnable,
  customerInvoiceInsallments,
  banksSelectData,
  setValue
) {
  const useOnlineFieldDetailArray = useFieldArray({
    control: control,
    name: "onlineDetail",
    rules: {
      required: true,
    },
  });

  function appendAllRows(data) {
    setValue(
      "onlineDetail",
      data?.map((item, index) => {
        return {
          ReceiptType: item.RecoveryType,
          InvoiceInstallmentID: item.InvoiceInstallmentID,
          FromBank: item.FromBank,
          ReceivedInBankID: item.ReceivedInBankID,
          TransactionID: item.TransactionID,
          Amount: item.Amount,
          DetailDescription: item.DetailDescription,
        };
      })
    );
  }

  function appendSingleRow(data) {
    useOnlineFieldDetailArray.append(data);
  }

  function removeAllRows() {
    useOnlineFieldDetailArray.remove();
  }

  function removeSingleRow(index) {
    useOnlineFieldDetailArray.remove(index);
  }

  return {
    fields: useOnlineFieldDetailArray.fields,
    appendAllRows,
    appendSingleRow,
    newRowIndex: useOnlineFieldDetailArray.fields.length + 1,
    removeAllRows,
    removeSingleRow,
    render: (
      <>
        <OnlineTransferFieldsDetail
          onlineFieldArray={useOnlineFieldDetailArray}
          isEnable={isEnable}
          customerInvoiceInsallments={customerInvoiceInsallments}
          banksSelectData={banksSelectData}
          removeSingleRow={removeSingleRow}
        />
        <GetOnlineDetailTotal control={control} />
      </>
    ),
  };
}

function useChequeModeDetail(
  control,
  isEnable,
  customerInvoiceInsallments,
  banksSelectData,
  setValue
) {
  const useChequeFieldDetailArray = useFieldArray({
    control: control,
    name: "chequeDetail",
    rules: {
      required: true,
    },
  });

  function appendAllRows(data) {
    // removeAllRows();
    setValue(
      "chequeDetail",
      data?.map((item, index) => {
        return {
          ReceiptType: item.RecoveryType,
          InvoiceInstallmentID: item.InvoiceInstallmentID,
          FromBank: item.FromBank,
          ReceivedInBankID: item.ReceivedInBankID,
          TransactionID: item.InstrumentNo,
          Amount: item.Amount,
          DetailDescription: item.DetailDescription,
          InstrumentDate: parseISO(item.InstrumentDate),
        };
      })
    );
  }

  function appendSingleRow(data) {
    let date = data.InstrumentDate || new Date();
    delete data.InstrumentDate;
    useChequeFieldDetailArray.append(data);
    let newIndex = useChequeFieldDetailArray.fields.length;
    setValue(`chequeDetail.${newIndex}.InstrumentDate`, date);
  }

  function removeAllRows() {
    useChequeFieldDetailArray.remove();
  }

  function removeSingleRow(index) {
    useChequeFieldDetailArray.remove(index);
  }

  return {
    fields: useChequeFieldDetailArray.fields,
    appendAllRows,
    appendSingleRow,
    newRowIndex: useChequeFieldDetailArray.fields.length + 1,
    removeAllRows,
    removeSingleRow,
    render: (
      <>
        <ChequeFieldsDetail
          chequeFieldArray={useChequeFieldDetailArray}
          isEnable={isEnable}
          customerInvoiceInsallments={customerInvoiceInsallments}
          banksSelectData={banksSelectData}
          removeSingleRow={removeSingleRow}
        />
        <GetChequeDetailTotal control={control} />
      </>
    ),
  };
}

function useDDModeDetail(
  control,
  isEnable,
  customerInvoiceInsallments,
  setValue
) {
  const useDDFieldDetailArray = useFieldArray({
    control: control,
    name: "dDDetail",
    rules: {
      required: true,
    },
  });

  function appendAllRows(data) {
    setValue(
      "dDDetail",
      data?.map((item, index) => {
        return {
          ReceiptType: item.RecoveryType,
          InvoiceInstallmentID: item.InvoiceInstallmentID,
          Amount: item.Amount,
          DetailDescription: item.DetailDescription,
        };
      })
    );
  }

  function appendSingleRow(data) {
    useDDFieldDetailArray.append(data);
  }

  function removeAllRows() {
    useDDFieldDetailArray.remove();
  }

  function removeSingleRow(index) {
    useDDFieldDetailArray.remove(index);
  }

  return {
    fields: useDDFieldDetailArray.fields,
    appendAllRows,
    appendSingleRow,
    newRowIndex: useDDFieldDetailArray.fields.length + 1,
    removeAllRows,
    removeSingleRow,
    render: (
      <>
        <DDFieldsDetail
          ddFieldArray={useDDFieldDetailArray}
          isEnable={isEnable}
          customerInvoiceInsallments={customerInvoiceInsallments}
          removeSingleRow={removeSingleRow}
        />
        <GetdDDetailTotal control={control} />
      </>
    ),
  };
}

// Cash Total
function GetCashDetailTotal({ control }) {
  const details = useWatch({
    control,
    name: "cashDetail",
  });
  let total = getTotal("Cash", details);

  return (
    <>
      <hr style={{ margin: "0" }} />
      <Row style={{ justifyContent: "flex-end" }}>
        <Form.Group className="col-xl-3" as={Col} controlId="TotalNetAmount">
          <Form.Label>Total Net Amount</Form.Label>
          <div>
            <NumberInput
              control={control}
              id={`TotalNetAmount`}
              disabled
              value={total}
            />
          </div>
        </Form.Group>
      </Row>
    </>
  );
}

// Online Total
function GetOnlineDetailTotal({ control }) {
  const details = useWatch({
    control,
    name: "onlineDetail",
  });
  let total = getTotal("Online", details);

  return (
    <>
      <hr style={{ margin: "0" }} />
      <Row style={{ justifyContent: "flex-end" }}>
        <Form.Group className="col-xl-3" as={Col} controlId="TotalNetAmount">
          <Form.Label>Total Net Amount</Form.Label>
          <div>
            <NumberInput
              control={control}
              id={`TotalNetAmount`}
              disabled
              value={total}
            />
          </div>
        </Form.Group>
      </Row>
    </>
  );
}

// Cheque Total
function GetChequeDetailTotal({ control }) {
  const details = useWatch({
    control,
    name: "chequeDetail",
  });
  let total = getTotal("Cheque", details);

  return (
    <>
      <hr style={{ margin: "0" }} />
      <Row style={{ justifyContent: "flex-end" }}>
        <Form.Group className="col-xl-3" as={Col} controlId="TotalNetAmount">
          <Form.Label>Total Net Amount</Form.Label>
          <div>
            <NumberInput
              control={control}
              id={`TotalNetAmount`}
              disabled
              value={total}
            />
          </div>
        </Form.Group>
      </Row>
    </>
  );
}

// DD Total
function GetdDDetailTotal({ control }) {
  const details = useWatch({
    control,
    name: "dDDetail",
  });
  let total = getTotal("DD", details);

  return (
    <>
      <hr style={{ margin: "0" }} />
      <Row style={{ justifyContent: "flex-end" }}>
        <Form.Group className="col-xl-3" as={Col} controlId="TotalNetAmount">
          <Form.Label>Total Net Amount</Form.Label>
          <div>
            <NumberInput
              control={control}
              id={`TotalNetAmount`}
              required={true}
              disabled
              value={total}
            />
          </div>
        </Form.Group>
      </Row>
    </>
  );
}

function getTotal(from = "Cash", detail) {
  let total = 0;
  if (from === "Cash") {
    if (detail?.length > 0) {
      for (const item of detail) {
        for (const obj in item) {
          if (obj === "CashAmount") {
            total += item[obj];
          }
        }
      }
    }
  } else {
    if (detail?.length > 0) {
      for (const item of detail) {
        for (const obj in item) {
          if (obj === "Amount") {
            total += item[obj];
          }
        }
      }
    }
  }
  return total;
}

// DP
let renderCountDP = 0;
export function DPForm() {
  renderCountDP++;

  const user = useContext(AuthContext);

  return (
    <>
      <p>{renderCountDP}</p>
      <Master userID={user.userID} />
      <DetailHeader />
    </>
  );
}
let renderCountDPMaster = 0;
function Master({ userID }) {
  renderCountDPMaster++;
  // States
  //   const [CustomerID, setCustomerID] = useState(0);
  //   const [AccountID, setAccountID] = useState(0);
  const { setCustomerID, setAccountID, CustomerID } =
    useReceiptEntryStateProvider();
  const [isEnable, setIsEnable] = useState(true);
  const [receiptMode, setReceiptMode] = useState("");

  // Select Data
  const sessionSelectData = useSessionSelectData();
  const customerSelectData = useOldCustomerSelectData();
  const customerLedgersData = useCustomerLedgersSelectData(CustomerID);
  //
  useEffect(() => {
    function pageSetup() {
      async function fetchReceiptNo() {
        const data = await fetchMaxReceiptNo(userID);
        method.setValue("ReceiptNo", data.data[0]?.VoucherNo);
      }
      fetchReceiptNo();
    }
    pageSetup();
  }, []);

  // Form
  const {
    method,
    removeAllCashRows,
    removeAllOnlineRows,
    removeAllChequeRows,
  } = useReceiptEntryForm();
  return (
    <>
      <p>{renderCountDPMaster}</p>
      <Row>
        <Form.Group className="col-xl-2" as={Col} controlId="Session">
          <Form.Label style={{ fontSize: "14px", fontWeight: "bold" }}>
            Session
            <span className="text-danger fw-bold ">*</span>
          </Form.Label>
          <div>
            <CDropdown
              control={method.control}
              name={`Session`}
              optionLabel="SessionTitle"
              optionValue="SessionID"
              placeholder="Select a session"
              options={sessionSelectData.data}
              required={true}
              disabled={!isEnable}
              focusOptions={() => method.setFocus("Customer")}
            />
          </div>
        </Form.Group>
        <Form.Group className="col-xl-3" as={Col} controlId="Customer">
          <Form.Label>
            Customer
            <span className="text-danger fw-bold ">*</span>
          </Form.Label>
          <div>
            <CDropdown
              control={method.control}
              name={"Customer"}
              options={customerSelectData.data}
              optionLabel="CustomerName"
              optionValue="CustomerID"
              placeholder="Select a customer"
              showOnFocus={true}
              required={true}
              filter={true}
              onChange={(e) => {
                setCustomerID(e.value);
                removeAllCashRows();
                removeAllOnlineRows();
                removeAllChequeRows();
              }}
              onSelect={(e) => {}}
              disabled={!isEnable}
              focusOptions={() => method.setFocus("CustomerLedger")}
            />
          </div>
        </Form.Group>
        <Form.Group className="col-xl-3" as={Col} controlId="CustomerLedger">
          <Form.Label>
            Customer Ledger
            <span className="text-danger fw-bold ">*</span>
          </Form.Label>
          <div>
            <CDropdown
              control={method.control}
              name={"CustomerLedger"}
              options={customerLedgersData.data}
              optionLabel="AccountTitle"
              optionValue="AccountID"
              placeholder="Select a ledger"
              showOnFocus={true}
              required={true}
              filter={true}
              onChange={(e) => {
                setAccountID(e.value);
                removeAllCashRows();
                removeAllOnlineRows();
                removeAllChequeRows();
                //removeAllDDRows();
              }}
              disabled={!isEnable}
              focusOptions={() => method.setFocus("ReceiptMode")}
            />
          </div>
        </Form.Group>
        <Form.Group className="col-xl-2 " as={Col} controlId="ReceiptMode">
          <Form.Label>
            Receipt Mode
            <span className="text-danger fw-bold ">*</span>
          </Form.Label>
          <div>
            <CDropdown
              control={method.control}
              options={receiptModeOptions}
              optionValue="value"
              optionLabel="label"
              name={`ReceiptMode`}
              placeholder="Select receipt mode"
              onChange={(e) => {
                setReceiptMode(e.value);
                method.setValue("InstrumentType", []);
                removeAllCashRows();
                removeAllOnlineRows();
                removeAllChequeRows();
                //removeAllDDRows();
              }}
              showOnFocus={true}
              disabled={!isEnable}
              focusOptions={() =>
                method.setFocus(
                  receiptMode === "Instrument"
                    ? "InstrumentType"
                    : "Description"
                )
              }
            />
          </div>
        </Form.Group>
        <Form.Group className="col-xl-2 " as={Col} controlId="Session">
          <Form.Label style={{ fontSize: "14px", fontWeight: "bold" }}>
            Instrument Type
          </Form.Label>
          <div>
            <CDropdown
              control={method.control}
              name={`InstrumentType`}
              placeholder="Select a type"
              options={instrumentTypeOptions}
              required={receiptMode === "Instrument"}
              disabled={
                !isEnable || !(method.watch("ReceiptMode") === "Instrument")
              }
              focusOptions={() => method.setFocus("Description")}
              onChange={(e) => {
                setReceiptMode(e.value);
                removeAllCashRows();
                removeAllOnlineRows();
                removeAllChequeRows();
                //removeAllDDRows();
              }}
            />
          </div>
        </Form.Group>
      </Row>
      <Row>
        <Form.Group as={Col} controlId="ReceiptNo">
          <Form.Label>Receipt No</Form.Label>

          <div>
            <TextInput
              control={method.control}
              ID={"ReceiptNo"}
              isEnable={false}
            />
          </div>
        </Form.Group>
        <Form.Group as={Col} controlId="ReceiptDate">
          <Form.Label>Date</Form.Label>
          <div>
            <Controller
              disabled={!isEnable}
              control={method.control}
              name="ReceiptDate"
              render={({ field }) => (
                <ReactDatePicker
                  disabled={!isEnable}
                  placeholderText="Select date"
                  onChange={(date) => field.onChange(date)}
                  selected={field.value || new Date()}
                  dateFormat={"dd-MMM-yyyy"}
                  className={!isEnable ? "disabled-field" : "binput"}
                />
              )}
            />
          </div>
        </Form.Group>

        <Form.Group as={Col} controlId="Description" className="col-9">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as={"textarea"}
            rows={1}
            disabled={!isEnable}
            className="form-control"
            style={{
              padding: "0.3rem 0.4rem",
              fontSize: "0.8em",
            }}
            {...method.register("Description")}
          />
        </Form.Group>
      </Row>
    </>
  );
}

let renderCountDH = 0;
function DetailHeader() {
  renderCountDH++;
  const { CustomerID, AccountID } = useReceiptEntryStateProvider();
  const { appendSingleCashRow, method: mainMethod } = useReceiptEntryForm();

  const [receiptType, setReceiptType] = useState(false);

  useEffect(() => {
    mainMethod.unregister("onlineDetail");
    mainMethod.unregister("chequeDetail");
    mainMethod.unregister("dDDetail");
  }, [mainMethod.unregister]);

  const customerInvoiceInsallments = useCustomerInvoiceInstallments(
    CustomerID,
    AccountID
  );

  const method = useForm({
    defaultValues: {
      ReceiptType: [],
      CustomerInstallments: [],
      CashAmount: 0,
      CashDescription: "",
    },
  });

  function onAdd(data) {
    // appendSingleCashRow({
    //   ReceiptType: data.ReceiptType,
    //   CustomerInstallments: data.CustomerInstallments,
    //   CashAmount: data.CashAmount,
    //   CashDescription: data.CashDescription,
    // });
    console.log(data);
    method.reset();
  }

  return (
    <>
      {renderCountDH}
      <Row className="mb-1">
        <Form.Group as={Col} controlId="ReceiptType" className="col-xl-3">
          <Form.Label>Receipt Type</Form.Label>
          <div>
            <CDropdown
              control={method.control}
              options={receiptTypeOptions}
              name="ReceiptType"
              placeholder="Select a type"
              required={true}
              showOnFocus={true}
              onChange={(e) => {
                setReceiptType(e.value === "Advance");
                if (e.value === "Advance") {
                  method.setValue("CustomerInstallments", []);
                }
              }}
              focusOptions={() => {
                method.setFocus(
                  method.watch("ReceiptType") === "Advance"
                    ? "CashAmount"
                    : "CustomerInstallments"
                );
              }}
            />
          </div>
        </Form.Group>
        <Form.Group
          className="col-xl-3"
          as={Col}
          controlId="CustomerInstallments"
        >
          <Form.Label>Customer Installments</Form.Label>
          <div>
            <CDropdown
              control={method.control}
              options={customerInvoiceInsallments.data}
              optionLabel="InstallmentTitle"
              optionValue="InvoiceInstallmentID"
              name="CustomerInstallments"
              placeholder="Select an insallment"
              showOnFocus={true}
              disabled={receiptType}
              focusOptions={() => method.setFocus("CashAmount")}
            />
          </div>
        </Form.Group>

        <Form.Group className="col-xl-3" as={Col} controlId="CashAmount">
          <Form.Label>Amount</Form.Label>
          <div>
            <NumberInput
              control={method.control}
              id={`CashAmount`}
              required={true}
              focusOptions={() => method.setFocus("CashDescription")}
            />
          </div>
        </Form.Group>
      </Row>
      <Row>
        <Form.Group as={Col} controlId="CashDescription">
          <Form.Label>Description</Form.Label>

          <div>
            <CTextArea name={`CashDescription`} control={method.control} />
          </div>
        </Form.Group>
        <Form.Group className="col-xl-3" as={Col} controlId="Actions">
          <Form.Label></Form.Label>
          <DetailHeaderActionButtons
            handleAdd={() => method.handleSubmit(onAdd)()}
            handleClear={() => method.reset()}
          />
        </Form.Group>
      </Row>
    </>
  );
}

function useReceiptEntryForm() {
  const method = useForm();

  const useCashFieldDetailArray = useFieldArray({
    control: method.control,
    name: "cashDetail",
    rules: {
      required: true,
    },
  });

  const useOnlineFieldDetailArray = useFieldArray({
    control: method.control,
    name: "onlineDetail",
    rules: {
      required: true,
    },
  });

  const useChequeFieldDetailArray = useFieldArray({
    control: method.control,
    name: "chequeDetail",
    rules: {
      required: true,
    },
  });

  function appendAllCashRows(data) {
    method.setValue(
      "cashDetail",
      data?.map((item, index) => {
        return {
          ReceiptType: item.RecoveryType,
          CustomerInstallments: item.InvoiceInstallmentID,
          FromBank: item.FromBank,
          ReceivedInBankID: item.ReceivedInBankID,
          TransactionID: item.TransactionID,
          CashAmount: item.Amount,
          CashDescription: item.DetailDescription,
        };
      })
    );
  }

  function appendSingleCashRow(data) {
    useCashFieldDetailArray.append({
      ReceiptType: data.ReceiptType,
      CustomerInstallments: data.CustomerInstallments,
      CashAmount: data.CashAmount,
      CashDescription: data.CashDescription,
    });
  }

  function removeAllCashRows() {
    useCashFieldDetailArray.remove();
  }

  function removeSingleCashRow(index) {
    useCashFieldDetailArray.remove(index);
  }

  function appendAllOnlineRows(data) {
    method.setValue(
      "onlineDetail",
      data?.map((item, index) => {
        return {
          ReceiptType: item.RecoveryType,
          InvoiceInstallmentID: item.InvoiceInstallmentID,
          FromBank: item.FromBank,
          ReceivedInBankID: item.ReceivedInBankID,
          TransactionID: item.TransactionID,
          Amount: item.Amount,
          DetailDescription: item.DetailDescription,
        };
      })
    );
  }

  function appendSingleOnlineRow(data) {
    useOnlineFieldDetailArray.append(data);
  }

  function removeAllOnlineRows() {
    useOnlineFieldDetailArray.remove();
  }

  function removeSingleOnlineRow(index) {
    useOnlineFieldDetailArray.remove(index);
  }

  function appendAllChequeRows(data) {
    method.setValue(
      "chequeDetail",
      data?.map((item, index) => {
        return {
          ReceiptType: item.RecoveryType,
          InvoiceInstallmentID: item.InvoiceInstallmentID,
          FromBank: item.FromBank,
          ReceivedInBankID: item.ReceivedInBankID,
          TransactionID: item.InstrumentNo,
          Amount: item.Amount,
          DetailDescription: item.DetailDescription,
          InstrumentDate: parseISO(item.InstrumentDate),
        };
      })
    );
  }

  function appendSingleChequeRow(data) {
    let date = data.InstrumentDate || new Date();
    delete data.InstrumentDate;
    useChequeFieldDetailArray.append(data);
    let newIndex = useChequeFieldDetailArray.fields.length;
    setValue(`chequeDetail.${newIndex}.InstrumentDate`, date);
  }

  function removeAllChequeRows() {
    useChequeFieldDetailArray.remove();
  }

  function removeSingleChequeRow(index) {
    useChequeFieldDetailArray.remove(index);
  }

  return {
    method,
    cashFieldsArray: useCashFieldDetailArray.fields,
    onlineFieldsArray: useOnlineFieldDetailArray.fields,
    chequeFieldsArray: useChequeFieldDetailArray.fields,
    appendAllCashRows,
    appendAllChequeRows,
    appendAllOnlineRows,
    appendSingleCashRow,
    appendSingleOnlineRow,
    appendSingleChequeRow,
    removeAllCashRows,
    removeAllOnlineRows,
    removeAllChequeRows,
    removeSingleCashRow,
    removeSingleOnlineRow,
    removeSingleChequeRow,
  };
}

function useReceiptEntryStateProvider() {
  const [CustomerID, setCustomerID] = useState(0);
  const [AccountID, setAccountID] = useState(0);

  return {
    CustomerID,
    setCustomerID,
    AccountID,
    setAccountID,
  };
}
