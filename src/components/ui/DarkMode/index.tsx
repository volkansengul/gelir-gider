'use client';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { MdSunny, MdOutlineDarkMode, MdContrast } from 'react-icons/md';
import styles from './style.module.css';

const DarkMode = () => {
	const [mounted, setMounted] = useState(false);
	const { theme, setTheme } = useTheme();

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	const toggle = () => {
		if (theme === 'dark') {
			setTheme('light');
		} else {
			setTheme('dark');
		}
	};

	const getTheme = () => {
		switch (theme) {
			case 'dark':
				return styles.dark;
			case 'light':
				return styles.light;
			case 'system':
				return styles.system;
			default:
				return styles.system;
		}
	};

	return (
		<>
			<span className={`darkModeToggle ${getTheme()}`} onClick={toggle}>
				{theme === 'light' && <MdSunny />}
				{theme === 'dark' && <MdOutlineDarkMode />}
				{theme === 'system' && <MdContrast />}
			</span>
		</>
	);
};

export default DarkMode;
