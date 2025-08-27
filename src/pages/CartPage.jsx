import Header from "../components/Header";
import Container from "@mui/material/Container";
import { Link } from "react-router";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useState } from "react";
import Swal from "sweetalert2";
import { toast } from "sonner";

const CartPage = () => {
  // load the cart items from the local storage
  const productsInLocalStorage = localStorage.getItem("cart");

  const [cart, setCart] = useState(
    productsInLocalStorage ? JSON.parse(productsInLocalStorage) : []
  );

  // total price calculation
  let total = 0;
  cart.forEach((c) => {
    total += c.price * c.quantity;
  });

  const handleCartDelete = async (id) => {
    Swal.fire({
      title: "Are you sure you want to delete the product?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        // remove product from cart
        const updatedCart = cart.filter((c) => c._id !== id);
        // update the cart data in local storage and the state
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        toast.success("Product has been removed");
      }
    });
  };

  return (
    <>
      <Header current="cart" title="Cart" />
      <Container>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Product</TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  Price
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  Quantity
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  Total
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cart.length === 0 ? (
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    No Product Added Yet!
                  </TableCell>
                </TableRow>
              ) : (
                cart.map((c) => (
                  <TableRow
                    key={c._id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {c.name}
                    </TableCell>
                    <TableCell align="right">$ {c.price}</TableCell>
                    <TableCell align="right">{c.quantity}</TableCell>
                    <TableCell align="right">
                      $ {(c.price * c.quantity).toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                          handleCartDelete(c._id);
                        }}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell colSpan={3}></TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  $ {total}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: "flex", justifyContent: "end" }}>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/checkout"
            // disable the checkout page if no item found in cart
            disabled={cart.length === 0 ? true : false}
          >
            Check Out
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default CartPage;
