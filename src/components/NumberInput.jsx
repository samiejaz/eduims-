import { Form } from "react-bootstrap";

function NumberInput() {
  return (
    <Form.Control
      type="text"
      pattern="^[0-9]*$"
      onInput={(e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, "");
      }}
    />
  );
}

export default NumberInput;
