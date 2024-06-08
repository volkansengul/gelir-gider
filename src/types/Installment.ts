interface Installment {
	id?: string;
	debtId?: string;
	paymentDate: string;
	paymentAmount: number;
	isPaid: boolean | 'loading';
}
export default Installment;
