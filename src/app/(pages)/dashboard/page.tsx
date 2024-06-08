'use client';
/* react */
import { useEffect } from 'react';
/* next */
import Link from 'next/link';
/* redux */
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import type { AppDispatch } from '@/redux/store';
import { fetchDashboard } from '@/redux/slices/dashboardSlice';
/* 3rd party */
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
/* lib */
import formatToTurkishLira from '@/lib/moneyFormatter';
import paymentPlan from '@/lib/paymentPlan';
/* component */
import { Header, InstallmentItem, Loading } from '@/components';

ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardPage: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const {
		status,
		list,
		totalDebt,
		paidDebt,
		thisMonthDebt,
		thisMonthPaid,
		expiredDebt,
		expiredInstallments,
		upcomingInstallments,
	} = useSelector((state: RootState) => state.dashboard);

	const getList = () => {
		dispatch(fetchDashboard());
	};
	useEffect(() => {
		getList();
	}, [dispatch]);

	const total = {
		debt: formatToTurkishLira(totalDebt),
		paid: formatToTurkishLira(paidDebt),
		unpaid: formatToTurkishLira(totalDebt - paidDebt),
		expired: formatToTurkishLira(expiredDebt),
	};
	const thisMonth = {
		debt: formatToTurkishLira(thisMonthDebt),
		paid: formatToTurkishLira(thisMonthPaid),
		unpaid: formatToTurkishLira(thisMonthDebt - thisMonthPaid),
	};

	return (
		<div className={'w-full px-2 flex flex-col'}>
			<Header title={'Dashboard'} />

			{status === 'loading' && (
				<div className='flex items-center justify-center gap-3 flex-1'>
					<Loading />
					Yükleniyor
				</div>
			)}

			{status === 'error' && (
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

			{status === 'ready' && (
				<>
					<div
						className={
							'flex w-full gap-5 items-center border-b border-black/10 dark:border-white/10 pb-5'
						}
					>
						<div className={'w-2/6'}>
							<Doughnut
								options={{
									plugins: {
										legend: {
											display: false,
										},
									},
								}}
								data={{
									labels: ['Gecikme', 'Ödenen', 'Kalan'],
									datasets: [
										{
											label: '₺',
											data: [expiredDebt, paidDebt, 0],
											backgroundColor: [
												'rgba(239,68,68,0.8)',
												'rgba(16,185,129,0.8)',
												'rgba(24,24,27,0.5)',
											],
											borderWidth: 0,
										},
									],
								}}
							/>
						</div>
						<div className={'w-4/6 flex flex-col gap-1 text-sm'}>
							<div className={'flex gap-2 justify-between'}>
								<span>Toplam : </span>
								<span
									className={
										'font-mono tabular-nums whitespace-nowrap'
									}
								>
									{total.debt.lira},
									<small>{total.debt.kurus}</small>
								</span>
							</div>

							<div
								className={
									'flex gap-2 justify-between text-red-500'
								}
							>
								<span>Gecikme : </span>
								<span
									className={
										'font-mono tabular-nums whitespace-nowrap'
									}
								>
									{total.expired.lira},
									<small>{total.expired.kurus}</small>
								</span>
							</div>

							<div
								className={
									'flex gap-2 justify-between text-emerald-500'
								}
							>
								<span>Ödenen : </span>
								<span
									className={
										'font-mono tabular-nums whitespace-nowrap'
									}
								>
									{total.paid.lira},
									<small>{total.paid.kurus}</small>
								</span>
							</div>

							<div
								className={
									'flex gap-2 justify-between font-bold'
								}
							>
								<span>Kalan Borç : </span>
								<span
									className={
										'font-mono tabular-nums whitespace-nowrap'
									}
								>
									{total.unpaid.lira},
									<small>{total.unpaid.kurus}</small>
								</span>
							</div>
						</div>
					</div>

					<div
						className={
							'flex items-center justify-between mb-4 border-b border-black/10 dark:border-white/10 py-4 px-2 bg-zinc-100 dark:bg-zinc-900'
						}
					>
						<div>
							<h2 className={'text-sm font-bold'}>Bu Ay</h2>
							<span className={'text-zinc-500 text-sm'}>
								(
								{new Date().toLocaleDateString('tr-TR', {
									month: 'long',
								})}
								)
							</span>
						</div>

						<div className={'flex gap-4'}>
							<div className={'flex flex-col text-emerald-500'}>
								<small>Ödenen:</small>
								<span>
									{thisMonth.paid.lira},
									<small>{thisMonth.paid.kurus}</small>
								</span>
							</div>

							<div className={'flex flex-col'}>
								<small>Kalan:</small>
								<span>
									{thisMonth.unpaid.lira},
									<small>{thisMonth.unpaid.kurus}</small>
								</span>
							</div>
						</div>
					</div>

					<div
						className={
							'mb-2 text-sm font-bold text-center border-b border-dashed border-black/10 dark:border-white/10 pb-2'
						}
					>
						Yaklaşan & Geciken Ödemeler
					</div>
					<div
						className={
							'flex flex-col flex-1 scroll overflow-y-auto'
						}
					>
						{expiredInstallments.length === 0 &&
							upcomingInstallments.length === 0 && (
								<div className={'text-emerald-500'}>
									Harika geciken veya yaklaşan bir ödemeniz
									yok
								</div>
							)}
						{[...expiredInstallments, ...upcomingInstallments].map(
							(item: any, i: number) => {
								return (
									<InstallmentItem
										key={`ex_${item.id}_${i}`}
										i={i}
										debtName={item.debtName}
										item={item}
										external={true}
									/>
								);
							}
						)}
					</div>
					<div className={'py-2'}>
						<Link href={'/debt'}>
							<button className={'btn btn-primary w-full'}>
								Tüm Borçları Gör
							</button>
						</Link>
					</div>
				</>
			)}
		</div>
	);
};
export default DashboardPage;
