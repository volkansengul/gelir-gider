import api from '../api';

const paymentPlanListService = async (id: string) => {
	const response = await api.get(`finance/payment-plans/${id}`);
	return response;
};

export default paymentPlanListService;
