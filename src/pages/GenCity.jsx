import React, { useState } from "react";
import { Button, Form, InputGroup, Row, Col } from "react-bootstrap";
import DataTable from "react-data-table-component";
import TabHeader from "../components/TabHeader";
import ActionButtons from "../components/ActionButtons";
import { tableCustomStyles } from "../utils/TableStyles";
import { fetchAllCities } from "../api/data";
import { useQuery } from "@tanstack/react-query";

function GenCity() {
  return (
    <div class="bg__image">
      <div class=" py-5 px-md-5 bg__image">
        <div class="py-4 px-md-4">
          <div>
            <TabHeader
              Search={<GenCitySearch />}
              Entry={<GenCityEntry />}
              SearchTitle={"Cities"}
              EntryTitle={"Add new city"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function GenCitySearch() {
  const { data: cities } = useQuery({
    queryKey: ["cities"],
    queryFn: fetchAllCities,
  });

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
        ActionButtons(row.CityID, handleDelete, handleEdit, handleView),
      width: "150px",
    },
    {
      name: "City",
      selector: (row) => row.CityName,
      sortable: true,
    },
    {
      name: "Province",
      selector: (row) => row.ProvinceName,
      sortable: true,
    },
  ];

  const [searchQuery, setSearchQuery] = useState();
  function handleFilter() {
    if (searchQuery?.toLowerCase() == "" || searchQuery == undefined) {
      return cities;
    } else {
      const newData = cities.filter((row) => {
        return (
          row.CityName.toLowerCase().includes(searchQuery?.toLowerCase()) ||
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

function GenCityEntry() {
  return (
    <>
      <h4 className="p-3 mb-2 bg-light text-dark text-center  ">City Entry</h4>
      <form>
        <Row className="p-3">
          <Form.Group as={Col} controlId="provinceID">
            <Form.Label>Province / State</Form.Label>
            <Form.Select>
              <option>Please Select...</option>
              <option value="1">Punjab</option>
              <option value="2">Sindh</option>
              <option value="3">Khyber Pakhtunkhwa</option>
            </Form.Select>
          </Form.Group>
          <Form.Group as={Col} controlId="city">
            <Form.Label>City Name</Form.Label>
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
          Add City
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

export default GenCity;
