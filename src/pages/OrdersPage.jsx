import { useState, useEffect } from "react";
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
import Swal from "sweetalert2";
import { toast } from "sonner";
import { getOrders, updateOrder, deleteOrder } from "../utils/api_orders";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Typography } from "@mui/material";

const OrdersPage = () => {
  // store orders data from API
  const [orders, setOrders] = useState([]);

  // call the API
  useEffect(() => {
    getOrders()
      .then((data) => {
        // putting the data into orders state
        setOrders(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []); // call only once when the page load

  const handleOrderDelete = async (id) => {
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
        await deleteOrder(id);
        const updatedOrders = await getOrders();
        // update the cart data in local storage and the state
        setOrders(updatedOrders);
        toast.success("Order has been removed");
      }
    });
  };

  console.log(orders);

  return (
    <>
      <Header current="orders" title="My Orders" />
      <Container>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Products
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Total Amount
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Payment Date
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    No Order Added Yet!
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((o) => (
                  <TableRow
                    key={o._id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {o.customerName} <br />
                      {o.customerEmail}
                    </TableCell>
                    <TableCell>
                      {o.products.map((p) => (
                        <Typography>{p.name}</Typography>
                      ))}
                    </TableCell>
                    <TableCell>{o.totalPrice}</TableCell>
                    <TableCell>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          Status
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          defaultValue={o.status}
                          label="Status"
                          onChange={async (event) => {
                            await updateOrder(o._id, event.target.value);
                            const updatedOrders = await getOrders();
                            setOrders(updatedOrders);
                          }}
                          disabled={o.status === "pending" ? true : false}
                        >
                          <MenuItem value="pending" disabled>Pending</MenuItem>
                          <MenuItem value="paid">Paid</MenuItem>
                          <MenuItem value="failed">Failed</MenuItem>
                          <MenuItem value="completed">Completed</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>{o.paid_at}</TableCell>
                    <TableCell>
                      {o.status === "pending" ? (
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => {
                            handleOrderDelete(o._id);
                          }}
                        >
                          Delete
                        </Button>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
};

export default OrdersPage;
