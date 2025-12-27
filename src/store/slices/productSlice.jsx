import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productApi } from "../api/productApi";
import toast from "react-hot-toast";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await productApi.getProducts(params);
      return response.data;
    } catch (error) {
      toast.error(error.message || "Failed to fetch products");
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProductOptions = createAsyncThunk(
  "products/fetchOptions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await productApi.getOptions();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProductStats = createAsyncThunk(
  "products/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await productApi.getStats();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async ({ data, hasImage = false }, { rejectWithValue }) => {
    try {
      const response = hasImage
        ? await productApi.createProductWithImage(data)
        : await productApi.createProduct(data);
      toast.success("Product created successfully");
      return response.data;
    } catch (error) {
      toast.error(error.message || "Failed to create product");
      return rejectWithValue(error.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, data, hasImage = false }, { rejectWithValue }) => {
    try {
      const response = hasImage
        ? await productApi.updateProductWithImage(id, data)
        : await productApi.updateProduct(id, data);
      toast.success("Product updated successfully");
      return response.data;
    } catch (error) {
      toast.error(error.message || "Failed to update product");
      return rejectWithValue(error.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      await productApi.deleteProduct(id);
      toast.success("Product deleted successfully");
      return id;
    } catch (error) {
      toast.error(error.message || "Failed to delete product");
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await productApi.getProductById(id);

      return response.data || response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  products: [],
  selectedProduct: null,
  options: null,
  stats: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  },
  filters: {
    category: "",
    status: "",
    search: "",
  },
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.currentPage = 1;
    },
    setPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedProduct = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        const payloadData = action.payload?.data || action.payload;
        state.selectedProduct = payloadData.product || payloadData;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        console.log("[v0] API Response received:", action.payload);
        const payloadData = action.payload?.data || action.payload;
        state.products =
          payloadData.products ||
          (Array.isArray(payloadData) ? payloadData : []);
        state.pagination = payloadData.pagination || state.pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchProductOptions.fulfilled, (state, action) => {
        state.options = action.payload;
      })

      .addCase(fetchProductStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })

      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.unshift(action.payload);
        state.pagination.totalItems += 1;
      })

      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })

      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p._id !== action.payload);
        state.pagination.totalItems -= 1;
      });
  },
});

export const { setFilters, setPage, clearFilters } = productSlice.actions;
export default productSlice.reducer;
