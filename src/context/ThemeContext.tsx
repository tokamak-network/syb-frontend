'use client';

import React, {
	createContext,
	useContext,
	useState,
	ReactNode,
	useEffect,
} from 'react';

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
	const [isHydrated, setIsHydrated] = useState(false);

	useEffect(() => {
		// This ensures the component is hydrated on the client side
		setIsHydrated(true);

		// Check for saved theme in localStorage after hydration
		const savedTheme = localStorage.getItem('theme') as Theme;

		if (savedTheme && ['light', 'dark', 'dim'].includes(savedTheme)) {
			setTheme(savedTheme);
		}
	}, []);

	useEffect(() => {
		// Save theme to localStorage when it changes
		if (isHydrated) {
			localStorage.setItem('theme', theme);
		}
	}, [theme, isHydrated]);

	// Always render the same structure to avoid hydration mismatches
	return (
		<ThemeContext.Provider value={{ theme, setTheme }}>
			<div className={isHydrated ? `theme-${theme}` : 'theme-light'}>
				{children}
			</div>
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
