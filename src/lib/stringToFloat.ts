const stringToFloat = (str: any) => {
	try {
		if (str === null || str === undefined || str === false) return 0;
		if (typeof str !== 'string') return str;
		return parseFloat(
			str
				.replace('.', '')
				.replace(',', '.')
				.replace('₺', '')
				.replace('%', '')
				.trim()
		);
	} catch (e) {}
};
export default stringToFloat;
