import axios from "axios";
import { toast } from "react-toastify";

const apiUrl = import.meta.env.VITE_APP_API_URL;

export async function fetchAllProductCategories(
  LoginUserID,
  ProductType = "Product"
) {
  const { data } = await axios.post(
    apiUrl + "/EduIMS/GetProductCategoryWhere?LoginUserID=" + LoginUserID
  );
  let newData = data.data.map((product) => {
    return {
      ProductType:
        product.ProductType === "Product" ? ProductType : product.ProductType,
      ProductCategoryID: product.ProductCategoryID,
      InActive: product.InActive,
      ProductCategoryTitle: product.ProductCategoryTitle,
    };
  });

  return newData;
}

export async function fetchProductCategoryById(ProductCategoryID, LoginUserID) {
  try {
    const { data } = await axios.post(
      apiUrl +
        `/EduIMS/GetProductCategoryWhere?ProductCategoryID=${ProductCategoryID}&LoginUserID=${LoginUserID}`
    );
    return data;
  } catch (error) {}
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
