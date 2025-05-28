'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorDisplay } from './ErrorDisplay';

interface Props {
	children: ReactNode;
	fallbackMessage?: string;
	fallbackTitle?: string;
}

interface State {
	hasError: boolean;
	error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
	public state: State = {
		hasError: false,
		error: null,
	};

	public static getDerivedStateFromError(error: Error): State {
		// Update state so the next render will show the fallback UI.
		return { hasError: true, error };
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		// You can also log the error to an error reporting service
		console.error('ErrorBoundary caught an error:', error, errorInfo);
	}

	private handleReset = () => {
		this.setState({ hasError: false, error: null });
		// You might want to add a mechanism to attempt to re-render the children,
		// or prompt the user for a page reload if a simple reset isn't enough.
	};

	public render() {
		if (this.state.hasError) {
			// You can render any custom fallback UI
			return (
				<ErrorDisplay
					title={this.props.fallbackTitle || 'Component Error'}
					message={
						this.props.fallbackMessage ||
						this.state.error?.message ||
						'This part of the application encountered an error.'
					}
					onReset={this.handleReset} // Provide a way to try rendering the component again
				/>
			);
		}

		return this.props.children;
	}
}
