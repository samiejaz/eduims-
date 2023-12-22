import React, { useState } from "react";
import { Button, Form, InputGroup, Row, Col } from "react-bootstrap";
import DataTable from "react-data-table-component";
import TabHeader from "../components/TabHeader";
import ActionButtons from "../components/ActionButtons";
import { tableCustomStyles } from "../utils/TableStyles";

function GenSoftware() {
  return (
    <div class="bg__image">
      <div class=" py-5 px-md-5 bg__image">
        <div class="py-4 px-md-4">
          <div>
            <TabHeader
              Search={<GenSoftwareSearch />}
              Entry={<GenSoftwareEntry />}
              EntryTitle={"Add New Software"}
              SearchTitle={"Softwares"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function GenSoftwareSearch() {
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
      name: "Software",
      selector: (row) => row.software,
      sortable: true,
    },
  ];
  const data = [
    {
      id: 1,
      software: "Edu Accountant Gold",
    },
    {
      id: 2,
      software: "Edu HMIS",
    },
  ];

  const [records, setRecords] = useState(data);

  function handleFilter(event) {
    const newData = data.filter((row) => {
      return row.software
        .toLowerCase()
        .includes(event.target.value.toLowerCase());
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
function GenSoftwareEntry() {
  return (
    <>
      <h4 className="p-3 mb-2 bg-light text-dark text-center  ">
        Software Entry
      </h4>
      <form>
        <Row className="p-3">
          <Form.Group as={Col} controlId="softwareName">
            <Form.Label>Software Name</Form.Label>
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
          Add Software
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

export default GenSoftware;
