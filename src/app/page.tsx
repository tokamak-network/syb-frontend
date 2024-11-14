// app/page.tsx

import React from 'react';

import { ImageSlider } from '@/components/common/ImageSlider';
import { Button } from '@/components';

const LandingPage: React.FC = () => {
	return (
		<div className="flex flex-col items-center">
			<ImageSlider />
			<div className="h-full w-full bg-[#011340]">
				<div className="flex flex-col items-center space-y-6 py-10">
					<h4 className="font-openSans text-3xl font-bold">
						Ground-Breaking Growth
					</h4>
					<h6 className="text-nowrap font-openSans text-xl">
						{
							'Join the SYB project, engage with the project, and see your\ncontribution grow to new height.'
						}
					</h6>
					<h1 className="font-anekDevanagari text-5xl font-extrabold">
						{'38,943,302 Active Users'}
					</h1>
					<div className="flex space-x-5 font-openSans">
						<Button className="rounded-lg bg-[#24A2C7] text-white">
							Get Started
						</Button>
						<Button className="rounded-lg bg-white text-[#001A33]">
							Learn More
						</Button>
					</div>
					<video
						autoPlay
						loop
						muted
						className="h-full w-full"
						src="/videos/bg-user-activity.webm"
					/>
				</div>
			</div>
		</div>
	);
};

export default LandingPage;
