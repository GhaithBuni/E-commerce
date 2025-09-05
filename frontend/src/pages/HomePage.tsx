import Grid from "@mui/material/GridLegacy"; // or: import { GridLegacy as Grid } from "@mui/material";
import Container from "@mui/material/Container";
import ProductsCard from "../components/ProductsCard";
import { useEffect, useState } from "react";
import type { Product } from "../types/product";
import { BASE_URL } from "../constants/baseURl";
import { Box } from "@mui/material";

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${BASE_URL}/product`);
        const data = await res.json();
        setProducts(data);
      } catch {
        setError(true);
      }
    };
    fetchProducts();
  }, []);

  if (error) {
    return <Box>Something went wrong</Box>;
  }
  return (
    <Container
      sx={{ mt: 2, display: "flex", justifyContent: "center" }}
      maxWidth="xl"
    >
      <Grid container spacing={2}>
        {products.map((p) => (
          <Grid item xs={12} md={4} key={p._id}>
            <ProductsCard {...p} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default HomePage;
