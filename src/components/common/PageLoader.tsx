import React from 'react';
import { ImSpinner2 } from 'react-icons/im';

export const PageLoader: React.FC = () => {
	return (
		<div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900">
			<ImSpinner2 className="animate-spin text-blue-500" size={40} />
		</div>
	);
};
