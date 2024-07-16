import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface Room {
  _id: string;
  roomNumber: number;
  isOccupied: boolean;
  price: number;
  __v: number;
  occupantName: string | null;
  checkInDate: string;
  checkOutDate: string;
}

interface RoomsState {
  rooms: Room[];
  loading: boolean;
  error: string | null;
}

const initialState: RoomsState = {
  rooms: [],
  loading: false,
  error: null,
};

const apiUrl = 'https://lodge-backend.onrender.com/api/rooms';

export const fetchOccupiedRooms = createAsyncThunk<Room[], { startDate: string, endDate: string }>(
  'rooms/fetchOccupiedRooms',
  async ({ startDate, endDate }) => {
    console.log(`Fetching occupied rooms between ${startDate} and ${endDate}`);
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    try {
      const response = await axios.get(`${apiUrl}/occupied`, {
        params: { startDate, endDate },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Response:', response.data);
      return response.data.details;
    } catch (error) {
      console.error('Error fetching occupied rooms:', error);
      throw error;
    }
  } 
);


export const fetchRooms = createAsyncThunk<Room[]>('rooms/fetchRooms', async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await axios.get(apiUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
});

export const updateRoomStatus = createAsyncThunk<Room, number>(
  'rooms/updateRoomStatus',
  async (roomNumber) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.put(`${apiUrl}/${roomNumber}/status`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  }
);

const roomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchRooms.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchRooms.fulfilled, (state, action: PayloadAction<Room[]>) => {
      state.rooms = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchRooms.rejected, (state, action) => {
      console.log(action.error);
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch rooms';
    });
    builder.addCase(fetchOccupiedRooms.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchOccupiedRooms.fulfilled, (state, action: PayloadAction<Room[]>) => {
      state.rooms = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchOccupiedRooms.rejected, (state, action) => {
      console.log('Error fetching occupied rooms:', action.error);
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch occupied rooms';
    });
    builder.addCase(updateRoomStatus.fulfilled, (state, action: PayloadAction<Room>) => {
      const updatedRoom = action.payload;
      const index = state.rooms.findIndex(room => room._id === updatedRoom._id);
      if (index !== -1) {
        state.rooms[index] = updatedRoom;
      }
    });
  },
});

export default roomsSlice.reducer;
