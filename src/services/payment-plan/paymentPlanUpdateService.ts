import api from '../api';
import { Installment } from '@/types';

const paymentPlanUpdateService = async (id: string, formData: Installment) => {
	return await api.put(`finance/payment-plans/${id}`, formData);
};

export default paymentPlanUpdateService;
