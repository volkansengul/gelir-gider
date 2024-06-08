/* next */
import Link from 'next/link';
/* component */
import DebtItem from './DebtItem';
/* types */
import { Debt } from '@/types';

const DebtList = ({ debts }: { debts: Debt[] }) => {
	if (debts.length === 0) {
		return (
			<div className={'flex flex-col flex-1 items-center justify-center'}>
				<p>Tebrikler borcunuz bulunmuyor.</p>
				<p>
					Eklemek için <Link href={'/debt/add'}>tıklayın</Link>
				</p>
			</div>
		);
	}

	return (
		<ul className={'w-full'}>
			{debts?.map((item, i) => {
				return <DebtItem key={`debtRow_${i}`} item={item} />;
			})}
		</ul>
	);
};

export default DebtList;
