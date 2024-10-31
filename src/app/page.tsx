// app/page.tsx

import React from 'react';
import Image from 'next/image';

import { Button } from '@/components/common/Button';

const LandingPage: React.FC = () => {
	return (
		<div className="flex flex-col items-center py-20 md:flex-row">
			<div className="relative mb-8 flex max-w-3xl flex-col justify-between space-y-28 p-12 md:mb-0">
				<p className="gradient-text pt-44 text-center text-6xl leading-relaxed tracking-wider md:text-left">
					Unlocking the <br /> Future of Security
				</p>
				<div className="flex justify-center space-x-10">
					<Button backgroundImage="/images/button1.png" className="w-1/3">
						Get Started
					</Button>
					<Button backgroundImage="/images/button2.png" className="w-1/3">
						Learn More
					</Button>
				</div>
			</div>
			<Image
				alt="background"
				className="absolute right-5 w-2/4 md:w-auto"
				height={300}
				src="/images/artwork.png"
				width={300}
			/>
		</div>
	);
};

export default LandingPage;
