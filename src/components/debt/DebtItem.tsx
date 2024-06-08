/* next */
import Link from 'next/link';
/* 3rd party */
import {
	MdCheckBoxOutlineBlank,
	MdCheckBox,
	MdEditDocument,
	MdReadMore,
} from 'react-icons/md';
/* utils */
import formatToTurkishLira from '@/lib/moneyFormatter';

const debtItem = ({ item }: { item: any }) => {
	const isAllPaid = !item.isActive;

	const debtAmount = formatToTurkishLira(item.debtAmount);

	return (
		<li
			className={`${
				isAllPaid ? 'opacity-50' : ''
			} flex items-center gap-2 border-b border-black/10 dark:border-white/10`}
		>
			<div
				className={
					'border-r border-black/10 dark:border-white/10 px-2 py-2'
				}
			>
				{isAllPaid ? (
					<span className={'text-green-500'}>
						<MdCheckBox />
					</span>
				) : (
					<span className={'text-zinc-700'}>
						<MdCheckBoxOutlineBlank />
					</span>
				)}
			</div>

			<div className={'flex flex-col py-2 px-2 w-32'}>
				<span
					className={
						'font-medium text-sm truncate overflow-hidden leading-tight text-zinc-500 dark:text-zinc-300'
					}
				>
					{item.debtName}
				</span>
				<span
					className={
						'text-xs truncate overflow-hidden text-zinc-400 dark:text-zinc-500'
					}
				>
					{item.lenderName} askdl akld aljakld jalkjdkal asdklja
				</span>
			</div>

			<div className={'ml-auto flex flex-col py-2 pr-2 items-end'}>
				<span
					className={
						'text-sm font-mono tabular-nums whitespace-nowrap'
					}
				>
					{debtAmount.lira},<small>{debtAmount.kurus}</small>
				</span>

				<span
					className={'text-xs flex items-center gap-2 text-zinc-500'}
				>
					{item?.installment} Taksit
				</span>
			</div>

			<div className={'flex gap-2'}>
				<Link href={`/debt/edit/${item.id}`}>
					<button className={'btn-dark btn-circle'}>
						<MdEditDocument />
					</button>
				</Link>
				<Link href={`/payment-plan/${item.id}`}>
					<button className={'btn-dark btn-circle'}>
						<MdReadMore />
					</button>
				</Link>
			</div>
		</li>
	);
};
export default debtItem;
