'use client';
/* react */
import { useState, useEffect, useRef } from 'react';
import { useFormState } from 'react-dom';
/* next */
import { useRouter } from 'next/navigation';
import Link from 'next/link';
/* 3rd party */
import { useForm, SubmitHandler } from 'react-hook-form';
import { MdMailOutline, MdLock, MdPerson } from 'react-icons/md';
/* component */
import { Icon } from '@/components';
/* service */
import { registerService } from '@/services';

interface IFormInput {
	name: string;
	email: string;
	password: string;
	passwordConfirm: string;
}

const RegisterForm: React.FC = () => {
	const {
		register,
		watch,
		handleSubmit,
		formState: { errors },
	} = useForm<IFormInput>();

	const [state, formAction] = useFormState(registerService, null);
	const [pending, setPending] = useState(false);
	const router = useRouter();

	const watchPassword = watch('password', '');

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
			<h2 className='text-2xl font-bold mb-4 text-center'>Kayıt Ol</h2>

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
				<div className={`leftIcon ${errors.name ? 'error' : ''}`}>
					<MdPerson />
					<input
						className={'pl-10'}
						{...register('name', {
							required: 'Lütfen adınızı girin',
							minLength: {
								value: 3,
								message: 'Lütfen geçerli bir isim girin',
							},
						})}
						type='text'
						placeholder={'Adınız'}
					/>
				</div>

				{errors?.name?.message && (
					<div className={'errorMessage'}>{errors.name.message}</div>
				)}
			</div>

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
						className={'pl-10'}
						{...register('password', {
							required: 'Lütfen bir şifre girin',
							minLength: {
								value: 6,
								message:
									'Şifreniz en az 6 karakterden oluşmalı',
							},
							maxLength: {
								value: 12,
								message:
									'Şifreniz en fazla 12 karakterden oluşmalı',
							},
						})}
						type={'password'}
						placeholder={'Parola'}
					/>
				</div>
				{errors?.password?.message && (
					<div className={'errorMessage'}>
						{errors.password.message}
					</div>
				)}
			</div>

			<div className='mb-4 formRow'>
				<div
					className={`leftIcon ${
						errors.passwordConfirm ? 'error' : ''
					}`}
				>
					<MdLock />
					<input
						{...register('passwordConfirm', {
							validate: (validate) =>
								validate === watchPassword ||
								'Şifreler uyuşmuyor',
							required: 'Lütfen bir şifre girin',
							minLength: {
								value: 6,
								message:
									'Şifreniz en az 6 karakterden oluşmalı',
							},
							maxLength: {
								value: 12,
								message:
									'Şifreniz en fazla 12 karakterden oluşmalı',
							},
						})}
						type={'password'}
						className={'pl-10'}
						placeholder={'Parola Doğrula'}
					/>
				</div>
				{errors?.passwordConfirm?.message && (
					<div className={'errorMessage'}>
						{errors.passwordConfirm.message}
					</div>
				)}
			</div>

			<button
				type='submit'
				disabled={pending}
				className={`w-full btn-primary`}
			>
				{pending ? 'Kayıt olunuyor...' : 'Kayıt Ol'}
			</button>

			<div className={'mt-4 text-center'}>
				Bir hesabın var mı? <Link href={'/login'}>Giriş yap</Link>
			</div>
		</form>
	);
};

export default RegisterForm;
