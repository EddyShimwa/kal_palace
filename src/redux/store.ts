import { configureStore } from '@reduxjs/toolkit';
import signinReducer from './slices/signInSlice';
import roomsReducer from './slices/roomsSlice';
import occupancyReducer from './slices/reportSlice';
export const store = configureStore({
  reducer: {
    signIn: signinReducer,
    rooms: roomsReducer,
    occupancy: occupancyReducer,
  },
  devTools: process.env.NODE_ENV !== 'production', 
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
