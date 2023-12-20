import Loading from "../../app/layout/Loading";
import { useAppDispatch, useAppSelector } from "../../app/store/configStore";
import ProductList from "./ProductList";
import { setPageNumber, setProductParams } from "./catalogSlice";
import { Grid, Hidden, Paper } from "@mui/material";
import ProductSearch from "./ProductSearch";
import RadioButtonGroup from "../../app/components/RadioButtonGroup";
import CheckBoxButtons from "../../app/components/CheckBoxButtons";
import AppPagination from "../../app/components/AppPagination";
import useProducts from "../../app/hooks/useProducts";

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
  const dispatch = useAppDispatch();

  const { products, filtersLoaded, types, brands, metaData } = useProducts();

  const { productParams } = useAppSelector((state) => state.catalog);

  if (!filtersLoaded) {
    return <Loading message="Product is loading" />;
  }

  return (
    <>
      <Grid container columnSpacing={4}>
        <Hidden mdDown>
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
        </Hidden>

        <Grid item md={9} xs={12}>
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
