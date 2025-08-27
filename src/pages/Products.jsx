import { Link } from "react-router";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Header from "../components/Header";
import { getProducts, deleteProduct, getProduct } from "../utils/api_products";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function Products() {
  const navigate = useNavigate();
  // to store data from /products
  const [products, setProducts] = useState([]);
  // to track which page the user is in
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("all");

  const [cart, setCart] = useState([]);

  // useEffect
  useEffect(() => {
    // get products
    getProducts(category, page).then((data) => {
      setProducts(data);
    });
  }, [category, page]);

  const handleProductDelete = async (id) => {
    Swal.fire({
      title: "Are you sure you want to delete the product?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      // once user confirm, then we delete the product
      if (result.isConfirmed) {
        // delete product at the backend
        await deleteProduct(id);
        // method #1: remove from the state manually
        // delete product from the state
        // setProducts(products.filter((p) => p._id !== id));

        // method #2: get the new data from the backend
        const updatedProducts = await getProducts(category, page);
        setProducts(updatedProducts);

        toast.success("Product has been deleted");
      }
    });
  };

  const handleProductAdd = async (id) => {
    const product = await getProduct(id);
    // get current cart data from local storage
    const cart = localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
    // if (cart.length === 0) {
    //   cart.push({ ...product, quantity: 1 });
    // } else {
    // find out if the product already exists in the cart or not
    const selected = cart.find((c) => c._id === id);
    if (selected) {
      // if product already exists, increase quantity
      // cart.map((c) => {
      //   if (c._id === id) {
      //     c.quantity += 1;
      //   } else {
      //     return c;
      //   }
      // });
      selected.quantity += 1;
    } else {
      // if not exists, add to cart
      cart.push({ ...product, quantity: 1 });
    }
    // }
    // update the cart (in local storage) with the latest data
    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success(`"${product.name}" has been added to cart`);
    navigate("/cart");
  };

  return (
    <>
      <Header current="home" />
      <Container>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 3,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Products
          </Typography>
          <Button
            component={Link}
            to="/products/new"
            variant="contained"
            color="success"
          >
            Add New
          </Button>
        </Box>
        <Box sx={{ pb: "20px" }}>
          <FormControl sx={{ minWidth: "250px" }}>
            <InputLabel
              id="demo-simple-select-label"
              sx={{ bgcolor: "white", pr: "5px" }}
            >
              Filter By Category
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={category}
              label="Category"
              onChange={(event) => {
                setCategory(event.target.value);
                // reset the page back to 1
                setPage(1);
              }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value={"Accessories"}>Accessories</MenuItem>
              <MenuItem value={"Games"}>Games</MenuItem>
              <MenuItem value={"Consoles"}>Consoles</MenuItem>
              <MenuItem value={"Subscriptions"}>Subscriptions</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ width: "100%" }}>
          <Grid container spacing={2}>
            {products.map((product) => (
              <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4 }} key={product._id}>
                <Card sx={{ minWidth: 275, p: "20px" }}>
                  <CardContent sx={{ m: 0, p: 0 }}>
                    <Typography component="div" sx={{ fontWeight: "bold" }}>
                      {product.name}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: "20px",
                      }}
                    >
                      <Chip
                        variant="outlined"
                        color="success"
                        label={`$ ${product.price}`}
                      />
                      <Chip
                        variant="outlined"
                        color="warning"
                        label={product.category}
                      />
                    </Box>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ width: "100%", my: "15px" }}
                      onClick={() => {
                        handleProductAdd(product._id);
                      }}
                    >
                      Add To Cart
                    </Button>
                  </CardContent>
                  <CardActions sx={{ m: 0, p: 0 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <Button
                        component={Link}
                        to={`/products/${product._id}/edit`}
                        variant="contained"
                        color="info"
                        sx={{ borderRadius: 5 }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        sx={{ borderRadius: 5 }}
                        onClick={() => {
                          handleProductDelete(product._id);
                        }}
                      >
                        Delete
                      </Button>
                    </Box>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
        {products.length === 0 ? (
          <Typography variant="h5" align="center" py={3}>
            No more products found.
          </Typography>
        ) : null}
        <Box
          sx={{
            py: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            disabled={page === 1 ? true : false} // the button will disabled if page is 1
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <span>Page: {page}</span>
          <Button
            variant="contained"
            disabled={products.length === 0 ? true : false} // the button will be disabled if no more products
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </Box>
      </Container>
    </>
  );
}
