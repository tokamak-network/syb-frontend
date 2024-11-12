// app/page.tsx

import React from 'react';

import { ImageSlider } from '@/components/common/ImageSlider';

const LandingPage: React.FC = () => {
	return (
		<div className="flex flex-col items-center md:flex-row">
			<ImageSlider />
		</div>
	);
};

export default LandingPage;
