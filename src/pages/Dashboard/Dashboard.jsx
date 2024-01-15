import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React from "react";
import ReactDatePicker from "react-datepicker";

function Dashboard() {
  document.title = "Dashboard";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
      className="mt-4"
    >
      <div className="card p-4 border-0 shadow-sm">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h3>Title</h3>
            <div>
              <div>
                <ReactDatePicker
                  placeholderText="Select date"
                  dateFormat={"dd-MMM-yyyy"}
                  className={"binput"}
                />
              </div>
            </div>
          </div>
          <hr />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "start",
              gap: "10px",
            }}
          >
            <div
              className="card p-2"
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <p className="fw-bold">Title</p>
              <p>10000</p>
            </div>
            <div
              className="card p-2"
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <p className="fw-bold">Title</p>
              <p>10000</p>
            </div>
            <div
              className="card p-2"
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <p className="fw-bold">Title</p>
              <p>10000</p>
            </div>
            <div
              className="card p-2"
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <p className="fw-bold">Title</p>
              <p>10000</p>
            </div>
            <div
              className="card p-2"
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <p className="fw-bold">Title</p>
              <p>10000</p>
            </div>
            <div
              className="card p-2"
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <p className="fw-bold">Title</p>
              <p>10000</p>
            </div>
          </div>
        </div>
      </div>
      <div className="card p-4 border-0 shadow-sm">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "end",
            gap: "10px",
          }}
        >
          <div>
            <ReactDatePicker
              placeholderText="Select date"
              dateFormat={"dd-MMM-yyyy"}
              className={"binput"}
            />
          </div>
          <div>
            <ReactDatePicker
              placeholderText="Select date"
              dateFormat={"dd-MMM-yyyy"}
              className={"binput"}
            />
          </div>
        </div>
        <hr />
        <div>
          <DataTable
            value={[
              { BusinessTypeTitle: "Title", BusinessTypeID: 1 },
              { BusinessTypeTitle: "Title", BusinessTypeID: 2 },
              { BusinessTypeTitle: "Title", BusinessTypeID: 3 },
              { BusinessTypeTitle: "Title", BusinessTypeID: 4 },
            ]}
            dataKey="BusinessTypeID"
            // paginator
            // rows={10}
            // rowsPerPageOptions={[5, 10, 25, 50]}
            removableSort
            emptyMessage="No business types found!"
            filterDisplay="row"
            resizableColumns
            size="small"
            selectionMode="single"
            className={"thead"}
            tableStyle={{ minWidth: "50rem" }}
          >
            <Column
              field="BusinessTypeID"
              filter
              filterPlaceholder="Search by Business Type"
              sortable
              header="Business Type"
            ></Column>
            <Column
              field="BusinessTypeTitle"
              filter
              filterPlaceholder="Search by Business Type"
              sortable
              header="Business Type"
            ></Column>
          </DataTable>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
