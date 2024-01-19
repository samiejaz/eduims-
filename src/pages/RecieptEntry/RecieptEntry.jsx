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
import React, { useContext, useEffect, useRef, useState } from "react";
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
  addNewReceiptVoucher,
  fetchAllReceiptVoucheres,
  fetchMonthlyMaxReceiptNo,
  fetchReceiptVoucherById,
} from "../../api/ReceiptVoucherData";
import ButtonToolBar from "../CustomerInvoice/CustomerInvoiceToolbar";
import { parseISO } from "date-fns";
import { Tag } from "primereact/tag";
import { QUERY_KEYS, ROUTE_URLS, SELECT_QUERY_KEYS } from "../../utils/enums";
import {
  fetchAllBankAccountsForSelect,
  fetchAllBusinessUnitsForSelect,
  fetchAllCustomerAccountsForSelect,
  fetchAllOldCustomersForSelect,
  fetchAllSessionsForSelect,
} from "../../api/SelectData";
import { Dropdown } from "primereact/dropdown";
import CDatePicker from "../../components/Forms/CDatePicker";
import CNumberInput from "../../components/Forms/CNumberInput";
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

let parentRoute = ROUTE_URLS.ACCOUNTS.RECIEPT_VOUCHER_ROUTE;
let editRoute = `${parentRoute}/edit/`;
let newRoute = `${parentRoute}/new`;
let cashDetailColor = "#22C55E";
let onlineDetailColor = "#F59E0B";
let chequeDetailColor = "#3B82F6";
let ddDetailColor = "#8f48d2";
let queryKey = QUERY_KEYS.RECEIPT_VOUCHER_INFO_QUERY_KEY;

function ReceiptEntry() {
  document.title = "Reciept Vouchers";
  return (
    <div className="mt-5">
      <ReceiptEntrySearch />
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
    VoucherNo: { value: null, matchMode: FilterMatchMode.CONTAINS },
    CustomerName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    AccountTitle: { value: null, matchMode: FilterMatchMode.CONTAINS },
    ReceiptMode: { value: null, matchMode: FilterMatchMode.CONTAINS },
    TotalNetAmount: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const { user } = useContext(AuthContext);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [queryKey],
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
                label="Add New Receipt Voucher"
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
                  () => handleDeleteShow(),
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
export function ReceiptEntryForm({ pagesTitle, mode }) {
  document.title = "Receipt Voucher Entry";
  renderCount++;
  const queryClient = useQueryClient();
  const { ReceiptVoucherID } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  // Ref
  const detailTableRef = useRef();

  // Form
  const method = useForm({
    defaultValues: {
      ReceiptNo: "",
      VoucherDate: new Date(),
      Description: "",
    },
  });

  const { data: ReceiptVoucherData } = useQuery({
    queryKey: [QUERY_KEYS.RECEIPT_VOUCHER_INFO_QUERY_KEY, +ReceiptVoucherID],
    queryFn: () => fetchReceiptVoucherById(+ReceiptVoucherID, user.userID),
    initialData: [],
  });

  const { data: BusinessUnitSelectData } = useQuery({
    queryKey: [QUERY_KEYS.BUSINESS_UNIT_QUERY_KEY],
    queryFn: fetchAllBusinessUnitsForSelect,
    initialData: [],
    enabled: mode !== "",
  });

  const receiptVoucherMutation = useMutation({
    mutationFn: addNewReceiptVoucher,
    onSuccess: () => {},
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

  useEffect(() => {
    if (+ReceiptVoucherID !== 0 && ReceiptVoucherData) {
      // Setting Values
      method.setValue("SessionID", ReceiptVoucherData[0]?.SessionID);
      method.setValue("BusinessUnitID", ReceiptVoucherData[0]?.BusinessUnitID);
      method.setValue("Customer", ReceiptVoucherData[0]?.CustomerID);
      method.setValue("CustomerLedgers", ReceiptVoucherData[0]?.AccountID);
      method.setValue("DocumentNo", ReceiptVoucherData[0]?.DocumentNo);
      method.setValue("VoucherNo", ReceiptVoucherData[0]?.VoucherNo);
      method.setValue(
        "SessionBasedVoucherNo",
        ReceiptVoucherData[0]?.SessionBasedVoucherNo
      );
      method.setValue(
        "SessionBasedVoucherNo",
        ReceiptVoucherData[0]?.SessionBasedVoucherNo
      );
      method.setValue("ReceiptMode", ReceiptVoucherData[0]?.ReceiptMode);
      method.setValue("InstrumentType", ReceiptVoucherData[0]?.InstrumentType);
    }
  }, [+ReceiptVoucherID, ReceiptVoucherData]);

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

  function handleDelete() {
    deleteMutation.mutate({
      ReceiptVoucherID: ReceiptVoucherID,
      LoginUserID: user.userID,
    });
    navigate(parentRoute);
  }

  function onSubmit(data) {
    receiptVoucherMutation.mutate({
      formData: data,
      userID: user.userID,
      ReceiptVoucherID: +ReceiptVoucherID,
    });
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
              saveLoading={receiptVoucherMutation.isPending}
            />
          </div>
          <form id="receiptVoucher" className="mt-4">
            <FormProvider {...method}>
              <Row>
                <SessionSelect mode={mode} />
                <BusinessUnitDependantFields mode={mode} />
                <Form.Group as={Col}>
                  <Form.Label>Date</Form.Label>
                  <div>
                    <CDatePicker
                      control={method.control}
                      name="VoucherDate"
                      disabled={mode === "view"}
                    />
                  </div>
                </Form.Group>
              </Row>
              <Row>
                <CustomerDependentFields
                  mode={mode}
                  removeAllRows={detailTableRef.current?.removeAllRows}
                />
                <ReceiptModeDependantFields
                  mode={mode}
                  removeAllRows={detailTableRef.current?.removeAllRows}
                />
              </Row>
            </FormProvider>

            <Row>
              <Form.Group as={Col} controlId="Description" className="col-9">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as={"textarea"}
                  rows={1}
                  disabled={mode === "view"}
                  className="form-control"
                  style={{
                    padding: "0.3rem 0.4rem",
                    fontSize: "0.8em",
                  }}
                  {...method.register("Description")}
                />
              </Form.Group>
            </Row>
          </form>

          {mode !== "view" && (
            <>
              <div className="card p-2 bg-light mt-2 ">
                <ReceiptDetailHeaderForm
                  appendSingleRow={detailTableRef.current?.appendSingleRow}
                />
              </div>
            </>
          )}

          <FormProvider {...method}>
            <ReceiptDetailTable
              mode={mode}
              BusinessUnitSelectData={BusinessUnitSelectData}
              ref={detailTableRef}
            />
          </FormProvider>

          <DevTool control={method.control} />
        </>
      )}
    </>
  );
}

export default ReceiptEntry;

// New Master Fields
function SessionSelect({ mode }) {
  const { data } = useQuery({
    queryKey: [SELECT_QUERY_KEYS.SESSION_SELECT_QUERY_KEY],
    queryFn: fetchAllSessionsForSelect,
    initialData: [],
  });

  const method = useFormContext();

  useEffect(() => {
    if (data.length > 0) {
      method.setValue("SessionID", data[0]?.SessionID);
    }
  }, [data]);

  return (
    <>
      <Form.Group className="col-xl-2" as={Col}>
        <Form.Label style={{ fontSize: "14px", fontWeight: "bold" }}>
          Session
          <span className="text-danger fw-bold ">*</span>
        </Form.Label>
        <div>
          <CDropdown
            control={method.control}
            name={`SessionID`}
            optionLabel="SessionTitle"
            optionValue="SessionID"
            placeholder="Select a session"
            options={data}
            required={true}
            disabled={mode === "view"}
            focusOptions={() => method.setFocus("BusinessUnitID")}
          />
        </div>
      </Form.Group>
    </>
  );
}

function CustomerDependentFields({ mode, removeAllRows }) {
  const [CustomerID, setCustomerID] = useState(0);

  const { data: customerSelectData } = useQuery({
    queryKey: [QUERY_KEYS.ALL_CUSTOMER_QUERY_KEY],
    queryFn: fetchAllOldCustomersForSelect,
    initialData: [],
  });

  const { data: CustomerAccounts } = useQuery({
    queryKey: [QUERY_KEYS.CUSTOMER_ACCOUNTS_QUERY_KEY, CustomerID],
    queryFn: () => fetchAllCustomerAccountsForSelect(CustomerID),
    initialData: [],
  });

  const method = useFormContext();

  return (
    <>
      <Form.Group as={Col}>
        <Form.Label>
          Customer Name
          <span className="text-danger fw-bold ">*</span>
        </Form.Label>

        <div>
          <CDropdown
            control={method.control}
            name={"Customer"}
            optionLabel="CustomerName"
            optionValue="CustomerID"
            placeholder="Select a customer"
            options={customerSelectData}
            disabled={mode === "view"}
            required={true}
            filter={true}
            onChange={(e) => {
              setCustomerID(e.value);
              removeAllRows();
            }}
            focusOptions={() => method.setFocus("CustomerLedgers")}
          />
        </div>
      </Form.Group>
      <Form.Group as={Col}>
        <Form.Label>
          Customer Ledgers
          <span className="text-danger fw-bold ">*</span>
        </Form.Label>

        <div>
          <CDropdown
            control={method.control}
            name={`CustomerLedgers`}
            optionLabel="AccountTitle"
            optionValue="AccountID"
            placeholder="Select a ledger"
            options={CustomerAccounts}
            disabled={mode === "view"}
            required={true}
            onChange={() => {
              removeAllRows();
            }}
            focusOptions={() => method.setFocus("ReceiptMode")}
          />
        </div>
      </Form.Group>
    </>
  );
}

function BusinessUnitDependantFields({ mode }) {
  const [BusinesssUnitID, setBusinessUnitID] = useState(0);

  const { data: BusinessUnitSelectData } = useQuery({
    queryKey: [QUERY_KEYS.BUSINESS_UNIT_QUERY_KEY],
    queryFn: fetchAllBusinessUnitsForSelect,
    initialData: [],
    enabled: mode !== "",
  });
  useEffect(() => {
    if (BusinessUnitSelectData.length > 0) {
      method.setValue(
        "BusinessUnitID",
        BusinessUnitSelectData[0].BusinessUnitID
      );
      setBusinessUnitID(BusinessUnitSelectData[0].BusinessUnitID);
    }
  }, [BusinessUnitSelectData]);

  useEffect(() => {
    async function fetchReceiptNo() {
      const data = await fetchMonthlyMaxReceiptNo(BusinesssUnitID);
      console.log(data);
      method.setValue("VoucherNo", data.data[0]?.VoucherNo);
      method.setValue(
        "SessionBasedVoucherNo",
        data.data[0]?.SessionBasedVoucherNo
      );
    }

    if (BusinesssUnitID !== 0) {
      fetchReceiptNo();
    }
  }, [BusinesssUnitID]);

  const method = useFormContext();

  return (
    <>
      <Form.Group as={Col} className="col-3">
        <Form.Label>
          Business Unit
          <span className="text-danger fw-bold ">*</span>
        </Form.Label>

        <div>
          <CDropdown
            control={method.control}
            name={`BusinessUnitID`}
            optionLabel="BusinessUnitName"
            optionValue="BusinessUnitID"
            placeholder="Select a business unit"
            options={BusinessUnitSelectData}
            disabled={mode === "view"}
            required={true}
            focusOptions={() => method.setFocus("Customer")}
            onChange={(e) => {
              setBusinessUnitID(e.value);
            }}
          />
        </div>
      </Form.Group>
      <Form.Group as={Col} className="col-sm-2">
        <Form.Label>Receipt No(Monthly)</Form.Label>

        <div>
          <TextInput
            control={method.control}
            ID={"VoucherNo"}
            isEnable={false}
          />
        </div>
      </Form.Group>
      <Form.Group as={Col} className="col-sm-2">
        <Form.Label>Receipt No(Yearly)</Form.Label>

        <div>
          <TextInput
            control={method.control}
            ID={"SessionBasedVoucherNo"}
            isEnable={false}
          />
        </div>
      </Form.Group>
      <Form.Group as={Col}>
        <Form.Label>Document No</Form.Label>

        <div>
          <TextInput control={method.control} ID={"DocumentNo"} />
        </div>
      </Form.Group>
    </>
  );
}

function ReceiptModeDependantFields({ mode, removeAllRows }) {
  const [receiptMode, setReceiptMode] = useState("");

  const method = useFormContext();

  function ShowSection() {
    if (receiptMode === "Online") {
      return (
        <>
          <MasterBankFields mode={mode} />
        </>
      );
    } else if (receiptMode === "DD" || receiptMode === "Cheque") {
      return (
        <>
          <MasterBankFields
            mode={mode}
            FromBankTitle="Instrument Of"
            ReceivedInBankTitle="In Bank"
            TranstactionIDTitle="Instrument No"
          />
          <Form.Group as={Col}>
            <Form.Label style={{ fontSize: "14px", fontWeight: "bold" }}>
              Instrument Date
            </Form.Label>
            <div>
              <CDatePicker
                control={method.control}
                name="InstrumentDate"
                disabled={mode === "view"}
              />
            </div>
          </Form.Group>
        </>
      );
    }
  }

  function emptyAllFieldsOnReceiptModeChange() {
    method.resetField("FromBank");
    method.resetField("InstrumentDate");
    method.resetField("ReceivedInBankID");
    method.resetField("TransactionID");
  }

  return (
    <>
      <Form.Group className="col-xl-2 " as={Col}>
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
              emptyAllFieldsOnReceiptModeChange();
            }}
            showOnFocus={true}
            disabled={mode === "view"}
            focusOptions={(e) => {
              method.setFocus(
                e.value === "Instrument" ? "InstrumentType" : "Description"
              );
            }}
          />
        </div>
      </Form.Group>

      <Form.Group className="col-xl-2 " as={Col}>
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
              mode === "view" ||
              receiptMode === "Cash" ||
              receiptMode === "Online"
            }
            focusOptions={() => method.setFocus("Description")}
            onChange={(e) => {
              setReceiptMode(e.value);
              removeAllRows();
              emptyAllFieldsOnReceiptModeChange();
            }}
          />
        </div>
      </Form.Group>

      <Row>
        <ShowSection />
      </Row>
    </>
  );
}

const MasterBankFields = ({
  mode,
  FromBankTitle = "From Bank",
  ReceivedInBankTitle = "Receieved In Bank",
  TranstactionIDTitle = "TransactionID",
}) => {
  const { data } = useQuery({
    queryKey: [SELECT_QUERY_KEYS.BANKS_SELECT_QUERY_KEY],
    queryFn: fetchAllBankAccountsForSelect,
    initialData: [],
  });

  const method = useFormContext();

  return (
    <>
      <Form.Group as={Col}>
        <Form.Label>{FromBankTitle}</Form.Label>
        <div>
          <TextInput
            ID={"FromBank"}
            control={method.control}
            required={true}
            focusOptions={() => method.setFocus("ReceivedInBankID")}
            isEnable={mode !== "view"}
          />
        </div>
      </Form.Group>
      <Form.Group as={Col}>
        <Form.Label>{ReceivedInBankTitle}</Form.Label>
        <div>
          <CDropdown
            control={method.control}
            options={data}
            optionValue="BankAccountID"
            optionLabel="BankAccountTitle"
            name="ReceivedInBankID"
            placeholder="Select a bank"
            required={true}
            disabled={mode === "view"}
            focusOptions={() => method.setFocus("TransactionID")}
          />
        </div>
      </Form.Group>
      <Form.Group as={Col}>
        <Form.Label>{TranstactionIDTitle}</Form.Label>
        <div>
          <TextInput
            control={method.control}
            ID={"TransactionID"}
            required={true}
            isEnable={mode !== "view"}
            focusOptions={() => method.setFocus("IntrumentDate")}
          />
        </div>
      </Form.Group>
    </>
  );
};

// New Detail Header Form
function ReceiptDetailHeaderForm({ appendSingleRow }) {
  const method = useForm();

  function onSubmit(data) {
    appendSingleRow(data);
    method.reset();
  }

  return (
    <>
      <form>
        <Row>
          <FormProvider {...method}>
            <DetailHeaderBusinessUnitDependents />
          </FormProvider>
        </Row>
        <Row>
          <Form.Group as={Col} controlId="Description" className="col-9">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as={"textarea"}
              rows={1}
              className="form-control"
              style={{
                padding: "0.3rem 0.4rem",
                fontSize: "0.8em",
              }}
              {...method.register("Description")}
            />
          </Form.Group>
          <Form.Group className="col-xl-3" as={Col} controlId="Actions">
            <Form.Label></Form.Label>
            <DetailHeaderActionButtons
              handleAdd={() => method.handleSubmit(onSubmit)()}
              handleClear={() => method.reset()}
            />
          </Form.Group>
        </Row>
      </form>
    </>
  );
}

function DetailHeaderBusinessUnitDependents() {
  const { data: BusinessUnitSelectData } = useQuery({
    queryKey: [QUERY_KEYS.BUSINESS_UNIT_QUERY_KEY],
    queryFn: fetchAllBusinessUnitsForSelect,
    initialData: [],
  });

  const method = useFormContext();

  return (
    <>
      <Form.Group as={Col} className="col-3">
        <Form.Label>
          Business Unit
          <span className="text-danger fw-bold ">*</span>
        </Form.Label>

        <div>
          <CDropdown
            control={method.control}
            name={`BusinessUnitID`}
            optionLabel="BusinessUnitName"
            optionValue="BusinessUnitID"
            placeholder="Select a business unit"
            options={BusinessUnitSelectData}
            required={true}
            focusOptions={() => method.setFocus("Customer")}
          />
        </div>
      </Form.Group>
      <Form.Group as={Col} className="col-3">
        <Form.Label>
          Balance
          <span className="text-danger fw-bold ">*</span>
        </Form.Label>

        <div>
          <CNumberInput
            control={method.control}
            name="BalanceAmount"
            disabled={true}
          />
        </div>
      </Form.Group>
      <Form.Group as={Col} className="col-3">
        <Form.Label>
          Amount
          <span className="text-danger fw-bold ">*</span>
        </Form.Label>

        <div>
          <CNumberInput control={method.control} name={"Amount"} />
        </div>
      </Form.Group>
    </>
  );
}

const ReceiptDetailTable = React.forwardRef(
  ({ mode, BusinessUnitSelectData }, ref) => {
    const method = useFormContext();

    const { fields, append, remove } = useFieldArray({
      control: method.control,
      name: "receiptDetail",
      rules: {
        required: true,
      },
    });

    React.useImperativeHandle(ref, () => ({
      appendSingleRow(data) {
        append(data);
      },
      removeAllRows() {
        remove();
      },
    }));

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
                Business Unit
              </th>

              <th
                className="p-2 text-white text-center "
                style={{ width: "4%", background: chequeDetailColor }}
              >
                Balance
              </th>

              <th
                className="p-2 text-white text-center "
                style={{ width: "4%", background: chequeDetailColor }}
              >
                Amount
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
            <FormProvider {...method}>
              {fields.map((item, index) => {
                return (
                  <ReceiptDetailTableRow
                    key={item.id}
                    item={item}
                    index={index}
                    disable={mode === "view"}
                    BusinessUnitSelectData={BusinessUnitSelectData}
                    remove={remove}
                  />
                );
              })}
            </FormProvider>
          </tbody>
        </table>
      </>
    );
  }
);

function ReceiptDetailTableRow({
  item,
  index,
  BusinessUnitSelectData,
  remove,
  disable = false,
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
            disabled={disable}
          />
        </td>
        <td>
          <CDropdown
            control={method.control}
            options={BusinessUnitSelectData}
            name={`receiptDetail.${index}.BusinessUnitID`}
            placeholder="Select a business unit"
            optionLabel="BusinessUnitName"
            optionValue="BusinessUnitID"
            required={true}
            showOnFocus={true}
            disabled={disable}
          />
        </td>

        <td>
          <CNumberInput
            name={`receiptDetail.${index}.Balance`}
            control={method.control}
            enterKeyOptions={() =>
              method.setFocus(`receiptDetail.${index}.Amount`)
            }
            disabled={disable}
          />
        </td>
        <td>
          <CNumberInput
            name={`receiptDetail.${index}.Amount`}
            control={method.control}
            enterKeyOptions={() =>
              method.setFocus(`receiptDetail.${index}.Description`)
            }
            required={true}
            disabled={disable}
          />
        </td>

        <td>
          <Form.Control
            as={"textarea"}
            rows={1}
            disabled={disable}
            className="form-control"
            {...method.register(`receiptDetail.${index}.Description`)}
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
            onClick={() => remove(index)}
          />
        </td>
      </tr>
    </>
  );
}
