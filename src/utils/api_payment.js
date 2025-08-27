import axios from "axios";

import { API_URL } from "./constants";

export const verifyPayment = async (
  billplz_id,
  billplz_paid,
  billplz_paid_at,
  billplz_x_signature
) => {
  const response = await axios.post(API_URL + "payment", {
    billplz_id,
    billplz_paid,
    billplz_paid_at,
    billplz_x_signature,
  });
  return response.data;
};
