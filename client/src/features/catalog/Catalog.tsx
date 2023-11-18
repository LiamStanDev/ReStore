import Loading from "../../app/layout/Loading";
import { useAppDispatch, useAppSelector } from "../../app/store/configStore";
import ProductList from "./ProductList";
import { useEffect } from "react";
import { ProductSelectors, fetchProdcutsAsync } from "./catalogSlice";

export default function Catalog() {
  const products = useAppSelector(ProductSelectors.selectAll);
  const dispatch = useAppDispatch();
  const { productsLoaded, status } = useAppSelector((state) => state.catalog);

  useEffect(() => {
    if (!productsLoaded) dispatch(fetchProdcutsAsync());
  }, [productsLoaded, dispatch]);

  if (status.includes("pending"))
    return <Loading message="Loading products..." />;

  return (
    <>
      <ProductList products={products} />
    </>
  );
}
