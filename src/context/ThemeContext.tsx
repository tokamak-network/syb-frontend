'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'dim';

interface ThemeContextType {
	theme: Theme;
	setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [theme, setTheme] = useState<Theme>('light'); // Default theme is 'light'

	return (
		<ThemeContext.Provider value={{ theme, setTheme }}>
			<div className={`theme-${theme}`}>{children}</div>{' '}
		</ThemeContext.Provider>
	);
};

export const useTheme = () => {
	const context = useContext(ThemeContext);

	if (!context) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}

	return context;
};
