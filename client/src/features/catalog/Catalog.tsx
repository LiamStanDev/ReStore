import Loading from "../../app/layout/Loading";
import { useAppDispatch, useAppSelector } from "../../app/store/configStore";
import ProductList from "./ProductList";
import { useEffect } from "react";
import {
  ProductSelectors,
  fetchFiltersAsync,
  fetchProdcutsAsync,
  setPageNumber,
  setProductParams,
} from "./catalogSlice";
import { Grid, Paper } from "@mui/material";
import ProductSearch from "./ProductSearch";
import RadioButtonGroup from "../../app/components/RadioButtonGroup";
import CheckBoxButtons from "../../app/components/CheckBoxButtons";
import AppPagination from "../../app/components/AppPagination";

const sortOptions = [
  {
    value: "name",
    lable: "Alphabetial",
  },
  {
    value: "priceDesc",
    lable: "Price -High to Low",
  },
  {
    value: "price",
    lable: "Price - Low to High",
  },
];

const Catalog = () => {
  const products = useAppSelector(ProductSelectors.selectAll);
  const dispatch = useAppDispatch();
  const {
    productsLoaded,
    filtersLoaded,
    brands,
    types,
    productParams,
    metaData,
  } = useAppSelector((state) => state.catalog);

  useEffect(() => {
    if (!productsLoaded) dispatch(fetchProdcutsAsync());
  }, [productsLoaded, dispatch]);

  useEffect(() => {
    if (!filtersLoaded) dispatch(fetchFiltersAsync());
  }, [filtersLoaded, dispatch]);

  if (!filtersLoaded) {
    return <Loading message="Product is loading" />;
  }

  return (
    <>
      <Grid container columnSpacing={4}>
        <Grid item xs={3}>
          <Paper sx={{ mb: 2 }}>
            <ProductSearch />
          </Paper>
          <Paper sx={{ mb: 2, p: 2 }}>
            <RadioButtonGroup
              selectedValue={productParams.orderBy}
              options={sortOptions}
              onChange={(event) =>
                dispatch(setProductParams({ orderBy: event.target.value }))
              }
            />
          </Paper>
          <Paper sx={{ mb: 2, p: 2 }}>
            <CheckBoxButtons
              items={brands}
              checked={productParams.brands || []}
              onChange={(items: string[]) =>
                dispatch(setProductParams({ brands: items }))
              }
            />
          </Paper>
          <Paper sx={{ mb: 2, p: 2 }}>
            <CheckBoxButtons
              items={types}
              checked={productParams.types || []}
              onChange={(items: string[]) => {
                dispatch(setProductParams({ types: items }));
              }}
            />
          </Paper>
        </Grid>

        <Grid item xs={9}>
          <ProductList products={products} />
        </Grid>
        <Grid item xs={3}></Grid>
        <Grid item xs={9} sx={{ mt: 2, mb: 2 }}>
          {metaData && (
            <AppPagination
              metaData={metaData}
              onPageChage={(page: number) =>
                dispatch(setPageNumber({ pageNumber: page }))
              }
            />
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default Catalog;
