import { configureStore } from '@reduxjs/toolkit';
import debtReducer from './slices/debtSlice';
import paymentPlanReducer from './slices/paymentPlanSlice';
import dashboardSlice from './slices/dashboardSlice';

export const store = configureStore({
	reducer: {
		dashboard: dashboardSlice,
		debt: debtReducer,
		paymentPlan: paymentPlanReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
