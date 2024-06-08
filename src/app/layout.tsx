import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';

import Provider from '@/redux/Provider';

import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Ödemelerim App',
	description: 'Borç yiğidin kamçısı mıdır?',
};

export default function RootLayout({
	children,
	modal,
}: Readonly<{
	children: React.ReactNode;
	modal: React.ReactNode;
}>) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body className={`${inter.className}`}>
				<ThemeProvider attribute={'class'}>
					<div className={'container'}>
						<div className={'h-dvh flex flex-col'}>
							<Provider>
								{modal}
								{children}
							</Provider>
						</div>
					</div>
				</ThemeProvider>
			</body>
		</html>
	);
}
