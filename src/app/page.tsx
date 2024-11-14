// app/page.tsx

import React from 'react';
import Image from 'next/image';

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
			<div className="flex justify-between bg-white p-28">
				<div className="flex w-1/3 flex-col space-y-4 text-[#011340]">
					<h5 className="font-openSans text-sm">ABOUT</h5>
					<h2 className="w-full text-nowrap font-anekDevanagari text-7xl font-bold">
						What is SYB?
					</h2>
					<span className="font-openSans text-lg">
						Sybil Resistance describes itself as an asset-backed real estate
						marketplace. The team&apos;s approach in the real estate marketplace
						is to partner with a team of experienced developers and construction
						companies to help bring our project and vision from concept to
						completion.
					</span>
				</div>
				<div className="flex h-80 w-80 items-center justify-center rounded-full border-4 border-[#24A2C7] bg-[#011340] p-10">
					<Image
						alt="about"
						height={180}
						src="/images/about-logo.png"
						width={180}
					/>
				</div>
			</div>
		</div>
	);
};

export default LandingPage;
