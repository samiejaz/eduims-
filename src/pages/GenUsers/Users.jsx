import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import useEditModal from "../../hooks/useEditModalHook";
import useDeleteModal from "../../hooks/useDeleteModalHook";
import { FilterMatchMode } from "primereact/api";
import { useEffect, useRef, useState } from "react";
import { CustomSpinner } from "../../components/CustomSpinner";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import ActionButtons from "../../components/ActionButtons";
import { useForm } from "react-hook-form";
import ButtonToolBar from "../CustomerInvoice/CustomerInvoiceToolbar";
import { Col, Form, Row } from "react-bootstrap";
import TextInput from "../../components/Forms/TextInput";
import CheckBox from "../../components/Forms/CheckBox";
import { useUserData } from "../../context/AuthContext";
import {
  addNewUser,
  deleteUserByID,
  fetchAllUsers,
  fetchUserById,
} from "../../api/UserData";
import { ROUTE_URLS, QUERY_KEYS } from "../../utils/enums";
import { FileUpload } from "primereact/fileupload";
import { useAllDepartmentsSelectData } from "../../hooks/SelectData/useSelectData";
import CDropdown from "../../components/Forms/CDropdown";

let parentRoute = ROUTE_URLS.USER_ROUTE;
let editRoute = `${parentRoute}/edit/`;
let newRoute = `${parentRoute}/new`;
let viewRoute = `${parentRoute}/`;
let detail = "#22C55E";
let queryKey = QUERY_KEYS.USER_QUERY_KEY;

export function UserDetail() {
  document.title = "Users";

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
    queryFn: () => fetchAllUsers(user.userID),
    initialData: [],
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUserByID,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKey],
      });
    },
  });

  function handleDelete(id) {
    deleteMutation.mutate({ UserID: id, LoginUserID: user.userID });
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
            <h2 className="text-center my-auto">Users</h2>
            <div className="text-end my-auto" style={{ marginLeft: "10px" }}>
              <Button
                label="Add New User"
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
            dataKey="LoginUserID"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            removableSort
            emptyMessage="No User found!"
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
                  rowData.LoginUserID,
                  () => handleDeleteShow(rowData.LoginUserID),
                  handleEditShow,
                  handleView
                )
              }
              header="Actions"
              resizeable={false}
              style={{ minWidth: "7rem", maxWidth: "10rem", width: "7rem" }}
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
      )}
    </div>
  );
}

let renderCount = 0;
export function UserForm({ pagesTitle, user, mode }) {
  renderCount++;
  document.title = "User Entry";

  const queryClient = useQueryClient();

  const [UserImage, setUserImage] = useState();

  const navigate = useNavigate();
  const { UserID } = useParams();

  const {
    control,
    handleSubmit,
    setFocus,
    setValue,
    reset,
    register,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      FirstName: "",
      LastName: "",
      Email: "",
      Password: "",
      UserName: "",
      InActive: "",
      DepartmentID: [],
    },
  });

  const departmentSelectData = useAllDepartmentsSelectData();

  const UserData = useQuery({
    queryKey: [queryKey, UserID],
    queryFn: () => fetchUserById(UserID, user.userID),
    enabled: UserID !== undefined,
    initialData: [],
  });

  useEffect(() => {
    if (!isDirty) {
      if (+UserID !== undefined && UserData?.data?.length > 0) {
        try {
          setValue("FirstName", UserData?.data[0]?.FirstName);
          setValue("LastName", UserData?.data[0]?.LastName);
          setValue("Email", UserData?.data[0]?.Email);
          setValue("UserName", UserData?.data[0]?.UserName);
          setValue("Password", UserData?.data[0]?.Password);
          setValue("InActive", UserData?.data[0]?.InActive);
        } catch (error) {
          console.log(error);
        }
      }
    }
  }, [UserID, UserData]);

  const mutation = useMutation({
    mutationFn: addNewUser,
    onSuccess: ({ success, RecordID }) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
        navigate(`${parentRoute}/${RecordID}`);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUserByID,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      navigate(parentRoute);
    },
  });

  function handleDelete() {
    deleteMutation.mutate({
      UserID: UserID,
      LoginUserID: user.userID,
    });
  }

  function handleAddNew() {
    reset();
    navigate(newRoute);
  }
  function handleCancel() {
    if (mode === "new") {
      navigate(parentRoute);
    } else if (mode === "edit") {
      navigate(viewRoute + UserID);
    }
  }
  function handleEdit() {
    navigate(editRoute + UserID);
  }

  function onSubmit(data) {
    // mutation.mutate({
    //   formData: data,
    //   userID: user.userID,
    //   UserID: parseInt(0 + UserID),
    //   UserImage: UserImage,
    // });
    console.log(data);
  }

  async function previewImage(e) {
    const file = e.target.files[0];

    const reader = new FileReader();
    let blob = await fetch(file.objectURL).then((r) => r.blob()); //blob:url

    reader.readAsDataURL(blob);
    console.log(blob);
    reader.onloadend = function () {
      const base64data = reader.result;
      console.log(base64data);
    };
  }

  return (
    <>
      {UserData.isLoading ? (
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
              handleSave={() => handleSubmit(onSubmit)()}
              GoBackLabel="Users"
            />
          </div>
          <form className="mt-4">
            <Row>
              <Form.Group as={Col} controlId="FirstName">
                <Form.Label>
                  First Name
                  <span className="text-danger fw-bold ">*</span>
                </Form.Label>

                <div>
                  <TextInput
                    control={control}
                    ID={"FirstName"}
                    required={true}
                    focusOptions={() => setFocus("LastName")}
                    isEnable={mode !== "view"}
                  />
                </div>
              </Form.Group>
              <Form.Group as={Col} controlId="LastName">
                <Form.Label>
                  Last Name
                  <span className="text-danger fw-bold ">*</span>
                </Form.Label>

                <div>
                  <TextInput
                    control={control}
                    ID={"LastName"}
                    required={true}
                    focusOptions={() => setFocus("Email")}
                    isEnable={mode !== "view"}
                  />
                </div>
              </Form.Group>
              <Form.Group as={Col} controlId="DepartmentID">
                <Form.Label style={{ fontSize: "14px", fontWeight: "bold" }}>
                  Department
                  <span className="text-danger fw-bold ">*</span>
                </Form.Label>
                <div>
                  <CDropdown
                    control={control}
                    name={`DepartmentID`}
                    optionLabel="DepartmentName"
                    optionValue="DepartmentID"
                    placeholder="Select a department"
                    options={departmentSelectData.data}
                    required={true}
                    disabled={mode === "view"}
                    focusOptions={() => setFocus("InActive")}
                  />
                </div>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={Col} controlId="Email">
                <Form.Label>
                  Email
                  <span className="text-danger fw-bold ">*</span>
                </Form.Label>

                <div>
                  <TextInput
                    control={control}
                    ID={"Email"}
                    required={true}
                    focusOptions={() => setFocus("UserName")}
                    isEnable={mode !== "view"}
                  />
                </div>
              </Form.Group>
              <Form.Group as={Col} controlId="UserName">
                <Form.Label>
                  User Name
                  <span className="text-danger fw-bold ">*</span>
                </Form.Label>

                <div>
                  <TextInput
                    control={control}
                    ID={"UserName"}
                    required={true}
                    focusOptions={() => setFocus("Password")}
                    isEnable={mode !== "view"}
                  />
                </div>
              </Form.Group>
              <Form.Group as={Col} controlId="Password">
                <Form.Label>
                  Password
                  <span className="text-danger fw-bold ">*</span>
                </Form.Label>

                <div>
                  <TextInput
                    control={control}
                    ID={"Password"}
                    required={true}
                    focusOptions={() => setFocus("InActive")}
                    isEnable={mode !== "view"}
                  />
                </div>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={Col} controlId="InActive">
                <div className="mt-1">
                  <CheckBox
                    control={control}
                    ID={"InActive"}
                    Label={"InActive"}
                    isEnable={mode !== "view"}
                  />
                </div>
              </Form.Group>
            </Row>
            <Row>
              {/* <div className="mt-2">
                <Form.Label>Image</Form.Label>
                <FileUpload
                  mode="advanced"
                  name="UserImage"
                  accept="image/*"
                  customUpload
                  uploadHandler={customBase64Uploader}
                />
              </div> */}
            </Row>
            <Row>
              <div
                style={{
                  border: "1px solid #ddd",
                  padding: "0",
                  width: "98.5%",
                  margin: "0px 10px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    background: "#f8f9fa",
                    padding: "1.5rem",
                  }}
                >
                  <span
                    className="p-button"
                    onClick={() => {
                      control._fields.UserImage._f.ref.click();
                    }}
                  >
                    Choose
                  </span>
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    {...register("UserImage")}
                    onChange={previewImage}
                  />
                  <Button
                    label="Remove"
                    severity="danger"
                    className="rounded"
                    type="button"
                    onClick={() => {
                      control._fields.UserImage._f.ref.value = "";
                    }}
                  />
                </div>
                <div style={{ padding: "2rem" }}>
                  <div>
                    <img
                      style={{
                        overflowClipMargin: "content-box",
                        overflow: "clip",
                        width: "50px",
                      }}
                      src="data:image/png;base64,"
                      alt="Image"
                    />
                  </div>
                </div>
              </div>
            </Row>
          </form>
          {renderCount}
        </>
      )}
    </>
  );
}
