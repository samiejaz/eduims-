import React, { useState, useEffect } from "react";
import { Form, InputGroup, Row, Col, Spinner } from "react-bootstrap";
import TabHeader from "../../components/TabHeader";
import ActionButtons from "../../components/ActionButtons";
import ButtonRow from "../../components/ButtonRow";
import { useForm } from "react-hook-form";
import { useContext } from "react";
import { ActiveKeyContext } from "../../context/ActiveKeyContext";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useDeleteModal from "../../hooks/useDeleteModalHook";
import useEditModal from "../../hooks/useEditModalHook";
import {
  deleteUser,
  fetchAllUsers,
  fetchOldUserById,
} from "../../api/GenUsersData";
import { UserDataContext, UserDataProivder } from "./UserDataContext";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { preventFormByEnterKeySubmission } from "../../utils/CommonFunctions";

const apiUrl = import.meta.env.VITE_APP_API_URL;

function GenUsers() {
  document.title = "Users Info";
  return (
    <UserDataProivder>
      <TabHeader
        Search={<GenUsersSearch />}
        Entry={<GenUsersEntry />}
        SearchTitle={"Users"}
        EntryTitle={"Add New User"}
      />
    </UserDataProivder>
  );
}

// Searcjh
function GenUsersSearch() {
  const queryClient = useQueryClient();

  const { user } = useContext(AuthContext);
  const { setKey } = useContext(ActiveKeyContext);

  const [filters, setFilters] = useState({
    FirstName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    LastName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    Email: { value: null, matchMode: FilterMatchMode.CONTAINS },
    UserName: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const {
    render: DeleteModal,
    handleShow: handleDeleteShow,
    handleClose: handleDeleteClose,
    setIdToDelete,
  } = useDeleteModal(handleDelete);
  const {
    render: EditModal,
    handleShow: handleEditShow,
    handleClose: handleEditClose,
    setIdToEdit,
  } = useEditModal(handleEdit);

  // Contexts
  const { setUserID, setIsEnable } = useContext(UserDataContext);

  // Queries
  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetchAllUsers(user.userID),
    initialData: [],
  });
  const mutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User successfully deleted!", {
        autoClose: 1000,
      });
    },
  });

  // CRUD Functions
  function handleEdit(UserID) {
    setUserID(UserID);
    setIsEnable(true);
    setKey("entry");
    handleEditClose();
    setIdToEdit(0);
  }

  function handleView(UserID) {
    setKey("entry");
    setUserID(UserID);
    setIsEnable(false);
  }

  function handleDelete(UserID) {
    mutation.mutate({ UserID, LoginUserID: user.userID });
    handleDeleteClose();
    setIdToDelete(0);
    setUserID(null);
  }

  return (
    <>
      <DataTable
        showGridlines
        value={users}
        dataKey="LoginUserID"
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50]}
        removableSort
        emptyMessage="No users found!"
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
              rowData.LoginUserID,
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
          field="FirstName"
          filter
          filterPlaceholder="Search by firstname"
          sortable
          header="First Name"
          style={{ minWidth: "20rem" }}
        ></Column>
        <Column
          field="LastName"
          filter
          filterPlaceholder="Search by lastname"
          sortable
          header="Last Name"
          style={{ minWidth: "20rem" }}
        ></Column>
        <Column
          field="UserName"
          filter
          filterPlaceholder="Search by username"
          sortable
          header="Username"
          style={{ minWidth: "20rem" }}
        ></Column>
        <Column
          field="Email"
          filter
          filterPlaceholder="Search by email"
          sortable
          header="Email"
          style={{ minWidth: "20rem" }}
        ></Column>
      </DataTable>
      {EditModal}
      {DeleteModal}
    </>
  );
}
function GenUsersEntry() {
  const [isLoading, setIsLoading] = useState(false);
  const [UserData, setUserData] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm();

  const { user } = useContext(AuthContext);
  const { isEnable, setIsEnable, setUserID, UserID } =
    useContext(UserDataContext);
  const { setKey } = useContext(ActiveKeyContext);

  useEffect(() => {
    async function fetchUserData() {
      if (UserID !== undefined && UserID !== null && UserID !== 0) {
        setIsLoading(true);
        const data = await fetchOldUserById(UserID, user.userID);
        if (!data) {
          setKey("search");
          toast.error("Network Error Occured!", {
            position: "bottom-left",
          });
        }
        setUserData(data);
        setIsLoading(false);
      }
    }
    if (UserID !== 0) {
      fetchUserData();
    }
  }, [UserID]);

  const userMutation = useMutation({
    mutationFn: async (formData) => {
      let DataToSend = {
        FirstName: formData.FirstName,
        LastName: formData.LastName,
        Email: formData.Email,
        Username: formData.Username,
        Password: formData.Password,
        InActive: formData.InActive ? 1 : 0,
        EntryUserID: user.userID,
      };
      if (UserData?.data[0]?.LoginUserID !== 0) {
        DataToSend.LoginUserID = UserData?.data[0]?.LoginUserID;
      }
      const { data } = await axios.post(
        apiUrl + "/EduIMS/UsersInsertUpdate",
        DataToSend
      );

      if (data.success === false) {
        toast.error(data.message, {
          autoClose: 1000,
        });
      } else {
        setUserID(0);
        reset();
        setIsEnable(true);
        setKey("search");
        queryClient.invalidateQueries({ queryKey: ["users"] });
        if (UserData?.data[0]?.LoginUserID !== undefined) {
          toast.success("User updated successfully!", {
            autoClose: 1000,
          });
        } else {
          toast.success("User saved successfully!", {
            autoClose: 1000,
          });
        }
      }
    },
    onError: () => {
      toast.error("Error while saving data!!");
    },
  });

  const deleteMutation = useMutation({
    mutationKey: "deleteUser",
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User successfully deleted!", {
        autoClose: 1000,
      });
      setUserID(null);
      setIsEnable(true);
      setKey("search");
    },
  });

  useEffect(() => {
    if (UserID !== 0 && UserData?.data) {
      setValue("FirstName", UserData?.data[0]?.FirstName);
      setValue("LastName", UserData?.data[0]?.LastName);
      setValue("Email", UserData?.data[0]?.Email);
      setValue("Username", UserData?.data[0]?.UserName);
      setValue("Password", UserData?.data[0]?.Password);
      setValue("InActive", UserData?.data[0]?.InActive);
    }
  }, [UserID, UserData]);

  function onSubmit(data) {
    userMutation.mutate(data);
  }

  function handleEdit() {
    setIsEnable(true);
  }

  function handleAddNew() {
    setUserData(undefined);
    setUserID(0);
    reset();
    setIsEnable(true);
  }

  function handleCancel() {
    setUserData(undefined);
    setUserID(0);
    reset();
    setIsEnable(true);
  }

  function handleDelete() {
    deleteMutation.mutate({
      UserID: UserData?.data[0]?.LoginUserID,
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
            Users Registration / Entry
          </h4>
          <form
            onSubmit={handleSubmit(onSubmit)}
            id="GenUsersForm"
            onKeyDown={preventFormByEnterKeySubmission}
          >
            <Row className="p-3">
              <Form.Group as={Col} controlId="FirstName">
                <Form.Label>First Name</Form.Label>
                <span className="text-danger fw-bold ">*</span>
                <Form.Control
                  type="text"
                  required
                  className="form-control"
                  {...register("FirstName", {
                    disabled: !isEnable,
                  })}
                />
                <p className="text-danger">{errors.FirstName?.message}</p>
              </Form.Group>

              <Form.Group as={Col} controlId="LastName">
                <Form.Label>Last Name</Form.Label>
                <span className="text-danger fw-bold ">*</span>
                <Form.Control
                  type="text"
                  required
                  {...register("LastName", {
                    disabled: !isEnable,
                  })}
                />
                <p className="text-danger">{errors.LastName?.message}</p>
              </Form.Group>

              {/* <Form.Group as={Col} controlId="departmentID">
            <Form.Label>Department</Form.Label>
            <Form.Select required>
              <option>Please Select...</option>
              <option value="1">Quality Assurance</option>
              <option value="2">Marketing</option>
              <option value="3">Management</option>
            </Form.Select>
          </Form.Group> */}
            </Row>
            <Row className="p-3" style={{ marginTop: "-25px" }}>
              <Form.Group as={Col} controlId="Email">
                <Form.Label>Email</Form.Label>
                <span className="text-danger fw-bold ">*</span>
                <Form.Control
                  type="email"
                  required
                  {...register("Email", {
                    disabled: !isEnable,
                  })}
                />
                <p className="text-danger">{errors.Email?.message}</p>
              </Form.Group>

              <Form.Group as={Col} controlId="Username">
                <Form.Label>User Name</Form.Label>
                <span className="text-danger fw-bold ">*</span>
                <InputGroup as={Col} className="mb-3">
                  <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                  <Form.Control
                    required
                    aria-label="Username"
                    {...register("Username", {
                      disabled: !isEnable,
                    })}
                  />
                </InputGroup>
                <p className="text-danger">{errors.Username?.message}</p>
              </Form.Group>

              <Form.Group as={Col} controlId="Password">
                <Form.Label>Password</Form.Label>
                <span className="text-danger fw-bold ">*</span>
                <Form.Control
                  type="password"
                  required
                  {...register("Password", {
                    disabled: !isEnable,
                  })}
                />
                <p className="text-danger">{errors.Password?.message}</p>
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
              isSubmitting={userMutation.isPending}
              handleAddNew={handleAddNew}
              handleCancel={handleCancel}
              viewRecord={!isEnable}
              editRecord={isEnable && (UserData ? true : false)}
              newRecord={UserData ? false : true}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          </form>
        </>
      )}
    </>
  );
}

export default GenUsers;
