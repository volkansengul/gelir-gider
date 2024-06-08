interface PaymentPlan {
	paymentDate: string;
	paymentAmount: number;
}

interface Debt {
	debtName: string;
	lenderName: string;
	debtAmount: number;
	interestRate: number;
	amount: number;
	paymentStart: string;
	installment: number;
	description: string;
	installmentAmount?: string;
	paymentPlan: PaymentPlan[];
}

export default Debt;
