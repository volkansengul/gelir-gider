'use client';
/* react */
import { useState, useEffect } from 'react';
import { useFormState } from 'react-dom';
/* next */
import { useRouter } from 'next/navigation';
import Link from 'next/link';
/* 3rd party */
import { useForm, SubmitHandler } from 'react-hook-form';
import { MdMailOutline, MdLock } from 'react-icons/md';
/* component */
import { Icon } from '@/components';
/* service */
import { loginService } from '@/services';

interface IFormInput {
	email: string;
	password: string;
}

const LoginForm: React.FC = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<IFormInput>();

	const [state, formAction] = useFormState(loginService, null);
	const [pending, setPending] = useState(false);
	const router = useRouter();

	const onSubmit: SubmitHandler<IFormInput> = (data) => {
		setPending(true);
		formAction(data);
	};

	useEffect(() => {
		if (state?.status === 'success') {
			router.push('/dashboard');
		} else if (pending) {
			setPending(false);
		}
	}, [state]);

	const error = state?.status === 'error';
	const errorMessage = state?.message || 'Somethings went wrong';

	return (
		<form onSubmit={handleSubmit(onSubmit)} className='mx-auto'>
			<span className={'logo mx-auto mb-8'}>
				<Icon name={'logo'} />
			</span>
			<h2 className='text-2xl font-bold mb-4 text-center'>Giriş Yap</h2>

			{error && (
				<div
					className={
						'bg-red-700/80 rounded-lg text-white text-center text-sm py-1 mb-4'
					}
				>
					{errorMessage}
				</div>
			)}

			<div className={'mb-4 formRow'}>
				<div className={`leftIcon ${errors.email ? 'error' : ''}`}>
					<MdMailOutline />
					<input
						className={'pl-10'}
						{...register('email', {
							required: 'Lütfen e-posta adresinizi girin',
							pattern: {
								value: /^\S+@\S+$/i,
								message: 'Lütfen geçerli bir e-posta girin',
							},
						})}
						type='text'
						placeholder={'E-posta'}
					/>
				</div>

				{errors?.email?.message && (
					<div className={'errorMessage'}>{errors.email.message}</div>
				)}
			</div>
			<div className='mb-4 formRow'>
				<div className={`leftIcon ${errors.password ? 'error' : ''}`}>
					<MdLock />
					<input
						{...register('password', {
							required: 'Lütfen bir şifre girin',
						})}
						type={'password'}
						className={'pl-10'}
						placeholder={'Parola'}
					/>
				</div>
				{errors?.password?.message && (
					<div className={'errorMessage'}>
						{errors.password.message}
					</div>
				)}
			</div>

			<button
				type='submit'
				disabled={pending}
				className={`w-full btn-primary`}
			>
				{pending ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
			</button>

			<div className={'mt-4 text-center'}>
				Bir hesabın yok mu? <Link href={'/register'}>Kayıt ol</Link>
			</div>
		</form>
	);
};

export default LoginForm;
