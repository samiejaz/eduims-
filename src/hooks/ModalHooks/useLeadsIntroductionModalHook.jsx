import React, { useState } from "react";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from "react-hook-form";
import {
  useAllBusinessNatureSelectData,
  useAllBusinessTypesSelectData,
  useAllCountiesSelectData,
  useAllLeadsSouceSelectData,
  useAllTehsilsSelectData,
} from "../SelectData/useSelectData";
import CDropdown from "../../components/Forms/CDropdown";
import { Col, Form, Row } from "react-bootstrap";
import CheckBox from "../../components/Forms/CheckBox";
import TextInput from "../../components/Forms/TextInput";
import CMaskInput from "../../components/Forms/CMaskInput";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { AutoComplete } from "primereact/autocomplete";
import { classNames } from "primereact/utils";

const useLeadsIntroductionModalHook = () => {
  const [visible, setVisible] = useState(false);

  const method = useForm({
    defaultValues: {
      CompanyName: "",
      CountryID: [],
      TehsilID: [],
      BusinessTypeID: [],
      CompanyAddress: "",
      CompanyWebsite: "",
      BusinessNature: "",
      ContactPersonName: "",
      ContactPersonMobileNo: "",
      ContactPersonWhatsAppNo: "",
      ContactPersonEmail: "",
      RequirementDetails: "",
      LeadSourceID: [],
      IsWANumberSameAsMobile: false,
    },
  });
  const dialogContent = (
    <>
      <FormProvider {...method}>
        <LeadsIntroductionFormComponent />
      </FormProvider>
    </>
  );

  const footerContent = (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "end",
          gap: "5px",
        }}
      >
        <Button
          label="Cancel"
          severity="danger"
          type="button"
          onClick={() => method.reset()}
          pt={{
            root: {
              style: {
                borderRadius: "16px",
              },
            },
          }}
        />
        <Button
          label="Save"
          severity="success"
          type="button"
          onClick={() => method.handleSubmit(onSubmit)()}
          pt={{
            root: {
              style: {
                borderRadius: "16px",
              },
            },
          }}
        />
      </div>
    </>
  );

  function onSubmit(data) {}

  return {
    setVisible,
    render: (
      <>
        <Dialog
          draggable={false}
          visible={visible}
          footer={footerContent}
          header="Leads Introduction"
          maximizable
          style={{ width: "80vw", height: "80vh" }}
          onHide={() => {
            setVisible(false);
            //TODO: Invalidate the query
          }}
        >
          {dialogContent}
        </Dialog>
      </>
    ),
  };
};
export function LeadsIntroductionFormComponent({ mode = "" }) {
  const [CountryID, setCountryID] = useState(0);
  const [items, setItems] = useState([]);

  const countriesSelectData = useAllCountiesSelectData();
  const tehsilsSelectData = useAllTehsilsSelectData(CountryID);
  const businessTypesSelectData = useAllBusinessTypesSelectData();
  const businessNatureSelectData = useAllBusinessNatureSelectData(true);
  const leadSourcesSelectData = useAllLeadsSouceSelectData();

  const method = useFormContext();

  const search = (event) => {
    let _filteredItems;
    let query = event.query;
    _filteredItems = businessNatureSelectData?.data.filter((item) => {
      return item.toLowerCase().includes(query.toLowerCase());
    });
    setItems(_filteredItems);
  };

  return (
    <>
      <form>
        <Row>
          <Form.Group as={Col} controlId="CompanyName">
            <Form.Label>
              Name of firm
              <span className="text-danger fw-bold ">*</span>
            </Form.Label>
            <div>
              <TextInput
                control={method.control}
                ID={"CompanyName"}
                required={true}
                focusOptions={() => method.setFocus("CountryID")}
                isEnable={mode !== "view"}
              />
            </div>
          </Form.Group>
          <Form.Group as={Col} controlId="CountryID">
            <Form.Label>
              Country
              <span className="text-danger fw-bold ">*</span>
            </Form.Label>
            <div>
              <CDropdown
                control={method.control}
                name={`CountryID`}
                optionLabel="CountryTitle"
                optionValue="CountryID"
                placeholder="Select a country"
                options={countriesSelectData.data}
                required={true}
                disabled={mode === "view"}
                focusOptions={() => method.setFocus("TehsilID")}
                onChange={(e) => {
                  setCountryID(e.value);
                  method.resetField("TehsilID");
                }}
              />
            </div>
          </Form.Group>
          <Form.Group as={Col} controlId="TehsilID">
            <Form.Label>
              Tehsil
              <span className="text-danger fw-bold ">*</span>
            </Form.Label>
            <div>
              <CDropdown
                control={method.control}
                name={`TehsilID`}
                optionLabel="TehsilTitle"
                optionValue="TehsilID"
                placeholder="Select a tehsil"
                options={tehsilsSelectData.data}
                required={true}
                disabled={mode === "view"}
                focusOptions={() => method.setFocus("BusinessTypeID")}
              />
            </div>
          </Form.Group>
          <Form.Group as={Col} controlId="BusinessTypeID">
            <Form.Label>
              Business Type
              <span className="text-danger fw-bold ">*</span>
            </Form.Label>
            <div>
              <CDropdown
                control={method.control}
                name={`BusinessTypeID`}
                optionLabel="BusinessTypeTitle"
                optionValue="BusinessTypeID"
                placeholder="Select a business type"
                options={businessTypesSelectData.data}
                required={true}
                disabled={mode === "view"}
                focusOptions={() => method.setFocus("BusinessNatureID")}
              />
            </div>
          </Form.Group>
        </Row>
        <Row>
          <Form.Group as={Col} controlId="BusinessNatureID">
            <Form.Label>
              Business Nature
              <span className="text-danger fw-bold ">*</span>
            </Form.Label>
            <div style={{ width: "100%" }}>
              <Controller
                name="BusinessNatureID"
                control={method.control}
                rules={{ required: true }}
                render={({ field, fieldState }) => (
                  <>
                    <AutoComplete
                      inputId={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      inputRef={field.ref}
                      suggestions={items}
                      completeMethod={search}
                      disabled={mode === "view"}
                      style={{ width: "100%" }}
                      pt={{
                        dropdownButton: {
                          root: {
                            style: {
                              padding: "0 !important",
                            },
                          },
                        },
                      }}
                      className={classNames({ "p-invalid": fieldState.error })}
                    />
                  </>
                )}
              />
            </div>
          </Form.Group>

          <Form.Group as={Col} controlId="CompanyWebsite">
            <Form.Label>Company Website</Form.Label>
            <div>
              <TextInput
                control={method.control}
                ID={"CompanyWebsite"}
                required={true}
                focusOptions={() => method.setFocus("ContactPersonName")}
                isEnable={mode !== "view"}
              />
            </div>
          </Form.Group>
          <Form.Group as={Col} controlId="ContactPersonName">
            <Form.Label>Contact Person Name</Form.Label>
            <div>
              <TextInput
                control={method.control}
                ID={"ContactPersonName"}
                required={true}
                focusOptions={() => method.setFocus("ContactPersonMobileNo")}
                isEnable={mode !== "view"}
              />
            </div>
          </Form.Group>
          <Form.Group as={Col} controlId="ContactPersonMobileNo">
            <Form.Label>Contact Person Mobile No</Form.Label>
            <div>
              <TextInput
                control={method.control}
                ID={"ContactPersonMobileNo"}
                required={true}
                isEnable={mode !== "view"}
                focusOptions={() => method.setFocus("ContactPersonEmail")}
                onChange={(e) => {
                  if (method.watch("IsWANumberSameAsMobile")) {
                    method.setValue("ContactPersonWhatsAppNo", e.target.value);
                  }
                }}
              />
              {/* <CMaskInput
                control={method.control}
                name={"ContactPersonMobileNo"}
                required={true}
                focusOptions={() => method.setFocus("ContactPersonEmail")}
                mask="9999-9999999"
                onChange={(e) => {
                  if (method.watch("IsWANumberSameAsMobile")) {
                    method.setValue("ContactPersonWhatsAppNo", e.value);
                  }
                }}
              /> */}
            </div>
          </Form.Group>
        </Row>
        <Row>
          <Form.Group as={Col} controlId="ContactPersonEmail">
            <Form.Label>Contact Person Email</Form.Label>
            <div>
              <TextInput
                control={method.control}
                ID={"ContactPersonEmail"}
                required={true}
                focusOptions={() => method.setFocus("CompanyAddress")}
                isEnable={mode !== "view"}
              />
            </div>
          </Form.Group>
          <Form.Group as={Col} controlId="CompanyAddress">
            <Form.Label>
              Company Address
              <span className="text-danger fw-bold ">*</span>
            </Form.Label>
            <div>
              <TextInput
                control={method.control}
                ID={"CompanyAddress"}
                required={true}
                focusOptions={() => method.setFocus("ContactPersonWhatsAppNo")}
                isEnable={mode !== "view"}
              />
            </div>
          </Form.Group>

          <Form.Group as={Col} controlId="ContactPersonWhatsAppNo">
            <Form.Label>Contact Person Whatsapp No</Form.Label>
            <div>
              {/* <CMaskInput
                control={method.control}
                name={"ContactPersonWhatsAppNo"}
                required={true}
                disabled={method.watch("IsWANumberSameAsMobile")}
                focusOptions={() => method.setFocus("IsWANumberSameAsMobile")}
                mask="9999-9999999"
              /> */}
              <TextInput
                control={method.control}
                ID={"ContactPersonWhatsAppNo"}
                required={true}
                isEnable={mode !== "view"}
                focusOptions={() => method.setFocus("IsWANumberSameAsMobile")}
              />
            </div>
          </Form.Group>
          <Form.Group as={Col} controlId="IsWANumberSameAsMobile">
            <Form.Label></Form.Label>
            <div className="mt-1">
              <CheckBox
                control={method.control}
                ID={"IsWANumberSameAsMobile"}
                Label={"Same as mobile no"}
                isEnable={mode !== "view"}
                onChange={(e) => {
                  if (e.checked) {
                    method.setValue(
                      "ContactPersonWhatsAppNo",
                      method.getValues(["ContactPersonMobileNo"])
                    );
                  } else {
                    method.setValue("ContactPersonWhatsAppNo", "");
                  }
                }}
              />
            </div>
          </Form.Group>
        </Row>
        <Row>
          <Form.Group as={Col} controlId="RequirementDetails" className="col-9">
            <Form.Label>Requirements Detail</Form.Label>
            <Form.Control
              as={"textarea"}
              rows={1}
              disabled={mode === "view"}
              className="form-control"
              style={{
                padding: "0.3rem 0.4rem",
                fontSize: "0.8em",
              }}
              {...method.register("LeadSourceID")}
            />
          </Form.Group>
          <Form.Group as={Col} controlId="LeadSourceID">
            <Form.Label>
              Where have you here about us?
              <span className="text-danger fw-bold ">*</span>
            </Form.Label>
            <div>
              <CDropdown
                control={method.control}
                name={`LeadSourceID`}
                optionLabel="LeadSourceTitle"
                optionValue="LeadSourceID"
                placeholder="Select a lead source"
                options={leadSourcesSelectData.data}
                required={true}
                disabled={mode === "view"}
              />
            </div>
          </Form.Group>
        </Row>
      </form>
    </>
  );
}
export function LeadsIntroductionFormModal({ IconButton = false }) {
  const { setVisible, render } = useLeadsIntroductionModalHook();

  return (
    <>
      {IconButton ? (
        <>
          <Button
            tooltip="Add new customer"
            icon="pi pi-plus"
            severity="success"
            size="small"
            className="rounded-2"
            type="button"
            onClick={() => setVisible(true)}
            style={{
              padding: "1px 0px",
              fontSize: "small",
              width: "30px",
              marginLeft: "10px",
            }}
          />
        </>
      ) : (
        <>
          <Button
            onClick={() => setVisible(true)}
            severity="info"
            icon="pi pi-plus"
            label="Add New"
            className="rounded-5"
            type="button"
            style={{
              padding: "0.3rem 1.25rem",
              marginLeft: "25px",
              fontSize: ".8em",
            }}
          />
        </>
      )}
      {render}
    </>
  );
}
