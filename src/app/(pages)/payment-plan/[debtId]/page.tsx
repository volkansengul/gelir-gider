'use client';
/* react */
import { useEffect } from 'react';
/* redux */
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import type { AppDispatch } from '@/redux/store';
import { fetchDebt } from '@/redux/slices/debtSlice';
import { fetchPaymentPlan } from '@/redux/slices/paymentPlanSlice';
/* lib */
import formatToTurkishLira from '@/lib/moneyFormatter';
/* types */
import { Installment } from '@/types';
/* component */
import { PaymentPlanList, Header, Loading } from '@/components';

const PaymentPlanPage: React.FC<{ params: any }> = ({ params: { debtId } }) => {
	const dispatch = useDispatch<AppDispatch>();

	const { loading, status, error, single } = useSelector(
		(state: RootState) => state.debt
	);
	const { list, status: listStatus } = useSelector(
		(state: RootState) => state.paymentPlan
	);

	const getList = () => {
		dispatch(fetchPaymentPlan(debtId));
		dispatch(fetchDebt(debtId));
	};

	useEffect(() => {
		getList();
	}, []);

	const {
		debtName,
		lenderName,
		description,
		debtAmount,
		amount,
		installment,
		interestRate,
	} = single;

	const _debtAmount = formatToTurkishLira(debtAmount);
	const _amount = formatToTurkishLira(amount);
	const debtInterest = formatToTurkishLira(amount - debtAmount);

	let paidInstallments = 0;
	let unpaidDebt = 0;

	list?.forEach((item: Installment) => {
		if (!item.isPaid) {
			unpaidDebt += item.paymentAmount;
		} else {
			paidInstallments += 1;
		}
	});

	const unpaidDebtAmount = formatToTurkishLira(unpaidDebt);

	return (
		<div className={'w-full px-2 flex flex-col'}>
			<Header title={'Ödeme Planı'} link={'/debt'} />
			{loading && (
				<div className='flex items-center justify-center gap-3 flex-1'>
					<Loading />
					Yükleniyor
				</div>
			)}

			{(status === 'error' || listStatus === 'error') && (
				<div
					className={
						'flex flex-col items-center justify-center flex-1 text-center'
					}
				>
					<span className={'w-2/3 text-red-500'}>
						Beklenmedik bir durum oluştu, lütfen daha sonra tekrar
						deneyin
					</span>

					<button onClick={getList} className={'btn-outline mt-4'}>
						Tekrar Dene
					</button>
				</div>
			)}

			{status === 'ready' && listStatus === 'ready' && (
				<>
					<div
						className={
							'flex justify-between items-end pb-4 gap-3 border-b border-black/10 dark:border-white/20'
						}
					>
						<div className={'flex flex-col'}>
							<span>{debtName}</span>
							<span
								className={
									'text-zinc-400  dark:text-zinc-300 text-sm'
								}
							>
								( {lenderName} )
							</span>
							<span className={'text-zinc-500 text-xs'}>
								{description}
							</span>
						</div>

						<div
							className={
								'flex flex-col text-right gap-1 items-end'
							}
						>
							<span className={'text-xs text-zinc-500'}>
								Kalan Borç
							</span>
							<span className={'text-xs text-zinc-500'}>
								({installment - paidInstallments}/{installment}{' '}
								Taksit)
							</span>
							<span
								className={
									'font-mono tabular-nums whitespace-nowrap'
								}
							>
								{unpaidDebtAmount.lira},
								<small>{unpaidDebtAmount.kurus}</small>
							</span>
						</div>
					</div>

					<div
						className={
							'flex flex-col flex-1 scroll overflow-y-auto'
						}
					>
						<PaymentPlanList installments={list} />
					</div>

					<div
						className={
							'py-6 border-t border-black/10 dark:border-white/20'
						}
					>
						<div className={'flex'}>
							<div className={'flex flex-col flex-1'}>
								<span className={'text-sm  text-zinc-500'}>
									Ana Para
								</span>
								<span
									className={
										'font-mono tabular-nums whitespace-nowrap'
									}
								>
									{_debtAmount.lira},
									<small>{_debtAmount.kurus}</small>
								</span>
							</div>
							<div className={'flex flex-col flex-1'}>
								<span className={'text-sm text-zinc-500'}>
									Faiz (%{interestRate})
								</span>
								<span
									className={
										'font-mono tabular-nums whitespace-nowrap'
									}
								>
									{debtInterest.lira},
									<small>{debtInterest.kurus}</small>
								</span>
							</div>
							<div className={'flex flex-col flex-1'}>
								<span className={'text-sm text-zinc-500'}>
									Toplam Borç
								</span>
								<span
									className={
										'font-mono tabular-nums whitespace-nowrap'
									}
								>
									{_amount.lira},
									<small>{_amount.kurus}</small>
								</span>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default PaymentPlanPage;
