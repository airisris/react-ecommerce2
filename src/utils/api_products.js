import axios from "axios";

import { API_URL } from "./constants";

export async function getProducts(category, page = 1) {
  const response = await axios.get(
    API_URL +
      "products?page=" +
      page +
      (category === "all" ? "" : "&category=" + category)
  );
  // GET http://localhost:5201/products?page=1&category=Consoles
  return response.data;
}

export async function getProduct(id) {
  const response = await axios.get(API_URL + "products/" + id);
  // GET http://localhost:5173/products/68a56c48bebcbb0886111807
  return response.data;
}

export async function addProduct(name, description, price, category, image) {
  const response = await axios.post(API_URL + "products", {
    name: name,
    description: description,
    price: price,
    category,
    image,
  });
  return response.data;
}

export async function updateProduct(id, name, description, price, category,image) {
  // PUT http://localhost:5173/products/68a56c48bebcbb0886111807
  const response = await axios.put(API_URL + "products/" + id, {
    name: name,
    description: description,
    price: price,
    category,
    image,
  });
  return response.data;
}

export async function deleteProduct(id) {
  // DELETE http://localhost:5173/products/68a56c48bebcbb0886111807
  const response = await axios.delete(API_URL + "products/" + id);
  return response.data;
}
