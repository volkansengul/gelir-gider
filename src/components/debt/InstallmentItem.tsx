'use client';
/* next */
import Link from 'next/link';
/* 3rd party */
import { MdCheckBoxOutlineBlank, MdCheckBox } from 'react-icons/md';
/* redux */
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/redux/store';
import { updatePaymentPlan } from '@/redux/slices/paymentPlanSlice';
/* utils */
import formatToTurkishLira from '@/lib/moneyFormatter';
/* component */
import { Loading } from '@/components';
/* types */
import { Installment } from '@/types';

const InstallmentItem = ({
	item,
	i,
	debtName,
	external,
}: {
	item: Installment;
	i: number;
	debtName?: string;
	external?: boolean;
}) => {
	const dispatch = useDispatch<AppDispatch>();
	const loading = item.isPaid === 'loading';
	const isPaid = item.isPaid === true;

	const debtAmount = formatToTurkishLira(item.paymentAmount);
	const paymentDate = new Date(item?.paymentDate).toLocaleDateString(
		'tr-TR',
		{
			month: 'long',
			day: 'numeric',
			year: 'numeric',
		}
	);
	const isExpired = !isPaid && new Date(item.paymentDate) < new Date();

	const changePaidStatus = () => {
		const date = new Date(item.paymentDate);
		const y = date.getFullYear();
		const m = date.getMonth() + 1;
		const d = date.getDate();
		const paymentDate = `${y}-${m <= 9 ? `0${m}` : m}-${
			d <= 9 ? `0${d}` : d
		}`;

		dispatch(
			updatePaymentPlan({
				debtId: item.id || '',
				data: {
					paymentAmount: item.paymentAmount,
					paymentDate: paymentDate,
					isPaid: !isPaid,
				},
			})
		);
	};

	return (
		<li
			className={`${
				loading ? 'opacity-50' : ''
			} flex items-center gap-2 border-b border-black/10 dark:border-white/10 cursor-pointer`}
		>
			{!external && (
				<div
					className={
						'border-r border-black/10 dark:border-white/10 px-2 py-2'
					}
					onClick={!loading ? changePaidStatus : () => {}}
				>
					{loading && <Loading />}
					{!loading &&
						(isPaid ? (
							<span className={'text-green-500'}>
								<MdCheckBox />
							</span>
						) : (
							<span className={'text-zinc-700'}>
								<MdCheckBoxOutlineBlank />
							</span>
						))}
				</div>
			)}

			<div className={'flex flex-col py-2 px-2'}>
				<span
					className={
						'font-medium text-base leading-tight text-zinc-400 dark:text-zinc-300'
					}
				>
					{debtName ?? `${i}.Taksit`}
				</span>
				<span
					className={`${
						isExpired
							? 'text-red-500'
							: isPaid
							? 'text-emerald-500'
							: 'text-zinc-500'
					}  text-xs flex items-center gap-2`}
				>
					{isExpired
						? 'gecikmede'
						: isPaid
						? 'ödendi'
						: 'henüz ödenmedi'}
				</span>
			</div>

			<div className={'ml-auto flex flex-col py-2 px-2 items-end'}>
				<span className={'font-mono tabular-nums whitespace-nowrap'}>
					{debtAmount.lira},<small>{debtAmount.kurus}</small>
				</span>

				<span
					className={'text-xs flex items-center gap-2 text-zinc-500'}
				>
					{paymentDate}
				</span>
			</div>

			{external && (
				<Link href={`/payment-plan/${item.debtId}`}>
					<button className={'btn-outline text-xs'}>Öde</button>
				</Link>
			)}
		</li>
	);
};
export default InstallmentItem;
