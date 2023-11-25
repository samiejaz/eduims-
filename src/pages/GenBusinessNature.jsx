import React, { useState } from "react";
import { Button, Form, InputGroup, Row, Col } from "react-bootstrap";
import DataTable from "react-data-table-component";
import TabHeader from "../components/TabHeader";
import ActionButtons from "../components/ActionButtons";

import "./pages.css";
import { tableCustomStyles } from "../utils/TableStyles";

function GenBusinessNature() {
  return (
    <div class="bg__image">
      <div class=" py-5 px-md-5 bg__image">
        <div class="py-4 px-md-4">
          <div>
            <TabHeader
              Search={<GenBusinessNatureSearch />}
              Entry={<GenBusinessNatureForm />}
              EntryTitle={"Add new Business"}
              SearchTitle={"Business Nature"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function GenBusinessNatureSearch() {
  function handleEdit(id) {
    console.log(id);
  }
  function handleDelete(id) {
    console.log(id);
  }
  function handleView(id) {
    console.log(id);
  }

  const columns = [
    {
      name: "Actions",
      selector: (row) =>
        ActionButtons(row.id, handleDelete, handleEdit, handleView),
      width: "150px",
    },
    {
      name: "Nature",
      selector: (row) => row.nature,
      sortable: true,
    },
  ];
  const data = [
    {
      id: 1,
      nature: "Manufacturing",
    },
    {
      id: 2,
      nature: "Distributor",
    },
  ];

  const [records, setRecords] = useState(data);

  function handleFilter(event) {
    const newData = data.filter((row) => {
      return row.nature
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
            <i className="bi bi-search"></i>
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

function GenBusinessNatureForm() {
  return (
    <>
      <h4 className="p-3 mb-2 bg-light text-dark text-center  ">
        Business Nature Entry
      </h4>
      <form>
        <Row className="p-3">
          <Form.Group as={Col} controlId="natureName">
            <Form.Label>Nature Name</Form.Label>
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
          Add Nature
        </Button>
        <Button
          variant="danger"
          style={{ marginTop: "20px" }}
          class="btn btn-primary p-2 "
        >
          Cancel
        </Button>
      </form>
    </>
  );
}

export default GenBusinessNature;
