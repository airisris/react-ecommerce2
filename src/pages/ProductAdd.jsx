import Header from "../components/Header";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useState, useEffect } from "react";
import { addProduct } from "../utils/api_products";
import { toast } from "sonner";
import { useNavigate } from "react-router";

const ProductAdd = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("");

  const handleFormSubmit = async (event) => {
    // 1. check for error
    if (!name || !price || !category) {
      toast.error("Please fill up the required fields");
    }

    try {
      // 2. trigger the API to create new product
      await addProduct(name, description, price, category);
      // 3. if successful, redirect user back to home page and show success message
      toast.success("New product has been added");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="md">
        <Typography variant="h4" align="center" my={3}>
          Add New Product
        </Typography>
        <Box mb={2}>
          <TextField
            label="Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Description"
            fullWidth
            value={description}
            multiline
            rows={3}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Box>
        <Box mb={2}>
          <TextField
            type="number"
            label="Price"
            fullWidth
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </Box>
        <Box mb={2}>
          <FormControl sx={{ width: "100%" }}>
            <InputLabel
              id="demo-simple-select-label"
              sx={{ bgcolor: "white", pr: "5px" }}
            >
              Category
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
              <MenuItem value={"Accessories"}>Accessories</MenuItem>
              <MenuItem value={"Games"}>Games</MenuItem>
              <MenuItem value={"Consoles"}>Consoles</MenuItem>
              <MenuItem value={"Subscriptions"}>Subscriptions</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box mb={2}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleFormSubmit}
          >
            Submit
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default ProductAdd;
