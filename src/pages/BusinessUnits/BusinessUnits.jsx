import { Row, Form, Col, Button, Spinner, ButtonGroup } from "react-bootstrap";
import TabHeader from "../../components/TabHeader";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ActionButtons from "../../components/ActionButtons";
import { FilterMatchMode } from "primereact/api";
import { useContext, useEffect, useState } from "react";
import useEditModal from "../../hooks/useEditModalHook";
import useDeleteModal from "../../hooks/useDeleteModalHook";
import { ActiveKeyContext } from "../../context/ActiveKeyContext";
import { Image } from "primereact/image";
import {
  BusinessUnitDataContext,
  BusinessUnitDataProivder,
} from "./BusinessUnitContext";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import ButtonRow from "../../components/ButtonRow";
import {
  fetchAllBusinessUnits,
  fetchBusinessUnitById,
} from "../../api/BusinessUnitData";
import {
  convertBase64StringToFile,
  preventFormByEnterKeySubmission,
} from "../../utils/CommonFunctions";

function BusinessUnits() {
  document.title = "Business Units";
  return (
    <BusinessUnitDataProivder>
      <TabHeader
        Search={<BusinessUnitsSearch />}
        Entry={<BusinessUnitsForm />}
        SearchTitle={"Users"}
        EntryTitle={"Add New User"}
      />
    </BusinessUnitDataProivder>
  );
}
const apiUrl = import.meta.env.VITE_APP_API_URL;
function BusinessUnitsSearch() {
  const queryClient = useQueryClient();
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
  const { setKey } = useContext(ActiveKeyContext);
  const { setBusinessUnitID, setIsEnable } = useContext(
    BusinessUnitDataContext
  );

  const [filters, setFilters] = useState({
    BusinessUnitName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    Address: { value: null, matchMode: FilterMatchMode.CONTAINS },
    LandlineNo: { value: null, matchMode: FilterMatchMode.CONTAINS },
    MobileNo: { value: null, matchMode: FilterMatchMode.CONTAINS },
    Email: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const { user } = useContext(AuthContext);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["businessUnits"],
    queryFn: () => fetchAllBusinessUnits(user.userID),
    initialData: [],
  });

  const deleteMutation = useMutation({
    mutationFn: async (business) => {
      const { data } = await axios.post(
        apiUrl +
          `/EduIMS/BusinessUnitsDelete?BusinessUnitID=${business.BusinessUnitID}&LoginUserID=${user.userID}`
      );
      if (data.success === true) {
        queryClient.invalidateQueries({ queryKey: ["businessUnits"] });
        toast.success("Business successfully deleted!");
      } else {
        toast.error(data.message, {
          autoClose: 2000,
        });
      }
    },
  });

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  function handleDelete(id) {
    deleteMutation.mutate({ BusinessUnitID: id, LoginUserID: user.userID });
    handleDeleteClose();
    setIdToDelete(0);
    setBusinessUnitID(0);
  }

  function handleEdit(id) {
    setBusinessUnitID(id);
    setIsEnable(true);
    // setTimeout(() => {
    setKey("entry");
    //   }, 1000);
    handleEditClose();
    setIdToEdit(0);
  }

  function handleView(id) {
    setKey("entry");

    setBusinessUnitID(id);
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
            value={data}
            dataKey="BusinessUnitID"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            removableSort
            emptyMessage="No business found!"
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
                  rowData.BusinessUnitID,
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
              field="BusinessUnitName"
              filter
              filterPlaceholder="Search by company"
              sortable
              header="Company"
              style={{ minWidth: "20rem" }}
            ></Column>
            <Column
              field="Address"
              sortable
              header="Address"
              filter
              filterPlaceholder="Search by address"
            ></Column>
            <Column
              field="LandlineNo"
              sortable
              header="LandlineNo"
              filter
              filterPlaceholder="Search by landline no"
            ></Column>
            <Column
              field="MobileNo"
              sortable
              header="MobileNo"
              filter
              filterPlaceholder="Search by mobile no"
            ></Column>
            <Column
              field="Email"
              sortable
              header="Email"
              filter
              filterPlaceholder="Search by email"
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
  BusinessUnitName: "",
  Address: "",
  LandlineNo: "",
  MobileNo: "",
  Email: "",
  Website: "",
  AuthorityPersonName: "",
  AuthorityPersonNo: "",
  AuthorityPersonEmail: "",
  NTNno: "",
  STRNo: "",
  Description: "",
  InActive: false,
};

function BusinessUnitsForm() {
  const queryClient = useQueryClient();
  const [BusinessUnit, setBusinessUnit] = useState({ data: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [imgData, setImgData] = useState();
  const [editImage, setEditImage] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isDirty, isValid, errors },
  } = useForm(defaultValues);

  const { BusinessUnitID, setBusinessUnitID, isEnable, setIsEnable } =
    useContext(BusinessUnitDataContext);
  const { user } = useContext(AuthContext);
  const { setKey } = useContext(ActiveKeyContext);

  useEffect(() => {
    async function fetchBusinessUnit() {
      if (
        BusinessUnitID !== undefined &&
        BusinessUnitID !== null &&
        BusinessUnitID !== 0
      ) {
        setIsLoading(true);
        const data = await fetchBusinessUnitById(BusinessUnitID, user.userID);
        if (!data) {
          setKey("search");
          toast.error("Network Error Occured!", {
            position: "bottom-left",
          });
        }
        setBusinessUnit(data);
        setIsLoading(false);
      } else {
        setBusinessUnit([]);
        setTimeout(() => {
          reset(defaultValues);
          setIsEnable(true);
          setImgData("");
        }, 200);
      }
    }
    if (BusinessUnitID !== 0) {
      fetchBusinessUnit();
    }
  }, [BusinessUnitID]);

  const companyMutation = useMutation({
    mutationFn: async (formData) => {
      let newFormData = new FormData();
      newFormData.append("BusinessUnitName", formData.BusinessUnitName);
      newFormData.append("Address", formData.Address || "");
      newFormData.append("LandlineNo", formData.LandlineNo || "");
      newFormData.append("MobileNo", formData.MobileNo || "");
      newFormData.append("Email", formData.Email || "");
      newFormData.append("Website", formData.Website || "");
      newFormData.append(
        "AuthorityPersonName",
        formData.AuthorityPersonName || ""
      );
      newFormData.append("AuthorityPersonNo", formData.AuthorityPersonNo || "");
      newFormData.append(
        "AuthorityPersonEmail",
        formData.AuthorityPersonEmail || ""
      );
      newFormData.append("NTNno", formData.NTNno || "");
      newFormData.append("STRNo", formData.STRNo || "");
      newFormData.append("Description", formData.Description || "");
      newFormData.append("EntryUserID", user.userID);
      newFormData.append("Inactive", formData.InActive === false ? 0 : 1);
      if (BusinessUnitID !== 0) {
        newFormData.append(
          "BusinessUnitID",
          BusinessUnit?.data[0]?.BusinessUnitID
        );
      } else {
        newFormData.append("BusinessUnitID", 0);
      }

      let file = convertBase64StringToFile(imgData);
      newFormData.append("image", file);

      const { data } = await axios.post(
        "http://192.168.9.110:90/api/EduIMS/BusinessUnitsInsertUpdate",
        newFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success === true) {
        if (BusinessUnitID !== 0) {
          toast.success("Business Unit updated successfully!");
        } else {
          toast.success("Business Unit saved successfully!");
        }
        setBusinessUnitID(0);
        setIsEnable(true);
        setEditImage(false);
        reset();
        setKey("search");
        queryClient.invalidateQueries({ queryKey: ["businessUnits"] });
        setImgData("");
      } else {
        toast.error(data.message, {
          autoClose: 1500,
        });
      }
    },
    onError: (err) => {
      toast.error("Something went wrong", {
        autoClose: 1000,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { data } = await axios.post(
        apiUrl +
          `/EduIMS/BusinessUnitsDelete?BusinessUnitID=${BusinessUnitID}&LoginUserID=${user.userID}`
      );
      if (data.success === true) {
        queryClient.invalidateQueries({ queryKey: ["businessUnits"] });
        toast.success("Business successfully deleted!");
        setBusinessUnit(undefined);
        setBusinessUnitID(0);
        reset();
        setIsEnable(true);
        setKey("search");
        setEditImage(false);
        setImgData("");
      } else {
        toast.error(data.message, {
          autoClose: 2000,
        });
      }
    },
  });

  function onSubmit(data) {
    companyMutation.mutate(data);
  }

  function handleEdit() {
    setIsEnable(true);
  }

  function handleAddNew() {
    setBusinessUnit({ data: [] });
    setBusinessUnitID(0);
    reset();
    setIsEnable(true);
    setEditImage(false);
    setImgData("");
  }

  function handleCancel() {
    setBusinessUnit({ data: [] });
    setBusinessUnitID(0);
    reset();
    setIsEnable(true);
    setEditImage(false);
    setImgData();
  }

  useEffect(() => {
    if (BusinessUnitID !== 0 && BusinessUnit?.data) {
      setValue("BusinessUnitName", BusinessUnit?.data[0]?.BusinessUnitName);
      setValue("Address", BusinessUnit?.data[0]?.Address);
      setValue("LandlineNo", BusinessUnit?.data[0]?.LandlineNo);
      setValue("MobileNo", BusinessUnit?.data[0]?.MobileNo);
      setValue("Email", BusinessUnit?.data[0]?.Email);
      setValue("Website", BusinessUnit?.data[0]?.Website);
      setValue(
        "AuthorityPersonName",
        BusinessUnit?.data[0]?.AuthorityPersonName
      );
      setValue("AuthorityPersonNo", BusinessUnit?.data[0]?.AuthorityPersonNo);
      setValue(
        "AuthorityPersonEmail",
        BusinessUnit?.data[0]?.AuthorityPersonEmail
      );
      setValue("NTNno", BusinessUnit?.data[0]?.NTNno);
      setValue("STRNo", BusinessUnit?.data[0]?.STRNo);
      setValue("Description", BusinessUnit?.data[0]?.Description);
      setValue("InActive", BusinessUnit?.data[0]?.InActive);
      setImgData(BusinessUnit?.data[0]?.Logo);
    }
  }, [BusinessUnit, BusinessUnitID]);
  function handleDelete() {
    deleteMutation.mutate({
      BusinessUnitID: BusinessUnitID,
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
    setValue("BusinessImage", []);
    setImgData("");
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
            Business Units
          </h4>
          <form
            id="BusinessUnits"
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={preventFormByEnterKeySubmission}
          >
            <Row className="p-3">
              <Form.Group as={Col} controlId="BusinessUnitName">
                <Form.Label>Business Unit Name</Form.Label>
                <span className="text-danger fw-bold ">*</span>
                <Form.Control
                  type="text"
                  required
                  className="form-control"
                  {...register("BusinessUnitName", {
                    disabled: !isEnable,
                  })}
                />
                <p className="text-danger">
                  {errors.BusinessUnitName?.message}
                </p>
              </Form.Group>
              <Form.Group as={Col} controlId="Address">
                <Form.Label>Address</Form.Label>

                <Form.Control
                  type="text"
                  className="form-control"
                  {...register("Address", {
                    disabled: !isEnable,
                  })}
                />
              </Form.Group>
            </Row>
            <Row className="p-3" style={{ marginTop: "-25px" }}>
              <Form.Group as={Col} controlId="LandlineNo">
                <Form.Label>Landline No</Form.Label>

                <Form.Control
                  type="text"
                  className="form-control"
                  {...register("LandlineNo", {
                    disabled: !isEnable,
                  })}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="MobileNo">
                <Form.Label>Mobile No</Form.Label>

                <Form.Control
                  type="text"
                  className="form-control"
                  {...register("MobileNo", {
                    disabled: !isEnable,
                  })}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="Email">
                <Form.Label>Email</Form.Label>

                <Form.Control
                  type="text"
                  className="form-control"
                  {...register("Email", {
                    disabled: !isEnable,
                  })}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="Website">
                <Form.Label>Website</Form.Label>

                <Form.Control
                  type="text"
                  className="form-control"
                  {...register("Website", {
                    disabled: !isEnable,
                  })}
                />
              </Form.Group>
            </Row>
            <Row className="p-3" style={{ marginTop: "-25px" }}>
              <Form.Group as={Col} controlId="AuthorityPersonName">
                <Form.Label>Authority Person / CEO Name</Form.Label>

                <Form.Control
                  type="text"
                  className="form-control"
                  {...register("AuthorityPersonName", {
                    disabled: !isEnable,
                  })}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="AuthorityPersonNo">
                <Form.Label>Mobile No</Form.Label>

                <Form.Control
                  type="text"
                  className="form-control"
                  {...register("AuthorityPersonNo", {
                    disabled: !isEnable,
                  })}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="AuthorityPersonEmail">
                <Form.Label>Email</Form.Label>

                <Form.Control
                  type="text"
                  className="form-control"
                  {...register("AuthorityPersonEmail", {
                    disabled: !isEnable,
                  })}
                />
              </Form.Group>
            </Row>
            <Row className="p-3" style={{ marginTop: "-25px" }}>
              <Form.Group as={Col} controlId="NTNno">
                <Form.Label>NTN-No</Form.Label>

                <Form.Control
                  type="text"
                  className="form-control"
                  {...register("NTNno", {
                    disabled: !isEnable,
                  })}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="STRNo">
                <Form.Label>Sales Tax Return No</Form.Label>

                <Form.Control
                  type="text"
                  className="form-control"
                  {...register("STRNo", {
                    disabled: !isEnable,
                  })}
                />
              </Form.Group>
            </Row>
            <Row className="p-3" style={{ marginTop: "-25px" }}>
              <Form.Group as={Col} controlId="Description">
                <Form.Label>Description</Form.Label>

                <Form.Control
                  type="text"
                  className="form-control"
                  {...register("Description", {
                    disabled: !isEnable,
                  })}
                />
              </Form.Group>
            </Row>

            {(editImage || !BusinessUnit?.data[0]?.Logo) && (
              <>
                <Row className="p-3" style={{ marginTop: "-25px" }}>
                  <Form.Group controlId="BusinessImage" className="mb-3">
                    <Form.Label>Business Logo</Form.Label>
                    <Form.Control
                      type="file"
                      {...register("BusinessImage", {
                        disabled: !isEnable,
                      })}
                      onChange={onImageChange}
                      accept="image/jpeg, image/png"
                    />
                  </Form.Group>
                </Row>
              </>
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
                  controlId="BusinessImagePreview"
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
              isSubmitting={companyMutation.isPending}
              handleAddNew={handleAddNew}
              handleCancel={handleCancel}
              viewRecord={!isEnable}
              editRecord={isEnable && (BusinessUnitID > 0 ? true : false)}
              newRecord={BusinessUnitID === 0 ? true : false}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          </form>
        </>
      )}
    </>
  );
}

export default BusinessUnits;
