interface PaymentPlanResponse {
	paymentDate: string;
	paymentAmount: number;
}

const paymentPlan = {
	create: (
		amount: number,
		installment: number,
		startDate: string
	): PaymentPlanResponse[] => {
		const [year, month, day] = startDate.split('-').map(Number);
		let plan: PaymentPlanResponse[] = [];

		for (let i = 0; i < installment; i++) {
			let date = new Date(year, month - 1, day);
			date.setMonth(date.getMonth() + i);
			let [d, m, y] = date
				.toLocaleDateString('tr-TR')
				.split('.')
				.map(String);
			plan.push({
				paymentAmount: parseFloat((amount / installment).toFixed(2)),
				paymentDate: `${y}-${m}-${d}`,
			});
		}

		return plan;
	},
};
export default paymentPlan;
