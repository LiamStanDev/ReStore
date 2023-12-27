import { useTheme } from "@emotion/react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import Slider from "react-slick";

const HomePage = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const theme: any = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <>
      <Slider {...settings}>
        <div>
          <img
            src="/images/hero1.jpg"
            alt="hero"
            style={{ display: "block", width: "100%" }}
          />
        </div>
        <div>
          <img
            src="/images/hero2.jpg"
            alt="hero"
            style={{ display: "block", width: "100%" }}
          />
        </div>
        <div>
          <img
            src="/images/hero3.jpg"
            alt="hero"
            style={{ display: "block", width: "100%" }}
          />
        </div>
      </Slider>

      <Box display="flex" justifyContent="center" sx={{ p: 4 }}>
        <Typography variant={isMdUp ? "h1" : "h4"}>
          Welcome to the shop!
        </Typography>
      </Box>
    </>
  );
};

export default HomePage;
