import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import useEditModal from "../../hooks/useEditModalHook";
import useDeleteModal from "../../hooks/useDeleteModalHook";
import { FilterMatchMode } from "primereact/api";
import { useEffect, useState } from "react";
import { CustomSpinner } from "../../components/CustomSpinner";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import ActionButtons from "../../components/ActionButtons";
import { useForm, FormProvider } from "react-hook-form";
import ButtonToolBar from "../CustomerInvoice/CustomerInvoiceToolbar";
import { Col, Form, Row } from "react-bootstrap";
import TextInput from "../../components/Forms/TextInput";
import CheckBox from "../../components/Forms/CheckBox";

import { useUserData } from "../../context/AuthContext";
import {
  addNewLeadIntroduction,
  deleteLeadIntroductionByID,
  fetchAllLeadIntroductions,
  fetchLeadIntroductionById,
} from "../../api/LeadIntroductionData";
import { ROUTE_URLS, QUERY_KEYS } from "../../utils/enums";
import { LeadsIntroductionFormComponent } from "../../hooks/ModalHooks/useLeadsIntroductionModalHook";

let parentRoute = ROUTE_URLS.LEAD_INTRODUCTION_ROUTE;
let editRoute = `${parentRoute}/edit/`;
let newRoute = `${parentRoute}/new`;
let viewRoute = `${parentRoute}/`;
let detail = "#22C55E";
let queryKey = QUERY_KEYS.LEAD_INTRODUCTION_QUERY_KEY;

export function LeadIntroductionDetail() {
  document.title = "Lead Introductions";

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

  const user = useUserData();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: [queryKey],
    queryFn: () => fetchAllLeadIntroductions(user.userID),
    initialData: [],
  });

  const deleteMutation = useMutation({
    mutationFn: deleteLeadIntroductionByID,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKey],
      });
    },
  });

  function handleDelete(id) {
    deleteMutation.mutate({ LeadIntroductionID: id, LoginUserID: user.userID });
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
    <div className="mt-4">
      {isLoading || isFetching ? (
        <>
          <div className="h-100 w-100">
            <div className="d-flex align-content-center justify-content-center ">
              <CustomSpinner />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="d-flex text-dark  mb-4 ">
            <h2 className="text-center my-auto">Lead Introductions</h2>
            <div className="text-end my-auto" style={{ marginLeft: "10px" }}>
              <Button
                label="Add New LeadIntroduction"
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
            dataKey="LeadIntroductionID"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            removableSort
            emptyMessage="No LeadIntroductions found!"
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
                  rowData.LeadIntroductionID,
                  () => handleDeleteShow(rowData.LeadIntroductionID),
                  handleEditShow,
                  handleView
                )
              }
              header="Actions"
              resizeable={false}
              style={{ minWidth: "7rem", maxWidth: "10rem", width: "7rem" }}
            ></Column>
            <Column
              field="LeadIntroductionName"
              filter
              filterPlaceholder="Search by LeadIntroduction"
              sortable
              header="LeadIntroduction"
            ></Column>
          </DataTable>
          {EditModal}
          {DeleteModal}
        </>
      )}
    </div>
  );
}
export function LeadIntroductionForm({ pagesTitle, user, mode }) {
  document.title = "LeadIntroduction Entry";
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { LeadIntroductionID } = useParams();
  const method = useForm({
    defaultValues: {
      LeadIntroductionName: "",
      InActive: false,
    },
  });
  const LeadIntroductionData = useQuery({
    queryKey: [queryKey, LeadIntroductionID],
    queryFn: () => fetchLeadIntroductionById(LeadIntroductionID, user.userID),
    enabled: LeadIntroductionID !== undefined,
    initialData: [],
  });

  useEffect(() => {
    if (
      LeadIntroductionID !== undefined &&
      LeadIntroductionData?.data?.length > 0
    ) {
      setValue(
        "LeadIntroductionName",
        LeadIntroductionData.data[0].LeadIntroductionName
      );
      setValue("InActive", LeadIntroductionData.data[0].InActive);
    }
  }, [LeadIntroductionID, LeadIntroductionData]);

  const mutation = useMutation({
    mutationFn: addNewLeadIntroduction,
    onSuccess: ({ success, RecordID }) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
        navigate(`${parentRoute}/${RecordID}`);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteLeadIntroductionByID,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      navigate(parentRoute);
    },
  });

  function handleDelete() {
    deleteMutation.mutate({
      LeadIntroductionID: LeadIntroductionID,
      LoginUserID: user.userID,
    });
  }

  function handleAddNew() {
    method.reset();
    navigate(newRoute);
  }
  function handleCancel() {
    if (mode === "new") {
      navigate(parentRoute);
    } else if (mode === "edit") {
      navigate(viewRoute + LeadIntroductionID);
    }
  }
  function handleEdit() {
    navigate(editRoute + LeadIntroductionID);
  }

  function onSubmit(data) {
    mutation.mutate({
      formData: data,
      userID: user.userID,
      LeadIntroductionID: LeadIntroductionID,
    });
  }

  return (
    <>
      {LeadIntroductionData.isLoading ? (
        <>
          <CustomSpinner />
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
              saveLoading={mutation.isPending}
              handleGoBack={() => navigate(parentRoute)}
              handleEdit={() => handleEdit()}
              handleCancel={() => {
                handleCancel();
              }}
              handleAddNew={() => {
                handleAddNew();
              }}
              handleDelete={handleDelete}
              handleSave={() => method.handleSubmit(onSubmit)()}
              GoBackLabel="LeadIntroductions"
            />
          </div>
          <div className="mt-4">
            <FormProvider {...method}>
              <LeadsIntroductionFormComponent />
            </FormProvider>
          </div>
        </>
      )}
    </>
  );
}
