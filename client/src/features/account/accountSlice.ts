import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { User } from "../../app/models/user";
import { FieldValues } from "react-hook-form";
import { toast } from "react-toastify";
import { setBasket } from "../basket/basketSlice";
import agent from "../../app/api/agent";
import router from "../../app/router/Routers";

export interface AccountState {
  user: User | null;
}

const initialState: AccountState = {
  user: null,
};

export const signInUser = createAsyncThunk<User, FieldValues>(
  "account/signInUser",
  async (data, thunkAPI) => {
    try {
      const userDTO = await agent.Account.login(data);
      // 把 basket 取出來，剩下的叫做 user
      // 因為 userDTO 為包含usernam, email 與 basket 的 class object
      // 不是 {}, 故不能直接取出來
      const { basket, ...user } = userDTO;
      if (basket) thunkAPI.dispatch(setBasket(basket));
      localStorage.setItem("user", JSON.stringify(user));

      return user;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const fetchCurrentUser = createAsyncThunk<User>(
  "account/fetchCurrentUser",
  async (_, thunkAPI) => {
    thunkAPI.dispatch(setUser(JSON.parse(localStorage.getItem("user")!)));
    try {
      const userDto = await agent.Account.currentUser();
      const { basket, ...user } = userDto;
      if (basket) thunkAPI.dispatch(setBasket(basket));
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
  {
    condition: () => {
      if (!localStorage.getItem("user")) return false;
    },
  }
);

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    signOut: (state) => {
      state.user = null;
      localStorage.removeItem("user");
      router.navigate("/");
    },
    setUser: (state, action) => {
      // atob: ASCII to BASE 64 但是它其實是 BASE64 to ASCII
      // 相反的操作為 btoa()
      const claims = JSON.parse(atob(action.payload.token.split(".")[1]));
      // 這是將 token 在 jwt.io 網站解析後得到的 key
      const roles =
        claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      state.user = {
        ...action.payload,
        roles: typeof roles === "string" ? [roles] : roles,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCurrentUser.rejected, (state) => {
      state.user = null;
      localStorage.removeItem("user");
      toast.error("Session expired - please login again");
      router.navigate("/");
    });

    builder.addCase(signInUser.rejected, (_, action) => {
      throw action.payload;
    });

    // the singInUser and fetchCurrentUser has the same return and error
    // we can use addMatcher instead of addCase to remove boiloplate.
    builder.addMatcher(
      isAnyOf(signInUser.fulfilled, fetchCurrentUser.fulfilled),
      (state, action) => {
        // atob: ASCII to BASE 64 但是它其實是 BASE64 to ASCII
        // 相反的操作為 btoa()
        const claims = JSON.parse(atob(action.payload.token.split(".")[1]));
        // 這是將 token 在 jwt.io 網站解析後得到的 key
        const roles =
          claims[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ];
        state.user = {
          ...action.payload,
          roles: typeof roles === "string" ? [roles] : roles,
        };
      }
    );
  },
});

export const { signOut, setUser } = accountSlice.actions;
