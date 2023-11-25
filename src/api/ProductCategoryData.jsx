import axios from "axios";
import { toast } from "react-toastify";

const apiUrl = import.meta.env.VITE_APP_API_URL;

export async function fetchAllProductCategories(LoginUserID) {
  const { data } = await axios.post(
    apiUrl + "/EduIMS/GetProductCategoryWhere?LoginUserID=" + LoginUserID
  );
  return data.data;
}

export async function fetchProductCategoryById(ProductCategoryID, LoginUserID) {
  try {
    const { data } = await axios.post(
      apiUrl +
        `/EduIMS/GetProductCategoryWhere?ProductCategoryID=${ProductCategoryID}&LoginUserID=${LoginUserID}`
    );
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteProductCategory(productCategory) {
  const { data } = await axios.post(
    apiUrl +
      `/EduIMS/ProductCategoryDelete?ProductCategoryID=${productCategory.ProductCategoryID}&LoginUserID=${productCategory.LoginUserID}`
  );
  if (data.success === true) {
    toast.success("Product category sucessfully deleted!");
    return true;
  } else {
    toast.error(data.message);
    return false;
  }
}
