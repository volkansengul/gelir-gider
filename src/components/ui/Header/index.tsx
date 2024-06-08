'use client';
/* react */
import { useTransition } from 'react';
/* next */
import { useRouter } from 'next/navigation';
/* 3rd party */
import { MdChevronLeft, MdLogout } from 'react-icons/md';
/* service */
import { logoutService } from '@/services';
/* component */
import { DarkMode } from '@/components';

const Header = ({ title, link }: { title: string; link?: string }) => {
	const router = useRouter();
	const [logout, doLogout] = useTransition();

	return (
		<header className={'flex gap-3 mb-10 pt-3'}>
			<button
				className={'btn-dark btn-circle'}
				onClick={() => {
					link ? router.push(link) : router.back();
				}}
			>
				<MdChevronLeft />
			</button>
			<h3
				className={
					'text-md text-zinc-500 dark:text-zinc-400 font-medium'
				}
			>
				{title.toLocaleUpperCase()}
			</h3>

			<DarkMode />

			<button
				onClick={() => {
					doLogout(() => logoutService());
				}}
				className={'btn-dark btn-circle ml-auto'}
			>
				<MdLogout />
			</button>
		</header>
	);
};
export default Header;
