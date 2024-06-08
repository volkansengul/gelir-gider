import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
	debtListService,
	debtGetService,
	debtCreateService,
	debtUpdateService,
} from '@/services';
import { Debt, Installment } from '@/types';

interface DebtState {
	status: string;
	formStatus: string;
	formError: string | null;
	loading: boolean;
	error: string | null;
	list: Debt[];
	single: Debt;
}

const initialState: DebtState = {
	status: 'init',
	loading: false,
	error: null,
	list: [],
	single: {
		debtName: '',
		lenderName: '',
		debtAmount: 0,
		amount: 0,
		installment: 0,
		interestRate: 0,
		paymentStart: new Date().toLocaleString('tr-TR'),
		description: '',
		paymentPlan: [],
	},
	formStatus: 'init',
	formError: null,
};

export const createDebt = createAsyncThunk(
	'debt/create',
	async (data: Debt, { rejectWithValue }) => {
		try {
			const response = await debtCreateService(data);
			return response;
		} catch (err: any) {
			return rejectWithValue(err);
		}
	}
);
export const updateDebt = createAsyncThunk(
	'debt/update',
	async (payload: { debtId: string; data: Debt }, { rejectWithValue }) => {
		try {
			const response = await debtUpdateService(
				payload.debtId,
				payload.data
			);
			return response;
		} catch (err: any) {
			return rejectWithValue(err);
		}
	}
);

export const fetchDebts = createAsyncThunk(
	'debt/fetchAll',
	async (_, { rejectWithValue }) => {
		try {
			const response = await debtListService();
			return response;
		} catch (err: any) {
			return rejectWithValue(err);
		}
	}
);

export const fetchDebt = createAsyncThunk(
	'debt/fetch',
	async (debtId: string, { rejectWithValue }) => {
		try {
			const response = await debtGetService(debtId);
			return response;
		} catch (err: any) {
			return rejectWithValue(err);
		}
	}
);

const debtSlice = createSlice({
	name: 'debt',
	initialState,
	reducers: {
		formReset(state) {
			state.formStatus = 'init';
			state.formError = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchDebts.pending, (state) => {
				state.status = 'loading';
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchDebts.fulfilled, (state, action) => {
				state.status = 'ready';
				state.loading = false;
				if (action.payload?.status === 'error') {
					state.status = 'error';
				} else if (
					action.payload?.status === 'success' &&
					action.payload?.data
				) {
					state.list = action.payload.data;
				}
			})
			.addCase(fetchDebts.rejected, (state) => {
				state.status = 'error';
				state.loading = false;
			})
			.addCase(fetchDebt.pending, (state) => {
				state.status = 'loading';
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchDebt.fulfilled, (state, action) => {
				state.status = 'ready';
				state.loading = false;
				if (action.payload?.status === 'error') {
					state.status = 'error';
				} else if (
					action.payload?.status === 'success' &&
					action.payload?.data
				) {
					const [d, m, y] = new Date(action.payload.data.paymentStart)
						.toLocaleString('tr-TR')
						.split(' ')[0]
						.split('.')
						.map(String);
					action.payload.data.paymentStart = `${d}-${m}-${y}`;
					state.single = action.payload.data;
				}
			})
			.addCase(fetchDebt.rejected, (state, action) => {
				state.status = 'error';
				state.loading = false;
			})
			.addCase(createDebt.pending, (state, action) => {
				state.formStatus = 'pending';
			})
			.addCase(createDebt.fulfilled, (state, action) => {
				state.formError = null;
				if (action.payload?.status === 'success') {
					state.formStatus = 'success';
				} else if (action.payload?.status === 'error') {
					state.formStatus = 'error';
					state.formError =
						(action.payload?.data &&
							typeof action.payload.data === 'string') ||
						'Sıradışı bir durum oluştu, tekrar deneyin';
				}
			})
			.addCase(updateDebt.pending, (state, action) => {
				state.formStatus = 'pending';
			})
			.addCase(updateDebt.fulfilled, (state, action) => {
				state.formError = null;
				if (action.payload?.status === 'success') {
					state.formStatus = 'success';
				} else if (action.payload?.status === 'error') {
					state.formStatus = 'error';
					state.formError =
						(action.payload?.data &&
							typeof action.payload.data === 'string') ||
						'Sıradışı bir durum oluştu, tekrar deneyin';
				}
			})
			.addCase(updateDebt.rejected, (state, action) => {
				state.formStatus = 'error';
				state.formError = 'Sıradışı bir durum oluştu, tekrar deneyin';
			});
	},
});

export const { formReset } = debtSlice.actions;
export default debtSlice.reducer;
