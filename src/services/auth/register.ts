import { cookies } from 'next/headers';
import api from '../api';

interface RegisterResponse {
	status: string;
	data?: any;
	message?: string;
}

export default async function registerService(
	prevState: any,
	formData: {
		name: string;
		email: string;
		password: string;
	}
): Promise<RegisterResponse> {
	try {
		const { name, email, password } = formData;
		const response = await api.post('auth/register', {
			name,
			email,
			password,
		});
		if (response?.status === 'success') {
			cookies().set('token', response.data);
			return { status: 'success', message: response.data };
		} else {
			return {
				status: 'error',
				message: response?.data || 'Bir hata meydana geldi',
			};
		}
	} catch (error: any) {
		return {
			status: 'error',
			message: 'Beklenmedik bir hata meydana geldi',
		};
	}
}
