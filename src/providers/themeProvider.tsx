'use client';
import { ThemeProvider } from 'next-themes';
import { useEffect, useState } from 'react';

const WithThemeProvider = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return <>{children}</>;
	}

	return <ThemeProvider>{children}</ThemeProvider>;
};

export default WithThemeProvider;
