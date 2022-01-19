import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {
  addToCart,
  getCart,
  increaseCartQuantity,
  decreaseCartQuantity,
  removeFromCart,
} from '../../services/asyncStorage';

export const addToCartAsync = createAsyncThunk(
  'cart/add',
  async (product, {rejectWithValue}) => {
    try {
      await addToCart(product);
      return product;
    } catch (e) {
      return rejectWithValue(e.response.data);
    }
  },
);

export const getFromCartAsync = createAsyncThunk(
  'cart/get',
  async (_, {rejectWithValue}) => {
    try {
      const products = await getCart();
      return products;
    } catch (e) {
      return rejectWithValue(e.response.data);
    }
  },
);

export const increaseQuantityAsync = createAsyncThunk(
  'cart/increase',
  async (productId, {rejectWithValue}) => {
    try {
      await increaseCartQuantity(productId);
      return productId;
    } catch (e) {
      return rejectWithValue(e.response.data);
    }
  },
);

export const decreaseQuantityAsync = createAsyncThunk(
  'cart/decrease',
  async (productId, {rejectWithValue}) => {
    try {
      await decreaseCartQuantity(productId);
      return productId;
    } catch (e) {
      return rejectWithValue(e.response.data);
    }
  },
);

export const removeFromCartAsync = createAsyncThunk(
  'cart/remove',
  async (productId, {rejectWithValue}) => {
    try {
      await removeFromCart(productId);
      return productId;
    } catch (e) {
      return rejectWithValue(e.response.data);
    }
  },
);

export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    products: [],
    status: 'idle',
    error: null,
  },
  reducers: {},

  extraReducers: builder => {
    builder
      .addCase(addToCartAsync.pending, state => {
        state.status = 'pending';
        state.error = null;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        const exist = state.products.filter(
          product => product.id === action.payload.id,
        ).length;
        if (exist === 0) {
          state.products = [...state.products, action.payload];
        }
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        console.log('addToCartAsync->rejected error : ', action.payload);
      })
      .addCase(getFromCartAsync.pending, state => {
        state.status = 'pending';
        state.error = null;
      })
      .addCase(getFromCartAsync.fulfilled, (state, action) => {
        state.products = [...action.payload];
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(getFromCartAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        console.log('getFromCartAsync->rejected error : ', action.payload);
      })
      .addCase(removeFromCartAsync.pending, state => {
        state.error = null;
      })
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.products = state.products.filter(
          product => product.id !== action.payload,
        );
      })
      .addCase(removeFromCartAsync.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(increaseQuantityAsync.pending, state => {
        state.error = null;
      })
      .addCase(increaseQuantityAsync.fulfilled, (state, action) => {
        state.products = state.products.map(product => {
          if (product.id === action.payload) {
            return {
              ...product,
              quantity: product.quantity + 1,
            };
          } else {
            return product;
          }
        });
      })
      .addCase(increaseQuantityAsync.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(decreaseQuantityAsync.pending, state => {
        state.error = null;
      })
      .addCase(decreaseQuantityAsync.fulfilled, (state, action) => {
        state.products = state.products.map(product => {
          if (product.id === action.payload && product.quantity > 1) {
            return {
              ...product,
              quantity: product.quantity - 1,
            };
          } else {
            return product;
          }
        });
      })
      .addCase(decreaseQuantityAsync.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;
