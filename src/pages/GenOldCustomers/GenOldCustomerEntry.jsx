import { Form, Row, Col, Spinner } from "react-bootstrap";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import TabHeader from "../../components/TabHeader";
import ActionButtons from "../../components/ActionButtons";
import Select from "react-select";
import {
  deleteOldCustomerByID,
  fetchAllOldCustomers,
  fetchOldCustomerById,
} from "../../api/GenOldCustomerData";
import axios from "axios";
import { ActiveKeyContext } from "../../context/ActiveKeyContext";
import { toast } from "react-toastify";
import useDeleteModal from "../../hooks/useDeleteModalHook";
import useEditModal from "../../hooks/useEditModalHook";
import ButtonRow from "../../components/ButtonRow";
import {
  GenOldCustomerDataContext,
  GenOldCustomerDataProivder,
} from "./GenOldCustomerDataContext";
import { FilterMatchMode } from "primereact/api";
import { preventFormByEnterKeySubmission } from "../../utils/CommonFunctions";
import {
  fetchAllActivationCustomersForSelect,
  fetchAllSoftwareCustomersForSelect,
} from "../../api/SelectData";

const apiUrl = import.meta.env.VITE_APP_API_URL;

function GenOldCustomerEntry() {
  document.title = "Old Customers";
  return (
    <GenOldCustomerDataProivder>
      <TabHeader
        Search={<GenOldCustomerEntrySearch />}
        Entry={<GenOldCustomerEntryForm />}
        SearchTitle={"Old Customers"}
        EntryTitle={"Old Customer Entry"}
      />
    </GenOldCustomerDataProivder>
  );
}
function GenOldCustomerEntrySearch() {
  const queryClient = useQueryClient();
  // Hooks
  const { user } = useContext(AuthContext);
  const { setKey } = useContext(ActiveKeyContext);

  const [filters, setFilters] = useState({
    CustomerName: { value: null, matchMode: FilterMatchMode.CONTAINS },
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

  // Contexts
  const { setIsEnable, setOldCustomerID } = useContext(
    GenOldCustomerDataContext
  );
  // Queries
  const {
    data: oldCustomers,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["oldCustomers"],
    queryFn: () => fetchAllOldCustomers(user.userID),
    initialData: [],
  });

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: deleteOldCustomerByID,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["oldCustomers"] });
      toast.success("Customer successfully deleted!");
    },
  });
  function handleEdit(OldCustomerID) {
    setOldCustomerID(OldCustomerID);
    setIsEnable(true);
    setKey("entry");
    handleEditClose();
    setIdToEdit(0);
  }
  function handleDelete(OldCustomerID) {
    deleteMutation.mutate({ OldCustomerID, LoginUserID: user.userID });
    handleDeleteClose();
    setIdToDelete(0);
    setOldCustomerID(null);
  }
  function handleView(OldCustomerID) {
    setKey("entry");
    setOldCustomerID(OldCustomerID);
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
            value={oldCustomers}
            dataKey="CustomerID"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            removableSort
            emptyMessage="No old customers found!"
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
                  handleView,
                  true
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
          </DataTable>
          {DeleteModal}
          {EditModal}
        </>
      )}
    </>
  );
}

const defaultValues = {
  ActivationDbID: [],
  SoftwareMgtDbID: [],
  CustomerName: "",
  InActive: false,
};

function GenOldCustomerEntryForm() {
  const queryClient = useQueryClient();
  const [OldCustomerData, setOldCustomerData] = useState();
  const [isLoading, setIsLoading] = useState(false);

  // Hooks
  const {
    handleSubmit,
    register,
    control,
    reset,
    setValue,
    formState: { errors, isDirty, isValid },
  } = useForm();

  const { user } = useContext(AuthContext);
  const { isEnable, setIsEnable, setOldCustomerID, OldCustomerID } = useContext(
    GenOldCustomerDataContext
  );
  const { setKey } = useContext(ActiveKeyContext);

  useEffect(() => {
    async function fetchOldCustomer() {
      if (OldCustomerID !== undefined) {
        setIsLoading(true);
        const data = await fetchOldCustomerById(OldCustomerID, user.userID);
        if (!data) {
          setKey("search");
          toast.error("Network Error Occured!", {
            position: "bottom-left",
          });
        }
        setOldCustomerData(data);
        setIsLoading(false);
      } else {
        setTimeout(() => {
          reset(defaultValues);
          setIsEnable(true);
        }, 200);
      }
    }
    if (OldCustomerID !== 0) {
      fetchOldCustomer();
    } else {
      setTimeout(() => {
        reset(defaultValues);
        setIsEnable(true);
      }, 200);
    }
  }, [OldCustomerID]);

  // Queries
  const { data: activationClients } = useQuery({
    queryKey: ["activationClients", OldCustomerID],
    queryFn: () => fetchAllActivationCustomersForSelect(OldCustomerID),
    initialData: [],
  });
  const { data: softwareClients } = useQuery({
    queryKey: ["softwareClients", OldCustomerID],
    queryFn: () => fetchAllSoftwareCustomersForSelect(OldCustomerID),
    initialData: [],
  });

  const oldCustomerMutation = useMutation({
    mutationFn: async (formData) => {
      let DataToSend = {
        ActivationDbID: formData?.ActivationDbID?.map((r) => r.ACTCustomerID),
        SoftwareMgtDbID: formData?.SoftwareMgtDbID?.map(
          (r) => r.SoftCustomerID
        ),
        CustomerName: formData.CustomerName,
        EntryUserID: user.userID,
      };

      if (OldCustomerData?.data[0]?.CustomerID !== 0) {
        DataToSend.CustomerID = OldCustomerData?.data[0]?.CustomerID;
      } else {
        DataToSend.CustomerID = 0;
      }

      const { data } = await axios.post(
        apiUrl + "/EduIMS/OldCustomerInsert",
        DataToSend
      );

      if (data.success === true) {
        setOldCustomerID(0);
        reset();
        resetSelectValues();
        setIsEnable(true);
        setKey("search");
        queryClient.invalidateQueries({ queryKey: ["oldCustomers"] });

        if (OldCustomerData?.data[0]?.CustomerID !== undefined) {
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
    mutationFn: deleteOldCustomerByID,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["oldCustomers"] });
      toast.success("Customer successfully deleted!");
      setOldCustomerID(null);
      setIsEnable(true);
      setKey("search");
    },
  });

  // Data For Edit & View

  useEffect(() => {
    if (OldCustomerID !== 0 && OldCustomerData?.data) {
      () => resetSelectValues();

      if (OldCustomerData?.data[0]?.ActivationDbID !== 0) {
        setValue("ActivationDbID", OldCustomerData?.dataAct);
      }
      if (OldCustomerData?.data[0]?.SoftwareMgtDbID !== 0) {
        setValue("SoftwareMgtDbID", OldCustomerData?.dataSoft);
      }
      setValue("CustomerName", OldCustomerData?.data[0]?.CustomerName);
      setValue("InActive", OldCustomerData?.data[0]?.InActive);
    }
  }, [OldCustomerID, OldCustomerData]);

  // Mutations
  function onSubmit(data) {
    oldCustomerMutation.mutate(data);
  }

  // Custom Functions
  function handleEdit() {
    setIsEnable(true);
  }

  function handleAddNew() {
    setOldCustomerData(undefined);
    setOldCustomerID(0);
    setTimeout(() => {
      resetSelectValues();
    }, 200);
    reset();
    setIsEnable(true);
  }

  function handleCancel() {
    setOldCustomerData(undefined);
    setOldCustomerID(0);
    setTimeout(() => {
      resetSelectValues();
    }, 200);
    reset();
    setIsEnable(true);
  }

  function handleDelete() {
    deleteMutation.mutate({
      OldCustomerID: OldCustomerID,
    });
  }

  // Utils
  function resetSelectValues() {
    setValue("ActivationDbID", []);
    setValue("SoftwareMgtDbID", []);
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
            Old Customer Entry
          </h4>

          <form
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={preventFormByEnterKeySubmission}
          >
            <Row className="p-3" style={{ marginTop: "-25px" }}>
              <Form.Group as={Col} controlId="ActivationDbID">
                <Form.Label>Customer Name (Activation)</Form.Label>
                <Controller
                  control={control}
                  name="ActivationDbID"
                  render={({ field: { onChange, value } }) => (
                    <Select
                      isDisabled={!isEnable}
                      options={activationClients}
                      getOptionValue={(option) => option.ACTCustomerID}
                      getOptionLabel={(option) => option.ACTCustomerName}
                      value={value}
                      onChange={(selectedOption) => onChange(selectedOption)}
                      placeholder="Select a customer"
                      noOptionsMessage={() => "No customer found!"}
                      isClearable
                      isMulti
                    />
                  )}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="SoftwareMgtDbID">
                <Form.Label>Customer Name (Software Mgt.)</Form.Label>
                <Controller
                  control={control}
                  name="SoftwareMgtDbID"
                  render={({ field: { onChange, value } }) => (
                    <Select
                      isDisabled={!isEnable}
                      options={softwareClients}
                      getOptionLabel={(option) => option.SoftCustomerName}
                      getOptionValue={(option) => option.SoftCustomerID}
                      value={value}
                      onChange={(selectedOption) => onChange(selectedOption)}
                      placeholder="Select a customer"
                      noOptionsMessage={() => "No customer found!"}
                      isClearable
                      isMulti
                    />
                  )}
                />
              </Form.Group>
            </Row>

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
            </Row>

            <ButtonRow
              isDirty={isDirty}
              isValid={isValid}
              editMode={isEnable}
              isSubmitting={oldCustomerMutation.isPending}
              handleAddNew={handleAddNew}
              handleCancel={handleCancel}
              viewRecord={!isEnable}
              editRecord={isEnable && (OldCustomerData ? true : false)}
              newRecord={OldCustomerData ? false : true}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              disableDelete={true}
            />
          </form>
        </>
      )}
    </>
  );
}

export default GenOldCustomerEntry;
