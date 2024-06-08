import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { paymentPlanListService, paymentPlanUpdateService } from '@/services';
import { Installment } from '@/types';

interface PaymentPlanState {
	status: string;
	formStatus: string;
	formError: string | null;
	loading: boolean;
	error: string | null;
	list: Installment[];
}

const initialState: PaymentPlanState = {
	status: 'init',
	loading: false,
	error: null,
	list: [],
	formStatus: 'init',
	formError: null,
};

export const updatePaymentPlan = createAsyncThunk(
	'paymentPlan/update',
	async (payload: { debtId: string; data: Installment }) => {
		const response = await paymentPlanUpdateService(
			payload.debtId,
			payload.data
		);
		return response;
	}
);

export const fetchPaymentPlan = createAsyncThunk(
	'paymentplan/fetchAll',
	async (id: string) => {
		const response = await paymentPlanListService(id);
		return response;
	}
);

const paymentPlanSlice = createSlice({
	name: 'paymentPlan',
	initialState,
	reducers: {
		formReset(state, action: PayloadAction<any>) {
			(state.formStatus = 'init'), (state.formError = null);
		},
		getDebts(state, action: PayloadAction<{ list: [] }>) {
			state.list = action.payload.list;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchPaymentPlan.pending, (state) => {
				state.status = 'loading';
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchPaymentPlan.fulfilled, (state, action) => {
				state.status = 'ready';
				state.loading = false;
				if (action.payload?.status === 'error') {
					state.status = 'error';
					state.error = 'hata';
				} else if (
					action.payload?.status === 'success' &&
					action.payload?.data
				) {
					state.list = action.payload.data;
				}
			})
			.addCase(fetchPaymentPlan.rejected, (state, action) => {
				state.status = 'failed';
				state.loading = false;
			})
			.addCase(updatePaymentPlan.pending, (state, action) => {
				const index = state.list.findIndex(
					(item) => item.id === action.meta.arg.debtId
				);
				if (index !== -1) {
					state.list[index].isPaid = 'loading';
				}
			})
			.addCase(updatePaymentPlan.fulfilled, (state, action) => {
				if (action.payload?.status === 'success') {
					const index = state.list.findIndex(
						(item) => item.id === action.payload.data.id
					);
					if (index !== -1) {
						state.list[index].isPaid = action.payload.data.isPaid;
					}
				}
			});
	},
});

export const {} = paymentPlanSlice.actions;
export default paymentPlanSlice.reducer;
