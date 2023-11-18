import {
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import { ChangeEvent, useEffect, useState } from "react";
import { useParams } from "react-router";
import NotFound from "../../app/errors/NotFound";
import Loading from "../../app/layout/Loading";
import { LoadingButton } from "@mui/lab";
import { useAppDispatch, useAppSelector } from "../../app/store/configStore";
import {
  addBasketItemAsync,
  removeBasketItemAsync,
} from "../basket/basketSlice";
import { ProductSelectors, fetchProductAsync } from "./catalogSlice";

const ProductDetail = () => {
  // get id from url string by react-router
  // it's the way to set item type inside an object.
  const { id } = useParams<{ id: string }>();
  const { basket, status } = useAppSelector((state) => state.basket);
  const dispatch = useAppDispatch();

  const product = useAppSelector((state) =>
    ProductSelectors.selectById(state, id!)
  );
  const [quantity, setQuantity] = useState(0);

  const item = basket?.items.find((i) => i.productId === product?.id);

  useEffect(() => {
    item && setQuantity(item.quantity);
    // to make sure id is not undefined
    if (!product && id) dispatch(fetchProductAsync(parseInt(id)));
  }, [id, item, dispatch, product]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const q = parseInt(event.currentTarget.value);
    if (q >= 0) {
      setQuantity(parseInt(event.target.value));
    }
  };

  const handleUpdateCart = () => {
    if (!item || quantity > item.quantity) {
      const updateQuantity = item ? quantity - item.quantity : quantity;
      dispatch(
        addBasketItemAsync({ productId: product!.id, quantity: updateQuantity })
      );
    } else {
      const updateQuantity = item.quantity - quantity;
      dispatch(
        removeBasketItemAsync({
          productId: product!.id,
          quantity: updateQuantity,
        })
      );
    }
  };

  if (status.includes("pendingFetchProduct"))
    return <Loading message="Loading product..." />;

  if (!product) return <NotFound />;

  return (
    <Grid container spacing={6}>
      <Grid item xs={6}>
        <img
          src={product.pictureUrl}
          alt={product.name}
          style={{ width: "100%" }}
        />
      </Grid>

      <Grid item xs={6}>
        <Typography variant="h3">{product.name}</Typography>
        <Divider sx={{ marginBottom: 2 }} />
        <Typography variant="h4">{product.name}</Typography>

        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>{product.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell>{product.description}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>{product.type}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Brand</TableCell>
              <TableCell>{product.brand}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Quantity in stock</TableCell>
              <TableCell>{product.quantityInStock}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Grid container spacing={2} alignItems="center" sx={{ marginTop: 2 }}>
          <Grid item xs={6}>
            <TextField
              onChange={handleInputChange}
              variant="outlined"
              type="number"
              label="Quantity in Cart"
              value={quantity}
              fullWidth
            ></TextField>
          </Grid>
          <Grid item xs={6}>
            <LoadingButton
              onClick={handleUpdateCart}
              disabled={
                quantity === item?.quantity || (!item && quantity === 0)
              }
              loading={status.includes("pending")}
              fullWidth
              variant="contained"
              sx={{ height: "55px" }}
              color="primary"
              size="large"
            >
              {item ? "Update Quantity" : "Add to Cart"}
            </LoadingButton>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ProductDetail;
