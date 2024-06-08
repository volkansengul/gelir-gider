import api from '../api';

const debtDeleteService = async (debtId: string) => {
	const response = await api.delete(`finance/debt/${debtId}`);
	return response;
};

export default debtDeleteService;
