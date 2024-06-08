import api from '../api';
import { Debt } from '@/types';

const debtCreateService = async (formData: Debt) => {
	const response = await api.post('finance/debt', formData);
	return response;
};

export default debtCreateService;
