import api from '../api';

const debtGetService = async (id: string) => {
	const response = await api.get(`finance/debt/${id}`);
	return response;
};

export default debtGetService;
