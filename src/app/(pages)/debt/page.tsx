'use client';
/* next */
import Link from 'next/link';
/* react */
import { useEffect } from 'react';
/* redux */
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import type { AppDispatch } from '@/redux/store';
import { fetchDebts } from '@/redux/slices/debtSlice';
/* 3rd party */
import { MdAdd } from 'react-icons/md';
/* component */
import { DebtList, Header, Loading } from '@/components';

const DebtsPage: React.FC = () => {
	const dispatch = useDispatch<AppDispatch>();
	const { loading, status, list } = useSelector(
		(state: RootState) => state.debt
	);

	const getList = () => {
		dispatch(fetchDebts());
	};
	useEffect(() => {
		getList();
	}, [dispatch]);

	return (
		<div className={'w-full px-2 flex flex-col'}>
			<Header title={'Borçlar'} link={'/dashboard'} />

			{loading && (
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
					<div className='flex flex-col flex-1 scroll overflow-y-auto'>
						<DebtList debts={list} />
					</div>
					<div className='flex justify-end w-full mb-4'>
						<Link href='/debt/add'>
							<button className='btn-primary btn-circle btn-circle-lg'>
								<MdAdd />
							</button>
						</Link>
					</div>
				</>
			)}
		</div>
	);
};

export default DebtsPage;
