import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import Product from "../../app/models/product";
import agent from "../../app/api/agent";
import { RootState } from "../../app/store/configStore";

const productAdapter = createEntityAdapter<Product>();

/*
 * 正常來說是不用再 createAsyncThunk 中使用 try catch
 * 但是我們希望能在 action pyload 中添加 error 訊息，
 * 所以在 thunkAPI object 中的 rejectWithValue 中添加
 * error
 */
export const fetchProdcutsAsync = createAsyncThunk<Product[], void>(
  "catalog/fetchProdcutsAsync",
  async (_, thunkAPI) => {
    // the _, is for none-exist argument.
    try {
      return await agent.Catalog.list();
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const fetchProductAsync = createAsyncThunk<Product, number>(
  "catalog/fetchProductAsync",
  async (id, thunAPI) => {
    try {
      return await agent.Catalog.detail(id);
    } catch (error: any) {
      return thunAPI.rejectWithValue({ error: error.data });
    }
  }
);

export const catalogSlice = createSlice({
  name: "catalog",
  initialState: productAdapter.getInitialState({
    // adding extra state
    productsLoaded: false,
    status: "idle",
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProdcutsAsync.pending, (state) => {
      state.status = "pendingFetchProducts";
    });
    builder.addCase(fetchProdcutsAsync.fulfilled, (state, action) => {
      productAdapter.setAll(state, action.payload);
      state.status = "idle";
      state.productsLoaded = true;
    });
    builder.addCase(fetchProdcutsAsync.rejected, (state, action) => {
      console.log(action.payload);
      state.status = "idle";
    });

    builder.addCase(fetchProductAsync.pending, (state) => {
      state.status = "pendingFetchProduct";
    });

    builder.addCase(fetchProductAsync.fulfilled, (state, action) => {
      productAdapter.upsertOne(state, action.payload);
      state.status = "idle";
    });

    builder.addCase(fetchProductAsync.rejected, (state, action) => {
      console.log(action.payload);
      state.status = "idle";
    });
  },
});

export const ProductSelectors = productAdapter.getSelectors(
  (state: RootState) => state.catalog
);
