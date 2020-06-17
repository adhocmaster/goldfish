import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import userReducer from '../features/user/User.reducer';
import ItemReducer from '../features/item/item.reducer';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    userState: userReducer,
    itemState: ItemReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
