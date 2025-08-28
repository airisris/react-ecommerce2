import { Link } from "react-router";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";

const Header = (props) => {
  const { current, title = "Welcome to My Store" } = props;
  return (
    <>
      <Box
        sx={{
          textAlign: "center",
          borderBottom: "1px solid #ddd",
          mx: 7,
          py: 3,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          {title}
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            mt: 2,
          }}
        >
          <Button
            component={Link}
            to="/"
            color="primary"
            variant={current === "home" ? "contained" : "outlined"}
          >
            Home
          </Button>
          <Button
            component={Link}
            to="/cart"
            color="primary"
            variant={current === "cart" ? "contained" : "outlined"}
          >
            Cart
          </Button>
          <Button
            component={Link}
            to="/orders"
            variant={current === "orders" ? "contained" : "outlined"}
          >
            My Orders
          </Button>
          <Button
            component={Link}
            to="/categories"
            variant={current === "categories" ? "contained" : "outlined"}
          >
            Categories
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default Header;
