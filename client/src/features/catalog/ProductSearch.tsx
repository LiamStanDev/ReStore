import { TextField, debounce } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/store/configStore";
import { setProductParams } from "./catalogSlice";
import { ChangeEvent, useState } from "react";

const ProductSearch = () => {
  const { productParams } = useAppSelector((state) => state.catalog);
  const dispatch = useAppDispatch();

  const debouncedSearch = debounce((event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setProductParams({ searchTerm: event.target.value }));
  }, 1000);

  const [searchTerm, setSearchTerm] = useState(productParams.searchTerm);

  const handleFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    debouncedSearch(event);
  };
  return (
    <TextField
      label="Search products"
      variant="outlined"
      fullWidth
      value={searchTerm || ""}
      onChange={handleFilterChange}
    ></TextField>
  );
};

export default ProductSearch;
