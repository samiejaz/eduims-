import React, { useState } from "react";
import { Button, Form, InputGroup, Row, Col } from "react-bootstrap";
import DataTable from "react-data-table-component";
import TabHeader from "../components/TabHeader";
import ActionButtons from "../components/ActionButtons";
import { tableCustomStyles } from "../utils/TableStyles";
import { useQuery } from "@tanstack/react-query";
import { fetchAllCountries } from "../api/data";

function GenCountry() {
  return (
    <div class="bg__image">
      <div class=" py-5 px-md-5 bg__image">
        <div class="py-4 px-md-4">
          <div>
            <TabHeader
              Entry={<GenCountryEntry />}
              Search={<GenCountrySearh />}
              SearchTitle={"Countries"}
              EntryTitle={"Add New Country"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function GenCountrySearh() {
  const {
    data: countries,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["countries"],
    queryFn: fetchAllCountries,
  });

  function handleEdit(id) {}
  function handleDelete(id) {}
  function handleView(id) {}

  const columns = [
    {
      name: "Actions",
      selector: (row) =>
        ActionButtons(row.CountryID, handleDelete, handleEdit, handleView),
      width: "150px",
    },
    {
      name: "Country ID",
      selector: (row) => row.CountryID,
      sortable: true,
    },
    {
      name: "Countries",
      selector: (row) => row.CountryName,
      sortable: true,
    },
  ];

  const [searchQuery, setSearchQuery] = useState();
  function handleFilter() {
    if (searchQuery?.toLowerCase() == "" || searchQuery == undefined) {
      return countries;
    } else {
      const newData = countries.filter((row) => {
        return row.CountryName.toLowerCase().includes(
          searchQuery?.toLowerCase()
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
          pagination
          customStyles={tableCustomStyles}
        ></DataTable>
      </div>
    </>
  );
}

function GenCountryEntry() {
  return (
    <>
      <h4 className="p-3 mb-2 bg-light text-dark text-center  ">
        Country Entry
      </h4>
      <form>
        <Row className="p-3">
          <Form.Group as={Col} controlId="CountryID" hidden>
            <Form.Label>Country ID</Form.Label>
            <Form.Control type="number" placeholder="" class="form-control" />
          </Form.Group>
          <Form.Group as={Col} controlId="countryName">
            <Form.Label>Country Name</Form.Label>
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
          Add Country
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

export default GenCountry;
