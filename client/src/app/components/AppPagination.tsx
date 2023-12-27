import { Box, Pagination, Typography } from "@mui/material";
import { MetaData } from "../models/pagination";
import { useState } from "react";

interface Props {
  metaData: MetaData | null;
  onPageChage: (page: number) => void;
}
const AppPagination = ({ metaData, onPageChage }: Props) => {
  const { currentPage, totalCount, pageSize, totalPages } = metaData!;
  const [pageNumber, setPageNumber] = useState(currentPage);

  const handlePageChange = (page: number) => {
    setPageNumber(page);
    onPageChage(page);
  };

  return (
    <Box display="flex" justifyContent="space-around" alignItems="center">
      <Typography>
        Displaying {(currentPage - 1) * pageSize + 1}-
        {currentPage * pageSize > totalCount
          ? totalCount
          : currentPage * pageSize}{" "}
        of {totalCount} items
      </Typography>
      <Pagination
        count={totalPages}
        page={pageNumber}
        onChange={(_, page) => handlePageChange(page)}
        size="large"
        color="secondary"
      />
    </Box>
  );
};

export default AppPagination;
