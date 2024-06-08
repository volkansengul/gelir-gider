/* next */
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
/* 3rd party */
import { MdArrowRightAlt } from 'react-icons/md';
/* component */
import { Icon } from '@/components';

const HomePage: React.FC = () => {
	const token = cookies().get('token')?.value;
	if (token) redirect('/dashboard');
	return (
		<div className={'w-full pt-24 px-12'}>
			<div>
				<span className={'logo'}>
					<Icon name={'logo'} />
				</span>
				<h1 className={'text-lg mt-6 mb-4'}>
					<strong>Giderlerim</strong>, uygulamasına hoş geldin.
				</h1>
				<div className={'mt-4'}>
					Gelir ve giderlerini takip et. Mali sağlığını denetle.
				</div>

				<div className={'flex gap-3 mt-4'}>
					<Link href={'/register'}>
						<button className={'btn-primary'}>
							Hemen kaydol <MdArrowRightAlt />
						</button>
					</Link>

					<Link href={'/login'}>
						<button className={'btn-outline'}>Giriş yap</button>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default HomePage;
