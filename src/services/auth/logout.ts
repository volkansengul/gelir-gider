import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function logoutService() {
	cookies().delete('token');
	redirect('/login');
}
