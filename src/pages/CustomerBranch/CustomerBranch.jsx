import TabHeader from "../../components/TabHeader";
import { Controller, useForm } from "react-hook-form";

import { Form, Row, Col, Spinner } from "react-bootstrap";
import Select from "react-select";
import { useContext } from "react";
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

import { fetchAllOldCustomersForSelect } from "../../api/SelectData";

import {
  CustomerBranchDataProivder,
  CustomerBranchDataContext,
} from "./CustomerBranchDataContext";
import {
  deleteCustomerBranchByID,
  fetchAllCustomerBranches,
  fetchCustomerBranchById,
} from "../../api/CustomerBranchData";
import { preventFormByEnterKeySubmission } from "../../utils/CommonFunctions";
import { AppConfigurationContext } from "../../context/AppConfigurationContext";

const apiUrl = import.meta.env.VITE_APP_API_URL;

function CustomerBranch() {
  const { pageTitles } = useContext(AppConfigurationContext);
  document.title = `${pageTitles?.branch || "Customer Branch"}`;
  return (
    <CustomerBranchDataProivder>
      <TabHeader
        Search={<CustomerBranchSearch pageTitles={pageTitles} />}
        Entry={<CustomerBranchEntry pageTitles={pageTitles} />}
        SearchTitle={"Bank Account Openings"}
        EntryTitle={"Add new opening"}
      />
    </CustomerBranchDataProivder>
  );
}

function CustomerBranchSearch({ pageTitles }) {
  const queryClient = useQueryClient();

  const { user } = useContext(AuthContext);
  const { setKey } = useContext(ActiveKeyContext);

  const [filters, setFilters] = useState({
    CustomerBranchTitle: { value: null, matchMode: FilterMatchMode.CONTAINS },
    CustomerName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    ContactPersonName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    ContactPersonNo: { value: null, matchMode: FilterMatchMode.CONTAINS },
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

  const { setIsEnable, setCustomerBranchID } = useContext(
    CustomerBranchDataContext
  );

  const {
    data: CustomerBranches,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["customerBranch"],
    queryFn: () => fetchAllCustomerBranches(user.userID),
    initialData: [],
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCustomerBranchByID,
    onSuccess: (response) => {
      if (response === true) {
        queryClient.invalidateQueries({ queryKey: ["customerBranch"] });
      }
    },
  });

  function handleEdit(CustomerBranchID) {
    setCustomerBranchID(CustomerBranchID);
    setIsEnable(true);
    setKey("entry");
    handleEditClose();
    setIdToEdit(0);
  }
  function handleDelete(CustomerBranchID) {
    deleteMutation.mutate({ CustomerBranchID, LoginUserID: user.userID });
    handleDeleteClose();
    setIdToDelete(0);
    setCustomerBranchID(null);
  }
  function handleView(CustomerBranchID) {
    setKey("entry");
    setCustomerBranchID(CustomerBranchID);
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
            value={CustomerBranches}
            dataKey="CustomerBranchID"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            removableSort
            emptyMessage={`No customer ${
              pageTitles?.branch?.toLowerCase() || "customer branch"
            } found!`}
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
                  rowData.CustomerBranchID,
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
              field="CustomerBranchTitle"
              filter
              filterPlaceholder={`Search by ${
                pageTitles?.branch || "Customer Branch"
              }`}
              sortable
              header={`Customer ${pageTitles?.branch || "Product"}`}
              style={{ minWidth: "20rem" }}
            ></Column>
            <Column
              field="CustomerName"
              filter
              filterPlaceholder="Search by Customer"
              sortable
              header="Customer"
              style={{ minWidth: "20rem" }}
            ></Column>
            <Column
              field="ContactPersonName"
              filter
              filterPlaceholder="Search by Person"
              sortable
              header="Contact Person Name"
              style={{ minWidth: "20rem" }}
            ></Column>
            <Column
              field="ContactPersonNo"
              filter
              filterPlaceholder="Search by Person No"
              sortable
              header="Contact Person No"
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
  CustomerBranchTitle: "",
  Customers: [],
  BranchAddress: "",
  BranchCode: "",
  ContactPersonName: "",
  ContactPersonNo: "",
  ContactPersonEmail: "",
  Description: "",
  InActive: false,
};

function CustomerBranchEntry({ pageTitles }) {
  const queryClient = useQueryClient();
  const [CustomerBranch, setCustomerBranch] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const {
    handleSubmit,
    register,
    control,
    reset,
    setValue,
    formState: { errors, isDirty, isValid },
  } = useForm();

  const { user } = useContext(AuthContext);
  const { isEnable, setIsEnable, setCustomerBranchID, CustomerBranchID } =
    useContext(CustomerBranchDataContext);
  const { setKey } = useContext(ActiveKeyContext);

  useEffect(() => {
    async function fetchCustomerBranch() {
      if (
        CustomerBranchID !== undefined &&
        CustomerBranchID !== null &&
        CustomerBranchID !== 0
      ) {
        setIsLoading(true);
        const data = await fetchCustomerBranchById(
          CustomerBranchID,
          user.userID
        );
        if (!data) {
          setKey("search");
          toast.error("Network Error Occured!", {
            position: "bottom-left",
          });
        }
        setCustomerBranch(data);
        setIsLoading(false);
      } else {
        setCustomerBranch(null);
        setTimeout(() => {
          reset(defaultValues);
          setIsEnable(true);
        }, 200);
      }
    }
    if (CustomerBranchID !== 0) {
      fetchCustomerBranch();
    }
  }, [CustomerBranchID]);

  const { data } = useQuery({
    queryKey: ["oldcustomers"],
    queryFn: () => fetchAllOldCustomersForSelect(),
    initialData: [],
  });

  const customerBranchMutation = useMutation({
    mutationFn: async (formData) => {
      const dataToSend = {
        CustomerBranchID: 0,
        CustomerID: formData.Customers.CustomerID,
        CustomerBranchTitle: formData.CustomerBranchTitle,
        BranchAddress: formData.BranchAddress,
        ContactPersonName: formData.ContactPersonName,
        ContactPersonNo: formData.ContactPersonNo,
        ContactPersonEmail: formData.ContactPersonEmail,
        Description: formData.Description,
        InActive: formData.InActive ? 1 : 0,
        EntryUserID: user.userID,
      };

      if (CustomerBranch?.data[0]?.CustomerBranchID !== undefined) {
        dataToSend.CustomerBranchID = CustomerBranch?.data[0]?.CustomerBranchID;
      } else {
        dataToSend.CustomerBranchID = 0;
      }

      const { data } = await axios.post(
        apiUrl + `/EduIMS/CustomerBranchInsertUpdate`,
        dataToSend
      );

      if (data.success === true) {
        setCustomerBranchID(0);
        reset();
        resetSelectValues();
        setIsEnable(true);
        setKey("search");
        queryClient.invalidateQueries({ queryKey: ["customerBranch"] });

        if (CustomerBranch?.data[0]?.CustomerBranchID !== undefined) {
          toast.success(
            `Customer ${
              pageTitles?.branch || "Customer Branch"
            } Info updated successfully!`
          );
        } else {
          toast.success(
            `Customer ${
              pageTitles?.branch || "Customer Branch"
            } Info saved successfully!`
          );
        }
      } else {
        toast.error(data.message, {
          autoClose: 1500,
        });
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCustomerBranchByID,
    onSuccess: (response) => {
      if (response === true) {
        queryClient.invalidateQueries({ queryKey: ["customerBranch"] });
        setCustomerBranch(undefined);
        setCustomerBranchID(0);
        reset();
        setIsEnable(true);
        setKey("search");
      }
    },
  });

  useEffect(() => {
    if (CustomerBranchID !== 0 && CustomerBranch?.data) {
      () => resetSelectValues();
      if (CustomerBranch?.data[0]?.CustomerID !== 0) {
        setValue("Customers", {
          CustomerID: CustomerBranch?.data[0]?.CustomerID,
          CustomerName: CustomerBranch?.data[0]?.CustomerName,
        });
      }
      setValue(
        "CustomerBranchTitle",
        CustomerBranch?.data[0]?.CustomerBranchTitle
      );
      setValue("BranchAddress", CustomerBranch?.data[0]?.BranchAddress);
      setValue("ContactPersonName", CustomerBranch?.data[0]?.ContactPersonName);
      setValue("ContactPersonNo", CustomerBranch?.data[0]?.ContactPersonNo);
      setValue(
        "ContactPersonEmail",
        CustomerBranch?.data[0]?.ContactPersonEmail
      );
      setValue("Description", CustomerBranch?.data[0]?.Description);

      setValue("InActive", CustomerBranch?.data[0]?.InActive);
    }
  }, [CustomerBranchID, CustomerBranch]);

  function onSubmit(data) {
    customerBranchMutation.mutate(data);
  }

  function handleEdit() {
    setIsEnable(true);
  }

  function handleAddNew() {
    setCustomerBranch(undefined);
    setCustomerBranchID(0);
    setTimeout(() => {
      resetSelectValues();
    }, 200);
    reset();
    setIsEnable(true);
  }

  function handleCancel() {
    setCustomerBranch(undefined);
    setCustomerBranchID(0);
    setTimeout(() => {
      resetSelectValues();
    }, 200);
    setValue("Customers", []);
    reset();
    setIsEnable(true);
  }

  function handleDelete() {
    deleteMutation.mutate({
      CustomerBranchID: CustomerBranchID,
      LoginUserID: user.userID,
    });
  }

  function resetSelectValues() {
    setValue("Customers", []);
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
            {pageTitles?.branch || "Customer Branch"} Entry
          </h4>

          <form
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={preventFormByEnterKeySubmission}
          >
            <Row className="p-3" style={{ marginTop: "-25px" }}>
              <Form.Group as={Col} controlId="CustomerBranchTitle">
                <Form.Label>
                  {pageTitles?.branch || "Customer Branch"} Title
                </Form.Label>
                <span className="text-danger fw-bold ">*</span>
                <Form.Control
                  type="text"
                  placeholder=""
                  required
                  className="form-control"
                  {...register("CustomerBranchTitle", {
                    disabled: !isEnable,
                  })}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="Customers">
                <Form.Label>Customer</Form.Label>
                <span className="text-danger fw-bold ">*</span>
                <Controller
                  control={control}
                  name="Customers"
                  render={({ field: { onChange, value } }) => (
                    <Select
                      required
                      isDisabled={!isEnable}
                      options={data}
                      getOptionValue={(option) => option.CustomerID}
                      getOptionLabel={(option) => option.CustomerName}
                      value={value}
                      onChange={(selectedOption) => onChange(selectedOption)}
                      placeholder="Select a customer"
                      noOptionsMessage={() => "No customers found!"}
                      isClearable
                    />
                  )}
                />
              </Form.Group>
            </Row>

            <Row className="p-3" style={{ marginTop: "-25px" }}>
              <Form.Group controlId="BranchAddress">
                <Form.Label>
                  {pageTitles?.branch || "Customer Branch"} Address
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder=""
                  {...register("BranchAddress", {
                    disabled: !isEnable,
                  })}
                />
              </Form.Group>
            </Row>

            <Row className="p-3" style={{ marginTop: "-25px" }}>
              <Form.Group as={Col} controlId="ContactPersonName">
                <Form.Label>Contact Person Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder=""
                  {...register("ContactPersonName", {
                    disabled: !isEnable,
                  })}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="ContactPersonNo">
                <Form.Label>Contact Person No</Form.Label>
                <Form.Control
                  type="text"
                  placeholder=""
                  {...register("ContactPersonNo", {
                    disabled: !isEnable,
                  })}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="ContactPersonEmail">
                <Form.Label>Contact Person Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder=""
                  {...register("ContactPersonEmail", {
                    disabled: !isEnable,
                  })}
                />
              </Form.Group>
            </Row>

            <Row className="p-3" style={{ marginTop: "-25px" }}>
              <Form.Group as={Col} controlId="Description">
                <Form.Label>Descripiton</Form.Label>
                <Form.Control
                  type="text"
                  placeholder=""
                  name="email"
                  {...register("Description", {
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
              isSubmitting={customerBranchMutation.isPending}
              handleAddNew={handleAddNew}
              handleCancel={handleCancel}
              viewRecord={!isEnable}
              editRecord={isEnable && (CustomerBranch ? true : false)}
              newRecord={CustomerBranch ? false : true}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          </form>
        </>
      )}
    </>
  );
}
export default CustomerBranch;
