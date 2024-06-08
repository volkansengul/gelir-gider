const numberToMoneyDecimal = (str: number): string => {
	if (str === null || str === undefined) return '0';
	return str.toFixed(2).replace('.', ',').toString();
};
export default numberToMoneyDecimal;
