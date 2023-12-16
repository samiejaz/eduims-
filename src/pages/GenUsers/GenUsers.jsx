import React, { useState, useEffect } from "react";
import {
  Form,
  InputGroup,
  Row,
  Col,
  Spinner,
  ButtonGroup,
  Button,
} from "react-bootstrap";
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
import {
  convertBase64StringToFile,
  preventFormByEnterKeySubmission,
} from "../../utils/CommonFunctions";
import { Image } from "primereact/image";
import { CheckBox } from "../../components/Forms/form";

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
    setUserID(0);
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
  const [imgData, setImgData] = useState("");
  const [editImage, setEditImage] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
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
      } else {
        setImgData("");
      }
    }
    if (UserID !== 0) {
      fetchUserData();
    }
  }, [UserID]);

  const userMutation = useMutation({
    mutationFn: async (formData) => {
      let newFormData = new FormData();
      newFormData.append("FirstName", formData.FirstName);
      newFormData.append("LastName", formData.LastName);
      newFormData.append("Email", formData.Email);
      newFormData.append("Username", formData.Username);
      newFormData.append("Password", formData.Password);
      newFormData.append("Inactive", formData.InActive === false ? 0 : 1);
      newFormData.append("EntryUserID", user.userID);
      if (UserData?.data && UserID !== 0) {
        newFormData.append("LoginUserID", UserData?.data[0]?.LoginUserID);
      } else {
        newFormData.append("LoginUserID", 0);
      }
      let file = convertBase64StringToFile(imgData);
      newFormData.append("image", file);

      const { data } = await axios.post(
        apiUrl + "/EduIMS/UsersInsertUpdate",
        newFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success === false) {
        toast.error(data.message, {
          autoClose: 1000,
        });
      } else {
        if (UserID !== 0) {
          toast.success("User updated successfully!", {
            autoClose: 1000,
          });
        } else {
          toast.success("User saved successfully!", {
            autoClose: 1000,
          });
        }
        setUserID(0);
        setUserData([]);
        reset();
        setIsEnable(true);
        setKey("search");
        queryClient.invalidateQueries({ queryKey: ["users"] });
        setImgData("");
      }
    },
    onError: (err) => {
      console.log(err);
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
      setUserData([]);
      setUserID(0);
      setIsEnable(true);
      setKey("search");
      setImgData("");
    },
  });

  useEffect(() => {
    if (UserID !== 0 && UserData?.data) {
      console.log(UserData);
      setValue("FirstName", UserData?.data[0]?.FirstName);
      setValue("LastName", UserData?.data[0]?.LastName);
      setValue("Email", UserData?.data[0]?.Email);
      setValue("Username", UserData?.data[0]?.UserName);
      setValue("Password", UserData?.data[0]?.Password);
      setValue("InActive", UserData?.data[0]?.InActive);
      setImgData(UserData?.data[0]?.ProfilePic);
    }
  }, [UserID, UserData]);

  function onSubmit(data) {
    userMutation.mutate(data);
  }

  function handleEdit() {
    setIsEnable(true);
  }

  function handleAddNew() {
    setUserData([]);
    setUserID(0);
    reset();
    setIsEnable(true);
    setImgData("");
  }

  function handleCancel() {
    setUserData([]);
    setUserID(0);
    reset();
    setIsEnable(true);
    setImgData("");
  }

  function handleDelete() {
    deleteMutation.mutate({
      UserID: UserData?.data[0]?.LoginUserID,
      LoginUserID: user.userID,
    });
  }

  function onImageChange(e) {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      let base64Data;
      if (reader.result.includes("data:image/png;base64,")) {
        base64Data = reader.result.replace(/^data:image\/png;base64,/, "");
      } else {
        base64Data = reader.result.replace(/^data:image\/jpeg;base64,/, "");
      }
      setImgData(base64Data);
    });
    reader.readAsDataURL(e.target.files[0]);
  }

  function handleImageEdit() {
    setEditImage(true);
  }

  function handleImageDelete() {
    setValue("UserImage", []);
    setImgData("");
    setEditImage(false);
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
                {/* <Form.Check
                  aria-label="Inactive"
                  label="Inactive"
                  {...register("InActive", {
                    disabled: !isEnable,
                  })}
                /> */}
                <CheckBox
                  control={control}
                  isEnable={isEnable}
                  ID={"InActive"}
                  Label={"InActive"}
                />
              </Form.Group>
            </Row>
            {(editImage || imgData === "") && (
              <Row className="p-3" style={{ marginTop: "-25px" }}>
                <Form.Group controlId="UserImage" className="mb-3">
                  <Form.Label>Image</Form.Label>
                  <Form.Control
                    type="file"
                    {...register("UserImage", {
                      disabled: !isEnable,
                    })}
                    onChange={onImageChange}
                    accept="image/jpeg, image/png"
                  />
                </Form.Group>
              </Row>
            )}
            {imgData && (
              <Row className="p-3" style={{ marginTop: "-25px" }}>
                {isEnable && (
                  <>
                    <div className="text-end mb-1">
                      <ButtonGroup className="gap-1">
                        <Button
                          onClick={() => handleImageDelete()}
                          size="sm"
                          variant="danger"
                          className="rounded"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            fill="currentColor"
                            className="bi bi-trash3"
                            viewBox="0 0 16 16"
                          >
                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                          </svg>
                        </Button>
                        <Button
                          onClick={() => handleImageEdit()}
                          size="sm"
                          variant="success"
                          className="rounded"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            fill="currentColor"
                            className="bi bi-pencil-square"
                            viewBox="0 0 16 16"
                          >
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                            <path
                              fillRule="evenodd"
                              d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                            />
                          </svg>
                        </Button>
                      </ButtonGroup>
                    </div>
                  </>
                )}
                <Form.Group
                  as={Col}
                  controlId="UserImagePreview"
                  className="mb-3"
                >
                  <div className="card flex justify-content-center">
                    <>
                      <Image
                        src={"data:image/png;base64," + imgData}
                        alt="Image"
                        width="250"
                        preview
                        className="text-center"
                      />
                    </>
                  </div>
                </Form.Group>
              </Row>
            )}
            <ButtonRow
              isDirty={isDirty}
              isValid={isValid}
              editMode={isEnable}
              isSubmitting={userMutation.isPending}
              handleAddNew={handleAddNew}
              handleCancel={handleCancel}
              viewRecord={!isEnable}
              editRecord={isEnable && (UserID > 0 ? true : false)}
              newRecord={UserID === 0 ? true : false}
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
