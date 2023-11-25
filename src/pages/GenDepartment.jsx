// import React, { useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import Button from "react-bootstrap/Button";
// import Col from "react-bootstrap/Col";
// import Form from "react-bootstrap/Form";
// import Row from "react-bootstrap/Row";
// import "./pages.css";
// import InputGroup from "react-bootstrap/InputGroup";
// import DataTable from "react-data-table-component";

// import "bootstrap-icons/font/bootstrap-icons.css";

// import TabHeader from "../components/TabHeader";

// import useActionButtons from "../hooks/useActionButtonsHook";

// function GenDepartment(props) {
//   return (
//     <div class="bg__image">
//       <div class=" py-5 px-md-5 bg__image">
//         <div class="py-4 px-md-4">
//           <div>
//             <TabHeader
//               Search={<DepartmentSearch />}
//               Entry={<DepartmentForm />}
//               EntryTitle={"Add new department"}
//               SearchTitle={"Departments"}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Search
// function DepartmentSearch() {
//   const { render } = useActionButtons({
//     ID: 1,
//     handleDelete,
//     handleEdit,
//     handleView,
//   });

//   const columns = [
//     {
//       name: "Actions",
//       selector: (row) => {
//         render;
//       },
//       width: "150px",
//     },
//     {
//       name: "Department",
//       selector: (row) => row.department,
//       sortable: true,
//     },
//   ];
//   const data = [
//     {
//       id: 1,
//       department: "Development",
//     },
//     {
//       id: 2,
//       department: "Marketing",
//     },
//     {
//       id: 3,
//       department: "Management",
//     },
//   ];

//   const [records, setRecords] = useState(data);

//   function handleFilter(event) {
//     const newData = data.filter((row) => {
//       return row.department
//         .toLowerCase()
//         .includes(event.target.value.toLowerCase());
//     });
//     setRecords(newData);
//   }

//   function handleDelete(id) {
//     console.log(id);
//   }
//   function handleEdit(id) {
//     console.log(id);
//   }
//   function handleView(id) {
//     console.log(id);
//   }

//   return (
//     <>
//       <div>
//         <InputGroup className="mb-3">
//           <InputGroup.Text>
//             <div className="bi bi-search" />
//           </InputGroup.Text>
//           <Form.Control
//             type="text"
//             placeholder="Search"
//             class="form-control"
//             size="sm"
//             style={{ width: "20px" }}
//             onChange={handleFilter}
//           />
//         </InputGroup>
//       </div>

//       <div style={{ marginTop: "20px" }}>
//         <DataTable
//           columns={columns}
//           data={records}
//           fixedHeader
//           pagination
//         ></DataTable>
//       </div>
//     </>
//   );
// }

// // Form
// function DepartmentForm() {
//   return (
//     <>
//       <h4 className="p-3 mb-2 bg-light text-dark text-center  ">
//         Department Entry
//       </h4>
//       <form>
//         <Row className="p-3">
//           <Form.Group as={Col} controlId="departmentName">
//             <Form.Label>Department Name</Form.Label>
//             <Form.Control
//               type="text"
//               placeholder=""
//               class="form-control"
//               required
//             />
//           </Form.Group>
//         </Row>
//         <Button
//           variant="primary"
//           style={{ marginTop: "20px" }}
//           class="btn btn-primary p-2 "
//           type="submit"
//         >
//           Add Department
//         </Button>
//         <Button
//           variant="danger"
//           style={{ marginTop: "20px" }}
//           class="btn btn-primary p-2 "
//         >
//           Cancel
//         </Button>
//       </form>
//     </>
//   );
// }

// export default GenDepartment;
