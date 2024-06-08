import api from '../api';

const debtListService = async () => {
	const response = await api.get(`finance/debt`);
	return response;
};

export default debtListService;
