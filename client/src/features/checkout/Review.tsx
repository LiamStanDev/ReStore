import { Typography, Grid } from "@mui/material";
import { BasketTable } from "../basket/BasketTable";
import BasketSummary from "../basket/BasketSummary";
import { useAppSelector } from "../../app/store/configStore";

export default function Review() {
  const { basket } = useAppSelector((state) => state.basket);
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Order summary
      </Typography>

      {basket && <BasketTable items={basket.items} isBasket={false} />}
      <Grid container>
        <Grid item xs={6} />
        <Grid item xs={6}>
          <BasketSummary />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={6} />
        <Grid item xs={6}></Grid>
      </Grid>
    </>
  );
}
