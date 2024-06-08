import api from '../api';
import { Debt } from '@/types';

const debtUpdateService = async (debtId: string, formData: Debt) => {
	const response = await api.put(`finance/debt/${debtId}`, formData);
	return response;
};

export default debtUpdateService;
