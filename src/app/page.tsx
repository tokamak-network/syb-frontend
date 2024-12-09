// app/page.tsx
'use client';

import React from 'react';

import { SearchBarComponent, UserGraph } from '@/components';
import ChainActivityTable from '@/components/tables/ChainActivity';

const HomePage: React.FC = () => {
	return (
		<div className="flex flex-col items-center">
			<ChainActivityTable />
		</div>
	);
};

export default HomePage;
