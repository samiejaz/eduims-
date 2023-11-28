import { createContext, useEffect, useState, useContext } from "react";
import { useFieldArray, useFormContext, FormProvider } from "react-hook-form";
import { preventFormByEnterKeySubmission } from "../../utils/CommonFunctions";
import { Form, Row, Table, Col } from "react-bootstrap";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import {
  fetchAllCustomerAccounts,
  fetchCustomerAccountByID,
} from "./CustomerEntryAPI";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";

let pageTitles = {};
const apiUrl = import.meta.env.VITE_APP_API_URL;
const AccountEntryContext = createContext();
const AccountEntryProvider = ({ children }) => {
  const [createdAccountID, setCreatedAccountID] = useState(0);
  return (
    <AccountEntryContext.Provider
      value={{ createdAccountID, setCreatedAccountID }}
    >
      {children}
    </AccountEntryContext.Provider>
  );
};

function CustomerAccountEntry(props) {
  const { CustomerID } = props;
  return (
    <>
      <AccountEntryProvider>
        <CustomerAccountDataTableHeader CustomerID={CustomerID} />
        {/* <CustomerAccountDataTableDetail /> */}
        <CustomerAccountDetailTable CustomerID={CustomerID} />
      </AccountEntryProvider>
    </>
  );
}

export default CustomerAccountEntry;

function CustomerAccountDataTableHeader(props) {
  const queryClient = useQueryClient();

  const { CustomerID } = props;
  console.log(CustomerID);
  const { user } = useContext(AuthContext);
  const { setCreatedAccountID } = useContext(AccountEntryContext);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      AccountTitle: "",
    },
  });

  const customerAccountEntryMutation = useMutation({
    mutationFn: async (formData) => {
      let DataToSend = {
        AccountID: 0,
        AccountTitle: formData?.AccountTitle,
        CustomerID: CustomerID,
        EntryUserID: user.userID,
      };
      const { data } = await axios.post(
        apiUrl + "/EduIMS/CustomerAccountsInsertUpdate",
        DataToSend
      );

      if (data.success === true) {
        setCreatedAccountID(data?.AccountID);
        reset();
        toast.success("Account saved successfully!");
        console.log(data);
        queryClient.invalidateQueries(["customerAccounts"]);
      } else {
        toast.error(data.message, {
          autoClose: 1500,
        });
      }
    },
    onError: (error) => {
      console.log(error);
      toast.error("Error while saving data!");
    },
  });

  function onSubmit(data) {
    if (CustomerID === 0) {
      toast.error("No Customer Found!!");
    } else {
      customerAccountEntryMutation.mutate(data);
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={preventFormByEnterKeySubmission}
      >
        <Row>
          <Form.Group as={Col} controlId="AccountTitle">
            <Form.Label>
              Customer {pageTitles?.branch || "Branch"} Title
            </Form.Label>
            <div className="d-flex">
              <Form.Control
                type="text"
                placeholder=""
                required
                className="form-control"
                {...register("AccountTitle")}
              />
              <Button
                severity="success"
                className="px-4 py-2 rounded-1 "
                type="submit"
              >
                Add
              </Button>
            </div>
          </Form.Group>
        </Row>
      </form>
    </>
  );
}

function CustomerAccountDetailTable(props) {
  const queryClient = useQueryClient();

  const { CustomerID } = props;
  const [filters, setFilters] = useState({
    AccountTitle: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const { user } = useContext(AuthContext);

  const {
    data: CustomerAccounts,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["customerAccounts", CustomerID],
    queryFn: () => fetchCustomerAccountByID(CustomerID, user.userID),
    enabled: CustomerID !== 0,
    initialData: [],
  });

  return (
    <>
      <DataTable
        className="mt-2"
        showGridlines
        value={CustomerAccounts?.data || []}
        dataKey="AccountID"
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25, 50]}
        removableSort
        emptyMessage="No customer accounts found!"
        filters={filters}
        filterDisplay="row"
        resizableColumns
        size="small"
        selectionMode="single"
        tableStyle={{ minWidth: "50rem" }}
      >
        <Column
          // body={(rowData) =>
          //   ActionButtons(
          //     rowData.BankAccountID,
          //     handleDeleteShow,
          //     handleEditShow,
          //     handleView
          //   )
          // }
          header="Actions"
          resizeable={false}
          style={{ minWidth: "7rem", maxWidth: "7rem", width: "7rem" }}
        ></Column>
        <Column
          field="AccountTitle"
          filter
          filterPlaceholder="Search by Customer Account"
          sortable
          header="Account Title"
          style={{ minWidth: "20rem" }}
        ></Column>
      </DataTable>
    </>
  );
}

function CustomerAccountDataTableDetail() {
  const { createdAccountID, setCreatedAccountID } =
    useContext(AccountEntryContext);
  console.log(createdAccountID);

  const { user } = useContext(AuthContext);

  const methods = useForm();
  const { fields, append, remove } = useFieldArray({
    name: "branchDetail",
  });

  useEffect(() => {
    async function fetchCustomerAccount() {
      if (
        createdAccountID !== undefined &&
        createdAccountID !== null &&
        createdAccountID !== 0
      ) {
        const data = await fetchCustomerAccountByID(
          createdAccountID,
          user.userID
        );

        console.log(data);
      } else {
        setBankAccount(null);
        setIsEnable(true);
        reset(defaultValues);
        setTimeout(() => {
          resetSelectValues();
        }, 200);
      }
    }
    if (createdAccountID !== 0) {
      fetchCustomerAccount();
    }
    return () => {
      setCreatedAccountID(0);
    };
  }, [createdAccountID]);

  return (
    <>
      <FormProvider {...methods}>
        <form>
          <Table className="mt-2">
            <thead>
              <tr>
                <th>No.</th>
                <th>Branch Title</th>
                <th>Customer Accounts</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => {
                return (
                  <tr key={field.id}>
                    <CustomerAccountDataTableDetailRow
                      field={field}
                      remove={remove}
                      index={index}
                    />
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </form>
      </FormProvider>
    </>
  );
}

function CustomerAccountDataTableDetailRow() {
  const { register } = useFormContext();
  const { remove, index } = props;
  return (
    <>
      <td>
        <InputText
          // type="text"
          required
          className="form-control"
          {...register(`accountsDetail.${index}.AccountTitle`)}
        />
      </td>
      <td>
        <Button
          label="Previous"
          icon="pi pi-arrow-left"
          className="p-button-p text-center"
        />
        <Button
          label="Next"
          icon="pi pi-arrow-left"
          onClick={() => remove(index)}
          className="p-button-p text-center"
        />
      </td>
    </>
  );
}
