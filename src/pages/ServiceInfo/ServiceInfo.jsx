import TabHeader from "../../components/TabHeader";
import { Controller, useForm } from "react-hook-form";

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

import { fetchAllServicesCategoriesForSelect } from "../../api/SelectData";
import {
  ServiceInfoDataContext,
  ServiceInfoDataProivder,
} from "./ServiceInfoDataContext";
import {
  deleteServiceByID,
  fetchAllServices,
  fetchServiceById,
} from "../../api/ServiceInfoData";
import { preventFormByEnterKeySubmission } from "../../utils/CommonFunctions";

const apiUrl = import.meta.env.VITE_APP_API_URL;

function ServiceInfo() {
  document.title = "Service Info";
  return (
    <ServiceInfoDataProivder>
      <TabHeader
        Search={<GenServiceInfoSearch />}
        Entry={<GenServiceInfoEntry />}
        SearchTitle={"Bank Account Openings"}
        EntryTitle={"Add new opening"}
      />
    </ServiceInfoDataProivder>
  );
}
function GenServiceInfoSearch() {
  const queryClient = useQueryClient();

  const { user } = useContext(AuthContext);
  const { setKey } = useContext(ActiveKeyContext);

  const [filters, setFilters] = useState({
    ServicesInfoTitle: { value: null, matchMode: FilterMatchMode.CONTAINS },
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

  const { setIsEnable, setServiceInfoID } = useContext(ServiceInfoDataContext);

  const {
    data: Services,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["serviceInfo"],
    queryFn: () => fetchAllServices(user.userID),
    initialData: [],
  });

  const deleteMutation = useMutation({
    mutationFn: deleteServiceByID,
    onSuccess: (response) => {
      if (response === true) {
        queryClient.invalidateQueries({ queryKey: ["serviceInfo"] });
      }
    },
  });
  function handleEdit(ServicesInfoID) {
    setServiceInfoID(ServicesInfoID);
    setIsEnable(true);
    setKey("entry");
    handleEditClose();
    setIdToEdit(0);
  }
  function handleDelete(ServicesInfoID) {
    deleteMutation.mutate({ ServicesInfoID, LoginUserID: user.userID });
    handleDeleteClose();
    setIdToDelete(0);
    setServiceInfoID(0);
  }
  function handleView(ServicesInfoID) {
    setKey("entry");
    setServiceInfoID(ServicesInfoID);
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
            value={Services}
            dataKey="ServicesInfoID "
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            removableSort
            emptyMessage="No services found!"
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
                  rowData.ServicesInfoID,
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
              field="ServicesInfoTitle"
              filter
              filterPlaceholder="Search by Service"
              sortable
              header="Service Info Title"
              style={{ minWidth: "20rem" }}
            ></Column>
            <Column
              field="ServiceCategoryTitle"
              filter
              filterPlaceholder="Search by Category"
              sortable
              header="Service Category Title"
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

function GenServiceInfoEntry() {
  const queryClient = useQueryClient();
  const [ServiceInfo, setServiceInfo] = useState();
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
  const { isEnable, setIsEnable, setServiceInfoID, ServicesInfoID } =
    useContext(ServiceInfoDataContext);
  const { setKey } = useContext(ActiveKeyContext);

  useEffect(() => {
    async function fetchSingleService() {
      if (
        ServicesInfoID !== undefined &&
        ServicesInfoID !== null &&
        ServicesInfoID !== 0
      ) {
        setIsLoading(true);
        const data = await fetchServiceById(ServicesInfoID, user.userID);
        if (!data) {
          setKey("search");
          toast.error("Network Error Occured!", {
            position: "bottom-left",
          });
        }
        setServiceInfo(data);
        setIsLoading(false);
      }
    }
    if (ServicesInfoID !== 0) {
      fetchSingleService();
    }
  }, [ServicesInfoID]);

  const { data } = useQuery({
    queryKey: ["serviceCategories"],
    queryFn: () => fetchAllServicesCategoriesForSelect(),
    initialData: [],
  });

  const serviceMutation = useMutation({
    mutationFn: async (formData) => {
      const dataToSend = {
        ServicesInfoID: 0,
        ServicesInfoTitle: formData.ServicesInfoTitle,
        ServiceCategoryID: formData.ServiceCategory.ServiceCategoryID,
        InActive: formData.InActive ? 1 : 0,
        EntryUserID: user.userID,
      };

      if (ServiceInfo?.data && ServicesInfoID !== 0) {
        dataToSend.ServicesInfoID = ServiceInfo?.data[0]?.ServicesInfoID;
      } else {
        dataToSend.ServicesInfoID = 0;
      }

      const { data } = await axios.post(
        apiUrl + `/EduIMS/ServicesInfoInsertUpdate`,
        dataToSend
      );

      if (data.success === true) {
        setServiceInfoID(0);
        setServiceInfo();
        reset();
        resetSelectValues();
        setIsEnable(true);
        setKey("search");
        queryClient.invalidateQueries({ queryKey: ["serviceInfo"] });
        if (ServicesInfoID !== 0) {
          toast.success("ServiceInfo Info updated successfully!");
        } else {
          toast.success("ServiceInfo Info saved successfully!");
        }
      } else {
        toast.error(data.message, {
          autoClose: 1500,
        });
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteServiceByID,
    onSuccess: (response) => {
      if (response === true) {
        queryClient.invalidateQueries({ queryKey: ["serviceInfo"] });

        setServiceInfo([]);
        setServiceInfoID(0);
        reset();
        setIsEnable(true);
        setKey("search");
      }
    },
  });

  useEffect(() => {
    if (ServicesInfoID !== 0 && ServiceInfo?.data) {
      () => resetSelectValues();
      if (ServiceInfo?.data[0]?.ServiceCategoryID !== 0) {
        setValue("ServiceCategory", {
          ServiceCategoryID: ServiceInfo?.data[0]?.ServiceCategoryID,
          ServiceCategoryTitle: ServiceInfo?.data[0]?.ServiceCategoryTitle,
        });
      }
      setValue("ServicesInfoTitle", ServiceInfo?.data[0]?.ServicesInfoTitle);
      setValue("InActive", ServiceInfo?.data[0]?.InActive);
    }
  }, [ServicesInfoID, ServiceInfo]);

  function onSubmit(data) {
    serviceMutation.mutate(data);
  }

  function handleEdit() {
    setIsEnable(true);
  }

  function handleAddNew() {
    setServiceInfo([]);
    setServiceInfoID(0);
    setTimeout(() => {
      resetSelectValues();
    }, 200);
    reset();
    setIsEnable(true);
  }

  function handleCancel() {
    setServiceInfo([]);
    setServiceInfoID(0);
    setTimeout(() => {
      resetSelectValues();
    }, 200);
    setValue("ServiceCategory", []);
    reset();
    setIsEnable(true);
  }

  function handleDelete() {
    deleteMutation.mutate({
      ServicesInfoID: ServicesInfoID,
      LoginUserID: user.userID,
    });
  }

  function resetSelectValues() {
    setValue("ServiceCategory", []);
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
            Service Info Title
          </h4>

          <form
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={preventFormByEnterKeySubmission}
          >
            <Row className="p-3" style={{ marginTop: "-25px" }}>
              <Form.Group as={Col} controlId="ServicesInfoTitle">
                <Form.Label>Service Info Title</Form.Label>
                <span className="text-danger fw-bold ">*</span>
                <Form.Control
                  type="text"
                  placeholder=""
                  required
                  className="form-control"
                  {...register("ServicesInfoTitle", {
                    disabled: !isEnable,
                  })}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="ServiceCategory">
                <Form.Label>Service Category</Form.Label>
                <span className="text-danger fw-bold ">*</span>
                <Controller
                  control={control}
                  name="ServiceCategory"
                  render={({ field: { onChange, value } }) => (
                    <Select
                      required
                      isDisabled={!isEnable}
                      options={data}
                      getOptionValue={(option) => option.ServiceCategoryID}
                      getOptionLabel={(option) => option.ServiceCategoryTitle}
                      value={value}
                      onChange={(selectedOption) => onChange(selectedOption)}
                      placeholder="Select a service category"
                      noOptionsMessage={() => "No product categories found!"}
                      isClearable
                    />
                  )}
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
              isSubmitting={serviceMutation.isPending}
              handleAddNew={handleAddNew}
              handleCancel={handleCancel}
              viewRecord={!isEnable}
              editRecord={isEnable && ServicesInfoID > 0}
              newRecord={ServicesInfoID === 0}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          </form>
        </>
      )}
    </>
  );
}
export default ServiceInfo;
