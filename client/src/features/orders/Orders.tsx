import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
import agent from "../../app/api/agent";
import Loading from "../../app/layout/Loading";
import { Order } from "../../app/models/order";
import OrderDetail from "./OrderDetail";

const Orders = () => {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    agent.Orders.list()
      .then((data) => {
        setOrders(data);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [setOrders, setLoading]);

  if (loading) {
    return <Loading message="Loading Orders..." />;
  }
  if (selectedOrder == null) {
    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Order Number</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell align="right">Order Date</TableCell>
              <TableCell align="right">Order Status</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          {orders && (
            <TableBody>
              {orders.map((order) => (
                <TableRow
                  key={order.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {order.id}
                  </TableCell>
                  <TableCell align="right">
                    ${(order.total / 100).toFixed(2)}
                  </TableCell>
                  <TableCell align="right">
                    {order.orderDay.split("T")[0]}
                  </TableCell>
                  <TableCell align="right">{order.orderStatus}</TableCell>
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      onClick={() => {
                        setSelectedOrder(order.id);
                      }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </TableContainer>
    );
  } else {
    return (
      <OrderDetail
        order={orders!.find((o) => o.id === selectedOrder)!}
        setSelectedOrder={setSelectedOrder}
      />
    );
  }
};

export default Orders;
