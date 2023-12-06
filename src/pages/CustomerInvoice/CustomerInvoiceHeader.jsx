import { Row, Col, Form, ButtonGroup } from "react-bootstrap";
import { Controller, useFormContext } from "react-hook-form";
import ReactSelect from "react-select";
import { useContext } from "react";
import { InvoiceDataContext } from "./CustomerInvoiceDataContext";
import { AutoComplete } from "primereact/autocomplete";
import { useQuery } from "@tanstack/react-query";
import { fetchAllSelectDescripitons } from "../../api/SelectData";
import { useState } from "react";
import { useEffect } from "react";

function CustomerInvoiceHeader(props) {
  const {
    businessSelectData,
    customerBranchSelectData,
    productsInfoSelectData,
    servicesInfoSelectData,
    append,
    pageTitles,
    InvoiceType,
  } = props;

  const [descriptions, setDescripitons] = useState([]);

  const {
    control,
    handleSubmit,
    register,
    reset,
    getValues,
    setValue,
    setFocus,
    formState: { errors, isDirty },
  } = useFormContext();

  const { setBusinessUnitID } = useContext(InvoiceDataContext);

  function onSubmit(data) {
    append(data);
    reset();
  }

  useEffect(() => {
    setValue("products", JSON.stringify(productsInfoSelectData));
  }, [productsInfoSelectData]);

  const { data: items } = useQuery({
    queryKey: ["invoiceDescripitons"],
    queryFn: () => fetchAllSelectDescripitons(InvoiceType?.value),
    enabled: InvoiceType?.value !== "",
    initialData: [],
  });

  const search = (event) => {
    let _filteredItems;
    let query = event.query;
    _filteredItems = items.filter((item) => {
      return item.toLowerCase().includes(query.toLowerCase());
    });
    setDescripitons(_filteredItems);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        // onKeyDown={preventFormByEnterKeySubmission}
      >
        <Row className="py-3" style={{ marginTop: "-25px" }}>
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
                    setValue("ProductInfo", []);
                    setBusinessUnitID(selectedOption?.BusinessUnitID);

                    setFocus("CustomerBranch");
                  }}
                  noOptionsMessage={() => "No business unit found!"}
                  isClearable
                  placeholder="Select a business unit"
                  openMenuOnFocus
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
                  getOptionValue={(option) => option.BranchID}
                  getOptionLabel={(option) => option.BranchTitle}
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
                  openMenuOnFocus
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
                  options={productsInfoSelectData}
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
                  openMenuOnFocus
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
                  getOptionValue={(option) => option.ProductInfoID}
                  getOptionLabel={(option) => option.ProductInfoTitle}
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
                  openMenuOnFocus
                />
              )}
            />
            <span className="text-danger">{errors?.ServiceInfo?.message}</span>
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
          <Form.Group as={Col} controlId="DetailDescription">
            <Form.Label>Description</Form.Label>

            <Controller
              name="DetailDescription"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <AutoComplete
                    className="w-100"
                    panelStyle={{ left: "103px", width: "1482px" }}
                    inputClassName="w-100"
                    inputId={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    inputRef={field.ref}
                    suggestions={descriptions}
                    completeMethod={search}
                  />
                </>
              )}
            />
          </Form.Group>

          <Form.Control
            type="text"
            {...register("products")}
            style={{ display: "none" }}
          />
        </Row>
        <Row className="py-3" style={{ marginTop: "-25px" }}>
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
                onClick={() => reset()}
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
