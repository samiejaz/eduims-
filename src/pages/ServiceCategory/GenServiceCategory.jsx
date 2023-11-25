import React, { useContext, useEffect, useState } from "react";
import TabHeader from "../../components/TabHeader";
import { Form, Row, Col, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ButtonRow from "../../components/ButtonRow";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { ActiveKeyContext } from "../../context/ActiveKeyContext";
import { toast } from "react-toastify";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import ActionButtons from "../../components/ActionButtons";
import useEditModal from "../../hooks/useEditModalHook";
import useDeleteModal from "../../hooks/useDeleteModalHook";
import { FilterMatchMode } from "primereact/api";
import {
  ServiceCategoryDataContext,
  ServiceCategoryDataProivder,
} from "./ServiceCategoryDataContext";
import {
  deleteServiceCategory,
  fetchAllServiceCategories,
  fetchServiceCategoryById,
} from "../../api/ServiceCategoryData";
import { preventFormByEnterKeySubmission } from "../../utils/CommonFunctions";

const apiUrl = import.meta.env.VITE_APP_API_URL;

function GenServiceCategory() {
  document.title = "Service Category";
  return (
    <ServiceCategoryDataProivder>
      <TabHeader
        Search={<GenServiceCategorySearch />}
        Entry={<GenServiceCategoryEntry />}
        SearchTitle={"Service Category Info"}
        EntryTitle={"Add New Product Category"}
      />
    </ServiceCategoryDataProivder>
  );
}

function GenServiceCategorySearch() {
  const queryClient = useQueryClient();

  const { user } = useContext(AuthContext);
  const { setKey } = useContext(ActiveKeyContext);

  const [filters, setFilters] = useState({
    ServiceCategoryTitle: { value: null, matchMode: FilterMatchMode.CONTAINS },
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

  const { setIsEnable, setServiceCategoryID } = useContext(
    ServiceCategoryDataContext
  );

  const {
    data: ServiceCategories,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["serviceCategories"],
    queryFn: () => fetchAllServiceCategories(user.userID),
    initialData: [],
  });

  const deleteMutation = useMutation({
    mutationFn: deleteServiceCategory,
    onSuccess: (data) => {
      if (data === true) {
        queryClient.invalidateQueries({ queryKey: ["serviceCategories"] });
      }
    },
  });

  function handleEdit(ServiceCategoryID) {
    setServiceCategoryID(ServiceCategoryID);
    setIsEnable(true);
    setKey("entry");
    handleEditClose();
    setIdToEdit(0);
  }
  function handleDelete(ServiceCategoryID) {
    deleteMutation.mutate({ ServiceCategoryID, LoginUserID: user.userID });
    handleDeleteClose();
    setIdToDelete(0);
    setServiceCategoryID(null);
  }
  function handleView(ServiceCategoryID) {
    setKey("entry");
    setServiceCategoryID(ServiceCategoryID);
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
            value={ServiceCategories}
            dataKey="ServiceCategoryID"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            removableSort
            emptyMessage="No Service Category found!"
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
                  rowData.ServiceCategoryID,
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
              field="ServiceCategoryTitle"
              filter
              filterPlaceholder="Search by category"
              sortable
              header="Service Category"
            ></Column>
          </DataTable>
          {EditModal}
          {DeleteModal}
        </>
      )}
    </>
  );
}

function GenServiceCategoryEntry() {
  const queryClient = useQueryClient();
  const [ServiceCategory, setServiceCategory] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isDirty, isValid },
  } = useForm();

  const { user } = useContext(AuthContext);
  const { setKey } = useContext(ActiveKeyContext);
  const { isEnable, ServiceCategoryID, setServiceCategoryID, setIsEnable } =
    useContext(ServiceCategoryDataContext);

  useEffect(() => {
    async function fetchSession() {
      if (
        ServiceCategoryID !== undefined &&
        ServiceCategoryID !== null &&
        ServiceCategoryID !== 0
      ) {
        setIsLoading(true);
        const data = await fetchServiceCategoryById(
          ServiceCategoryID,
          user.userID
        );
        if (!data) {
          setKey("search");
          toast.error("Network Error Occured!");
        }
        setServiceCategory(data);
        setIsLoading(false);
      }
    }
    if (ServiceCategoryID !== 0) {
      fetchSession();
    }
  }, [ServiceCategoryID]);

  const sessionMutation = useMutation({
    mutationFn: async (formData) => {
      const dataToSend = {
        ServiceCategoryID: 0,
        ServiceCategoryTitle: formData.ServiceCategoryTitle,
        InActive: formData.InActive ? 1 : 0,
        EntryUserID: user.userID,
      };

      if (ServiceCategory?.data[0]?.ServiceCategoryID !== undefined) {
        dataToSend.ServiceCategoryID =
          ServiceCategory?.data[0]?.ServiceCategoryID;
      } else {
        dataToSend.ServiceCategoryID = 0;
      }

      const { data } = await axios.post(
        apiUrl + `/EduIMS/ServiceCategoryInsertUpdate`,
        dataToSend
      );

      if (data.success === true) {
        setServiceCategoryID(0);
        reset();
        setIsEnable(true);
        setKey("search");
        queryClient.invalidateQueries({ queryKey: ["serviceCategories"] });
        if (ServiceCategory?.data[0]?.ServiceCategoryID !== undefined) {
          toast.success("Service Category  updated successfully!");
        } else {
          toast.success("Service Category  saved successfully!");
        }
      } else {
        toast.error(data.message, {
          autoClose: 1500,
        });
      }
    },
  });
  const deleteMutation = useMutation({
    mutationFn: deleteServiceCategory,
    onSuccess: (response) => {
      if (response === true) {
        queryClient.invalidateQueries({ queryKey: ["serviceCategories"] });
        setServiceCategory(undefined);
        setServiceCategoryID(0);
        reset();
        setIsEnable(true);
        setKey("search");
      }
    },
  });

  useEffect(() => {
    if (ServiceCategoryID !== 0 && ServiceCategory?.data) {
      setValue(
        "ServiceCategoryTitle",
        ServiceCategory?.data[0]?.ServiceCategoryTitle
      );
      setValue("InActive", ServiceCategory?.data[0]?.InActive);
    }
  }, [ServiceCategoryID, ServiceCategory]);

  function onSubmit(data) {
    sessionMutation.mutate(data);
  }
  function handleEdit() {
    setIsEnable(true);
  }

  function handleAddNew() {
    setServiceCategory(undefined);
    setServiceCategoryID(0);
    reset();
    setIsEnable(true);
  }

  function handleCancel() {
    setServiceCategory(undefined);
    setServiceCategoryID(0);
    reset();
    setIsEnable(true);
  }

  function handleDelete() {
    deleteMutation.mutate({
      ServiceCategoryID,
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
          <h4 className="p-3 mb-2 bg-light text-dark text-center  ">
            Service Category Entry
          </h4>
          <form
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={preventFormByEnterKeySubmission}
          >
            <Row className="p-3">
              <Form.Group as={Col} controlId="ServiceCategoryTitle">
                <Form.Label>Product Category Title</Form.Label>
                <span className="text-danger fw-bold ">*</span>
                <Form.Control
                  type="text"
                  required
                  className="form-control"
                  {...register("ServiceCategoryTitle", {
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
              isSubmitting={sessionMutation.isPending}
              handleAddNew={handleAddNew}
              handleCancel={handleCancel}
              viewRecord={!isEnable}
              editRecord={isEnable && (ServiceCategory ? true : false)}
              newRecord={ServiceCategory ? false : true}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          </form>
        </>
      )}
    </>
  );
}

export default GenServiceCategory;
