import Loading from "../../app/layout/Loading";
import { useAppDispatch, useAppSelector } from "../../app/store/configStore";
import ProductList from "./ProductList";
import { useEffect } from "react";
import {
  ProductSelectors,
  fetchFiltersAsync,
  fetchProdcutsAsync,
  setProductParams,
} from "./catalogSlice";
import {
  Box,
  Checkbox,
  Container,
  FormControlLabel,
  FormGroup,
  Grid,
  Pagination,
  Paper,
  Typography,
} from "@mui/material";
import ProductSearch from "./ProductSearch";
import RadioButtonGroup from "../../app/components/RadioButtonGroup";
import CheckBoxButtons from "../../app/components/CheckBoxButtons";

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
    status,
    filtersLoaded,
    brands,
    types,
    productParams,
  } = useAppSelector((state) => state.catalog);

  useEffect(() => {
    if (!productsLoaded) dispatch(fetchProdcutsAsync());
  }, [productsLoaded, dispatch]);

  useEffect(() => {
    if (!filtersLoaded) dispatch(fetchFiltersAsync());
  }, [filtersLoaded, dispatch]);
  //
  // if (status.includes("pending"))
  //   return <Loading message="Loading products..." />;

  return (
    <>
      <Grid container spacing={4}>
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
              onChange={(items: string[]) =>
                dispatch(setProductParams({ types: items }))
              }
            />
            <FormGroup>
              {types.map((types) => (
                <FormControlLabel
                  key={types}
                  control={<Checkbox />}
                  label={types}
                />
              ))}
            </FormGroup>
          </Paper>
        </Grid>

        <Grid item xs={9}>
          {status.includes("pending") ? (
            <Loading message="Loading products..." />
          ) : (
            <ProductList products={products} />
          )}
        </Grid>
        <Grid item xs={3}></Grid>
        <Grid item xs={9}>
          <Box display="flex" justifyContent="space-around" alignItems="center">
            <Typography>Displaying 1-6 of 20 items</Typography>
            <Pagination count={10} page={2} size="large" color="secondary" />
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default Catalog;
