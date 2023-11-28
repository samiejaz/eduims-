import { Form, Row, Col, Spinner, Button } from "react-bootstrap";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import TabHeader from "../../components/TabHeader";
import ActionButtons from "../../components/ActionButtons";
import axios from "axios";
import { ActiveKeyContext } from "../../context/ActiveKeyContext";
import { toast } from "react-toastify";
import useDeleteModal from "../../hooks/useDeleteModalHook";
import useEditModal from "../../hooks/useEditModalHook";
import ButtonRow from "../../components/ButtonRow";
import { FilterMatchMode } from "primereact/api";
import { preventFormByEnterKeySubmission } from "../../utils/CommonFunctions";
import {
  GenCustomerDataContext,
  GenCustomerDataProivder,
} from "./CustomerEntryDataContext";
import {
  deleteNewCustomerByID,
  fetchAllNewCustomers,
  fetchNewCustomerById,
} from "../../api/NewCustomerData";
import useCustomerEntryHook from "../../hooks/useCustomerEntryHook";

const apiUrl = import.meta.env.VITE_APP_API_URL;

function GenCustomerEntry() {
  document.title = "Customers";
  return (
    <GenCustomerDataProivder>
      <TabHeader
        Search={<GenOldCustomerEntrySearch />}
        Entry={<GenOldCustomerEntryForm />}
        SearchTitle={"Old Customers"}
        EntryTitle={"Old Customer Entry"}
      />
    </GenCustomerDataProivder>
  );
}
function GenOldCustomerEntrySearch() {
  const queryClient = useQueryClient();
  // Hooks
  const { user } = useContext(AuthContext);
  const { setKey } = useContext(ActiveKeyContext);

  const [filters, setFilters] = useState({
    CustomerName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    CustomerBusinessAddress: {
      value: null,
      matchMode: FilterMatchMode.CONTAINS,
    },
    CustomerBusinessName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    ContactPerson1Name: { value: null, matchMode: FilterMatchMode.CONTAINS },
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

  const { render: CustomerForm, setVisible } = useCustomerEntryHook();

  // Contexts
  const { setIsEnable, setCustomerID } = useContext(GenCustomerDataContext);
  // Queries
  const {
    data: Customers,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["Customers"],
    queryFn: () => fetchAllNewCustomers(user.userID),
    initialData: [],
  });

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: deleteNewCustomerByID,
    onSuccess: (response) => {
      if (response) {
        queryClient.invalidateQueries({ queryKey: ["Customers"] });
      }
    },
  });

  function handleEdit(CustomerID) {
    setCustomerID(CustomerID);
    setIsEnable(true);
    setKey("entry");
    handleEditClose();
    setIdToEdit(0);
  }
  function handleDelete(CustomerID) {
    deleteMutation.mutate({ CustomerID, LoginUserID: user.userID });
    handleDeleteClose();
    setIdToDelete(0);
    setCustomerID(0);
  }
  function handleView(CustomerID) {
    setKey("entry");
    setCustomerID(CustomerID);
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
          <Button onClick={() => setVisible(true)}>Add New</Button>
          <DataTable
            showGridlines
            value={Customers}
            dataKey="CustomerID"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            removableSort
            emptyMessage="No customer entry found!"
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
                  rowData.CustomerID,
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
              field="CustomerName"
              filter
              filterPlaceholder="Search by Customer Name"
              sortable
              header="Customer Name"
            ></Column>
            <Column
              field="CustomerBusinessAddress"
              filter
              filterPlaceholder="Search by Address"
              sortable
              header="Customer Business Address"
            ></Column>
            <Column
              field="CustomerBusinessName"
              filter
              filterPlaceholder="Search by Business Name"
              sortable
              header="Customer Business Name"
            ></Column>
            <Column
              field="ContactPerson1Name"
              filter
              filterPlaceholder="Search by Contact Person Name"
              sortable
              header="Contact Person Name"
            ></Column>
          </DataTable>
          {DeleteModal}
          {EditModal}
          {CustomerForm}
        </>
      )}
    </>
  );
}

const defaultValues = {
  CustomerName: "",
  CustomerBusinessName: "",
  CustomerBusinessAddress: "",
  ContactPerson1Name: "",
  ContactPerson1Email: "",
  ContactPerson1No: "",
  Description: "",
  InActive: false,
};

function GenOldCustomerEntryForm() {
  const queryClient = useQueryClient();
  const [CustomerData, setCustomerData] = useState();
  const [isLoading, setIsLoading] = useState(false);

  // Hooks
  const {
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors, isDirty, isValid },
  } = useForm();

  const { user } = useContext(AuthContext);
  const { isEnable, setIsEnable, setCustomerID, CustomerID } = useContext(
    GenCustomerDataContext
  );
  const { setKey } = useContext(ActiveKeyContext);
  const { setVisible, render } = useCustomerEntryHook();

  useEffect(() => {
    async function fetchOldCustomer() {
      if (CustomerID !== undefined && CustomerID !== 0 && CustomerID !== null) {
        setIsLoading(true);
        const data = await fetchNewCustomerById(CustomerID, user.userID);
        if (!data) {
          setKey("search");
          toast.error("Network Error Occured!", {
            position: "bottom-left",
          });
        }
        setCustomerData(data);
        setIsLoading(false);
      } else {
        setTimeout(() => {
          reset(defaultValues);
          setIsEnable(true);
        }, 200);
      }
    }
    if (CustomerID !== 0) {
      fetchOldCustomer();
    } else {
      setTimeout(() => {
        reset(defaultValues);
        setIsEnable(true);
      }, 200);
    }
  }, [CustomerID]);

  const oldCustomerMutation = useMutation({
    mutationFn: async (formData) => {
      let DataToSend = {
        ContactPerson1Email: formData?.ContactPerson1Email,
        ContactPerson1Name: formData?.ContactPerson1Name,
        ContactPerson1No: formData?.ContactPerson1No,
        CustomerBusinessAddress: formData?.CustomerBusinessAddress,
        CustomerBusinessName: formData.CustomerBusinessName,
        CustomerName: formData.CustomerName,
        Description: formData?.Description,
        InActive: formData?.InActive === false ? 0 : 1,
        EntryUserID: user.userID,
        EntryDate: "",
      };

      console.log(DataToSend);

      if (CustomerData?.data[0]?.CustomerID !== 0) {
        DataToSend.CustomerID = CustomerData?.data[0]?.CustomerID;
      } else {
        DataToSend.CustomerID = 0;
      }
      const { data } = await axios.post(
        apiUrl + "/EduIMS/NewCustomerInsert",
        DataToSend
      );

      if (data.success === true) {
        setCustomerID(0);
        reset();
        setIsEnable(true);
        setKey("search");
        queryClient.invalidateQueries({ queryKey: ["Customers"] });

        if (CustomerData?.data[0]?.CustomerID !== undefined) {
          toast.success("Customer updated successfully!");
        } else {
          toast.success("Customer saved successfully!");
        }
      } else {
        toast.error(data.message, {
          autoClose: 1500,
        });
      }
    },
    onError: () => {
      toast.error("Error while saving data!!");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNewCustomerByID,
    onSuccess: (response) => {
      if (response) {
        queryClient.invalidateQueries({ queryKey: ["Customers"] });
        setCustomerID(null);
        setIsEnable(true);
        setKey("search");
      }
    },
  });

  // Data For Edit & View

  useEffect(() => {
    if (CustomerID !== 0 && CustomerData?.data) {
      setValue("CustomerName", CustomerData?.data[0]?.CustomerName);
      setValue(
        "CustomerBusinessName",
        CustomerData?.data[0]?.CustomerBusinessName
      );
      setValue(
        "CustomerBusinessAddress",
        CustomerData?.data[0]?.CustomerBusinessAddress
      );
      setValue("ContactPerson1Name", CustomerData?.data[0]?.ContactPerson1Name);
      setValue("ContactPerson1No", CustomerData?.data[0]?.ContactPerson1No);
      setValue(
        "ContactPerson1Email",
        CustomerData?.data[0]?.ContactPerson1Email
      );
      setValue("Description", CustomerData?.data[0]?.Description);
      setValue("InActive", CustomerData?.data[0]?.InActive);
    }
  }, [CustomerID, CustomerData]);

  // Mutations
  function onSubmit(data) {
    oldCustomerMutation.mutate(data);
  }

  // Custom Functions
  function handleEdit() {
    setIsEnable(true);
  }

  function handleAddNew() {
    setCustomerData(undefined);
    setCustomerID(0);
    reset();
    setIsEnable(true);
  }

  function handleCancel() {
    setCustomerData(undefined);
    setCustomerID(0);
    reset();
    setIsEnable(true);
  }

  function handleDelete() {
    deleteMutation.mutate({
      CustomerID: CustomerID,
      LoginUserID: user.userID,
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
          <button className="btn btn-primary " onClick={() => setVisible(true)}>
            {" "}
            Add
          </button>
          {render}
          <h4 className="p-3 mb-4 bg-light text-dark text-center  ">
            New Customer Entry
          </h4>

          <form
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={preventFormByEnterKeySubmission}
          >
            <Row className="p-3" style={{ marginTop: "-25px" }}>
              <Form.Group as={Col} controlId="CustomerName">
                <Form.Label>Customer Name</Form.Label>
                <span className="text-danger fw-bold ">*</span>
                <Form.Control
                  type="text"
                  required
                  placeholder=""
                  className="form-control"
                  {...register("CustomerName", {
                    disabled: !isEnable,
                  })}
                />
                <p className="text-danger">{errors?.CustomerName?.message}</p>
              </Form.Group>
              <Form.Group as={Col} controlId="CustomerBusinessName">
                <Form.Label>Customer Business Name</Form.Label>
                <span className="text-danger fw-bold ">*</span>
                <Form.Control
                  type="text"
                  required
                  placeholder=""
                  {...register("CustomerBusinessName", {
                    disabled: !isEnable,
                  })}
                />
                <p className="text-danger">
                  {errors?.CustomerBusinessName?.message}
                </p>
              </Form.Group>
            </Row>

            <Row className="p-3" style={{ marginTop: "-25px" }}>
              <Form.Group controlId="CustomerBusinessAddress">
                <Form.Label>Customer Business Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder=""
                  {...register("CustomerBusinessAddress", {
                    disabled: !isEnable,
                  })}
                />
              </Form.Group>
            </Row>

            <Row className="p-3" style={{ marginTop: "-25px" }}>
              <Form.Group as={Col} controlId="ContactPerson1Name">
                <Form.Label>Contact Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder=""
                  {...register("ContactPerson1Name", {
                    disabled: !isEnable,
                  })}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="ContactPerson1No">
                <Form.Label>Contact No</Form.Label>
                <Form.Control
                  type="text"
                  placeholder=""
                  {...register("ContactPerson1No", {
                    disabled: !isEnable,
                  })}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="ContactPerson1Email">
                <Form.Label> Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder=""
                  {...register("ContactPerson1Email", {
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
              isSubmitting={oldCustomerMutation.isPending}
              handleAddNew={handleAddNew}
              handleCancel={handleCancel}
              viewRecord={!isEnable}
              editRecord={isEnable && (CustomerData ? true : false)}
              newRecord={CustomerData ? false : true}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          </form>
        </>
      )}
    </>
  );
}

export default GenCustomerEntry;
