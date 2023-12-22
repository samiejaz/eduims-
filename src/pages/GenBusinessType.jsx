import React, { useState } from "react";
import { Button, Form, InputGroup, Row, Col } from "react-bootstrap";
import DataTable from "react-data-table-component";
import TabHeader from "../components/TabHeader";
import ActionButtons from "../components/ActionButtons";
import { tableCustomStyles } from "../utils/TableStyles";

function GetBusinessTypeSearch() {
  function handleEdit(id) {}
  function handleDelete(id) {}
  function handleView(id) {}

  const columns = [
    {
      name: "Actions",
      selector: (row) =>
        ActionButtons(row.id, handleDelete, handleEdit, handleView),
      width: "150px",
    },
    {
      name: "Business Types",
      selector: (row) => row.types,
      sortable: true,
    },
  ];
  const data = [
    {
      id: 1,
      types: "Retail",
    },
    {
      id: 1,
      types: "Whole Sale",
    },
  ];

  const [records, setRecords] = useState(data);

  function handleFilter(event) {
    const newData = data.filter((row) => {
      return row.types.toLowerCase().includes(event.target.value.toLowerCase());
    });
    setRecords(newData);
  }

  return (
    <>
      <div>
        <InputGroup className="mb-3">
          <InputGroup.Text>
            <div className="bi bi-search" />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Search"
            class="form-control"
            size="sm"
            style={{ width: "20px" }}
            onChange={handleFilter}
          />
        </InputGroup>
      </div>

      <div style={{ marginTop: "20px" }}>
        <DataTable
          columns={columns}
          data={records}
          fixedHeader
          pagination
          customStyles={tableCustomStyles}
        ></DataTable>
      </div>
    </>
  );
}

function GetBusinessTypeEntry() {
  return (
    <>
      <h4 className="p-3 mb-2 bg-light text-dark text-center  ">
        Business Type Entry
      </h4>
      <form>
        <Row className="p-3">
          <Form.Group as={Col} controlId="natureName">
            <Form.Label>Business Type Name</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              class="form-control"
              required
            />
          </Form.Group>
        </Row>
        <Button
          variant="primary"
          style={{ marginTop: "20px" }}
          class="btn btn-primary p-2 "
          type="submit"
        >
          Add Type
        </Button>{" "}
        {"  "}
        <Button
          variant="danger"
          style={{ marginTop: "20px" }}
          class="btn btn-primary p-2 "
        >
          {" "}
          Cancel
        </Button>
      </form>
    </>
  );
}

function GenBusinessType(props) {
  return (
    <div class="bg__image">
      <div class=" py-5 px-md-5 bg__image">
        <div class="py-4 px-md-4">
          <div>
            <TabHeader
              Entry={<GetBusinessTypeEntry />}
              Search={<GetBusinessTypeSearch />}
              SearchTitle={"Business Types"}
              EntryTitle={"Add new type"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default GenBusinessType;
