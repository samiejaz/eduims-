import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { preventFormByEnterKeySubmission } from "../../utils/CommonFunctions";
import { Form, Row, Col } from "react-bootstrap";

function CustomerEntry(props) {
  console.log("Customer Re-renderd");

  const { customersEntryData } = props;

  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();

  useEffect(() => {
    if (customersEntryData) {
      setValue("CustomerName", customersEntryData?.CustomerName);
      setValue(
        "CustomerBusinessName",
        customersEntryData?.CustomerBusinessName
      );
      setValue(
        "CustomerBusinessAddress",
        customersEntryData?.CustomerBusinessAddress
      );
      setValue("ContactPerson1Name", customersEntryData?.ContactPerson1Name);
      setValue("ContactPerson1No", customersEntryData?.ContactPerson1No);
      setValue("ContactPerson1Email", customersEntryData?.ContactPerson1Email);
      setValue("Description", customersEntryData?.Description);
      setValue("InActive", customersEntryData?.InActive);
    }
  }, [customersEntryData]);

  return (
    <>
      <form onKeyDown={preventFormByEnterKeySubmission}>
        <Row>
          <Form.Group as={Col} controlId="CustomerName">
            <Form.Label>Customer Name</Form.Label>
            <span className="text-danger fw-bold ">*</span>
            <Form.Control
              type="text"
              required
              placeholder=""
              className="form-control"
              {...register("CustomerName", {})}
            />
            <p className="text-danger">{errors?.CustomerName?.message}</p>
          </Form.Group>
          <Form.Group as={Col} controlId="CustomerBusinessName">
            <Form.Label>Customer Business Name</Form.Label>
            <span className="text-danger fw-bold ">*</span>
            <Form.Control
              type="text"
              required
              placeholder=""
              {...register("CustomerBusinessName", {})}
            />
            <p className="text-danger">
              {errors?.CustomerBusinessName?.message}
            </p>
          </Form.Group>
        </Row>

        <Row>
          <Form.Group controlId="CustomerBusinessAddress">
            <Form.Label>Customer Business Address</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              {...register("CustomerBusinessAddress", {
                // disabled: !isEnable,
              })}
            />
          </Form.Group>
        </Row>

        <Row>
          <Form.Group as={Col} controlId="ContactPerson1Name">
            <Form.Label>Contact Name</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              {...register("ContactPerson1Name", {
                // disabled: !isEnable,
              })}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="ContactPerson1No">
            <Form.Label>Contact No</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              {...register("ContactPerson1No", {
                // disabled: !isEnable,
              })}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="ContactPerson1Email">
            <Form.Label> Email</Form.Label>
            <Form.Control
              type="email"
              placeholder=""
              {...register("ContactPerson1Email", {
                // disabled: !isEnable,
              })}
            />
          </Form.Group>
        </Row>

        <Row>
          <Form.Group as={Col} controlId="Description">
            <Form.Label>Descripiton</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              name="email"
              {...register("Description", {
                // disabled: !isEnable,
              })}
            />
          </Form.Group>
        </Row>
        <Row>
          <Form.Group as={Col} controlId="InActive">
            <Form.Check
              aria-label="Inactive"
              label="Inactive"
              {...register("InActive", {
                // disabled: !isEnable,
              })}
            />
          </Form.Group>
        </Row>
      </form>
    </>
  );
}

export default CustomerEntry;
