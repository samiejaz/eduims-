import { FormProvider, useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CustomerEntry from "../../components/CustomerEntryModal/CustomerEntry";
import CustomerAccountEntry from "../../components/CustomerEntryModal/CustomerAccountsEntry";
import CustomerBranchEntry from "../../components/CustomerEntryModal/CustomerBranchEntry";
import { TabView, TabPanel } from "primereact/tabview";
import { ButtonGroup } from "react-bootstrap";
import { Button } from "primereact/button";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { BreadCrumb } from "primereact/breadcrumb";
const apiUrl = import.meta.env.VITE_APP_API_URL;

const items = [{ label: "Customer Detail" }];
export default function GenNewCustomerView() {
  const params = useParams();
  const location = useLocation();
  const { search } = location;
  const url = new URLSearchParams(search);
  let isEnable = url.get("viewMode") === "edit" ? true : false;
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const customerEntryForm = useForm();
  const customerBranchFrom = useForm();
  const customerAccountsForm = useForm();
  const home = {
    label: "Customers",
    command: () => navigate("/customers/customerEntry"),
  };

  let customerMutation = useMutation({
    mutationFn: async (formData) => {
      let DataToSend = {
        CustomerID: +params.CustomerID,
        ContactPerson1Email: formData?.ContactPerson1Email,
        ContactPerson1Name: formData?.ContactPerson1Name,
        ContactPerson1No: formData?.ContactPerson1No,
        CustomerBusinessAddress: formData?.CustomerBusinessAddress,
        CustomerBusinessName: formData.CustomerBusinessName,
        CustomerName: formData.CustomerName,
        Description: formData?.Description,
        InActive: formData?.InActive === false ? 0 : 1,
        EntryUserID: user.userID,
      };

      const { data } = await axios.post(
        apiUrl + "/EduIMS/NewCustomerInsert",
        DataToSend
      );

      if (data.success === true) {
        if (+params.CustomerID) {
          toast.success("Customer updated successfully!");
        } else {
          toast.success("Customer saved successfully!");
        }
      } else {
        toast.error(data.message, {
          autoClose: 1500,
        });
      }
    },
    onError: () => {
      toast.error("Error while saving data!");
    },
  });

  function onSubmit(data) {
    customerMutation.mutate(data);
  }

  return (
    <>
      <div className="bg__image mt-5">
        <div className=" px-md-5 bg__image">
          <div className=" px-md-4">
            <div>
              <BreadCrumb
                model={items}
                home={home}
                style={{ border: "none" }}
              />
            </div>
            <div className="d-flex text-dark p-3 mb-4 ">
              <h2 className="text-center my-auto">Customer Detail</h2>
            </div>
            <div className="card">
              <TabView>
                <TabPanel header="Customer">
                  <FormProvider {...customerEntryForm}>
                    <CustomerEntry
                      CustomerID={params.CustomerID}
                      isEnable={isEnable}
                    />
                    <ButtonGroup className="mt-3 w-100">
                      <Button
                        type="button"
                        severity="success"
                        label="Save"
                        className="rounded w-100"
                        onClick={() => {
                          customerEntryForm.handleSubmit(onSubmit)();
                        }}
                        disabled={!isEnable}
                      ></Button>
                    </ButtonGroup>
                  </FormProvider>
                </TabPanel>
                <TabPanel header="Customer Branches">
                  <FormProvider {...customerBranchFrom}>
                    <CustomerBranchEntry
                      CustomerID={params.CustomerID}
                      isEnable={isEnable}
                    />
                  </FormProvider>
                </TabPanel>
                <TabPanel header="Customer Ledgers ">
                  <CustomerAccountEntry
                    CustomerID={params.CustomerID}
                    isEnable={isEnable}
                  />
                </TabPanel>
              </TabView>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
