'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

import { Toast } from '@/components/common';

interface ToastData {
	id: string;
	type: 'success' | 'warning' | 'error' | 'info';
	title: string;
	description: string;
}

interface ToastContextType {
	addToast: (
		type: 'success' | 'warning' | 'error' | 'info',
		title: string,
		description: string,
	) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [toasts, setToasts] = useState<ToastData[]>([]);

	const addToast = (
		type: 'success' | 'warning' | 'error' | 'info',
		title: string,
		description: string,
	) => {
		const id = Math.random().toString(36).substr(2, 9);

		setToasts((prev) => [...prev, { id, type, title, description }]);
	};

	const removeToast = (id: string) => {
		setToasts((prev) => prev.filter((toast) => toast.id !== id));
	};

	return (
		<ToastContext.Provider value={{ addToast }}>
			{children}
			<div className="fixed right-0 top-0 z-50 flex flex-col items-end space-y-2 p-4">
				{toasts.map((toast) => (
					<Toast key={toast.id} {...toast} onRemove={removeToast} />
				))}
			</div>
		</ToastContext.Provider>
	);
};

export const useToast = (): ToastContextType => {
	const context = useContext(ToastContext);

	if (!context) {
		throw new Error('useToast must be used within a ToastProvider');
	}

	return context;
};
