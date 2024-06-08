interface FormattedCurrency {
	lira: string;
	kurus: string;
}

export default function formatToTurkishLira(value: number): FormattedCurrency {
	const [lira, kurus] = value.toFixed(2).split('.');

	const formattedLira = Number(lira).toLocaleString('tr-TR', {
		style: 'currency',
		currency: 'TRY',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	});

	return {
		lira: formattedLira,
		kurus: kurus,
	};
}
