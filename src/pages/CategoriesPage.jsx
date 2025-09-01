import Header from "../components/Header";
import { Container } from "@mui/material";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useState, useEffect } from "react";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../utils/api_category";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { Category } from "@mui/icons-material";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

const CategoriesPage = () => {
  const [categories, setCategories] = useState("");
  const [label, setLabel] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedCatID, setSelectedCatID] = useState("");
  const [selectedCatLabel, setSelectedCatLabel] = useState("");

  // call the API
  useEffect(() => {
    getCategories()
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleSubmit = async () => {
    // check for error
    if (!label) {
      toast.error("Please fill up the label");
    }

    try {
      // trigger the API to create new category
      await createCategory(label);
      // get latest categories
      const updatedCategories = await getCategories();
      setCategories(updatedCategories);
      // clear the label
      setLabel("");
      toast.success("New category has been added");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleCategoryEdit = async (c) => {
    const label = prompt("Enter the new label", c.label);

    if (!label) {
      toast.error("Please fill up the label");
      return;
    }

    try {
      // trigger the API to edit category
      await updateCategory(c._id, label);
      const updatedCategories = await getCategories();
      setCategories(updatedCategories);
      toast.info("Category has been updated");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleUpdate = async () => {
    // update category
    await updateCategory(selectedCatID, selectedCatLabel);
    // get the latest categories again
    const newCategories = await getCategories();
    // update the categories state
    setCategories(newCategories);
    // close the model
    setOpen(false);
    toast.info("Category has been updated");
  };

  const handleCategoryDelete = async (id) => {
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
        await deleteCategory(id);
        const updatedCategories = await getCategories();
        setCategories(updatedCategories);
        toast.success("Category has been removed");
      }
    });
  };

  return (
    <>
      <Header current="categories" title="Manage Cateories" />
      <Container maWidth="lg">
        <Typography variant="h5" sx={{ fontWeight: "bold", py: 3 }}>
          Categories
        </Typography>
        <Paper
          variant="outlined"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px",
            p: 2,
          }}
        >
          <TextField
            label="Category Name"
            fullWidth
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
          <Button
            color="primary"
            variant="contained"
            sx={{ p: 2 }}
            onClick={handleSubmit}
          >
            ADD
          </Button>
        </Paper>
        <TableContainer>
          <Table sx={{ minWidth: 650, my: 2 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    No Product Added Yet!
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((c) => (
                  <TableRow
                    key={c._id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ minWidth: "300px" }}
                    >
                      {c.label}
                    </TableCell>
                    <TableCell sx={{ display: "flex", gap: "10px" }}>
                      <Button
                        variant="contained"
                        color="primary"
                        // onClick={() => {
                        //   handleCategoryEdit(c);
                        // }}
                        onClick={() => {
                          setOpen(true);
                          // pass in the id and label
                          setSelectedCatID(c._id);
                          setSelectedCatLabel(c.label);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                          handleCategoryDelete(c._id);
                        }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Modal open={open} onClose={() => setOpen(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
            }}
          >
            <TextField
              fullWidth
              label="Category"
              variant="outlined"
              value={selectedCatLabel}
              onChange={(event) => setSelectedCatLabel(event.target.value)}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                pt: 2,
              }}
            >
              {" "}
              <Button
                color="primary"
                variant="outlined"
                onClick={() => {
                  setOpen(false);
                }}
              >
                Close
              </Button>
              <Button
                color="primary"
                variant="contained"
                onClick={handleUpdate}
              >
                Update
              </Button>
            </Box>
          </Box>
        </Modal>
      </Container>
    </>
  );
};

export default CategoriesPage;
