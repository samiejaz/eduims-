import axios from "axios";
import { toast } from "react-toastify";

const apiUrl = import.meta.env.VITE_APP_API_URL;

export async function fetchAllProducts(LoginUserID) {
  const { data } = await axios.post(
    apiUrl + "/EduIMS/GetProductInfoWhere?LoginUserID=" + LoginUserID
  );
  return data.data ?? [];
}

export async function fetchProductById(ProductInfoID, LoginUserID) {
  try {
    const { data } = await axios.post(
      apiUrl +
        `/EduIMS/GetProductInfoWhere?ProductInfoID=${ProductInfoID}&LoginUserID=${LoginUserID}`
    );
    return data;
  } catch (error) {}
}

export async function deleteProductByID(productInfo) {
  const { data } = await axios.post(
    apiUrl +
      `/EduIMS/ProductInfoDelete?ProductInfoID=${productInfo.ProductInfoID}&LoginUserID=${productInfo.LoginUserID}`
  );
  if (data.success === true) {
    toast.success("Product sucessfully deleted!");
    return true;
  } else {
    toast.error(data.message);
    return false;
  }
}
