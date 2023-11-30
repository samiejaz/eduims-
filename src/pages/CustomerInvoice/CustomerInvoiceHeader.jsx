import { useEffect, useState } from "react";
import { Row, Col, Form, ButtonGroup, Button } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import ReactSelect from "react-select";
import { preventFormByEnterKeySubmission } from "../../utils/CommonFunctions";

const defaultValues = {
  InvoiceType: [],
  BusinessUnit: [],
  CustomerBranch: [],
  ProductInfo: [],
  ServiceInfo: [],
  Qty: 1,
  Rate: 0,
  CGS: 0,
  Discount: 0,
  Amount: 0,
  NetAmount: 0,
  Description: "",
};

function CustomerInvoiceHeader({
  businessSelectData,
  customerBranchSelectData,
  productsInfoSelectData,
  servicesInfoSelectData,
  append,
  fields,
  pageTitles,
}) {
  const {
    control,
    handleSubmit,
    register,
    reset,
    getValues,
    setValue,
    setFocus,
    watch,
    formState: { errors, isDirty },
  } = useForm({ defaultValues });

  const [filteredProducts, setFilteredProducts] = useState([]);
  const InvoiceType = watch("InvoiceType");

  function onSubmit(data) {
    console.log(data);
    append(data);

    // {
    //   InvoiceType: {
    //     value: data.InvoiceType.value,
    //     label: data.InvoiceType.label,
    //   },
    //   BusinessUnit: {
    //     BusinessUnitID: data.BusinessUnit.BusinessUnitID,
    //     BusinessUnitName: data.BusinessUnit.BusinessUnitName,
    //   },
    //   Product: {
    //     ProductInfoID: data.ProductInfo.ProductInfoID,
    //     ProductInfoTitle: data.ProductInfo.ProductInfoTitle,
    //   },
    //   CustomerBranch: {
    //     CustomerBranchID: data.CustomerBranch.CustomerBranchID,
    //     CustomerBranchTitle: data.CustomerBranch.CustomerBranchTitle,
    //   },
    //   Rate: data.Rate,
    //   CGS: data.CGS,
    //   Discount: data.Discount,
    //   Amount: data.Amount,
    //   Description: data.Description,
    // }

    reset(defaultValues);
  }

  const typesOptions = [
    { label: pageTitles?.product || "Product", value: "Product" },
    { label: "Service", value: "Service" },
  ];

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        // onKeyDown={preventFormByEnterKeySubmission}
      >
        <Row className="py-3" style={{ marginTop: "-25px" }}>
          <Form.Group as={Col} controlId="InvoiceType">
            <Form.Label>Invoice Type</Form.Label>
            <span className="text-danger fw-bold ">*</span>
            <Controller
              control={control}
              name="InvoiceType"
              rules={{ required: "Please select a type!" }}
              render={({ field: { onChange, value } }) => (
                <ReactSelect
                  options={typesOptions}
                  value={value}
                  onChange={(selectedOption) => {
                    onChange(selectedOption);
                    setFocus("BusinessUnit");
                    setValue("ServiceInfo", []);
                  }}
                  placeholder="Select a type"
                  noOptionsMessage={() => "No types found!"}
                />
              )}
            />
            <span className="text-danger">{errors?.Type?.message}</span>
          </Form.Group>
          <Form.Group as={Col} controlId="BusinessUnit">
            <Form.Label>Business Unit</Form.Label>
            <span className="text-danger fw-bold ">*</span>
            <Controller
              control={control}
              name="BusinessUnit"
              rules={{ required: "Please select a business unit" }}
              render={({ field: { onChange, value, ref } }) => (
                <ReactSelect
                  options={businessSelectData}
                  getOptionValue={(option) => option.BusinessUnitID}
                  getOptionLabel={(option) => option.BusinessUnitName}
                  value={value}
                  ref={ref}
                  onChange={(selectedOption) => {
                    onChange(selectedOption);
                    const filteredProducts = productsInfoSelectData.filter(
                      (p) => p.BusinessUnitID === selectedOption.BusinessUnitID
                    );
                    setValue("ProductInfo", []);
                    setFilteredProducts(filteredProducts);
                    setFocus("CustomerBranch");
                  }}
                  noOptionsMessage={() => "No business unit found!"}
                  isClearable
                  placeholder="Select a business unit"
                />
              )}
            />
            <span className="text-danger">{errors?.BusinessUnit?.message}</span>
          </Form.Group>
          <Form.Group as={Col} controlId="CustomerBranch">
            <Form.Label>{pageTitles?.branch || "Customer Branch"}</Form.Label>
            <span className="text-danger fw-bold ">*</span>
            <Controller
              control={control}
              name="CustomerBranch"
              rules={{
                required: `Please select a ${
                  pageTitles?.branch?.toLowerCase() || "customer branch"
                }`,
              }}
              render={({ field: { onChange, value, ref } }) => (
                <ReactSelect
                  options={customerBranchSelectData}
                  getOptionValue={(option) => option.CustomerBranchID}
                  getOptionLabel={(option) => option.CustomerBranchTitle}
                  value={value}
                  ref={ref}
                  onChange={(selectedOption) => {
                    onChange(selectedOption);
                    setFocus("ProductInfo");
                  }}
                  placeholder={`Select a ${
                    pageTitles?.branch.toLowerCase() || "customer branche"
                  }s`}
                  noOptionsMessage={() =>
                    `No ${
                      pageTitles?.branch?.toLowerCase() || "customer branche"
                    }s found!`
                  }
                  isClearable
                />
              )}
            />
            <span className="text-danger">
              {errors?.CustomerBranch?.message}
            </span>
          </Form.Group>
        </Row>

        <Row className="py-3" style={{ marginTop: "-25px" }}>
          <Form.Group as={Col} controlId="ProductInfo">
            <Form.Label>
              {pageTitles?.product || "Product"} to{" "}
              {InvoiceType?.value === "Product" ? "Invoice" : "Serve"}
            </Form.Label>
            <span className="text-danger fw-bold ">*</span>
            <Controller
              control={control}
              name="ProductInfo"
              rules={{
                required: `Please select a ${
                  pageTitles?.product.toLowerCase() || "product"
                }`,
              }}
              render={({ field: { onChange, value, ref } }) => (
                <ReactSelect
                  options={filteredProducts}
                  getOptionValue={(option) => option.ProductInfoID}
                  getOptionLabel={(option) => option.ProductInfoTitle}
                  value={value}
                  ref={ref}
                  onChange={(selectedOption) => {
                    onChange(selectedOption);
                    InvoiceType?.value === "Product"
                      ? setFocus("Qty")
                      : setFocus("ServiceInfo");
                  }}
                  placeholder={`Select a ${
                    pageTitles?.product.toLowerCase() || "product"
                  }`}
                  noOptionsMessage={() =>
                    `No ${
                      pageTitles?.product.toLowerCase() || "product"
                    }s found!`
                  }
                  isClearable
                />
              )}
            />
            <span className="text-danger">{errors?.ProductInfo?.message}</span>
          </Form.Group>
          <Form.Group as={Col} controlId="ServiceInfo">
            <Form.Label>Service to Invoice</Form.Label>
            <span className="text-danger fw-bold ">*</span>
            <Controller
              control={control}
              name="ServiceInfo"
              rules={{
                required: InvoiceType?.value === "Product" ? false : true,
              }}
              render={({ field: { onChange, value, ref } }) => (
                <ReactSelect
                  options={servicesInfoSelectData}
                  getOptionValue={(option) => option.ServiceInfoID}
                  getOptionLabel={(option) => option.ServiceInfoTitle}
                  value={value}
                  ref={ref}
                  onChange={(selectedOption) => {
                    onChange(selectedOption);
                    setFocus("Qty");
                  }}
                  placeholder={`Select a service`}
                  noOptionsMessage={() => `No services found!`}
                  isClearable
                  isDisabled={InvoiceType?.value === "Product"}
                />
              )}
            />
            <span className="text-danger">{errors?.ProductInfo?.message}</span>
          </Form.Group>
        </Row>
        <Row className="py-3" style={{ marginTop: "-25px" }}>
          <Form.Group as={Col} controlId="Qty">
            <Form.Label>Qty</Form.Label>
            <Form.Control
              type="text"
              {...register("Qty", {
                required: true,
                min: 1,
              })}
              pattern="^[0-9]*$"
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
              }}
              onChange={(e) => {
                const rate = getValues(["Rate"]);
                setValue("Amount", e.target.value * rate);
              }}
              required
              isInvalid={!!errors?.Rate}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="Rate">
            <Form.Label>Rate</Form.Label>
            <Form.Control
              type="text"
              {...register("Rate", {
                required: true,
              })}
              pattern="^[0-9]*$"
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
              }}
              onChange={(e) => {
                const qty = getValues(["Qty"]);
                setValue("Amount", e.target.value * qty);
              }}
              required
              isInvalid={!!errors?.Rate}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="CGS">
            <Form.Label>CGS</Form.Label>
            <Form.Control
              type="text"
              {...register("CGS")}
              pattern="^[0-9]*$"
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
              }}
              required
            />
          </Form.Group>
          <Form.Group as={Col} controlId="Amount">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="text"
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
              }}
              {...register("Amount")}
              disabled
              required
            />
          </Form.Group>
          <Form.Group as={Col} controlId="Discount">
            <Form.Label>Discount</Form.Label>
            <Form.Control
              type="text"
              {...register("Discount")}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
              }}
              onChange={(e) => {
                const amount = getValues(["Amount"]);
                setValue("NetAmount", amount - e.target.value);
              }}
              required
            />
          </Form.Group>
          <Form.Group as={Col} controlId="NetAmount">
            <Form.Label>Net Amount</Form.Label>
            <Form.Control
              type="text"
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
              }}
              {...register("NetAmount")}
              disabled
              required
            />
          </Form.Group>
        </Row>
        <Row className="py-3" style={{ marginTop: "-25px" }}>
          <Form.Group as={Col} controlId="Description">
            <Form.Label>Description</Form.Label>
            <Form.Control type="textarea" {...register("Description")} />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label>Actions</Form.Label>
            <ButtonGroup className="d-block">
              <button
                className="showbutton bg-success text-white"
                type="submit"
              >
                Add
              </button>
              <button
                className="showbutton bg-danger text-white"
                style={{ marginLeft: "2px" }}
                type="button"
                onClick={() => reset(defaultValues)}
              >
                Clear
              </button>
            </ButtonGroup>
          </Form.Group>
        </Row>
      </form>
    </>
  );
}

export default CustomerInvoiceHeader;
