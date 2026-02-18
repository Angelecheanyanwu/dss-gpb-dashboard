import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserModel {
  email: string;
  name?: string;
  agency_id?: string;
  role?: string;
  [key: string]: any;
}

interface UserState {
  user: UserModel | null;
}

const initialState: UserState = {
  user: null,
};

const userSlice = createSlice({
  name: 'userData',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserModel>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
