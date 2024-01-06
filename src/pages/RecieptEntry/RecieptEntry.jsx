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
} from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ActionButtons from "../../components/ActionButtons";
import { FilterMatchMode } from "primereact/api";
import { useContext, useEffect, useState } from "react";
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
  fetchReceiptVoucherById,
} from "../../api/ReceiptVoucherData";
import ButtonToolBar from "../CustomerInvoice/CustomerInvoiceToolbar";

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

function ReceiptEntry() {
  document.title = "Reciept Vouchers";
  return (
    <div className="bg__image mt-3">
      <div className=" px-md-5 bg__image">
        <div className=" px-md-4">
          <ReceiptEntrySearch />
        </div>
      </div>
    </div>
  );
}
const apiUrl = import.meta.env.VITE_APP_API_URL;
function ReceiptEntrySearch() {
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
    ReceiptVoucherName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    Address: { value: null, matchMode: FilterMatchMode.CONTAINS },
    LandlineNo: { value: null, matchMode: FilterMatchMode.CONTAINS },
    MobileNo: { value: null, matchMode: FilterMatchMode.CONTAINS },
    Email: { value: null, matchMode: FilterMatchMode.CONTAINS },
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
          `/EduIMS/ReceiptEntryDelete?ReceiptVoucherID=${business.ReceiptVoucherID}&LoginUserID=${user.userID}`
      );
      if (data.success === true) {
        queryClient.invalidateQueries({ queryKey: ["ReceiptEntry"] });
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

export function ReceiptEntryForm({ pagesTitle, mode }) {
  document.title = "Receipt Voucher Entry";
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
    } else if (receiptMode === "Cheque") {
      method.unregister("onlineDetail");
      method.unregister("cashDetail");
    } else if (receiptMode === "Cash") {
      method.unregister("onlineDetail");
      method.unregister("chequeDetail");
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
    bankAccountsSelectData.data
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
        setIsEnable(true);
        method.setValue("Session", sessionSelectData?.data[0]?.SessionID ?? 1);
      }
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
              InstrumentType: null,
              CustomerInvoiceID: null,
              InvoiceInstallmentID:
                item.CustomerInstallments.length === 0
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
        } else if (formData?.onlineDetail.length > 0) {
          ReceiptVoucherDetail = formData?.onlineDetail?.map((item, index) => {
            return {
              RowID: index + 1,
              RecoveryType: item.ReceiptType,
              InstrumentType: null,
              CustomerInvoiceID: null,
              InvoiceInstallmentID:
                item.InvoiceInstallmentID.length === 0
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
        }

        let DataToSend = {
          SessionID: formData?.Session || sessionSelectData[0]?.SessionID,
          VoucherNo: formData?.InvoiceNo || "1",
          VoucherDate: formData?.ReceiptDate || new Date(),
          CustomerID: formData?.Customer,
          AccountID: formData?.CustomerLedger,
          ReceiptMode: formData?.ReceiptMode,
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
    //       `/EduIMS/ReceiptEntryDelete?ReceiptVoucherID=${ReceiptVoucherID}&LoginUserID=${user.userID}`
    //   );
    //   if (data.success === true) {
    //     queryClient.invalidateQueries({ queryKey: ["ReceiptEntry"] });
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

  function onSubmit(data) {
    companyMutation.mutate(data);
  }

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
      // method.setValue("ReceiptDate", ReceiptVoucher?.Master[0]?.VoucherDate);
      method.setValue("Description", ReceiptVoucher?.Master[0]?.Description);
      method.setValue("ReceiptNo", ReceiptVoucher?.Master[0]?.VoucherNo);
      setReceiptMode(ReceiptVoucher?.Master[0]?.ReceiptMode);
      if (ReceiptVoucher?.Master[0]?.ReceiptMode === "Online") {
        appendAllOnlineRows(ReceiptVoucher?.Detail);
      } else if (ReceiptVoucher?.Master[0]?.ReceiptMode === "Cash") {
        appendAllRows(ReceiptVoucher?.Detail);
      } else if (ReceiptVoucher?.Master[0]?.ReceiptMode === "Cheque") {
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
    }
  }

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
                        className="binput"
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

export default ReceiptEntry;

function CashModeFields({
  appendSingleRow,
  customerInvoiceInsallments,
  unregister,
}) {
  const [receiptType, setReceiptType] = useState(false);

  useEffect(() => {
    unregister("onlineDetail");
    unregister("chequeDetail");
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
      <Row className="mt-3 mx-1">
        {/* <CashModeDetail
          method={mainMethod}
          isEnable={isEnable}
          cashFieldsArray={cashFieldsArray}
          customerSelectData={customerSelectData}
        /> */}
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
              className="p-2 bg-info text-white text-center "
              style={{ width: "2rem" }}
            >
              Sr No.
            </th>
            <th
              className="p-2 bg-info text-white text-center "
              style={{ width: "30%" }}
            >
              Receipt Type
            </th>
            <th
              className="p-2 bg-info text-white text-center "
              style={{ width: "30%" }}
            >
              Customer Installment
            </th>
            <th
              className="p-2 bg-info text-white text-center "
              style={{ width: "4%" }}
            >
              Amount
            </th>
            <th
              className="p-2 bg-info text-white text-center "
              style={{ width: "30%" }}
            >
              Description
            </th>
            <th
              className="p-2 bg-info text-white text-center "
              style={{ width: "5%" }}
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
              className="p-2 bg-info text-white text-center "
              style={{ width: "2%" }}
            >
              Sr No.
            </th>
            <th
              className="p-2 bg-info text-white text-center "
              style={{ width: "10%" }}
            >
              Receipt Type
            </th>
            <th
              className="p-2 bg-info text-white text-center "
              style={{ width: "15%" }}
            >
              Customer Installment
            </th>
            <th
              className="p-2 bg-info text-white text-center "
              style={{ width: "4%" }}
            >
              Amount
            </th>
            <th
              className="p-2 bg-info text-white text-center "
              style={{ width: "10%" }}
            >
              From Bank
            </th>
            <th
              className="p-2 bg-info text-white text-center "
              style={{ width: "20%" }}
            >
              Received In Bank
            </th>
            <th
              className="p-2 bg-info text-white text-center "
              style={{ width: "4%" }}
            >
              Transaction ID
            </th>
            <th
              className="p-2 bg-info text-white text-center "
              style={{ width: "10%" }}
            >
              Description
            </th>
            <th
              className="p-2 bg-info text-white text-center "
              style={{ width: "4%" }}
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
              required={true}
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
  useEffect(() => {}, []);
  return (
    <>
      <table className="table table-responsive mt-2">
        <thead>
          <tr>
            <th
              className="p-2 bg-info text-white text-center "
              style={{ width: "2%" }}
            >
              Sr No.
            </th>
            <th
              className="p-2 bg-info text-white text-center "
              style={{ width: "10%" }}
            >
              Receipt Type
            </th>
            <th
              className="p-2 bg-info text-white text-center "
              style={{ width: "15%" }}
            >
              Customer Installment
            </th>
            <th
              className="p-2 bg-info text-white text-center "
              style={{ width: "4%" }}
            >
              Amount
            </th>
            <th
              className="p-2 bg-info text-white text-center "
              style={{ width: "10%" }}
            >
              Instrument Of
            </th>
            <th
              className="p-2 bg-info text-white text-center "
              style={{ width: "20%" }}
            >
              To Bank
            </th>
            <th
              className="p-2 bg-info text-white text-center "
              style={{ width: "4%" }}
            >
              Instrument No
            </th>
            <th
              className="p-2 bg-info text-white text-center "
              style={{ width: "4%" }}
            >
              Instrument Date
            </th>
            <th
              className="p-2 bg-info text-white text-center "
              style={{ width: "10%" }}
            >
              Description
            </th>
            <th
              className="p-2 bg-info text-white text-center "
              style={{ width: "4%" }}
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
          />
        </td>
        <td>
          <Controller
            disabled={!isEnable}
            control={method.control}
            name={`chequeDetail.${index}.InstrumentDate`}
            render={({ field }) => (
              <ReactDatePicker
                disabled={!isEnable}
                placeholderText="Select date"
                onChange={(date) => field.onChange(date)}
                selected={field.value}
                dateFormat={"dd-MMM-yyyy"}
                className="binput"
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
      </>
    ),
  };
}

function useChequeModeDetail(
  control,
  isEnable,
  customerInvoiceInsallments,
  banksSelectData
) {
  const useChequeFieldDetailArray = useFieldArray({
    control: control,
    name: "chequeDetail",
    rules: {
      required: true,
    },
  });

  function appendAllRows(data) {
    // setValue(
    //   "cashDetail",
    //   data?.map((invoice, index) => {
    //     return {
    //       InvoiceType: invoice.InvoiceTypeTitle,
    //       ProductInfo: invoice.ProductToInvoiceID,
    //       ServiceInfo: invoice.ServiceToInvoiceID,
    //       CustomerBranch: invoice.BranchID,
    //       BusinessUnit: invoice.BusinessUnitID,
    //       Qty: invoice.Quantity,
    //       ...invoice,
    //     };
    //   })
    // );
    // if (data.length > 0) {
    //   data.forEach((item, index) => {
    //     filteredProductsBasedOnRow(item.BusinessUnitID, index);
    //     filteredServicesBasedOnRow(item.BusinessUnitID, index);
    //   });
    // }
  }

  function appendSingleRow(data) {
    let date = data.InstrumentDate.toISOString();
    data.InstrumentDate = date;
    useChequeFieldDetailArray.append(data);
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
      </>
    ),
  };
}
