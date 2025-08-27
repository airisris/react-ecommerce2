import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { verifyPayment } from "../utils/api_payment";

const PaymentVerify = () => {
  /*
        verify-payment?billplz[id]=ea9018b2511d8429&billplz%5Bpaid%5D=true&billplz%5Bpaid_at%5D=2025-08-26+11%3A19%3A30+%2B0800&billplz%5Bx_signature%5D=3166235abd67fa6f5b68e925f88c67a5d5ff4475fbbc53ea1a2d0c6bbf5a8c9f
    */
  // 1. call the search params hook
  const [searchParams] = useSearchParams(); // extract the value from the url string
  const billplz_id = searchParams.get("billplz[id]");
  const billplz_paid = searchParams.get("billplz[paid]");
  const billplz_paid_at = searchParams.get("billplz[paid_at]");
  const billplz_x_signature = searchParams.get("billplz[x_signature]");
  const navigate = useNavigate();

  useEffect(() => {
    // call verify payment API
    verifyPayment(
      billplz_id,
      billplz_paid,
      billplz_paid_at,
      billplz_x_signature
    )
      .then((updatedOrder) => {
        // clear the cart
        localStorage.removeItem("cart");
        // redirect the user to orders page
        navigate("/orders");
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      Please wait while we verifying your transaction. Please don't click the go
      back button or close the browser.
    </>
  );
};

export default PaymentVerify;
