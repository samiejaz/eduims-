import { useForm } from "react-hook-form";
import { Row, Col, Button, Form } from "react-bootstrap";

export function CustomerAccountDataTableHeader(props) {
  const { append, pageTitles } = props;

  const { register, handleSubmit, reset } = useForm();
  function onSubmit(formData) {
    append(formData);
    reset();
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} id="childForm">
        <Row>
          <Form.Group as={Col} controlId="AccountTitle">
            <Form.Label>
              Customer {pageTitles?.branch || "Branch"} Title
            </Form.Label>
            <div className="d-flex">
              <Form.Control
                type="text"
                placeholder=""
                required
                className="form-control"
                {...register("AccountTitle", {
                  // disabled: !isEnable,
                })}
              />
              <Button variant="success" type="submit">
                Add
              </Button>
            </div>
          </Form.Group>
        </Row>
      </form>
    </>
  );
}
