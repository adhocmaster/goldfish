import { createStore, configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import userReducer from '../features/user/User.reducer';
import ItemReducer from '../features/item/item.reducer';
import CategoryReducer from '../features/category/category.reducer';
import YearReducer from '../features/year/year.reducer';
import WeekSummaryReducer from '../features/week/WeekSummary.reducer';

export const store = configureStore({
  reducer: {
    userState: userReducer,
    itemState: ItemReducer,
    categoryState: CategoryReducer,
    yearState: YearReducer,
    weekSummaryState: WeekSummaryReducer,
    
  },
});

const rootReducer = combineReducers({
  userState: userReducer,
  itemState: ItemReducer,
  categoryState: CategoryReducer,
  weekSummaryState: WeekSummaryReducer,
  
});
// export const store = createStore(rootReducer, enhancer);


export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
