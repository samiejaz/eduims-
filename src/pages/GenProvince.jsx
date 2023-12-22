import React, { useState } from "react";
import { Button, Form, InputGroup, Row, Col } from "react-bootstrap";
import DataTable from "react-data-table-component";
import TabHeader from "../components/TabHeader";
import ActionButtons from "../components/ActionButtons";
import { tableCustomStyles } from "../utils/TableStyles";
import { useQuery } from "@tanstack/react-query";
import { fetchAllProvinces } from "../api/data";

function GenProvince() {
  return (
    <div class="bg__image">
      <div class=" py-5 px-md-5 bg__image">
        <div class="py-4 px-md-4">
          <div>
            <TabHeader
              Search={<GenProvinceSearch />}
              Entry={<GenProvinceEntry />}
              EntryTitle={"Add New Province"}
              SearchTitle={"Provinces"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function GenProvinceSearch() {
  const { data: provinces } = useQuery({
    queryKey: ["provinces"],
    queryFn: fetchAllProvinces,
  });

  function handleEdit(id) {}
  function handleDelete(id) {}
  function handleView(id) {}

  const columns = [
    {
      name: "Actions",
      selector: (row) =>
        ActionButtons(row.ProvinceID, handleDelete, handleEdit, handleView),
      width: "150px",
    },
    {
      name: "Province",
      selector: (row) => row.ProvinceName,
      sortable: true,
    },
    {
      name: "Country",
      selector: (row) => row.CountryName,
      sortable: true,
    },
  ];

  const [searchQuery, setSearchQuery] = useState();
  function handleFilter() {
    if (searchQuery?.toLowerCase() == "" || searchQuery == undefined) {
      return provinces;
    } else {
      const newData = provinces.filter((row) => {
        return (
          row.CountryName.toLowerCase().includes(searchQuery?.toLowerCase()) ||
          row.ProvinceName.toLowerCase().includes(searchQuery?.toLowerCase())
        );
      });
      return newData;
    }
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
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>
      </div>

      <div style={{ marginTop: "20px" }}>
        <DataTable
          columns={columns}
          data={handleFilter()}
          fixedHeader
          pagination
          customStyles={tableCustomStyles}
        ></DataTable>
      </div>
    </>
  );
}
function GenProvinceEntry() {
  return (
    <>
      <h4 className="p-3 mb-2 bg-light text-dark text-center  ">
        Province Entry
      </h4>
      <form>
        <Row className="p-3">
          <Form.Group as={Col} controlId="countryID">
            <Form.Label>Country</Form.Label>
            <Form.Select required>
              <option>Please Select...</option>
              <option value="1">Pakistan</option>
              <option value="2">UAE</option>
              <option value="3">China</option>
            </Form.Select>
          </Form.Group>
          <Form.Group as={Col} controlId="province">
            <Form.Label>Province Name</Form.Label>
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
          Add Province
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
export default GenProvince;
