import { useContext, useEffect, useState } from "react";
import TabHeader from "../../components/TabHeader";
import { Form, Row, Col, Spinner } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import {
  SessionInfoDataContext,
  SessionInfoDataProivder,
} from "./SessionInfoDataContext";
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
import {
  deleteSessionByID,
  fetchAllSessions,
  fetchSessionById,
} from "../../api/SessionData";
import { FilterMatchMode } from "primereact/api";
import {
  FormatDate,
  preventFormByEnterKeySubmission,
} from "../../utils/CommonFunctions";
import ReactDatePicker from "react-datepicker";
import { parseISO } from "date-fns";

const apiUrl = import.meta.env.VITE_APP_API_URL;

function GenSessionInfo() {
  document.title = "Session Info";
  return (
    <SessionInfoDataProivder>
      <TabHeader
        Search={<GenSessionInfoSearch />}
        Entry={<GenSessionInfoEntry />}
        SearchTitle={"Session Info"}
        EntryTitle={"Add New Session"}
      />
    </SessionInfoDataProivder>
  );
}

function GenSessionInfoSearch() {
  const queryClient = useQueryClient();

  const { user } = useContext(AuthContext);
  const { setKey } = useContext(ActiveKeyContext);

  const [filters, setFilters] = useState({
    SessionTitle: { value: null, matchMode: FilterMatchMode.CONTAINS },
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

  const { setIsEnable, setSessionID } = useContext(SessionInfoDataContext);

  const {
    data: Sessions,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["sessions"],
    queryFn: () => fetchAllSessions(user.userID),
    initialData: [],
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSessionByID,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      toast.success("Session successfully deleted!");
    },
  });

  function handleEdit(SessionID) {
    setSessionID(SessionID);
    setIsEnable(true);
    setKey("entry");
    handleEditClose();
    setIdToEdit(0);
  }
  function handleDelete(SessionID) {
    deleteMutation.mutate({ SessionID, LoginUserID: user.userID });
    handleDeleteClose();
    setIdToDelete(0);
    setSessionID(null);
  }
  function handleView(SessionID) {
    setKey("entry");
    setSessionID(SessionID);
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
            value={Sessions}
            dataKey="SessionID"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            removableSort
            emptyMessage="No session found!"
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
                  rowData.SessionID,
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
              field="SessionTitle"
              filter
              filterPlaceholder="Search by session"
              sortable
              header="Session"
              style={{ minWidth: "20rem" }}
            ></Column>
            <Column
              field="SessionOpeningDate"
              sortable
              header="Opening Date"
              style={{ minWidth: "20rem" }}
            ></Column>
            <Column
              field="SessionClosingDate"
              sortable
              header="Closing Date"
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

function GenSessionInfoEntry() {
  const queryClient = useQueryClient();
  const [Session, setSession] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { isDirty, isValid },
  } = useForm();

  const { user } = useContext(AuthContext);
  const { setKey } = useContext(ActiveKeyContext);
  const { isEnable, SessionID, setSessionID, setIsEnable } = useContext(
    SessionInfoDataContext
  );

  useEffect(() => {
    async function fetchSession() {
      if (SessionID !== undefined && SessionID !== null && SessionID !== 0) {
        setIsLoading(true);
        const data = await fetchSessionById(SessionID, user.userID);
        if (!data) {
          setKey("search");
          toast.error("Network Error Occured!", {
            position: "bottom-left",
          });
        }
        setSession(data);
        setIsLoading(false);
      }
    }
    if (SessionID !== 0) {
      fetchSession();
    }
  }, [SessionID]);

  const sessionMutation = useMutation({
    mutationFn: async (formData) => {
      const dataToSend = {
        SessionTitle: formData.SessionTitle,
        SessionOpeningDate: formData.SessionOpeningDate,
        SessionClosingDate: formData.SessionClosingDate,
        EntryUserID: user.userID,
      };

      console.log(dataToSend);

      if (Session?.data[0]?.SessionID !== undefined) {
        dataToSend.SessionID = Session?.data[0]?.SessionID;
      } else {
        dataToSend.SessionID = 0;
      }

      const { data } = await axios.post(
        apiUrl + `/EduIMS/SessionInsertUpdate`,
        dataToSend
      );

      if (data.success === true) {
        setSessionID(0);
        reset();
        setIsEnable(true);
        setKey("search");
        queryClient.invalidateQueries({ queryKey: ["sessions"] });
        if (Session?.data[0]?.SessionID !== undefined) {
          toast.success("Session Info updated successfully!");
        } else {
          toast.success("Session Info saved successfully!");
        }
      } else {
        toast.error(data.message, {
          autoClose: 1500,
        });
      }
    },
  });
  const deleteMutation = useMutation({
    mutationFn: deleteSessionByID,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      toast.success("Session successfully deleted!");
      setSession(undefined);
      setSessionID(0);
      reset();
      setIsEnable(true);
      setKey("search");
    },
  });

  useEffect(() => {
    if (SessionID !== 0 && Session?.data) {
      setValue("SessionTitle", Session?.data[0]?.SessionTitle);
      setValue(
        "SessionOpeningDate",
        parseISO(Session?.data[0]?.SessionOpeningDate)
      );
      setValue(
        "SessionClosingDate",
        parseISO(Session?.data[0]?.SessionClosingDate)
      );
    }
  }, [SessionID, Session]);
  function onSubmit(data) {
    sessionMutation.mutate(data);
  }
  function handleEdit() {
    setIsEnable(true);
  }

  function handleAddNew() {
    setSession(undefined);
    setSessionID(0);
    reset();
    setIsEnable(true);
  }

  function handleCancel() {
    setSession(undefined);
    setSessionID(0);
    reset();
    setIsEnable(true);
  }

  function handleDelete() {
    deleteMutation.mutate({
      SessionID,
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
            Session Entry
          </h4>
          <form
            id="BusinessUnits"
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={preventFormByEnterKeySubmission}
          >
            <Row className="p-3">
              <Form.Group as={Col} controlId="SessionTitle">
                <Form.Label>Session Title</Form.Label>
                <span className="text-danger fw-bold ">*</span>
                <Form.Control
                  type="text"
                  required
                  className="form-control"
                  {...register("SessionTitle", {
                    disabled: !isEnable,
                  })}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="SessionOpeningDate">
                <Form.Label>Session Opening Date</Form.Label>
                <div>
                  <Controller
                    control={control}
                    name="SessionOpeningDate"
                    render={({ field }) => (
                      <ReactDatePicker
                        placeholderText="Select date"
                        onChange={(date) => field.onChange(date)}
                        selected={field.value}
                        dateFormat={"dd-MMM-yyyy"}
                        className="binput"
                        disabled={!isEnable}
                      />
                    )}
                  />
                </div>
              </Form.Group>
              <Form.Group as={Col} controlId="SessionClosingDate">
                <Form.Label>Session Opening Date</Form.Label>
                <div>
                  <Controller
                    control={control}
                    name="SessionClosingDate"
                    render={({ field }) => (
                      <ReactDatePicker
                        placeholderText="Select date"
                        onChange={(date) => field.onChange(date)}
                        selected={field.value}
                        dateFormat={"dd-MMM-yyyy"}
                        className="binput"
                        disabled={!isEnable}
                      />
                    )}
                  />
                </div>
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
              editRecord={isEnable && (Session ? true : false)}
              newRecord={Session ? false : true}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          </form>
        </>
      )}
    </>
  );
}

export default GenSessionInfo;
