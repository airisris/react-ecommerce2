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

const CategoriesPage = () => {
  const [categories, setCategories] = useState("");
  const [label, setLabel] = useState("");

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
      const updatedCategories = await getCategories();
      setCategories(updatedCategories);
      toast.success("New category has been added");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleCategoryEdit = async (id) => {
    const label = prompt("Enter the new label");

    if (!label) {
      toast.error("Please fill up the label");
      return;
    }

    try {
      // trigger the API to create new category
      await updateCategory(id, label);
      const updatedCategories = await getCategories();
      setCategories(updatedCategories);
      toast.info("Category has been updated");
    } catch (error) {
      toast.error(error.message);
    }
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
                        onClick={() => {
                          handleCategoryEdit(c._id);
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
      </Container>
    </>
  );
};

export default CategoriesPage;
