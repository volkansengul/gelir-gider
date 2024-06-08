'use client';
/* next */
import { useRouter } from 'next/navigation';
/* component */
import { DebtForm, Header } from '@/components';

const AddDebt: React.FC = () => {
	const router = useRouter();

	const handleSuccess = () => {
		router.push('/debt');
	};

	return (
		<div className='px-2 flex flex-1 flex-col'>
			<Header title='Borç Oluştur' link='/debt' />
			<div className='flex flex-1 items-center justify-center'>
				<DebtForm onSuccess={handleSuccess} />
			</div>
		</div>
	);
};

export default AddDebt;
