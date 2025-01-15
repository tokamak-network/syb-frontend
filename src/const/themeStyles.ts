export const themeStyles = {
	light: {
		text: 'text-black',
		hoverText: 'hover:text-gray-600',
		hoverBg: 'hover:bg-gray-100',
		beforeBg: '#000000',
		afterBg: '#000000',
		borderColor: 'border-gray-300',
		selectedColor: 'bg-blue-100',
		background: 'bg-white',
	},
	dark: {
		text: 'text-white',
		hoverText: 'hover:text-gray-300',
		hoverBg: 'hover:bg-gray-900',
		beforeBg: '#ffffff',
		afterBg: '#ffffff',
		borderColor: 'border-gray-600',
		selectedColor: 'bg-gray-700',
		background: 'bg-black',
	},
	dim: {
		text: 'text-gray-200',
		hoverText: 'hover:text-gray-500',
		hoverBg: 'hover:bg-gray-400',
		beforeBg: '#cccccc',
		afterBg: '#cccccc',
		borderColor: 'border-gray-500',
		selectedColor: 'bg-gray-800',
		background: 'bg-gray-600',
	},
};

export const inputThemeStyles = (theme: 'light' | 'dark' | 'dim') => {
	switch (theme) {
		case 'dark':
			return 'bg-gray-800 text-white border-gray-600 focus:ring-blue-500';
		case 'dim':
			return 'bg-gray-200 text-gray-800 border-gray-400 focus:ring-blue-400';
		case 'light':
		default:
			return 'bg-white text-gray-800 border-gray-300 focus:ring-blue-500';
	}
};
