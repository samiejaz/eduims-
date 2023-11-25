import React, { useState } from "react";
import { Button, Form, InputGroup, Row, Col, Accordion } from "react-bootstrap";
import DataTable from "react-data-table-component";
import TabHeader from "../components/TabHeader";
import ActionButtons from "../components/ActionButtons";
import { tableCustomStyles } from "../utils/TableStyles";

const GenCustomerInfo = (props) => {
  return (
    <div>
      <div class=" py-5 px-md-5 bg__image">
        <div class="py-4 px-md-4">
          <div>
            <TabHeader
              Entry={<GenCustomerInfoEntry />}
              Search={<GenCustomerInfoSearch />}
              EntryTitle={"Add New Customer"}
              SearchTitle={"Customers"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

function GenCustomerInfoSearch() {
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
      name: "Business Name",
      selector: (row) => row.businessname,
      sortable: true,
    },
    {
      name: "City",
      selector: (row) => row.city,
      sortable: true,
    },
    {
      name: "Contact Person Name",
      selector: (row) => row.contactperson1name,
      sortable: true,
    },
    {
      name: "Contact Person No",
      selector: (row) => row.contactperson1no,
      sortable: true,
    },
    {
      name: "Software",
      selector: (row) => row.product,
      sortable: true,
    },
  ];
  const data = [
    {
      id: 1,
      businessname: "Ahsan Medicine",
      city: "Multan",
      contactperson1name: "Dr. Ahsan",
      contactperson1no: "03009635363",
      product: "Edu Pharma Manager",
    },
    {
      id: 2,
      businessname: "AK",
      city: "Lahore",
      contactperson1name: "Haider",
      contactperson1no: "03009635363",
      product: "Edu ERP",
    },
    {
      id: 3,
      businessname: "Hero Electric",
      city: "Sargodha",
      contactperson1name: "Bilal Sb",
      contactperson1no: "03009635363",
      product: "Edu ERP",
    },
    {
      id: 4,
      businessname: "Food Festival",
      city: "Multan",
      contactperson1name: "Ajaz Sb",
      contactperson1no: "03009635363",
      product: "Edu Store Manager",
    },
  ];

  const [records, setRecords] = useState(data);

  function handleFilter(event) {
    const newData = data.filter((row) => {
      return (
        row.businessname
          .toLowerCase()
          .includes(event.target.value.toLowerCase()) ||
        row.city.toLowerCase().includes(event.target.value.toLowerCase()) ||
        row.contactperson1name
          .toLowerCase()
          .includes(event.target.value.toLowerCase()) ||
        row.contactperson1no
          .toLowerCase()
          .includes(event.target.value.toLowerCase()) ||
        row.product.toLowerCase().includes(event.target.value.toLowerCase())
      );
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
function GenCustomerInfoEntry() {
  return (
    <>
      <h4 className="p-3 mb-2 bg-light text-dark text-center  ">
        Customer Registration / Entry
      </h4>
      <form>
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>General Infomation</Accordion.Header>
            <Accordion.Body>
              <Row className="p-3">
                <Form.Group as={Col} controlId="customerName">
                  <Form.Label>Customer Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder=""
                    class="form-control"
                    required
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="customerBusinessName">
                  <Form.Label>Customer Business Name</Form.Label>
                  <Form.Control type="text" placeholder="" required />
                </Form.Group>
              </Row>

              <Row className="p-3" style={{ marginTop: "-25px" }}>
                <Form.Group as={Col} controlId="segmentID">
                  <Form.Label>Segment</Form.Label>
                  <Form.Select>
                    <option>Please Select...</option>
                    <option value="1">Clothing</option>
                    <option value="2">Bakery</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group as={Col} controlId="natureID">
                  <Form.Label>Nature</Form.Label>
                  <Form.Select>
                    <option>Please Select...</option>
                    <option value="1">Manufacturing</option>
                    <option value="2">Distributor</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group as={Col} controlId="typeID">
                  <Form.Label>Type</Form.Label>
                  <Form.Select>
                    <option>Please Select...</option>
                    <option value="1">Retail</option>
                    <option value="2">Wholesale</option>
                  </Form.Select>
                </Form.Group>
              </Row>

              <Row className="p-3" style={{ marginTop: "-25px" }}>
                <Form.Group controlId="customerBusinessAddress">
                  <Form.Label>Customer Business Address</Form.Label>
                  <Form.Control type="text" placeholder="" />
                </Form.Group>
              </Row>

              <Row className="p-3" style={{ marginTop: "-25px" }}>
                <Form.Group as={Col} controlId="countryID">
                  <Form.Label>Country</Form.Label>
                  <Form.Select>
                    <option>Please Select...</option>
                    <option value="1">Pakistan</option>
                    <option value="2">UAE</option>
                    <option value="3">China</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group as={Col} controlId="provinceID">
                  <Form.Label>Province / State</Form.Label>
                  <Form.Select>
                    <option>Please Select...</option>
                    <option value="1">Punjab</option>
                    <option value="2">Sindh</option>
                    <option value="3">Khyber Pakhtunkhwa</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group as={Col} controlId="cityID">
                  <Form.Label>City</Form.Label>
                  <Form.Select>
                    <option>Please Select...</option>
                    <option value="1">Multan</option>
                    <option value="2">Peshawar</option>
                    <option value="3">Karachi</option>
                  </Form.Select>
                </Form.Group>
              </Row>

              <Row className="p-3" style={{ marginTop: "-25px" }}>
                <Form.Group as={Col} controlId="contactperson1name">
                  <Form.Label>Contact Person #1 Name</Form.Label>
                  <Form.Control type="text" placeholder="" />
                </Form.Group>

                <Form.Group as={Col} controlId="contactperson1no">
                  <Form.Label>Contact Person #1 Phone</Form.Label>
                  <Form.Control type="number" placeholder="" />
                </Form.Group>

                <Form.Group as={Col} controlId="contactperson1email">
                  <Form.Label>Contact Person #1 Email</Form.Label>
                  <Form.Control type="email" placeholder="" />
                </Form.Group>
              </Row>

              <Row className="p-3" style={{ marginTop: "-25px" }}>
                <Form.Group as={Col} controlId="contactperson2name">
                  <Form.Label>Contact Person #2 Name</Form.Label>
                  <Form.Control type="text" placeholder="" />
                </Form.Group>

                <Form.Group as={Col} controlId="contactperson2no">
                  <Form.Label>Contact Person #2 Phone</Form.Label>
                  <Form.Control type="number" placeholder="" />
                </Form.Group>

                <Form.Group as={Col} controlId="contactperson2email">
                  <Form.Label>Contact Person #2 Email</Form.Label>
                  <Form.Control type="email" placeholder="" />
                </Form.Group>
              </Row>

              <Row className="p-3" style={{ marginTop: "-25px" }}>
                <Form.Group as={Col} controlId="productID">
                  <Form.Label>Software</Form.Label>
                  <Form.Select>
                    <option>Please Select...</option>
                    <option value="1">Edu Accountant Gold</option>
                    <option value="2">Edu Resturant Manager</option>
                    <option value="3">Edu HMIS</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group as={Col} controlId="formFile">
                  <Form.Label>Client Logo</Form.Label>
                  <Form.Control type="file" />
                </Form.Group>
              </Row>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item>
            <Accordion.Header>Financial Information</Accordion.Header>
            <Accordion.Body>
              <Row className="p-3">
                <Form.Group as={Col} controlId="contractDate">
                  <Form.Label>Contract Date</Form.Label>
                  <Form.Control type="date" />
                </Form.Group>
                <Form.Group as={Col} controlId="leadDate">
                  <Form.Label>Lead Date</Form.Label>
                  <Form.Control type="date" required />
                </Form.Group>
              </Row>
              <Row className="p-3" style={{ marginTop: "-25px" }}>
                <Form.Group as={Col} controlId="contractamount">
                  <Form.Label>Contract Amount</Form.Label>
                  <InputGroup className="mb-3">
                    <InputGroup.Text>PKR</InputGroup.Text>
                    <Form.Control type="number" required />
                  </InputGroup>
                </Form.Group>
                <Form.Group as={Col} controlId="noOfTerminals">
                  <Form.Label>No of Terminals</Form.Label>
                  <Form.Control type="number" required />
                </Form.Group>
                <Form.Group as={Col} controlId="noOfTerminals">
                  <Form.Label>No of Servers</Form.Label>
                  <Form.Control type="number" required />
                </Form.Group>
                <Form.Group as={Col} controlId="noOfTerminals">
                  <Form.Label>No of Databases</Form.Label>
                  <Form.Control type="number" required />
                </Form.Group>
                <Form.Group as={Col} controlId="contractNo">
                  <Form.Label>Contract No</Form.Label>
                  <Form.Control type="number" required />
                </Form.Group>
              </Row>

              <Row className="p-3" style={{ marginTop: "-50px" }}>
                <Form.Group controlId="formFile" className="p-3 mb-2">
                  <Form.Label>Contract Files</Form.Label>
                  <Form.Control type="file" multiple />
                </Form.Group>
              </Row>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        <Button
          variant="primary"
          style={{ marginTop: "30px" }}
          class="btn btn-primary p-2 "
          type="submit"
        >
          {" "}
          Save Form
        </Button>{" "}
        {"  "}
        <Button
          variant="danger"
          style={{ marginTop: "30px" }}
          class="btn btn-primary p-2 "
          type="submit"
        >
          {" "}
          Cancel
        </Button>
      </form>
    </>
  );
}

export default GenCustomerInfo;
