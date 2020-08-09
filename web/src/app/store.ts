import { createStore, configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import userReducer from '../features/user/user.reducer';
import ItemReducer from '../features/item/item.reducer';
import GoalReducer from '../features/goal/goal.reducer';
import YearReducer from '../features/year/year.reducer';
import WeekSummaryReducer from '../features/week/weekSummary.reducer';
import WeekReducer from '../features/week/week.reducer';
import SettingsReducer from 'account/settings.reducer';

export const store = configureStore({
  reducer: {
    userState: userReducer,
    itemState: ItemReducer,
    categoryState: GoalReducer,
    yearState: YearReducer,
    weekSummaryState: WeekSummaryReducer,
    settingsState: SettingsReducer,
    weekState: WeekReducer,

  },
});

const rootReducer = combineReducers({
  userState: userReducer,
  itemState: ItemReducer,
  categoryState: GoalReducer,
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
