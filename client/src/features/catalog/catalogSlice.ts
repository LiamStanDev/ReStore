import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import Product, { ProductParams } from "../../app/models/product";
import agent from "../../app/api/agent";
import { RootState } from "../../app/store/configStore";

const productAdapter = createEntityAdapter<Product>();

const converToAxiosSearchParams = (productParams: ProductParams) => {
  const params = new URLSearchParams();
  params.append("pageNumber", productParams.pageNumber.toString());
  params.append("pageSize", productParams.pageSize.toString());
  params.append("orderBy", productParams.orderBy);
  if (productParams.searchTerm)
    params.append("searchTerm", productParams.searchTerm);
  if (productParams.types)
    params.append("types", productParams.types.toString());
  if (productParams.brands)
    params.append("brands", productParams.brands.toString());
  return params;
};

/*
 * 正常來說是不用再 createAsyncThunk 中使用 try catch
 * 但是我們希望能在 action pyload 中添加 error 訊息，
 * 所以在 thunkAPI object 中的 rejectWithValue 中添加
 * error
 */
export const fetchProdcutsAsync = createAsyncThunk<
  Product[],
  void,
  { state: RootState } // for give state an type
>("catalog/fetchProdcutsAsync", async (_, thunkAPI) => {
  const params = converToAxiosSearchParams(
    thunkAPI.getState().catalog.productParams
  );
  // the _, is for none-exist argument.
  try {
    const searchParams = params;
    return await agent.Catalog.list(searchParams);
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.data });
  }
});

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

export const fetchFiltersAsync = createAsyncThunk(
  "catalogFetchFiltersAsync",
  async (_, thunkAPI) => {
    try {
      return await agent.Catalog.filters();
    } catch (error) {
      return thunkAPI.rejectWithValue({ error: error });
    }
  }
);

interface CatalogState {
  productsLoaded: boolean;
  filtersLoaded: boolean;
  status: string;
  brands: string[];
  types: string[];
  productParams: ProductParams;
}

const initProductParams = (): ProductParams => {
  return {
    pageNumber: 1,
    pageSize: 6,
    orderBy: "name",
  };
};

export const catalogSlice = createSlice({
  name: "catalog",
  initialState: productAdapter.getInitialState<CatalogState>({
    // adding extra state
    productsLoaded: false,
    status: "idle",
    filtersLoaded: false,
    brands: [],
    types: [],
    productParams: initProductParams(),
  }),
  reducers: {
    setProductParams: (state, action) => {
      state.productsLoaded = false;
      state.productParams = { ...state.productParams, ...action.payload };
    },
    resetProductParams: (state) => {
      state.productsLoaded = false;
      state.productParams = initProductParams();
    },
  },
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

    builder.addCase(fetchFiltersAsync.fulfilled, (state, action) => {
      state.brands = action.payload.brands;
      state.types = action.payload.types;
      state.status = "idle";
      state.filtersLoaded = true;
    });

    builder.addCase(fetchFiltersAsync.pending, (state) => {
      state.status = "pendingFetchFilters";
    });

    builder.addCase(fetchFiltersAsync.rejected, (state) => {
      state.filtersLoaded = false;
      state.status = "idle";
    });
  },
});

export const ProductSelectors = productAdapter.getSelectors(
  (state: RootState) => state.catalog
);

export const { setProductParams, resetProductParams } = catalogSlice.actions;
