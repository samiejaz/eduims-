import { Row, Form, Col, Spinner } from "react-bootstrap";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { toast } from "react-toastify";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ActionButtons from "../../components/ActionButtons";
import { FilterMatchMode } from "primereact/api";
import { useContext, useEffect, useState } from "react";
import useEditModal from "../../hooks/useEditModalHook";
import useDeleteModal from "../../hooks/useDeleteModalHook";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";
import ReactDatePicker from "react-datepicker";
import TextInput from "../../components/Forms/TextInput";
import NumberInput from "../../components/Forms/NumberInput";
import {
  useBusinessUnitsSelectData,
  useCustomerInvoiceInstallments,
  useCustomerInvoicesSelectData,
  useOldCustomerSelectData,
  useSessionSelectData,
} from "../../hooks/SelectData/useSelectData";
import DetailHeaderActionButtons from "../../components/DetailHeaderActionButtons";
import CDropdown from "../../components/Forms/CDropdown";
import CTextArea from "../../components/Forms/CTextArea";

const receiptModeOptions = [
  { value: "Cash", label: "Cash" },
  { value: "Online", label: "Online Transfer" },
  { value: "Cheque", label: "Cheque" },
];
const customerInvoiceOptions = [
  {
    InvoiceID: 1,
    InvoiceTitle: "Invoice 1",
  },
  {
    InvoiceID: 2,
    InvoiceTitle: "Invoice 2",
  },
];
const customerInstallmentsOptions = [
  {
    InstallmentID: 1,
    InstallmentTitle: "Installment 1",
  },
  {
    InstallmentID: 2,
    InstallmentTitle: "Installment 2",
  },
];

function ReceiptEntry() {
  document.title = "Reciept Vouchers";
  return (
    <div className="bg__image mt-5">
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
    queryKey: ["ReceiptEntry"],
    queryFn: () => fetchAllReceiptEntry(user.userID),
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
    navigate("/customers/ReceiptEntry/" + id);
    handleEditClose();
    setIdToEdit(0);
  }

  function handleView(id) {
    navigate("/customers/ReceiptEntry/" + id);
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
          <div className="d-flex text-dark p-3 mb-4 ">
            <h2 className="text-center my-auto">Business Units</h2>
            <div className="text-end my-auto" style={{ marginLeft: "10px" }}>
              <Button
                label="Add New"
                icon="pi pi-plus"
                type="button"
                className="rounded"
                onClick={() => navigate(`/customers/ReceiptEntry/new`)}
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
              field="ReceiptVoucherName"
              filter
              filterPlaceholder="Search by reciept"
              sortable
              header="Company"
              style={{ minWidth: "20rem" }}
            ></Column>
            <Column
              field="Address"
              sortable
              header="Address"
              filter
              filterPlaceholder="Search by address"
            ></Column>
            <Column
              field="LandlineNo"
              sortable
              header="LandlineNo"
              filter
              filterPlaceholder="Search by landline no"
            ></Column>
            <Column
              field="MobileNo"
              sortable
              header="MobileNo"
              filter
              filterPlaceholder="Search by mobile no"
            ></Column>
            <Column
              field="Email"
              sortable
              header="Email"
              filter
              filterPlaceholder="Search by email"
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
  const [isLoading, setIsLoading] = useState(false);
  const [isEnable, setIsEnable] = useState(false);
  const [receiptMode, setReceiptMode] = useState("");
  const params = useParams();
  const navigate = useNavigate();
  // Form
  const method = useForm();
  const cashFieldsArray = useFieldArray({
    control: method.control,
    name: "cash",
  });
  const { user } = useContext(AuthContext);

  const customerSelectData = useOldCustomerSelectData();
  const sessionSelectData = useSessionSelectData();
  const businessUnitData = useBusinessUnitsSelectData();

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
        const data = [];
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

  //   const companyMutation = useMutation({
  //     mutationFn: async (formData) => {
  //       let newFormData = new FormData();
  //       newFormData.append("ReceiptVoucherName", formData.ReceiptVoucherName);
  //       newFormData.append("Address", formData.Address || "");
  //       newFormData.append("LandlineNo", formData.LandlineNo || "");
  //       newFormData.append("MobileNo", formData.MobileNo || "");
  //       newFormData.append("Email", formData.Email || "");
  //       newFormData.append("Website", formData.Website || "");
  //       newFormData.append(
  //         "AuthorityPersonName",
  //         formData.AuthorityPersonName || ""
  //       );
  //       newFormData.append("AuthorityPersonNo", formData.AuthorityPersonNo || "");
  //       newFormData.append(
  //         "AuthorityPersonEmail",
  //         formData.AuthorityPersonEmail || ""
  //       );
  //       newFormData.append("NTNno", formData.NTNno || "");
  //       newFormData.append("STRNo", formData.STRNo || "");
  //       newFormData.append("Description", formData.Description || "");
  //       newFormData.append("EntryUserID", user.userID);
  //       newFormData.append("Inactive", formData.InActive === false ? 0 : 1);
  //       if (ReceiptVoucherID !== 0) {
  //         newFormData.append(
  //           "ReceiptVoucherID",
  //           ReceiptVoucher?.data[0]?.ReceiptVoucherID
  //         );
  //       } else {
  //         newFormData.append("ReceiptVoucherID", 0);
  //       }

  //       let file = convertBase64StringToFile(imgData);
  //       newFormData.append("image", file);

  //       const { data } = await axios.post(
  //         "http://192.168.9.110:90/api/EduIMS/ReceiptEntryInsertUpdate",
  //         newFormData,
  //         {
  //           headers: {
  //             "Content-Type": "multipart/form-data",
  //           },
  //         }
  //       );

  //       if (data.success === true) {
  //         queryClient.invalidateQueries({ queryKey: ["ReceiptEntry"] });
  //         if (ReceiptVoucherID !== 0) {
  //           toast.success("Business Unit updated successfully!");
  //           navigate(`/customers/customerInvoice/${ReceiptVoucherID}`);
  //         } else {
  //           toast.success("Business Unit created successfully!");
  //           // navigate(`/customers/customerInvoice/${data?.ReceiptVoucherID}`);
  //         }

  //         setEditImage(false);
  //         setImgData("");
  //       } else {
  //         toast.error(data.message, {
  //           autoClose: 1500,
  //         });
  //       }
  //     },
  //     onError: (err) => {
  //       toast.error("Something went wrong", {
  //         autoClose: 1000,
  //       });
  //     },
  //   });

  //   const deleteMutation = useMutation({
  //     mutationFn: async () => {
  //       const { data } = await axios.post(
  //         apiUrl +
  //           `/EduIMS/ReceiptEntryDelete?ReceiptVoucherID=${ReceiptVoucherID}&LoginUserID=${user.userID}`
  //       );
  //       if (data.success === true) {
  //         queryClient.invalidateQueries({ queryKey: ["ReceiptEntry"] });
  //         toast.success("Business successfully deleted!");
  //         setReceiptVoucher(undefined);
  //         setReceiptVoucherID(0);
  //         method.reset();
  //         setIsEnable(true);
  //         setKey("search");
  //       } else {
  //         toast.error(data.message, {
  //           autoClose: 2000,
  //         });
  //       }
  //     },
  //   });

  //   function onSubmit(data) {
  //     companyMutation.mutate(data);
  //   }

  //   function handleEdit() {
  //     navigate(`/customers/ReceiptEntry/edit/${ReceiptVoucherID}`);
  //   }

  //   function handleAddNew() {
  //     navigate(`/customers/ReceiptEntry/new`);
  //   }

  //   function handleCancel() {
  //     if (mode === "new") {
  //       navigate(`/customers/ReceiptEntry`);
  //     } else if (mode === "edit") {
  //       navigate(`/customers/ReceiptEntry/${ReceiptVoucherID}`);
  //     }
  //   }

  //   useEffect(() => {
  //     if (ReceiptVoucherID !== 0 && ReceiptVoucher?.data) {
  //       setValue(
  //         "ReceiptVoucherName",
  //         ReceiptVoucher?.data[0]?.ReceiptVoucherName
  //       );
  //       setValue("Address", ReceiptVoucher?.data[0]?.Address);
  //       setValue("LandlineNo", ReceiptVoucher?.data[0]?.LandlineNo);
  //       setValue("MobileNo", ReceiptVoucher?.data[0]?.MobileNo);
  //       setValue("Email", ReceiptVoucher?.data[0]?.Email);
  //       setValue("Website", ReceiptVoucher?.data[0]?.Website);
  //       setValue(
  //         "AuthorityPersonName",
  //         ReceiptVoucher?.data[0]?.AuthorityPersonName
  //       );
  //       setValue("AuthorityPersonNo", ReceiptVoucher?.data[0]?.AuthorityPersonNo);
  //       setValue(
  //         "AuthorityPersonEmail",
  //         ReceiptVoucher?.data[0]?.AuthorityPersonEmail
  //       );
  //       setValue("NTNno", ReceiptVoucher?.data[0]?.NTNno);
  //       setValue("STRNo", ReceiptVoucher?.data[0]?.STRNo);
  //       setValue("Description", ReceiptVoucher?.data[0]?.Description);
  //       setValue("InActive", ReceiptVoucher?.data[0]?.InActive);
  //       setImgData(ReceiptVoucher?.data[0]?.Logo);
  //     }
  //   }, [ReceiptVoucher, ReceiptVoucherID]);

  //   function handleDelete() {
  //     deleteMutation.mutate({
  //       ReceiptVoucherID: ReceiptVoucherID,
  //       LoginUserID: user.userID,
  //     });
  //     navigate(`/customers/ReceiptEntry`);
  //   }

  function onSubmit(data) {
    console.log(data);
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
          {/* <div className="shadow-sm mb-1">
            <ButtonToolBar
              editDisable={mode !== "view"}
              cancelDisable={mode === "view"}
              addNewDisable={mode === "edit" || mode === "new"}
              deleteDisable={mode === "edit" || mode === "new"}
              saveLabel={mode === "edit" ? "Update" : "Save"}
              handleGoBack={() => navigate("/customers/ReceiptEntry")}
              handleEdit={() => handleEdit()}
              handleCancel={() => {
                handleCancel();
              }}
              handleAddNew={() => {
                handleAddNew();
              }}
              handleSave={() => handleSubmit(onSubmit)()}
              handleDelete={() => handleDelete()}
            />
          </div> */}
          <Button
            label="Submit"
            severity="success"
            type="button"
            onClick={() => method.handleSubmit(onSubmit)()}
          />
          <form
            id="ReceiptEntry"
            // onKeyDown={preventFormByEnterKeySubmission}
            className="mt-5"
          >
            <Row>
              <Form.Group className="col-xl-3 " as={Col} controlId="Session">
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
                    focusOptions={() => method.setFocus("BusinessUnit")}
                  />
                </div>
              </Form.Group>
              <Form.Group
                className="col-xl-3 "
                as={Col}
                controlId="BusinessUnit"
              >
                <Form.Label>Business Unit</Form.Label>
                <div>
                  <CDropdown
                    control={method.control}
                    options={businessUnitData.data}
                    optionValue="BusinessUnitID"
                    optionLabel="BusinessUnitName"
                    name={`BusinessUnit`}
                    placeholder="Select a business unit"
                    required={true}
                    showOnFocus={true}
                    focusOptions={() => method.setFocus("ReceiptMode")}
                  />
                </div>
              </Form.Group>
              <Form.Group
                className="col-xl-3 "
                as={Col}
                controlId="ReceiptMode"
              >
                <Form.Label>Receipt Mode</Form.Label>
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
                    }}
                    showOnFocus={true}
                  />
                </div>
              </Form.Group>
              <Form.Group as={Col} controlId="InoviceDate">
                <Form.Label>Date</Form.Label>

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
              <Form.Group as={Col} controlId="ReceiptNo">
                <Form.Label>Receipt No</Form.Label>

                <div>
                  <TextInput
                    control={method.control}
                    ID={"ReceiptNo"}
                    disabled={true}
                  />
                </div>
              </Form.Group>
            </Row>
            {/* Cash Row */}
            {receiptMode === "Cash" && (
              <>
                <div className="card p-2 bg-light mt-2">
                  <CashModeFields
                    mainMethod={method}
                    isEnable={isEnable}
                    customerSelectData={customerSelectData.data}
                    cashFieldsArray={cashFieldsArray}
                  />
                </div>
              </>
            )}
            {/* Online Transfer Fields */}
            {receiptMode === "Online" && (
              <>
                <OnlineTransferFields method={method} isEnable={isEnable} />
              </>
            )}
            {/* Cheque Fields */}
            {receiptMode === "Cheque" && (
              <>
                <ChequeFields method={method} isEnable={isEnable} />
              </>
            )}
          </form>
        </>
      )}
    </>
  );
}

export default ReceiptEntry;

function CashModeFields({
  mainMethod,
  cashFieldsArray,
  isEnable,
  customerSelectData,
}) {
  const method = useForm({
    defaultValues: {
      Customer: [],
      CustomerInvoice: [],
      CustomerInstallments: [],
      CashAmount: null,
      Description: "",
    },
  });

  function onAdd(data) {
    cashFieldsArray.append(data);
    method.setFocus("Customer");
    method.reset();
  }

  const [CustomerID, setCustomerID] = useState(0);
  const [CustomerInvoiceID, setCustomerInvoiceID] = useState(0);

  const customerInvoicesSelectData = useCustomerInvoicesSelectData(CustomerID);
  const customerInvoiceInstallmentsSelectData =
    useCustomerInvoiceInstallments(CustomerInvoiceID);

  return (
    <>
      <Row className="mb-1">
        <Form.Group className="col-xl-3" as={Col} controlId="Customer">
          <Form.Label>Customer</Form.Label>
          <div>
            {/* <Controller
              name="Customer"
              control={method.control}
              rules={{ required: "Customer is required." }}
              render={({ field, fieldState }) => (
                <Dropdown
                  id={field.name}
                  value={field.value}
                  optionLabel="CustomerName"
                  optionValue="CustomerID"
                  placeholder="Select a customer"
                  options={customerSelectData}
                  focusInputRef={field.ref}
                  onChange={(e) => {
                    field.onChange(e.value);
                    setCustomerID(e.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      method.setFocus("CustomerInvoice");
                    }
                  }}
                  showOnFocus
                  filter
                  className={classNames({
                    "p-invalid": fieldState.error,
                  })}
                  style={{ width: "100%" }}
                  pt={{
                    input: {
                      style: {
                        padding: "0.25rem 0.4rem",
                        fontSize: ".9em",
                      },
                    },
                    item: {
                      style: {
                        padding: "0.4rem 0.4rem",
                      },
                    },
                  }}
                />
              )}
            /> */}
            <CDropdown
              control={method.control}
              name={"Customer"}
              options={customerSelectData}
              optionLabel="CustomerName"
              optionValue="CustomerID"
              placeholder="Select a customer"
              showOnFocus={true}
              required={true}
              onChange={(e) => {
                setCustomerID(e.value);
              }}
              focusOptions={() => method.setFocus("CustomerInvoice")}
            />
          </div>
        </Form.Group>
        <Form.Group className="col-xl-3" as={Col} controlId="CustomerInvoice">
          <Form.Label>Customer Invoices</Form.Label>
          <div>
            <CDropdown
              control={method.control}
              options={customerInvoiceOptions}
              optionValue="InvoiceID"
              optionLabel="InvoiceTitle"
              name="CustomerInvoice"
              placeholder="Select an invoice"
              required={true}
              showOnFocus={true}
              onChange={(e) => {
                setCustomerInvoiceID(e.value);
              }}
              focusOptions={() => method.setFocus("CustomerInstallments")}
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
              options={customerInstallmentsOptions}
              optionLabel="InstallmentTitle"
              optionValue="InstallmentID"
              name="CustomerInstallments"
              placeholder="Select an insallment"
              showOnFocus={true}
              focusOptions={() => method.setFocus("CashAmount")}
            />
          </div>
        </Form.Group>

        <Form.Group className="col-xl-3" as={Col} controlId="Amount">
          <Form.Label>Amount</Form.Label>
          <div>
            <NumberInput
              control={method.control}
              id={`CashAmount`}
              required={true}
              focusOptions={() => method.setFocus("Description")}
            />
          </div>
        </Form.Group>
      </Row>
      <Row>
        <Form.Group as={Col} controlId="Description">
          <Form.Label>Description</Form.Label>

          <div>
            <CTextArea name={`Description`} control={method.control} />
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
        <CashModeDetail
          method={mainMethod}
          isEnable={isEnable}
          cashFieldsArray={cashFieldsArray}
          customerSelectData={customerSelectData}
        />
      </Row>
    </>
  );
}
function CashModeDetail({
  method,
  isEnable,
  cashFieldsArray,
  customerSelectData,
}) {
  return (
    <>
      <table className="table">
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
              Customer
            </th>
            <th
              className="p-2 bg-info text-white text-center "
              style={{ width: "30%" }}
            >
              Customer Invoice
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
                  />
                </td>
                <td>
                  <CDropdown
                    control={method.control}
                    options={customerSelectData}
                    optionValue="CustomerID"
                    optionLabel="CustomerName"
                    name={`cash.${index}.Customer`}
                    placeholder="Select a customer"
                    required={true}
                  />
                </td>
                <td>
                  <CDropdown
                    control={method.control}
                    options={customerInvoiceOptions}
                    optionValue="InvoiceID"
                    optionLabel="InvoiceTitle"
                    name={`cash.${index}.CustomerInvoice`}
                    placeholder="Select an invoice"
                    required={true}
                  />
                </td>
                <td>
                  <NumberInput
                    control={method.control}
                    id={`cash.${index}.CashAmount`}
                  />
                </td>
                <td>
                  <Form.Control
                    as={"textarea"}
                    rows={1}
                    disabled={!isEnable}
                    className="form-control"
                    {...method.register(`cash.${index}.Description`)}
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
function OnlineTransferFields({ method, isEnable }) {
  return (
    <>
      <Row>
        <Form.Group className="col-xl-3 " as={Col} controlId="FromBank">
          <Form.Label>From Bank</Form.Label>
          <div>
            {/* <Controller
              name="FromBank"
              control={method.control}
              rules={{ required: "Bank is required." }}
              render={({ field, fieldState }) => (
                <Dropdown
                  id={field.name}
                  value={field.value}
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Select receipt mode"
                  options={receiptModeOptions}
                  focusInputRef={field.ref}
                  onChange={(e) => field.onChange(e.value)}
                  showOnFocus
                  className={classNames({
                    "p-invalid": fieldState.error,
                  })}
                  style={{ width: "100%" }}
                  pt={{
                    input: {
                      style: {
                        padding: "0.25rem 0.4rem",
                        fontSize: ".9em",
                      },
                    },
                    item: {
                      style: {
                        padding: "0.4rem 0.4rem",
                      },
                    },
                  }}
                />
              )}
            /> */}
            <CDropdown
              control={method.control}
              options={customerInvoiceOptions}
              optionValue="InvoiceID"
              optionLabel="InvoiceTitle"
              name="FromBank"
              placeholder="Select a bank"
              required={true}
            />
          </div>
        </Form.Group>
        <Form.Group className="col-xl-3 " as={Col} controlId="RecievedInBank">
          <Form.Label>Recieved In Back</Form.Label>
          <div>
            {/* <Controller
              name="BusinessUnit"
              control={method.control}
              rules={{ required: "Receipt mode is required." }}
              render={({ field, fieldState }) => (
                <Dropdown
                  id={field.name}
                  value={field.value}
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Select receipt mode"
                  options={receiptModeOptions}
                  focusInputRef={field.ref}
                  onChange={(e) => field.onChange(e.value)}
                  showOnFocus
                  className={classNames({
                    "p-invalid": fieldState.error,
                  })}
                  style={{ width: "100%" }}
                  pt={{
                    input: {
                      style: {
                        padding: "0.25rem 0.4rem",
                        fontSize: ".9em",
                      },
                    },
                    item: {
                      style: {
                        padding: "0.4rem 0.4rem",
                      },
                    },
                  }}
                />
              )}
            /> */}
            <CDropdown
              control={method.control}
              options={customerInvoiceOptions}
              optionValue="InvoiceID"
              optionLabel="InvoiceTitle"
              name="RecievedInBank"
              placeholder="Select a bank"
              required={true}
            />
          </div>
        </Form.Group>
        <Form.Group className="col-xl-3 " as={Col} controlId="Customer">
          <Form.Label>Customer</Form.Label>
          <div>
            {/* <Controller
              name="BusinessUnit"
              control={method.control}
              rules={{ required: "Receipt mode is required." }}
              render={({ field, fieldState }) => (
                <Dropdown
                  id={field.name}
                  value={field.value}
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Select receipt mode"
                  options={receiptModeOptions}
                  focusInputRef={field.ref}
                  onChange={(e) => field.onChange(e.value)}
                  showOnFocus
                  className={classNames({
                    "p-invalid": fieldState.error,
                  })}
                  style={{ width: "100%" }}
                  pt={{
                    input: {
                      style: {
                        padding: "0.25rem 0.4rem",
                        fontSize: ".9em",
                      },
                    },
                    item: {
                      style: {
                        padding: "0.4rem 0.4rem",
                      },
                    },
                  }}
                />
              )}
            /> */}
            <CDropdown
              control={method.control}
              options={customerInvoiceOptions}
              optionValue="InvoiceID"
              optionLabel="InvoiceTitle"
              name="Customer"
              placeholder="Select a bank"
              required={true}
            />
          </div>
        </Form.Group>
        <Form.Group className="col-xl-3 " as={Col} controlId="TransactionID">
          <Form.Label>Transaction ID</Form.Label>
          <div>
            {/* <Controller
              name="BusinessUnit"
              control={method.control}
              rules={{ required: "Receipt mode is required." }}
              render={({ field, fieldState }) => (
                <Dropdown
                  id={field.name}
                  value={field.value}
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Select receipt mode"
                  options={receiptModeOptions}
                  focusInputRef={field.ref}
                  onChange={(e) => field.onChange(e.value)}
                  showOnFocus
                  className={classNames({
                    "p-invalid": fieldState.error,
                  })}
                  style={{ width: "100%" }}
                  pt={{
                    input: {
                      style: {
                        padding: "0.25rem 0.4rem",
                        fontSize: ".9em",
                      },
                    },
                    item: {
                      style: {
                        padding: "0.4rem 0.4rem",
                      },
                    },
                  }}
                />
              )}
            /> */}
            <TextInput ID={"TransactionID"} control={method.control} />
          </div>
        </Form.Group>
      </Row>
      <Row>
        <Form.Group className="col-xl-3" as={Col} controlId="Amount">
          <Form.Label>Amount</Form.Label>
          <div>
            <NumberInput
              control={method.control}
              id={"Amount"}
              prefix="Rs "
              style={{ width: "100%" }}
            />
          </div>
        </Form.Group>
        <Form.Group as={Col} controlId="Description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as={"textarea"}
            rows={1}
            disabled={!isEnable}
            className="small-textarea"
            style={{
              padding: "0.2rem 0.4rem",
              fontSize: "0.9em",
            }}
            {...method.register("Description")}
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
  method,
  isEnable,
  onlineTransferFieldsArray,
  customerSelectData,
}) {
  return (
    <>
      <table className="table">
        <thead>
          <tr>
            <th className="p-2 bg-info text-white" style={{ width: "2rem" }}>
              Sr No.
            </th>
            <th className="p-2 bg-info text-white" style={{ width: "20%" }}>
              From Bank
            </th>
            <th className="p-2 bg-info text-white" style={{ width: "20%" }}>
              Received In Bank
            </th>
            <th className="p-2 bg-info text-white" style={{ width: "20%" }}>
              Customer
            </th>
            <th className="p-2 bg-info text-white" style={{ width: "10%" }}>
              Tansaction ID
            </th>
            <th className="p-2 bg-info text-white" style={{ width: "10%" }}>
              Amount
            </th>
            <th className="p-2 bg-info text-white" style={{ width: "10%" }}>
              Description
            </th>
            <th className="p-2 bg-info text-white" style={{ width: "5%" }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {onlineTransferFieldsArray.fields.map((item, index) => {
            return (
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
                  {/* <Controller
                    name={`cash.${index}.Customer`}
                    control={method.control}
                    rules={{ required: "Customer is required." }}
                    render={({ field, fieldState }) => (
                      <Dropdown
                        id={field.name}
                        value={field.value}
                        optionLabel="CustomerName"
                        optionValue="CustomerID"
                        placeholder="Select a customer"
                        options={customerSelectData}
                        focusInputRef={field.ref}
                        onChange={(e) => field.onChange(e.value)}
                        showOnFocus
                        className={classNames({
                          "p-invalid": fieldState.error,
                        })}
                        style={{ width: "100%" }}
                        pt={{
                          input: {
                            style: {
                              padding: "0.25rem 0.4rem",
                              fontSize: ".9em",
                            },
                          },
                          item: {
                            style: {
                              padding: "0.4rem 0.4rem",
                            },
                          },
                        }}
                      />
                    )}
                  /> */}
                  <CDropdown
                    control={method.control}
                    options={customerInvoiceOptions}
                    optionValue="InvoiceID"
                    optionLabel="InvoiceTitle"
                    name={`cash.${index}.Customer`}
                    placeholder="Select a bank"
                    required={true}
                  />
                </td>
                <td>
                  <Controller
                    name={`cash.${index}.CustomerInvoice`}
                    control={method.control}
                    rules={{ required: "Invoice is required." }}
                    render={({ field, fieldState }) => (
                      <Dropdown
                        id={field.name}
                        value={field.value}
                        optionLabel="InvoiceTitle"
                        optionValue="InvoiceID"
                        placeholder="Select a customer invoice"
                        options={customerInvoiceOptions}
                        focusInputRef={field.ref}
                        onChange={(e) => field.onChange(e.value)}
                        showOnFocus
                        className={classNames({
                          "p-invalid": fieldState.error,
                        })}
                        style={{ width: "100%" }}
                        pt={{
                          input: {
                            style: {
                              padding: "0.25rem 0.4rem",
                              fontSize: ".9em",
                            },
                          },
                          item: {
                            style: {
                              padding: "0.4rem 0.4rem",
                            },
                          },
                        }}
                      />
                    )}
                  />
                </td>
                <td>
                  <NumberInput
                    control={method.control}
                    id={`cash.${index}.CashAmount`}
                  />
                </td>
                <td>
                  <Form.Control
                    as={"textarea"}
                    rows={1}
                    disabled={!isEnable}
                    className="form-control"
                    {...method.register(`cash.${index}.Description`)}
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
                    onClick={() => onlineTransferFieldsArray.remove(index)}
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
// Cheque Fields
function ChequeFields({ method, isEnable }) {
  return (
    <>
      <Row>
        <Form.Group className="col-xl-3 " as={Col} controlId="BusinessUnit">
          <Form.Label>Of Bank</Form.Label>
          <div>
            <Controller
              name="BusinessUnit"
              control={method.control}
              rules={{ required: "Receipt mode is required." }}
              render={({ field, fieldState }) => (
                <Dropdown
                  id={field.name}
                  value={field.value}
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Select receipt mode"
                  options={receiptModeOptions}
                  focusInputRef={field.ref}
                  onChange={(e) => field.onChange(e.value)}
                  showOnFocus
                  className={classNames({
                    "p-invalid": fieldState.error,
                  })}
                  style={{ width: "100%" }}
                  pt={{
                    input: {
                      style: {
                        padding: "0.25rem 0.4rem",
                        fontSize: ".9em",
                      },
                    },
                    item: {
                      style: {
                        padding: "0.4rem 0.4rem",
                      },
                    },
                  }}
                />
              )}
            />
          </div>
        </Form.Group>
        <Form.Group className="col-xl-3 " as={Col} controlId="BusinessUnit">
          <Form.Label>Cheque No</Form.Label>
          <div>
            <TextInput ID={"Cheque No"} control={method.control} />
          </div>
        </Form.Group>
        <Form.Group as={Col} controlId="InoviceDate">
          <Form.Label>Date</Form.Label>
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

        <Form.Group as={Col} controlId="ChequeCashed">
          <Form.Label></Form.Label>
          <div className="form-control">
            <Form.Check
              aria-label="Cheque Cashed"
              label="Cheque Cashed"
              {...method.register("ChequeCashed", {
                disabled: !isEnable,
              })}
            />
          </div>
        </Form.Group>
        <Form.Group as={Col} controlId="AddedInBank">
          <Form.Label> </Form.Label>
          <div className="form-control">
            <Form.Check
              aria-label="Added In Bank"
              label="Added In Bank"
              {...method.register("AddedInBank", {
                disabled: !isEnable,
              })}
            />
          </div>
        </Form.Group>
      </Row>
      <Row>
        <Form.Group as={Col} controlId="Description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as={"textarea"}
            rows={1}
            disabled={!isEnable}
            className="form-control"
            {...method.register("Description")}
          />
        </Form.Group>
        <Form.Group className="col-xl-3" as={Col} controlId="Amount">
          <Form.Label></Form.Label>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <Button
              label="Add"
              severity="success"
              type="button"
              style={{ borderRadius: "16px" }}
            />
            <Button
              label="Clear"
              severity="danger"
              type="button"
              style={{ borderRadius: "16px" }}
            />
          </div>
        </Form.Group>
      </Row>
    </>
  );
}
