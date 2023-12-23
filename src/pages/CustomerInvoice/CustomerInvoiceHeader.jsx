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
import NumberInput from "../../components/Forms/NumberInput";

function CustomerInvoiceHeader(props) {
  const {
    businessSelectData,
    customerBranchSelectData,
    productsInfoSelectData,
    servicesInfoSelectData,
    typesOption,
    append,
    pageTitles,
  } = props;

  const [descriptions, setDescripitons] = useState([]);
  const [isFree, setIsFree] = useState(false);

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
  } = useFormContext();
  const invoiceType = watch("InvoiceType")?.value === "Product" ? true : false;

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
    queryFn: () => fetchAllSelectDescripitons(invoiceType?.value),
    enabled: invoiceType !== "",
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
          <Form.Group as={Col} controlId="InvoiceType">
            <Form.Label>Invoice Type</Form.Label>
            <span className="text-danger fw-bold ">*</span>
            <Controller
              control={control}
              name="InvoiceType"
              rules={{ required: "Please select a type!" }}
              render={({ field: { onChange, value, ref } }) => (
                <ReactSelect
                  options={typesOption}
                  required
                  value={value}
                  ref={ref}
                  onChange={(selectedOption) => {
                    onChange(selectedOption);
                    setFocus("Customer");
                  }}
                  placeholder="Select a type"
                  noOptionsMessage={() => "No types found!"}
                  openMenuOnFocus
                />
              )}
            />
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
                    setValue("ProductInfo", []);
                    setValue("ServiceInfo", []);
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
              {invoiceType ? "Invoice" : "Serve"}
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
                    invoiceType ? setFocus("Qty") : setFocus("ServiceInfo");
                  }}
                  placeholder={`Select a ${
                    pageTitles?.product.toLowerCase() || "product"
                  }`}
                  noOptionsMessage={() =>
                    `No ${
                      pageTitles?.product.toLowerCase() || "product"
                    } found!`
                  }
                  isClearable
                  openMenuOnFocus
                />
              )}
            />
            <span className="text-danger">{errors?.ProductInfo?.message}</span>
          </Form.Group>
          <Form.Group as={Col} controlId="ServiceInfo" className="col-3">
            <Form.Label>Service to Invoice</Form.Label>
            <Controller
              control={control}
              name="ServiceInfo"
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
                  isDisabled={invoiceType}
                  openMenuOnFocus
                />
              )}
            />
            <span className="text-danger">{errors?.ServiceInfo?.message}</span>
          </Form.Group>
          <Form.Group as={Col} controlId="Qty" className="col-1 p-0 ">
            <Form.Label>Qty</Form.Label>
            <NumberInput
              id={"Qty"}
              control={control}
              onChange={(e) => {
                const rate = getValues(["Rate"]);
                setValue("Amount", e.value * rate);
              }}
              inputClassName="form-control"
              useGrouping={false}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="Rate" className="col-1">
            <Form.Label>Rate</Form.Label>
            <NumberInput
              id={"Rate"}
              control={control}
              onChange={(e) => {
                const qty = getValues(["Qty"]);
                setValue("Amount", e.value * qty);
                const disc = getValues(["Discount"]);
                setValue("NetAmount", e.value * qty - disc);
              }}
              mode="decimal"
              maxFractionDigits={2}
              inputClassName="form-control"
              useGrouping={false}
              disabled={isFree}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="CGS" className="col-1">
            <Form.Label>CGS</Form.Label>
            <NumberInput
              id={"CGS"}
              control={control}
              mode="decimal"
              maxFractionDigits={2}
              inputClassName="form-control"
              useGrouping={false}
              disabled={isFree}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="Amount" className="col-1">
            <Form.Label>Amount</Form.Label>
            <NumberInput
              id={"Amount"}
              control={control}
              mode="decimal"
              maxFractionDigits={2}
              inputClassName="form-control"
              useGrouping={false}
              disabled={true}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="Discount" className="col-1">
            <Form.Label>Discount</Form.Label>
            <NumberInput
              id={"Discount"}
              control={control}
              disabled={isFree}
              onChange={(e) => {
                const amount = getValues(["Amount"]);
                setValue("NetAmount", amount - e.value);
              }}
              mode="decimal"
              maxFractionDigits={2}
              inputClassName="form-control"
              useGrouping={false}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="NetAmount" className="col-1">
            <Form.Label>Net Amount</Form.Label>
            <NumberInput
              id={"NetAmount"}
              control={control}
              mode="decimal"
              maxFractionDigits={2}
              inputClassName="form-control"
              useGrouping={false}
              disabled={true}
            />
          </Form.Group>
        </Row>
        {/* <Row className="py-3" style={{ marginTop: "-25px" }}>
        
        </Row> */}
        <Row className="py-3" style={{ marginTop: "-25px" }}>
          <Form.Group as={Col} controlId="DetailDescription" className="col-9">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as={"textarea"}
              rows={1}
              className="form-control"
              {...register("DetailDescription")}
            />

            {/* <Controller
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
            /> */}
          </Form.Group>

          <Form.Control
            type="text"
            {...register("products")}
            style={{ display: "none" }}
          />
          <Form.Group as={Col} controlId="IsFree">
            <Form.Label></Form.Label>
            <Form.Check
              {...register("IsFree")}
              label="Is Free"
              aria-label="Is Free"
              style={{ marginTop: "15px" }}
              onChange={(e) => {
                if (e.target.checked) {
                  setValue("Rate", 0);
                  setValue("CGS", 0);
                  setValue("Amount", 0);
                  setValue("Discount", 0);
                  setValue("NetAmount", 0);
                  setIsFree(true);
                } else {
                  setIsFree(false);
                }
              }}
            />
          </Form.Group>
          <Form.Group as={Col}>
            <Form.Label></Form.Label>
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
        {/* <Row className="py-3" style={{ marginTop: "-25px" }}>
         
        </Row> */}
      </form>
    </>
  );
}

export default CustomerInvoiceHeader;
