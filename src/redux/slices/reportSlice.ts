import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the payload type for the fulfilled action
interface FetchOccupancyPayload {
  totalRevenue: number;
  count: number;
  details: Array<{
    _id: string;
    roomNumber: string;
    checkInDate: string;
    checkOutDate: string;
    price: number;
    __v: number;
  }>;
}

// Define the state shape
interface OccupancyState {
  totalRevenue: number;
  count: number;
  details: Array<{
    _id: string;
    roomNumber: string;
    checkInDate: string;
    checkOutDate: string;
    price: number;
    __v: number;
  }>;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
}

// Initial state
const initialState: OccupancyState = {
  totalRevenue: 0,
  count: 0,
  details: [],
  status: 'idle',
  error: '',
};

// Async thunk action
export const fetchOccupancy = createAsyncThunk(
  'occupancy/fetchOccupancy',
  async (params: { startDate: string; endDate: string }) => {
    const token = localStorage.getItem('token');
    const headers = new Headers();
    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(
      `https://lodge-backend.onrender.com/api/rooms/occupied?startDate=${params.startDate}&endDate=${params.endDate}`, {
        method: 'GET',
        headers: headers,
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch occupancy data');
    }
    return await response.json(); // Return the whole response object
  }
);

// Slice
export const occupancySlice = createSlice({
  name: 'occupancy',
  initialState, // Corrected here
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOccupancy.fulfilled, (state, action: PayloadAction<FetchOccupancyPayload>) => {
        state.status = 'succeeded';
        state.totalRevenue = action.payload.totalRevenue;
        state.count = action.payload.count;
        state.details = action.payload.details;
      })
      .addCase(fetchOccupancy.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOccupancy.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Unknown error';
      });
  },
});

// Export actions and reducer
export const { actions: occupancyActions, reducer: occupancyReducer } = occupancySlice;

// Export the reducer as default
export default occupancyReducer;
