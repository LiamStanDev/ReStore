import { Button, Grid, Typography } from "@mui/material";
import BasketSummary from "./BasketSummary";
import { Link } from "react-router-dom";
import { BasketTable } from "./BasketTable";
import { useAppSelector } from "../../app/store/configStore";

const BasketPage = () => {
  const { basket } = useAppSelector((state) => state.basket);

  if (!basket) return <Typography variant="h3">Basket is empty</Typography>;

  return (
    <>
      <BasketTable items={basket.items} isBasket={true} />
      <Grid container>
        <Grid item xs={6} />
        <Grid item xs={6}>
          <BasketSummary />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={6} />
        <Grid item xs={6}>
          <Button
            variant="contained"
            size="large"
            component={Link}
            to="/checkout"
            fullWidth
          >
            Checkout
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default BasketPage;
