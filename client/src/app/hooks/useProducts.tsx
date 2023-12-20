import { useEffect } from "react";
import {
  ProductSelectors,
  fetchFiltersAsync,
  fetchProdcutsAsync,
} from "../../features/catalog/catalogSlice";
import { useAppDispatch, useAppSelector } from "../store/configStore";

const useProducts = () => {
  const products = useAppSelector(ProductSelectors.selectAll);
  const dispatch = useAppDispatch();
  const { productsLoaded, filtersLoaded, brands, types, metaData } =
    useAppSelector((state) => state.catalog);

  useEffect(() => {
    if (!productsLoaded) dispatch(fetchProdcutsAsync());
  }, [productsLoaded, dispatch]);

  useEffect(() => {
    if (!filtersLoaded) dispatch(fetchFiltersAsync());
  }, [filtersLoaded, dispatch]);

  return {
    products,
    productsLoaded,
    filtersLoaded,
    brands,
    types,
    metaData,
  };
};

export default useProducts;
