// src/store.js
import { configureStore } from '@reduxjs/toolkit';
// import { apiSlice } from './apiSlice'; // Make sure this path is correct
import { apiSlice } from './redux/api/apiSlice';
import favoriteReducer from './redux/features/favorites/favoriteSlice';

const store = configureStore({
  reducer: {
    favorites: favoriteReducer,
    [apiSlice.reducerPath]: apiSlice.reducer, // Add the api slice reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware), // Add the api middleware
});

export default store;
