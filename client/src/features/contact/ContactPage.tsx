import { Button, ButtonGroup, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/store/configStore";
import { decrement, increment } from "./counterSlice";

const ContactPage = () => {
  const dispatch = useAppDispatch();
  const { title, data } = useAppSelector((state) => state.counter);
  return (
    <>
      <Typography variant="h3">{title}</Typography>
      <Typography variant="h5">The data is: {data}</Typography>
      <ButtonGroup>
        <Button onClick={() => dispatch(decrement(1))} variant="contained">
          Decrement
        </Button>
        <Button onClick={() => dispatch(increment(1))} variant="contained">
          Increment
        </Button>
        <Button onClick={() => dispatch(increment(5))} variant="contained">
          IncrementBy5
        </Button>
      </ButtonGroup>
    </>
  );
};

export default ContactPage;
