import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import { Order } from "../../app/models/order";

interface Prop {
  order: Order;
}

const OrderSummary = ({ order }: Prop) => {
  const { subTotal, deliveryFee } = order;
  return (
    <TableContainer component={Paper} variant={"outlined"}>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell colSpan={2}>Subtotal</TableCell>
            <TableCell align="right">${subTotal.toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>Delivery fee*</TableCell>
            <TableCell align="right">${deliveryFee.toFixed(2)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell align="right">
              ${(subTotal + deliveryFee).toFixed(2)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <span style={{ fontStyle: "italic" }}>
                *Orders over $100 qualify for free delivery
              </span>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrderSummary;
