import { Grid } from "@mui/material";
import Product from "../../app/models/product";
import ProductCard from "./ProductCard";
import { useAppSelector } from "../../app/store/configStore";
import ProductCardSkeleton from "./ProductCardSkeleton";

interface Prop {
  products: Product[];
}

const ProductList = ({ products }: Prop) => {
  const { productsLoaded } = useAppSelector((state) => state.catalog);

  return (
    <Grid container spacing={4}>
      {products.map((product) => {
        return (
          <Grid item xs={4} key={product.id}>
            {productsLoaded ? (
              <ProductCard product={product} />
            ) : (
              <ProductCardSkeleton />
            )}
          </Grid>
        );
      })}
    </Grid>
  );
};

export default ProductList;
