import { cookies } from 'next/headers';
const API_BASE_URL = process.env.API_BASE_URL;

const callApi = async (uri: string, options: RequestInit) => {
	try {
		options.headers = {
			'Content-Type': 'application/json',
		};

		const cookieStore = cookies();
		const cookie = cookieStore.get('token');
		if (cookie) {
			const token = cookie.value;
			options.headers['Authorization'] = `Bearer ${token}`;
		}
		const response = await fetch(`${API_BASE_URL}/${uri}`, options);
		const data = await response.json();
		return data;
	} catch (error) {
		return { status: 'error' };
	}
};

const api = {
	get: (endpoint: string) => {
		return callApi(endpoint, {
			method: 'GET',
		});
	},
	post: (endpoint: string, payload?: any) => {
		return callApi(endpoint, {
			method: 'POST',
			body: JSON.stringify(payload),
		});
	},
	put: (endpoint: string, payload?: any) => {
		return callApi(endpoint, {
			method: 'PUT',
			body: JSON.stringify(payload),
		});
	},
	delete: (endpoint: string) => {
		return callApi(endpoint, {
			method: 'DELETE',
		});
	},
};

export default api;
