import React, { useContext, useEffect, useState } from "react";
import TabHeader from "../../components/TabHeader";
import { Form, Row, Col, Spinner } from "react-bootstrap";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from "react-hook-form";

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
  ProductCategoryDataContext,
  ProductCategoryDataProivder,
} from "./ProductCategoryDataContext";
import {
  deleteProductCategory,
  fetchAllProductCategories,
  fetchProductCategoryById,
} from "../../api/ProductCategoryData";
import { preventFormByEnterKeySubmission } from "../../utils/CommonFunctions";
import Select from "react-select";
import { AppConfigurationContext } from "../../context/AppConfigurationContext";

const apiUrl = import.meta.env.VITE_APP_API_URL;
const defaultValues = {
  ProductCategoryTitle: "",
  ProductType: [],
  InActive: false,
};

function GenProductCategory() {
  const { pageTitles } = useContext(AppConfigurationContext);
  document.title = `${pageTitles?.product || "Product"} Category`;

  return (
    <ProductCategoryDataProivder>
      <TabHeader
        Search={<GenProductCategorySearch pageTitles={pageTitles} />}
        Entry={<GenProductCategoryEntry pageTitles={pageTitles} />}
        SearchTitle={"ProductCategory Info"}
        EntryTitle={"Add New ProductCategory"}
      />
    </ProductCategoryDataProivder>
  );
}

function GenProductCategorySearch() {
  const queryClient = useQueryClient();
  const { pageTitles } = useContext(AppConfigurationContext);
  const { user } = useContext(AuthContext);
  const { setKey } = useContext(ActiveKeyContext);

  const [filters, setFilters] = useState({
    ProductCategoryTitle: { value: null, matchMode: FilterMatchMode.CONTAINS },
    ProductType: { value: null, matchMode: FilterMatchMode.CONTAINS },
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

  const { setIsEnable, setProductCategoryID } = useContext(
    ProductCategoryDataContext
  );

  const {
    data: ProductCategories,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["productCategories"],
    queryFn: () => fetchAllProductCategories(user.userID, pageTitles?.product),
    initialData: [],
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProductCategory,
    onSuccess: (data) => {
      if (data === true) {
        queryClient.invalidateQueries({ queryKey: ["productCategories"] });
      }
    },
  });

  function handleEdit(ProductCategoryID) {
    setProductCategoryID(ProductCategoryID);
    setIsEnable(true);
    setKey("entry");
    handleEditClose();
    setIdToEdit(0);
  }
  function handleDelete(ProductCategoryID) {
    deleteMutation.mutate({ ProductCategoryID, LoginUserID: user.userID });
    handleDeleteClose();
    setIdToDelete(0);
    setProductCategoryID(null);
  }
  function handleView(ProductCategoryID) {
    setKey("entry");
    setProductCategoryID(ProductCategoryID);
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
            value={ProductCategories}
            dataKey="ProductCategoryID"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            removableSort
            emptyMessage={`No ${
              pageTitles?.product?.toLowerCase() || "product"
            } category found!`}
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
                  rowData.ProductCategoryID,
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
              field="ProductCategoryTitle"
              filter
              filterPlaceholder="Search by category"
              sortable
              header={`${pageTitles?.product || "Product"} Category`}
              style={{ minWidth: "20rem" }}
            ></Column>
            <Column
              field="ProductType"
              filter
              filterPlaceholder={`Search by ${
                pageTitles?.product?.toLowerCase() || "product"
              } type`}
              sortable
              header={`${pageTitles?.product || "Product"} Type`}
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

function GenProductCategoryEntry({ pageTitles }) {
  const queryClient = useQueryClient();
  const [ProductCategory, setProductCategory] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isDirty, isValid },
  } = useForm();

  const { user } = useContext(AuthContext);
  const { setKey } = useContext(ActiveKeyContext);
  const { isEnable, ProductCategoryID, setProductCategoryID, setIsEnable } =
    useContext(ProductCategoryDataContext);

  useEffect(() => {
    async function fetchSession() {
      if (
        ProductCategoryID !== undefined &&
        ProductCategoryID !== null &&
        ProductCategoryID !== 0
      ) {
        setIsLoading(true);
        const data = await fetchProductCategoryById(
          ProductCategoryID,
          user.userID
        );
        if (!data) {
          setKey("search");
          toast.error("Network Error Occured!");
        }
        setProductCategory(data);
        setIsLoading(false);
      } else {
        setProductCategory(null);
        setTimeout(() => {
          reset(defaultValues);
          setIsEnable(true);
        }, 200);
      }
    }
    if (ProductCategoryID !== 0) {
      fetchSession();
    }
  }, [ProductCategoryID]);

  const sessionMutation = useMutation({
    mutationFn: async (formData) => {
      const dataToSend = {
        ProductCategoryID: 0,
        ProductCategoryTitle: formData.ProductCategoryTitle,
        ProductType: formData.ProductType.value,
        InActive: formData.InActive ? 1 : 0,
        EntryUserID: user.userID,
      };

      if (ProductCategory?.data[0]?.ProductCategoryID !== undefined) {
        dataToSend.ProductCategoryID =
          ProductCategory?.data[0]?.ProductCategoryID;
      } else {
        dataToSend.ProductCategoryID = 0;
      }

      const { data } = await axios.post(
        apiUrl + `/EduIMS/ProductCategoryInsertUpdate`,
        dataToSend
      );

      if (data.success === true) {
        setProductCategoryID(0);
        reset(defaultValues);
        setIsEnable(true);
        setKey("search");
        queryClient.invalidateQueries({ queryKey: ["productCategories"] });
        if (ProductCategory?.data[0]?.ProductCategoryID !== undefined) {
          toast.success(
            `${
              pageTitles?.product || "Product"
            } Category  updated successfully!`
          );
        } else {
          toast.success(
            `${pageTitles?.product || "Product"} Category  saved successfully!`
          );
        }
      } else {
        toast.error(data.message, {
          autoClose: 1500,
        });
      }
    },
  });
  const deleteMutation = useMutation({
    mutationFn: deleteProductCategory,
    onSuccess: (response) => {
      if (response === true) {
        queryClient.invalidateQueries({ queryKey: ["productCategories"] });
        setProductCategory(undefined);
        setProductCategoryID(0);
        reset(defaultValues);
        setIsEnable(true);
        setKey("search");
      }
    },
  });

  useEffect(() => {
    if (ProductCategoryID !== 0 && ProductCategory?.data) {
      setValue(
        "ProductCategoryTitle",
        ProductCategory?.data[0]?.ProductCategoryTitle
      );
      setValue("ProductType", {
        label: ProductCategory?.data[0]?.ProductType,
        value: ProductCategory?.data[0]?.ProductType,
      });

      setValue("InActive", ProductCategory?.data[0]?.InActive);
    }
  }, [ProductCategoryID, ProductCategory]);

  function onSubmit(data) {
    sessionMutation.mutate(data);
  }
  function handleEdit() {
    setIsEnable(true);
  }

  function handleAddNew() {
    setProductCategory(undefined);
    setProductCategoryID(0);
    reset(defaultValues);
    setIsEnable(true);
  }

  function handleCancel() {
    setProductCategory(undefined);
    setProductCategoryID(0);
    reset(defaultValues);
    setIsEnable(true);
  }

  function handleDelete() {
    deleteMutation.mutate({
      ProductCategoryID,
      LoginUserID: user.userID,
    });
  }

  const typesOptions = [
    { label: pageTitles?.product || "Product", value: "Product" },
    { label: "Service", value: "Service" },
  ];

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
            {pageTitles?.product || "Product"} Category Entry
          </h4>
          <form
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={preventFormByEnterKeySubmission}
          >
            <Row className="p-3">
              <Form.Group as={Col} controlId="ProductCategoryTitle">
                <Form.Label>
                  {pageTitles?.product || "Product"} Category Title
                </Form.Label>
                <span className="text-danger fw-bold ">*</span>
                <Form.Control
                  type="text"
                  required
                  className="form-control"
                  {...register("ProductCategoryTitle", {
                    disabled: !isEnable,
                  })}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="ProductType">
                <Form.Label>{pageTitles?.product || "Product"} Type</Form.Label>
                <span className="text-danger fw-bold ">*</span>
                <Controller
                  control={control}
                  name="ProductType"
                  render={({ field: { onChange, value } }) => (
                    <Select
                      required
                      isDisabled={!isEnable}
                      options={typesOptions}
                      value={value}
                      onChange={(selectedOption) => onChange(selectedOption)}
                      placeholder="Select a type"
                      noOptionsMessage={() => "No types found!"}
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
              isSubmitting={sessionMutation.isPending}
              handleAddNew={handleAddNew}
              handleCancel={handleCancel}
              viewRecord={!isEnable}
              editRecord={isEnable && (ProductCategory ? true : false)}
              newRecord={ProductCategory ? false : true}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          </form>
        </>
      )}
    </>
  );
}

export default GenProductCategory;
