import TabHeader from "../../components/TabHeader";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from "react-hook-form";
import { Form, Row, Col, Spinner } from "react-bootstrap";
import Select from "react-select";
import { useContext } from "react";
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

import {
  fetchAllBusinessUnitsForSelect,
  fetchAllProductCategoriesForSelect,
} from "../../api/SelectData";
import {
  ProductInfoDataContext,
  ProductInfoDataProivder,
} from "./ProductInfoDataContext";
import {
  deleteProductByID,
  fetchAllProducts,
  fetchProductById,
} from "../../api/ProductInfoData";
import { preventFormByEnterKeySubmission } from "../../utils/CommonFunctions";
import { AppConfigurationContext } from "../../context/AppConfigurationContext";

const apiUrl = import.meta.env.VITE_APP_API_URL;

function ProductInfo() {
  const { pageTitles } = useContext(AppConfigurationContext);
  document.title = `${pageTitles?.product || "Product"} Info`;

  return (
    <ProductInfoDataProivder>
      <TabHeader
        Search={<GenProductInfoSearch pageTitles={pageTitles} />}
        Entry={<GenProductInfoEntry pageTitles={pageTitles} />}
        SearchTitle={"Bank Account Openings"}
        EntryTitle={"Add new opening"}
      />
    </ProductInfoDataProivder>
  );
}

const defaultValues = {
  ProductInfoTitle: "",
  ProductCategory: [],
  InActive: false,
};

function GenProductInfoSearch({ pageTitles }) {
  const queryClient = useQueryClient();

  const { user } = useContext(AuthContext);
  const { setKey } = useContext(ActiveKeyContext);

  const [filters, setFilters] = useState({
    ProductInfoTitle: { value: null, matchMode: FilterMatchMode.CONTAINS },
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

  const { setIsEnable, setProductInfoID } = useContext(ProductInfoDataContext);

  const {
    data: Products,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["productInfo"],
    queryFn: () => fetchAllProducts(user.userID),
    initialData: [],
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProductByID,
    onSuccess: (response) => {
      if (response === true) {
        queryClient.invalidateQueries({ queryKey: ["productInfo"] });
      }
    },
  });
  function handleEdit(ProductInfoID) {
    setProductInfoID(ProductInfoID);
    setIsEnable(true);
    setKey("entry");
    handleEditClose();
    setIdToEdit(0);
  }
  function handleDelete(ProductInfoID) {
    deleteMutation.mutate({ ProductInfoID, LoginUserID: user.userID });
    handleDeleteClose();
    setIdToDelete(0);
    setProductInfoID(null);
  }
  function handleView(ProductInfoID) {
    setKey("entry");
    setProductInfoID(ProductInfoID);
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
            value={Products}
            dataKey="ProductInfoID"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            removableSort
            emptyMessage={`No ${
              pageTitles?.product?.toLowerCase() || "product"
            }s found!`}
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
                  rowData.ProductInfoID,
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
              field="ProductInfoTitle"
              filter
              filterPlaceholder={`Search by ${
                pageTitles?.product || "Product"
              }`}
              sortable
              header={`${pageTitles?.product || "Product"} Info Title`}
              style={{ minWidth: "20rem" }}
            ></Column>
            <Column
              field="ProductCategoryTitle"
              filter
              filterPlaceholder="Search by Category"
              sortable
              header={`${pageTitles?.product || "Product"} Category`}
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

function GenProductInfoEntry({ pageTitles }) {
  const queryClient = useQueryClient();
  const [ProductInfo, setProductInfo] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBusinessUnits, setSelectedBusinessUnits] = useState();
  const {
    handleSubmit,
    register,
    control,
    reset,
    setValue,
    formState: { errors, isDirty, isValid },
  } = useForm();

  const { user } = useContext(AuthContext);
  const { isEnable, setIsEnable, setProductInfoID, ProductInfoID } = useContext(
    ProductInfoDataContext
  );
  const { setKey } = useContext(ActiveKeyContext);

  useEffect(() => {
    async function fetchSingleProduct() {
      if (
        ProductInfoID !== undefined &&
        ProductInfoID !== null &&
        ProductInfoID !== 0
      ) {
        setIsLoading(true);
        const data = await fetchProductById(ProductInfoID, user.userID);
        if (!data) {
          setKey("search");
          toast.error("Network Error Occured!");
        }
        setProductInfo(data);
        setIsLoading(false);
      } else {
        setProductInfo(null);
        setTimeout(() => {
          reset(defaultValues);
          setIsEnable(true);
          setSelectedBusinessUnits([]);
        }, 200);
      }
    }
    if (ProductInfoID !== 0) {
      fetchSingleProduct();
    }
  }, [ProductInfoID]);

  const { data } = useQuery({
    queryKey: ["productCategories"],
    queryFn: () => fetchAllProductCategoriesForSelect(),
    initialData: [],
  });

  const { data: BusinessUnits } = useQuery({
    queryKey: ["businessUnits"],
    queryFn: () => fetchAllBusinessUnitsForSelect(),
    initialData: [],
  });

  const productInfoMutation = useMutation({
    mutationFn: async (formData) => {
      let selectedBusinessUnitIDs;
      if (selectedBusinessUnits.length === 0) {
        selectedBusinessUnitIDs = BusinessUnits?.map((b, i) => {
          return { RowID: i + 1, BusinessUnitID: b.BusinessUnitID };
        });
      } else {
        selectedBusinessUnitIDs = selectedBusinessUnits?.map((b, i) => {
          return { RowID: i + 1, BusinessUnitID: b.BusinessUnitID };
        });
      }

      const dataToSend = {
        ProductInfoID: 0,
        ProductInfoTitle: formData.ProductInfoTitle,
        ProductCategoryID: formData.ProductCategory.ProductCategoryID,
        BusinessUnitIDs: JSON.stringify(selectedBusinessUnitIDs),
        InActive: formData.InActive ? 1 : 0,
        EntryUserID: user.userID,
      };

      if (
        ProductInfo?.length !== 0 &&
        ProductInfo?.data[0]?.ProductInfoID !== undefined
      ) {
        dataToSend.ProductInfoID = ProductInfo?.data[0]?.ProductInfoID;
      } else {
        dataToSend.ProductInfoID = 0;
      }

      const { data } = await axios.post(
        apiUrl + `/EduIMS/ProductInfoInsertUpdate`,
        dataToSend
      );

      if (data.success === true) {
        setProductInfoID(0);
        reset();
        resetSelectValues();
        setSelectedBusinessUnits([]);
        setIsEnable(true);
        setProductInfo([]);
        setKey("search");
        queryClient.invalidateQueries({ queryKey: ["productInfo"] });

        if (ProductInfo.length !== 0) {
          toast.success("ProductInfo Info updated successfully!");
        } else {
          toast.success("ProductInfo Info saved successfully!");
        }
      } else {
        toast.error(data.message, {
          autoClose: 1500,
        });
      }
    },
    onError: (error) => {
      toast.error("Some error occured!");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProductByID,
    onSuccess: (response) => {
      if (response === true) {
        queryClient.invalidateQueries({ queryKey: ["productInfo"] });
        setProductInfo([]);
        setProductInfoID(0);
        reset();
        setIsEnable(true);
        setKey("search");
      }
    },
  });

  useEffect(() => {
    if (ProductInfoID !== 0 && ProductInfo?.data) {
      resetSelectValues();
      if (ProductInfo?.data[0]?.ProductCategoryID !== 0) {
        setValue("ProductCategory", {
          ProductCategoryID: ProductInfo?.data[0]?.ProductCategoryID,
          ProductCategoryTitle: ProductInfo?.data[0]?.ProductCategoryTitle,
        });
      }
      setValue("ProductInfoTitle", ProductInfo?.data[0]?.ProductInfoTitle);

      setValue("InActive", ProductInfo?.data[0]?.InActive);
      setSelectedBusinessUnits(ProductInfo.Detail);
    }
  }, [ProductInfoID, ProductInfo]);

  function onSubmit(data) {
    productInfoMutation.mutate(data);
  }

  function handleEdit() {
    setIsEnable(true);
  }

  function handleAddNew() {
    setProductInfo([]);
    setProductInfoID(0);
    setTimeout(() => {
      resetSelectValues();
      setSelectedBusinessUnits([]);
    }, 200);
    reset();
    setIsEnable(true);
  }

  function handleCancel() {
    setProductInfo([]);
    setProductInfoID(0);
    setTimeout(() => {
      resetSelectValues();
      setSelectedBusinessUnits([]);
    }, 200);
    setValue("ProductCategory", []);
    reset();
    setIsEnable(true);
    //formRef.current.reset();
  }

  function handleDelete() {
    deleteMutation.mutate({
      ProductInfoID: ProductInfoID,
      LoginUserID: user.userID,
    });
  }

  function resetSelectValues() {
    setValue("ProductCategory", []);
  }

  const isRowSelectable = (event) => {
    return isEnable ? true : false;
  };

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
            {pageTitles?.product || "Product"} Info
          </h4>

          <form
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={preventFormByEnterKeySubmission}
          >
            <Row className="p-3" style={{ marginTop: "-25px" }}>
              <Form.Group as={Col} controlId="ProductInfoTitle">
                <Form.Label>
                  {pageTitles?.product || "Product"} Title
                </Form.Label>
                <span className="text-danger fw-bold ">*</span>
                <Form.Control
                  type="text"
                  placeholder=""
                  required
                  className="form-control"
                  {...register("ProductInfoTitle", {
                    disabled: !isEnable,
                  })}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="ProductCategory">
                <Form.Label>
                  {pageTitles?.product || "Product"} Category
                </Form.Label>
                <span className="text-danger fw-bold ">*</span>
                <Controller
                  control={control}
                  name="ProductCategory"
                  render={({ field: { onChange, value } }) => (
                    <Select
                      required
                      isDisabled={!isEnable}
                      options={data}
                      getOptionValue={(option) => option.ProductCategoryID}
                      getOptionLabel={(option) => option.ProductCategoryTitle}
                      value={value}
                      onChange={(selectedOption) => onChange(selectedOption)}
                      placeholder={`Select a ${
                        pageTitles?.product.toLowerCase() || "product"
                      } category`}
                      noOptionsMessage={() =>
                        `No ${
                          pageTitles?.product.toLowerCase() || "product"
                        } categories found!`
                      }
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

            <Row className="p-3" style={{ marginTop: "-25px" }}>
              <Form.Group as={Col}>
                <DataTable
                  id="businessUnitTable"
                  value={BusinessUnits}
                  selectionMode={"checkbox"}
                  selection={selectedBusinessUnits}
                  onSelectionChange={(e) => setSelectedBusinessUnits(e.value)}
                  dataKey="BusinessUnitID"
                  tableStyle={{ minWidth: "50rem" }}
                  size="sm"
                  isDataSelectable={isRowSelectable}
                >
                  <Column
                    selectionMode="multiple"
                    headerStyle={{ width: "3rem" }}
                  ></Column>
                  <Column
                    field="BusinessUnitName"
                    header="Business Unit"
                  ></Column>
                </DataTable>
              </Form.Group>
            </Row>

            <ButtonRow
              isDirty={isDirty}
              isValid={isValid}
              editMode={isEnable}
              isSubmitting={productInfoMutation.isPending}
              handleAddNew={handleAddNew}
              handleCancel={handleCancel}
              viewRecord={!isEnable}
              editRecord={
                isEnable && (ProductInfo?.length !== 0 ? true : false)
              }
              newRecord={ProductInfo?.length !== 0 ? false : true}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          </form>
        </>
      )}
    </>
  );
}
export default ProductInfo;
