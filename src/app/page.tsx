// app/page.tsx
'use client';

import React from 'react';

import { UserGraph } from '@/components';

const HomePage: React.FC = () => {
	return (
		<div className="flex flex-col items-center">
			<UserGraph />
		</div>
	);
};

export default HomePage;
