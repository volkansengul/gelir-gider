/* types */
import { Installment } from '@/types';
/* component */
import InstallmentItem from './InstallmentItem';

const PaymentPlanList = ({ installments }: { installments: Installment[] }) => {
	return (
		<ul className={'w-full'}>
			{installments?.map((item, i) => {
				return (
					<InstallmentItem
						key={`installment_${i}`}
						i={i + 1}
						item={item}
					/>
				);
			})}
		</ul>
	);
};

export default PaymentPlanList;
