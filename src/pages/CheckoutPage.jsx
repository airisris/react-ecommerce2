import Header from "../components/Header";
import Container from "@mui/material/Container";
import { Grid } from "@mui/material";
import Typography from "@mui/material/Typography";
import { Link } from "react-router";
import TextField from "@mui/material/TextField";
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
import validator from "email-validator";
import { createOrder } from "../utils/api_orders";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const CheckoutPage = () => {
  // load the cart items from the local storage
  const productsInLocalStorage = localStorage.getItem("cart");

  const [cart, setCart] = useState(
    productsInLocalStorage ? JSON.parse(productsInLocalStorage) : []
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // total price calculation
  let total = 0;
  cart.forEach((c) => {
    total += c.price * c.quantity;
  });

  const handleCheckOut = async () => {
    // make sure the name and email fields are not empty
    if (!name || !email) {
      toast.error("Please fill up all the the fields");
    } else if (!validator.validate(email)) {
      // make sure the email is valid
      toast.error("Please use a valid email address");
    } else {
      // do checkout
      try {
        // open loading backdrop
        setLoading(true);
        // get total price
        const totalPrice = total;
        // create order
        const response = await createOrder(name, email, cart, totalPrice);
        // get the billplz orl from the response
        const billplz_url = response.billplz_url;
        // redirect the user to billplz payment page
        window.location.href = billplz_url;
      } catch (error) {
        console.log(error);
        toast.error(error.message);
        // close the loading backdrop
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Header current="checkout" title="Checkout" />
      <Container sx={{ textAlign: "center", mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item size={{ xs: 12, md: 6, lg: 6 }}>
            <Typography variant="h5" mb={4}>
              Contact Information
            </Typography>
            <Box mb={2}>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Box>
            <Box mb={2}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Box>
            <Box mb={2}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => handleCheckOut()}
              >
                Pay ${total}
              </Button>
            </Box>
          </Grid>
          <Grid item size={{ xs: 12, md: 6, lg: 6 }}>
            <Typography variant="h5">Your Order Summary</Typography>
            <TableContainer>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Product</TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                      Total
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
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {c.name}
                        </TableCell>
                        <TableCell align="right">
                          $ {(c.price * c.quantity).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell colSpan={1}></TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                      $ {total}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Container>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default CheckoutPage;
