import React, { useEffect, useRef, useState } from "react";
import { Row, Col, Form, ButtonGroup, Button, Table } from "react-bootstrap";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import ReactSelect from "react-select";
import CustomerInvoiceHeader from "./CustomerInvoiceHeader";
import ReactDatePicker from "react-datepicker";

let renderCount = 0;
function CustomerInvoiceDetailTable({ customerBranchSelectData, pageTitles }) {
  renderCount++;

  const {
    register,
    control,
    getValues,
    setValue,
    setFocus,
    watch,
    formState: { errors },
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "detail",
  });

  const prevCustomerBranchSelectData = useRef([{}]);

  useEffect(() => {
    if (
      prevCustomerBranchSelectData &&
      prevCustomerBranchSelectData.current[0].CustomerBranchID !==
        customerBranchSelectData[0]?.CustomerBranchID
    ) {
      remove();
      prevCustomerBranchSelectData.current = customerBranchSelectData;
    }
  }, [customerBranchSelectData]);

  const businessSelectData = [
    {
      BusinessUnitID: 1,
      BusinessUnitName: "Business Unit 1",
    },
    {
      BusinessUnitID: 2,
      BusinessUnitName: "Business Unit 2",
    },
  ];

  const productsInfoSelectData = [
    {
      ProductInfoID: 1,
      ProductInfoTitle: `${pageTitles?.product || "Product"} 1`,
      BusinessUnitID: 1,
    },
    {
      ProductInfoID: 2,
      ProductInfoTitle: `${pageTitles?.product || "Product"} 2`,
      BusinessUnitID: 2,
    },
    {
      ProductInfoID: 3,
      ProductInfoTitle: `${pageTitles?.product || "Product"} 3`,
      BusinessUnitID: 1,
    },
    {
      ProductInfoID: 4,
      ProductInfoTitle: `${pageTitles?.product || "Product"} 4`,
      BusinessUnitID: 2,
    },
  ];

  const servicesInfoSelectData = [
    {
      ServiceInfoID: 1,
      ServiceInfoTitle: `Service 1`,
      BusinessUnitID: 1,
    },
    {
      ServiceInfoID: 2,
      ServiceInfoTitle: `Service 2`,
      BusinessUnitID: 2,
    },
    {
      ServiceInfoID: 3,
      ServiceInfoTitle: `Service 3`,
      BusinessUnitID: 1,
    },
    {
      ServiceInfoID: 4,
      ServiceInfoTitle: `Service 4`,
      BusinessUnitID: 2,
    },
  ];

  useEffect(() => {
    handleNetAmountTotal();
  }, [append, fields]);

  function handleNetAmountTotal() {
    let rateSum = 0;
    let cgsSum = 0;
    let discountSum = 0;
    let amountSum = 0;

    fields.forEach((item, index) => {
      const rate = parseFloat(getValues(`detail.${index}.Rate`) || 0);
      const cgs = parseFloat(getValues(`detail.${index}.CGS`) || 0);
      const discount = parseFloat(getValues(`detail.${index}.Discount`) || 0);
      const amount = parseFloat(getValues(`detail.${index}.Amount`) || 0);

      rateSum += rate;
      cgsSum += cgs;
      discountSum += discount;
      amountSum += amount;
    });

    setValue("Total_Rate", rateSum);
    setValue("Total_CGS", cgsSum);
    setValue("Total_Discount", discountSum);
    setValue("Total_Amount", amountSum);
  }

  function filteredProductsBasedOnRow(selectedOption) {
    if (selectedOption) {
      let filteredProducts = productsInfoSelectData.filter(
        (p) => p.BusinessUnitID === selectedOption[0]?.BusinessUnitID
      );
      return filteredProducts;
    }
  }

  const typesOptions = [
    { label: pageTitles?.product || "Product", value: "Product" },
    { label: "Service", value: "Service" },
  ];

  return (
    <>
      <div className="py-3 mb-4">
        <div
          style={{
            padding: "1rem",
            borderRadius: "6px",
          }}
          className="bg-light shadow-sm"
        >
          <h5 className="p-3 mb-4 bg-light text-dark text-center  ">
            Detail Entry
          </h5>
          <CustomerInvoiceHeader
            businessSelectData={businessSelectData}
            productsInfoSelectData={productsInfoSelectData}
            servicesInfoSelectData={servicesInfoSelectData}
            customerBranchSelectData={customerBranchSelectData}
            append={append}
            handleNetAmountTotal={handleNetAmountTotal}
            fields={fields}
            pageTitles={pageTitles}
          />
        </div>
        <form>
          <hr />

          <Table
            bordered
            hover
            size="sm"
            responsive
            style={{ width: "1700px" }}
          >
            <thead className="">
              <tr className="text-center bg-info-subtle ">
                <th className="p-2 bg-info text-white">Sr No.</th>
                <th className="p-2 bg-info text-white">Product Type</th>
                <th className="p-2 bg-info text-white">Business Unit</th>
                <th className="p-2 bg-info text-white">
                  Customer {pageTitles?.branch || "Branch"}
                </th>
                <th className="p-2 bg-info text-white">
                  {pageTitles?.product || "Product"}
                </th>
                <th className="p-2 bg-info text-white">Service</th>
                <th className="p-2 bg-info text-white">Qty</th>
                <th className="p-2 bg-info text-white">Rate</th>
                <th className="p-2 bg-info text-white">CGS</th>
                <th className="p-2 bg-info text-white">Amount</th>
                <th className="p-2 bg-info text-white">Discount</th>
                <th className="p-2 bg-info text-white">Net Amount</th>
                <th className="p-2 bg-info text-white">Description</th>
                <th className="p-2 bg-info text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((item, index) => {
                return (
                  <tr key={item.id}>
                    <td className="text-center" style={{ width: "60px" }}>
                      <Form.Control
                        readOnly
                        {...register(`detail.${index}.RowID`, {
                          valueAsNumber: true,
                        })}
                        value={index + 1}
                      />
                    </td>
                    <td style={{ width: "250px" }}>
                      <Controller
                        control={control}
                        name={`detail.${index}.InvoiceType`}
                        render={({ field: { onChange, value } }) => (
                          <ReactSelect
                            required
                            options={typesOptions}
                            value={value}
                            onChange={(selectedOption) =>
                              onChange(selectedOption)
                            }
                            noOptionsMessage={() => "No types found!"}
                          />
                        )}
                      />
                    </td>
                    <td style={{ width: "250px" }}>
                      <Controller
                        control={control}
                        name={`detail.${index}.BusinessUnit`}
                        render={({ field: { onChange, value, ref } }) => (
                          <ReactSelect
                            options={businessSelectData}
                            getOptionValue={(option) => option.BusinessUnitID}
                            getOptionLabel={(option) => option.BusinessUnitName}
                            value={value}
                            ref={ref}
                            onChange={(selectedOption) => {
                              onChange(selectedOption);
                              setValue(`detail.${index}.Product`, []);
                              setFocus(`detail.${index}.CustomerBranch`);
                            }}
                            noOptionsMessage={() => "No business unit found!"}
                            isClearable
                          />
                        )}
                      />
                    </td>
                    <td style={{ width: "250px" }}>
                      <Controller
                        control={control}
                        name={`detail.${index}.CustomerBranch`}
                        render={({ field: { onChange, value, ref } }) => (
                          <ReactSelect
                            options={customerBranchSelectData}
                            getOptionValue={(option) => option.CustomerBranchID}
                            getOptionLabel={(option) =>
                              option.CustomerBranchTitle
                            }
                            ref={ref}
                            value={value}
                            onChange={(selectedOption) => {
                              onChange(selectedOption);
                              setFocus(`detail.${index}.Product`);
                            }}
                            noOptionsMessage={() => "No branch found!"}
                            isClearable
                          />
                        )}
                      />
                    </td>

                    <td style={{ width: "250px" }}>
                      <Controller
                        control={control}
                        name={`detail.${index}.ProductInfo`}
                        render={({ field: { onChange, value, ref } }) => (
                          <ReactSelect
                            options={filteredProductsBasedOnRow(
                              watch(`detail.${index}.BusinessUnit`)
                            )}
                            getOptionValue={(option) => option.ProductInfoID}
                            getOptionLabel={(option) => option.ProductInfoTitle}
                            value={value}
                            ref={ref}
                            onChange={(selectedOption) => {
                              onChange(selectedOption);
                              setFocus(`detail.${index}.Rate`);
                            }}
                            noOptionsMessage={() => "No products found!"}
                            isClearable
                            required
                          />
                        )}
                      />
                    </td>
                    <td style={{ width: "250px" }}>
                      <Controller
                        control={control}
                        name={`detail.${index}.ServiceInfo`}
                        render={({ field: { onChange, value, ref } }) => (
                          <ReactSelect
                            options={servicesInfoSelectData}
                            getOptionValue={(option) => option.ServiceInfoID}
                            getOptionLabel={(option) => option.ServiceInfoTitle}
                            value={value}
                            ref={ref}
                            onChange={(selectedOption) => {
                              onChange(selectedOption);
                              setFocus(`detail.${index}.ProductInfo`);
                            }}
                            noOptionsMessage={() => "No services found!"}
                            isClearable
                            isDisabled={
                              watch(`detail.${index}.InvoiceType`)?.value ===
                              "Product"
                                ? true
                                : false
                            }
                            required
                          />
                        )}
                      />
                    </td>

                    <td style={{ width: "80px" }}>
                      <Form.Control
                        type="text"
                        {...register(`detail.${index}.Qty`, {
                          valueAsNumber: true,
                          required: true,
                          min: 1,
                        })}
                        required
                        defaultValue={0}
                        pattern="^[0-9]*$"
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(
                            /[^0-9]/g,
                            ""
                          );
                          const rate = parseFloat(
                            0 + getValues([`detail.${index}.Rate`])
                          );
                          setValue(
                            `detail.${index}.Amount`,
                            e.target.value * rate
                          );
                          handleNetAmountTotal();
                        }}
                      />
                    </td>
                    <td style={{ width: "150px" }}>
                      <Form.Control
                        type="text"
                        {...register(`detail.${index}.Rate`, {
                          valueAsNumber: true,
                          required: true,
                          min: 1,
                        })}
                        required
                        defaultValue={0}
                        pattern="^[0-9]*$"
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(
                            /[^0-9]/g,
                            ""
                          );
                          const qty = parseFloat(
                            0 + getValues([`detail.${index}.Qty`])
                          );
                          setValue(
                            `detail.${index}.Amount`,
                            e.target.value - qty
                          );
                          setValue(`detail.${index}.Rate`, e.target.value);
                          handleNetAmountTotal();
                        }}
                      />
                    </td>
                    <td style={{ width: "150px" }}>
                      <Form.Control
                        type="text"
                        {...register(`detail.${index}.CGS`, {
                          valueAsNumber: true,
                        })}
                        defaultValue={0}
                        pattern="^[0-9]*$"
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(
                            /[^0-9]/g,
                            ""
                          );
                          setValue(`detail.${index}.CGS`, e.target.value);
                          handleNetAmountTotal();
                        }}
                      />
                    </td>
                    <td style={{ width: "150px" }}>
                      <Form.Control
                        type="text"
                        disabled
                        defaultValue={0}
                        {...register(`detail.${index}.Amount`)}
                      />
                    </td>
                    <td style={{ width: "150px" }}>
                      <Form.Control
                        type="text"
                        {...register(`detail.${index}.Discount`, {
                          valueAsNumber: true,
                        })}
                        defaultValue={0}
                        pattern="^[0-9]*$"
                        onInput={(e) => {
                          e.target.value = e.target.value.replace(
                            /[^0-9]/g,
                            ""
                          );
                          const amount = parseFloat(
                            0 + getValues([`detail.${index}.Amount`])
                          );
                          setValue(
                            `detail.${index}.NetAmount`,
                            amount - e.target.value
                          );
                          setValue(`detail.${index}.Discount`, e.target.value);
                          handleNetAmountTotal();
                        }}
                      />
                    </td>

                    <td style={{ width: "150px" }}>
                      <Form.Control
                        type="text"
                        disabled
                        defaultValue={0}
                        {...register(`detail.${index}.NetAmount`)}
                      />
                    </td>
                    <td style={{ width: "250px" }}>
                      <Form.Control
                        type="text"
                        {...register(`detail.${index}.Description`)}
                      />
                    </td>
                    <td>
                      <ButtonGroup className="d-flex align-items-center justify-content-center my-auto gap-1">
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => {
                            append({
                              Type: [],
                              BusinessUnit: [],
                              Product: [],
                              CustomerBranch: [],
                              Qty: 1,
                              Rate: 0,
                              CGS: 0,
                              Discount: 0,
                              Amount: 0,
                              NetAmount: 0,
                              Description: "",
                            });
                            setTimeout(() => {
                              setFocus(`detail.${fields.length}.BusinessUnit`);
                            }, 200);
                          }}
                        >
                          +
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => {
                            remove(index);
                            handleNetAmountTotal();
                          }}
                        >
                          -
                        </Button>
                      </ButtonGroup>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          <hr />
          <Row className="p-3" style={{ marginTop: "-25px" }}>
            <Form.Group as={Col} controlId="Total_Rate">
              <Form.Label>Total Rate</Form.Label>
              <Form.Control disabled {...register("Total_Rate")} />
            </Form.Group>
            <Form.Group as={Col} controlId="Total_CGS">
              <Form.Label>Total CGS</Form.Label>
              <Form.Control disabled {...register("Total_CGS")} />
            </Form.Group>
            <Form.Group as={Col} controlId="Total_Discount">
              <Form.Label>Total Discount</Form.Label>
              <Form.Control disabled {...register("Total_Discount")} />
            </Form.Group>
            <Form.Group as={Col} controlId="Total_Amount">
              <Form.Label>Total Amount</Form.Label>
              <Form.Control disabled {...register("Total_Amount")} />
            </Form.Group>
          </Row>
          <Row className="p-3" style={{ marginTop: "-25px" }}>
            <Form.Group as={Col} controlId="">
              <Form.Label>Invoice Date</Form.Label>
              <div>
                <Controller
                  control={control}
                  name="DueDate"
                  render={({ field }) => (
                    <ReactDatePicker
                      placeholderText="Select due date"
                      onChange={(date) => field.onChange(date)}
                      selected={field.value || new Date()}
                      dateFormat={"dd-MMM-yyyy"}
                      className="binput"
                    />
                  )}
                />
              </div>
            </Form.Group>
          </Row>
        </form>
      </div>
    </>
  );
}

export default CustomerInvoiceDetailTable;
