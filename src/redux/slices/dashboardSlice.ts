import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { debtListService, debtGetService } from '@/services';
import { Debt, Installment } from '@/types';

interface DebtState {
	status: string;
	error: string | null;
	list: Debt[];
	totalDebt: number;
	paidDebt: number;
	expiredDebt: number;
	thisMonthDebt: number;
	thisMonthPaid: number;
	upcomingInstallments: any;
	expiredInstallments: any;
}

const initialState: DebtState = {
	status: 'init',
	error: null,
	list: [],
	totalDebt: 0,
	paidDebt: 0,
	expiredDebt: 0,
	thisMonthDebt: 0,
	thisMonthPaid: 0,
	upcomingInstallments: [],
	expiredInstallments: [],
};

export const fetchDashboard = createAsyncThunk(
	'dashboard/fetchAll',
	async (_, { rejectWithValue }) => {
		try {
			const response = await debtListService();
			const debtList: any = [];
			const expiredList: any = [];
			const upcomingList: any = [];
			let totalDebt = 0;
			let paidDebt = 0;
			let expiredDebt = 0;

			let date = new Date();
			let thisMonth = date.getMonth() + 1;
			let thisYear = date.getFullYear();

			date.setMonth(thisMonth + 1);
			let nextMonth = date.getMonth() + 1;

			let thisMonthDebt = 0;
			let thisMonthPaid = 0;

			let nextMonthDebt = 0;
			let nextMonthPaid = 0;

			if (response && response?.status === 'success') {
				await response?.data?.reduce(
					async (promise: any, item: any) => {
						await promise;
						const resp = await debtGetService(item.id);
						if (resp?.status === 'success' && resp?.data) {
							debtList.push(resp.data);
							totalDebt += resp.data.amount;

							resp.data?.paymentPlan?.forEach((_item: any) => {
								_item.debtName = item.debtName;

								let _date = new Date(_item.paymentDate);
								let _isExpired =
									_date < new Date() && !_item.isPaid;
								let _month = _date.getMonth() + 1;
								let _year = _date.getFullYear();

								let isThisMonthInstallment =
									thisMonth === _month && thisYear === _year;
								if (isThisMonthInstallment) {
									thisMonthDebt += _item.paymentAmount;
									if (!_item.isPaid && !_isExpired) {
										upcomingList.push(_item);
									}
								}

								if (_isExpired) {
									expiredDebt += _item.paymentAmount;
									expiredList.push(_item);
								} else if (_item.isPaid) {
									paidDebt += _item.paymentAmount;
									if (isThisMonthInstallment) {
										thisMonthPaid += _item.paymentAmount;
									}
								}
							});
						} else {
							return rejectWithValue('failed');
						}
					},
					Promise.resolve()
				);
			} else {
				return rejectWithValue('failed');
			}
			return {
				list: debtList,
				totalDebt: totalDebt,
				paidDebt: paidDebt,
				expiredDebt: expiredDebt,
				thisMonthDebt: thisMonthDebt,
				thisMonthPaid: thisMonthPaid,
				expiredList: expiredList,
				upcomingList: upcomingList,
			};
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

const dashboardSlice = createSlice({
	name: 'debt',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchDashboard.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(fetchDashboard.fulfilled, (state, action) => {
				state.status = 'ready';
				state.list = action.payload.list;
				state.totalDebt = action.payload.totalDebt;
				state.paidDebt = action.payload.paidDebt;
				state.expiredDebt = action.payload.expiredDebt;
				state.thisMonthDebt = action.payload.thisMonthDebt;
				state.thisMonthPaid = action.payload.thisMonthPaid;

				state.expiredInstallments = action.payload.expiredList;
				state.upcomingInstallments = action.payload.upcomingList;
			})
			.addCase(fetchDashboard.rejected, (state) => {
				state.status = 'error';
			});
	},
});

export const {} = dashboardSlice.actions;
export default dashboardSlice.reducer;
