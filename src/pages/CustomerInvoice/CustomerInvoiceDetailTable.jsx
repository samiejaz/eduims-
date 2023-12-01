import React, { useEffect, useRef, useState } from "react";
import { Row, Col, Form, ButtonGroup, Button, Table } from "react-bootstrap";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import ReactSelect from "react-select";
import { fetchAllProductsForSelect } from "../../api/SelectData";

let renderCount = 0;
function CustomerInvoiceDetailTable(props) {
  renderCount++;
  const {
    customerBranchSelectData,
    pageTitles,
    fields,
    append,
    remove,
    businessSelectData,
    servicesInfoSelectData,
    InvoiceType,
    isEnable,
  } = props;

  const {
    register,
    control,
    getValues,
    setValue,
    setFocus,
    watch,
    formState: { errors },
  } = useFormContext();

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
      const amount = parseFloat(getValues(`detail.${index}.NetAmount`) || 0);

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

  async function filteredProductsBasedOnRow(selectedOption, index) {
    const data = await fetchAllProductsForSelect(
      selectedOption?.BusinessUnitID
    );
    setValue(`detail.${index}.products`, JSON.stringify(data));
  }

  const selectStyles = {
    menu: (base) => ({
      ...base,
      zIndex: 1000, // Set the z-index to a large value
    }),
  };

  return (
    <>
      <div className="py-3 mb-4">
        <p>{renderCount}</p>
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
                <th
                  className="p-2 bg-info text-white"
                  style={{ width: "400px" }}
                >
                  Business Unit
                </th>
                <th
                  className="p-2 bg-info text-white"
                  style={{ width: "400px" }}
                >
                  {pageTitles?.branch || "Customer Branch"}
                </th>
                <th
                  className="p-2 bg-info text-white"
                  style={{ width: "400px" }}
                >
                  {pageTitles?.product || "Product"}
                </th>
                <th
                  className="p-2 bg-info text-white"
                  style={{ width: "400px" }}
                >
                  Service
                </th>
                <th
                  className="p-2 bg-info text-white"
                  style={{ width: "80px" }}
                >
                  Qty
                </th>
                <th
                  className="p-2 bg-info text-white"
                  style={{ width: "80px" }}
                >
                  Rate
                </th>
                <th
                  className="p-2 bg-info text-white"
                  style={{ width: "80px" }}
                >
                  CGS
                </th>
                <th
                  className="p-2 bg-info text-white"
                  style={{ width: "80px" }}
                >
                  Amount
                </th>
                <th
                  className="p-2 bg-info text-white"
                  style={{ width: "80px" }}
                >
                  Discount
                </th>
                <th
                  className="p-2 bg-info text-white"
                  style={{ width: "80px" }}
                >
                  Net Amount
                </th>
                <th className="p-2 bg-info text-white">Description</th>
                <th
                  className="p-2 bg-info text-white"
                  style={{ display: "none" }}
                >
                  Products
                </th>
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
                        disabled={!isEnable}
                        value={index + 1}
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
                              filteredProductsBasedOnRow(selectedOption, index);
                              setValue(`detail.${index}.ProductInfo`, []);
                              setFocus(`detail.${index}.CustomerBranch`);
                            }}
                            noOptionsMessage={() => "No business unit found!"}
                            openMenuOnFocus
                            components={{ DropdownIndicator: () => null }}
                            classNames={selectStyles}
                            isDisabled={!isEnable}
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
                              setFocus(`detail.${index}.ProductInfo`);
                            }}
                            noOptionsMessage={() => "No branch found!"}
                            openMenuOnFocus
                            isDisabled={!isEnable}
                            components={{ DropdownIndicator: () => null }}
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
                            options={JSON.parse(
                              watch(`detail.${index}.products`)?.toString() ||
                                "[]"
                            )}
                            getOptionValue={(option) => option.ProductInfoID}
                            getOptionLabel={(option) => option.ProductInfoTitle}
                            value={value}
                            ref={ref}
                            isDisabled={!isEnable}
                            onChange={(selectedOption) => {
                              onChange(selectedOption);
                              setFocus(`detail.${index}.Rate`);
                            }}
                            noOptionsMessage={() => "No products found!"}
                            required
                            openMenuOnFocus
                            components={{ DropdownIndicator: () => null }}
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
                            getOptionValue={(option) => option.ProductInfoID}
                            isDisabled={
                              InvoiceType?.value === "Product" || !isEnable
                            }
                            getOptionLabel={(option) => option.ProductInfoTitle}
                            value={value}
                            ref={ref}
                            onChange={(selectedOption) => {
                              onChange(selectedOption);
                              setFocus(`detail.${index}.Qty`);
                            }}
                            noOptionsMessage={() => "No services found!"}
                            required
                            openMenuOnFocus
                            components={{ DropdownIndicator: () => null }}
                            menuPlacement="top"
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
                        disabled={!isEnable}
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
                        disabled={!isEnable}
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
                        disabled={!isEnable}
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
                        disabled={!isEnable}
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
                        disabled={!isEnable}
                        {...register(`detail.${index}.DetailDescription`)}
                      />
                    </td>
                    <td style={{ width: "250px", display: "none" }}>
                      <Form.Control
                        type="text"
                        {...register(`detail.${index}.products`)}
                      />
                    </td>
                    <td>
                      <ButtonGroup className="d-flex align-items-center justify-content-center my-auto gap-1">
                        <Button
                          disabled={!isEnable}
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
                          disabled={!isEnable}
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
        </form>
      </div>
    </>
  );
}

export default CustomerInvoiceDetailTable;

/*
  onBusinessUnitChange -> get id
  setOptions at certain index 

*/
