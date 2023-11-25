import TabHeader from "../../components/TabHeader";
import { Controller, useForm } from "react-hook-form";
import {
  BankAccountOpeningDataContext,
  BankAccountOpeningDataProivder,
} from "./BankAccountOpeningDataContext";
import { Form, Row, Col, Spinner } from "react-bootstrap";
import Select from "react-select";
import { useContext, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ButtonRow from "../../components/ButtonRow";
import { toast } from "react-toastify";
import axios from "axios";
import { ActiveKeyContext } from "../../context/ActiveKeyContext";
import useEditModal from "../../hooks/useEditModalHook";
import useDeleteModal from "../../hooks/useDeleteModalHook";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import ActionButtons from "../../components/ActionButtons";
import { FilterMatchMode } from "primereact/api";
import { useState, useEffect } from "react";
import {
  deleteBankAccountByID,
  fetchAllBankAccounts,
  fetchBankAccountById,
} from "../../api/BankAccountData";
import { fetchAllBusinessUnitsForSelect } from "../../api/SelectData";
import { preventFormByEnterKeySubmission } from "../../utils/CommonFunctions";

const apiUrl = import.meta.env.VITE_APP_API_URL;

function BankAccountOpening() {
  document.title = "Bank Account Opening";
  return (
    <BankAccountOpeningDataProivder>
      <TabHeader
        Search={<BankAccountOpeningSearch />}
        Entry={<BankAccountOpeningEntry />}
        SearchTitle={"Bank Account Openings"}
        EntryTitle={"Add new opening"}
      />
    </BankAccountOpeningDataProivder>
  );
}
function BankAccountOpeningSearch() {
  const queryClient = useQueryClient();

  const { user } = useContext(AuthContext);
  const { setKey } = useContext(ActiveKeyContext);

  const [filters, setFilters] = useState({
    BankAccountTitle: { value: null, matchMode: FilterMatchMode.CONTAINS },
    AccountNo: { value: null, matchMode: FilterMatchMode.CONTAINS },
    IbanNo: { value: null, matchMode: FilterMatchMode.CONTAINS },
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

  const { setIsEnable, setBankAccountID } = useContext(
    BankAccountOpeningDataContext
  );

  const {
    data: BankAccounts,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["bankAccountOpenings"],
    queryFn: () => fetchAllBankAccounts(user.userID),
    initialData: [],
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBankAccountByID,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bankAccountOpenings"] });
      toast.success("Bank account successfully deleted!");
    },
  });
  function handleEdit(BankAccountID) {
    setBankAccountID(BankAccountID);
    setIsEnable(true);
    setKey("entry");
    handleEditClose();
    setIdToEdit(0);
  }
  function handleDelete(BankAccountID) {
    deleteMutation.mutate({ BankAccountID, LoginUserID: user.userID });
    handleDeleteClose();
    setIdToDelete(0);
    setBankAccountID(null);
  }
  function handleView(BankAccountID) {
    setKey("entry");
    setBankAccountID(BankAccountID);
    setIsEnable(false);
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
          <DataTable
            showGridlines
            value={BankAccounts}
            dataKey="BankAccountID"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            removableSort
            emptyMessage="No bank account found!"
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
                  rowData.BankAccountID,
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
              field="BankAccountTitle"
              filter
              filterPlaceholder="Search by BankAccount"
              sortable
              header="BankAccount"
              style={{ minWidth: "20rem" }}
            ></Column>
            <Column
              field="AccountNo"
              filter
              filterPlaceholder="Search by Account No"
              sortable
              header="Account No"
              style={{ minWidth: "20rem" }}
            ></Column>
            <Column
              field="IbanNo"
              filter
              filterPlaceholder="Search by IBAN No"
              sortable
              header="IBAN No"
              style={{ minWidth: "20rem" }}
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
  BankAccountTitle: "",
  BusinessUnit: [],
  BranchName: "",
  BranchCode: "",
  AccountNo: "",
  IbanNo: "",
};

function BankAccountOpeningEntry() {
  const queryClient = useQueryClient();
  const [BankAccount, setBankAccount] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const {
    handleSubmit,
    register,
    control,
    reset,
    setValue,
    formState: { isDirty, isValid },
  } = useForm(defaultValues);

  const { user } = useContext(AuthContext);
  const { isEnable, setIsEnable, setBankAccountID, BankAccountID } = useContext(
    BankAccountOpeningDataContext
  );
  const { setKey } = useContext(ActiveKeyContext);
  const formRef = useRef();

  useEffect(() => {
    async function fetchBankAccount() {
      if (
        BankAccountID !== undefined &&
        BankAccountID !== null &&
        BankAccountID !== 0
      ) {
        setIsLoading(true);
        const data = await fetchBankAccountById(BankAccountID, user.userID);
        if (!data) {
          setKey("search");
          toast.error("Network Error Occured!", {
            position: "bottom-left",
          });
        }
        setBankAccount(data);
        setIsLoading(false);
      } else {
        setBankAccount(null);
        setIsEnable(true);
        reset(defaultValues);
        setTimeout(() => {
          resetSelectValues();
        }, 200);
      }
    }
    if (BankAccountID !== 0) {
      fetchBankAccount();
    }
  }, [BankAccountID]);

  const { data } = useQuery({
    queryKey: ["businessUnits"],
    queryFn: () => fetchAllBusinessUnitsForSelect(),
    initialData: [],
  });

  const bankAccountMutation = useMutation({
    mutationFn: async (formData) => {
      const dataToSend = {
        BankAccountID: 0,
        BankAccountTitle: formData.BankAccountTitle,
        BusinessUnitID: formData.BusinessUnit.BusinessUnitID,
        BranchName: formData.BranchName || "",
        BranchCode: formData.BranchCode || "",
        AccountNo: formData.AccountNo || "",
        IbanNo: formData.IbanNo || "",
        InActive: formData.InActive ? 1 : 0,
        EntryUserID: user.userID,
      };

      if (BankAccount?.data[0]?.BankAccountID !== undefined) {
        dataToSend.BankAccountID = BankAccount?.data[0]?.BankAccountID;
      } else {
        dataToSend.BankAccountID = 0;
      }

      const { data } = await axios.post(
        apiUrl + `/EduIMS/BankAccountInsertUpdate`,
        dataToSend
      );

      if (data.success === true) {
        setBankAccountID(0);
        reset();
        resetSelectValues();
        setIsEnable(true);
        setKey("search");
        queryClient.invalidateQueries({ queryKey: ["bankAccountOpenings"] });

        if (BankAccount?.data[0]?.BankAccountID !== undefined) {
          toast.success("BankAccount Info updated successfully!");
        } else {
          toast.success("BankAccount Info saved successfully!");
        }
      } else {
        toast.error(data.message, {
          autoClose: 1500,
        });
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBankAccountByID,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bankAccountOpenings"] });
      toast.success("Bank account successfully deleted!");
      setBankAccount(undefined);
      setBankAccountID(0);
      reset();
      setIsEnable(true);
      setKey("search");
    },
  });

  useEffect(() => {
    if (BankAccountID !== 0 && BankAccount?.data) {
      () => resetSelectValues();
      if (BankAccount?.data[0]?.BusinessUnitID !== 0) {
        setValue("BusinessUnit", {
          BusinessUnitID: BankAccount?.data[0]?.BusinessUnitID,
          BusinessUnitName: BankAccount?.data[0]?.BusinessUnitName,
        });
      }
      setValue("BankAccountTitle", BankAccount?.data[0]?.BankAccountTitle);
      setValue("BranchName", BankAccount?.data[0]?.BranchName);
      setValue("BranchCode", BankAccount?.data[0]?.BranchCode);
      setValue("AccountNo", BankAccount?.data[0]?.AccountNo);
      setValue("IbanNo", BankAccount?.data[0]?.IbanNo);
      setValue("InActive", BankAccount?.data[0]?.InActive === 1 ? true : false);
    }
  }, [BankAccountID, BankAccount]);

  function onSubmit(data) {
    bankAccountMutation.mutate(data);
  }

  function handleEdit() {
    setIsEnable(true);
  }

  function handleAddNew() {
    setBankAccount(undefined);
    setBankAccountID(0);
    setTimeout(() => {
      resetSelectValues();
    }, 200);
    reset();
    setIsEnable(true);
  }

  function handleCancel() {
    setBankAccount(undefined);
    setBankAccountID(0);
    setTimeout(() => {
      resetSelectValues();
    }, 200);
    setValue("BusinessUnit", []);
    reset();
    setIsEnable(true);
    //formRef.current.reset();
  }

  function handleDelete() {
    deleteMutation.mutate({
      BankAccountID: BankAccountID,
      LoginUserID: user.userID,
    });
  }

  function resetSelectValues() {
    setValue("BusinessUnit", []);
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
          <h4 className="p-3 mb-4 bg-light text-dark text-center  ">
            Bank Account Opening
          </h4>

          <form
            onSubmit={handleSubmit(onSubmit)}
            ref={formRef}
            onKeyDown={preventFormByEnterKeySubmission}
          >
            <Row className="p-3" style={{ marginTop: "-25px" }}>
              <Form.Group as={Col} controlId="BankAccountTitle">
                <Form.Label>Bank Account Title</Form.Label>
                <span className="text-danger fw-bold ">*</span>
                <Form.Control
                  type="text"
                  placeholder=""
                  required
                  className="form-control"
                  {...register("BankAccountTitle", {
                    disabled: !isEnable,
                  })}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="BusinessUnit">
                <Form.Label>Business Unit</Form.Label>
                <span className="text-danger fw-bold ">*</span>
                <Controller
                  control={control}
                  name="BusinessUnit"
                  render={({ field: { onChange, value } }) => (
                    <Select
                      isDisabled={!isEnable}
                      options={data}
                      required
                      getOptionValue={(option) => option.BusinessUnitID}
                      getOptionLabel={(option) => option.BusinessUnitName}
                      value={value}
                      onChange={(selectedOption) => onChange(selectedOption)}
                      placeholder="Select a business unit"
                      noOptionsMessage={() => "No business units found!"}
                      isClearable
                    />
                  )}
                />
              </Form.Group>
            </Row>
            <Row className="p-3" style={{ marginTop: "-25px" }}>
              <Form.Group as={Col} controlId="BranchName">
                <Form.Label>Branch Name</Form.Label>

                <Form.Control
                  type="text"
                  placeholder=""
                  className="form-control"
                  {...register("BranchName", {
                    disabled: !isEnable,
                  })}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="BranchCode">
                <Form.Label>Branch Code</Form.Label>

                <Form.Control
                  type="text"
                  placeholder=""
                  className="form-control"
                  {...register("BranchCode", {
                    disabled: !isEnable,
                  })}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="AccountNo">
                <Form.Label>Account No</Form.Label>

                <Form.Control
                  type="text"
                  placeholder=""
                  className="form-control"
                  {...register("AccountNo", {
                    disabled: !isEnable,
                  })}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="IbanNo">
                <Form.Label>IBAN No</Form.Label>

                <Form.Control
                  type="text"
                  placeholder=""
                  className="form-control"
                  {...register("IbanNo", {
                    disabled: !isEnable,
                  })}
                />
              </Form.Group>
            </Row>
            <Row className="p-3" style={{ marginTop: "-25px" }}>
              <Form.Group as={Col} controlId="InActive">
                <Form.Check
                  aria-label="Inactive"
                  label="Inactive"
                  {...register("InActive", {
                    disabled: !isEnable,
                  })}
                />
              </Form.Group>
            </Row>

            <ButtonRow
              isDirty={isDirty}
              isValid={isValid}
              editMode={isEnable}
              isSubmitting={bankAccountMutation.isPending}
              handleAddNew={handleAddNew}
              handleCancel={handleCancel}
              viewRecord={!isEnable}
              editRecord={isEnable && (BankAccount ? true : false)}
              newRecord={BankAccount ? false : true}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          </form>
        </>
      )}
    </>
  );
}
export default BankAccountOpening;
