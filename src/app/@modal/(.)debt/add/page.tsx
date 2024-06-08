'use client';
/* next */
import { useRouter } from 'next/navigation';
/* redux */
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/redux/store';
import { fetchDebts, formReset } from '@/redux/slices/debtSlice';
/* component */
import { DebtForm } from '@/components';

const AddDebt: React.FC = () => {
	const router = useRouter();
	const dispatch = useDispatch<AppDispatch>();

	const handleSuccess = async () => {
		dispatch(formReset());
		await dispatch(fetchDebts());
		router.back();
	};
	return (
		<div className={'w-full px-4 py-4 bg-white dark:bg-zinc-800'}>
			<DebtForm onSuccess={handleSuccess} />
		</div>
	);
};
export default AddDebt;
