import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import agent from "../../app/api/agent";
import { Paper } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { FieldValues, useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";

const Register = () => {
  const {
    handleSubmit,
    formState: { isSubmitting, isValid, errors },
    register,
    setError,
  } = useForm({ mode: "onTouched" });

  // 當向後端發送註冊時，後端會還傳 ModeValidationError
  // 此時要將 errors 放到對應 name 的 message 中
  const handleValidationErrrors = (errors: []) => {
    errors.forEach((error: string) => {
      if (error.includes("Password")) {
        setError("password", { message: error });
      } else if (error.includes("Email")) {
        setError("email", { message: error });
      } else if (error.includes("Username")) {
        setError("username", { message: error });
      }
    });
  };

  const submit = (data: FieldValues) => {
    agent.Account.register(data)
      .then(() => {
        toast.success("Registration successful - you can now login");
        navigate("/login");
      })
      .catch((errors) => {
        handleValidationErrrors(errors);
      });
  };
  const navigate = useNavigate();

  return (
    <Container
      component={Paper}
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 4,
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Register
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(submit)}
        noValidate
        sx={{ mt: 1 }}
      >
        <TextField
          margin="normal"
          fullWidth
          label="Username"
          autoFocus
          {...register("username", { required: "Username is required" })}
          error={!!errors.username} // !!: if errors.usernam is exist then return true or false.
          helperText={errors.username?.message as string}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/,
              message: "Not a valid email address",
            },
          })}
          error={!!errors.email} // !!: if errors.usernam is exist then return true or false.
          helperText={errors.email?.message as string}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Password"
          type="password"
          {...register("password", {
            required: "Password is required",
            pattern: {
              value: /^(?=.*\d)(?=.*[a-zA-Z])(?!.*[\W_\x7B-\xFF]).{6,15}$/,
              message: "Password does not meet complexity requirement",
            },
          })}
          error={!!errors.password}
          helperText={errors.password?.message as string}
        />

        <LoadingButton
          disabled={!isValid}
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          loading={isSubmitting}
        >
          Register
        </LoadingButton>
        <Grid container>
          <Grid item>
            <Link to={"/login"}>{"Already have an account? Sign In"}</Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Register;
