'use client';
/* react */
import { useEffect } from 'react';
/* next */
import { useRouter } from 'next/navigation';
/* redux */
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import type { AppDispatch } from '@/redux/store';
import { fetchDebt, formReset } from '@/redux/slices/debtSlice';
/* component */
import { DebtForm, Header, Loading } from '@/components';

interface EditDebtProps {
	params: { debtId: string };
}

const EditDebt: React.FC<EditDebtProps> = ({ params: { debtId } }) => {
	const dispatch = useDispatch<AppDispatch>();
	const router = useRouter();
	const { single, loading, status } = useSelector(
		(state: RootState) => state.debt
	);

	const handleSuccess = () => {
		dispatch(formReset());
		router.push('/debt');
	};

	useEffect(() => {
		dispatch(formReset());
		dispatch(fetchDebt(debtId));
	}, [debtId]);

	return (
		<div className='px-4 flex flex-1 flex-col'>
			<Header title='Borç Düzenle' link='/debt' />
			{loading ? (
				<div className='flex items-center justify-center gap-3 flex-1'>
					<Loading />
					Yükleniyor
				</div>
			) : status === 'ready' ? (
				<div className='flex flex-1 items-center justify-center'>
					<DebtForm
						onSuccess={handleSuccess}
						debtId={debtId}
						debtData={single}
					/>
				</div>
			) : null}
		</div>
	);
};

export default EditDebt;
