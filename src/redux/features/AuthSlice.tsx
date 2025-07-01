
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  name: string | null;
  email: string | null;
  id: string | null;
}

const initialState: AuthState = {
  token: null,
  name: null,
  email: null,
  id: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    clearToken: (state) => {
      state.token = null;
      state.name = null;
      state.email = null;
      state.id = null;
    },
    setUserData: (state, action: PayloadAction<{ id: string; name: string; email: string }>) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
    },
    clearUserData: (state) => {
      state.id = null;
      state.name = null;
      state.email = null;
      
    },
  },
});

export const { setToken, clearToken, setUserData, clearUserData } = authSlice.actions;

export default authSlice.reducer;
