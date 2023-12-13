import {
  Box,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Order } from "../../app/models/order";
import OrderSummary from "./OrderSummary";

interface Props {
  order: Order;
  setSelectedOrder: (id: number | null) => void;
}
const OrderDetail = ({ order, setSelectedOrder }: Props) => {
  console.log(order);
  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h3">
          Order #{order.id} - {order.orderStatus}
        </Typography>
        <Button variant="contained" onClick={() => setSelectedOrder(null)}>
          BACK TO DESHBOARD
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell align="center">Price</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="right">Subtotal</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {order.orderItems.map((item) => (
              <TableRow
                key={item.productId}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Box display="flex" alignItems="center">
                    <img
                      src={item.pictureUrl}
                      alt={item.name}
                      style={{ height: 50, marginRight: 20 }}
                    />
                    <span>{item.name}</span>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  ${(item.price / 100).toFixed(2)}
                </TableCell>
                <TableCell align="center">{item.quantity}</TableCell>
                <TableCell align="right">
                  ${((item.price / 100) * item.quantity).toFixed(2)}
                </TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Grid container>
        <Grid item xs={6}></Grid>
        <Grid item xs={6}>
          <OrderSummary order={order} />
        </Grid>
      </Grid>
    </>
  );
};

export default OrderDetail;
