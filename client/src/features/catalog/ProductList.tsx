import { Grid } from "@mui/material";
import Product from "../../app/models/product";
import ProductCard from "./ProductCard";

interface Prop {
  products: Product[];
}

const ProductList = ({ products }: Prop) => {
  return (
    <Grid container spacing={4}>
      {products.map((product) => {
        return (
          <Grid item xs={3} key={product.id}>
            <ProductCard product={product} />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default ProductList;
