import React from 'react';

import { Header, Footer } from '@/components';

const MainContainer: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	return (
		<div className={`flex min-h-screen flex-col`}>
			<main className="w-full flex-grow px-4">
				<Header />
				{children}
				<Footer />
			</main>
		</div>
	);
};

export default MainContainer;
