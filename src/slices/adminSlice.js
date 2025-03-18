// slices/adminSlice.js

import { createSlice } from '@reduxjs/toolkit';

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    dashboardData: [],
    loading: false,
    error: null,
  },
  reducers: {
    setDashboardData: (state, action) => {
      state.dashboardData = action.payload;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.dashboardData = [];
    },
  },
});

export const { setDashboardData, setLoading, setError } = adminSlice.actions;
export default adminSlice.reducer;