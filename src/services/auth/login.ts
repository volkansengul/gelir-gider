import { cookies } from 'next/headers';
import api from '../api';

interface LoginResponse {
	status: string;
	data?: any;
	message?: string;
}

export default async function loginService(
	prevState: any,
	formData: {
		email: string;
		password: string;
	}
): Promise<LoginResponse> {
	try {
		const { email, password } = formData;
		const response = await api.post('auth/login', { email, password });
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
