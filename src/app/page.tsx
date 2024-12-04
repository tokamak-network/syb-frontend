// app/page.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

import { Button } from '@/components';
import { CoreAttributesData, projectStructure } from '@/const';
import { ImageSlider } from '@/components/slider';
import { TeamMemberSlider } from '@/components/slider/TeamMemberSlider';
import { OrbitingIcons } from '@/components/common/OrbitingIcons';

const LandingPage: React.FC = () => {
	const itemVariants = {
		offscreen: { opacity: 0, y: 20 },
		onscreen: { opacity: 1, y: 0 },
	};

	const structureVariants = {
		offscreen: { opacity: 0, x: 0 },
		onscreen: { opacity: 1, x: -50 },
	};

	const sectionTitleVariants = {
		offscreen: { opacity: 1, y: 0 },
		onscreen: { opacity: 1, y: 30 },
	};

	const sectionSubtitleVariants = {
		offscreen: { opacity: 1, x: -100 },
		onscreen: { opacity: 1, x: 0 },
	};

	return (
		<div className="flex flex-col items-center">
			{/* <section className="w-full">
				<ImageSlider />
			</section> */}
			{/* <section className="h-full w-full bg-primary">
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
						<Button className="rounded-lg bg-secondary text-white">
							Get Started
						</Button>
						<Button className="rounded-lg bg-white text-primary">
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
			</section> */}
			<section className="flex justify-between bg-white p-28">
				<div className="flex w-1/3 flex-col space-y-6 text-primary">
					<motion.p
						className="font-openSans text-sm"
						exit="offscreen"
						initial="offscreen"
						transition={{ duration: 0.2, delay: 0.2 }}
						variants={sectionTitleVariants}
						whileInView="onscreen"
					>
						ABOUT
					</motion.p>
					<motion.p
						className="font-anekDevanagari text-7xl font-extrabold"
						exit="offscreen"
						initial="offscreen"
						transition={{ duration: 0.2, delay: 0.2 }}
						variants={sectionSubtitleVariants}
						whileInView="onscreen"
					>
						What is SYB?
					</motion.p>
					<p className="font-openSans text-lg">
						Sybil Resistance describes itself as an asset-backed real estate
						marketplace. The team&apos;s approach in the real estate marketplace
						is to partner with a team of experienced developers and construction
						companies to help bring our project and vision from concept to
						completion.
					</p>
				</div>
				<div className="flex h-96 w-96 items-center justify-center rounded-full border-4 border-secondary bg-primary p-10">
					<Image
						alt="about"
						height={180}
						src="/images/about-logo.png"
						width={180}
					/>
				</div>
			</section>
			<section className="flex w-full flex-col space-y-10 bg-secondary py-20">
				<div className="flex flex-col space-y-8 text-center">
					<motion.p
						className="font-openSans text-lg font-normal tracking-widest"
						exit="offscreen"
						initial="offscreen"
						transition={{ duration: 0.2, delay: 0.2 }}
						variants={sectionTitleVariants}
						whileInView="onscreen"
					>
						FEATURES
					</motion.p>
					<motion.p
						className="font-anekDevanagari text-7xl font-extrabold"
						exit="offscreen"
						initial="offscreen"
						transition={{ duration: 0.2, delay: 0.2 }}
						variants={sectionSubtitleVariants}
						whileInView="onscreen"
					>
						Core Attributes
					</motion.p>
				</div>
				<div className="grid w-full grid-cols-1 gap-8 px-60 md:grid-cols-3">
					{CoreAttributesData.map((item, index) => (
						<motion.div
							key={index}
							className={`flex flex-col justify-center space-y-3 rounded-3xl border-2 border-white border-opacity-30 p-6 ${
								index === 3 ? 'col-span-1 md:col-start-2' : ''
							}`}
							exit="offscreen"
							initial="offscreen"
							transition={{ duration: 0.5, delay: index * 0.2 }}
							variants={itemVariants}
							viewport={{ once: false, amount: 0.8 }}
							whileInView="onscreen"
						>
							<h3 className="text-left font-openSans text-2xl font-bold tracking-wider">
								{item.title}
							</h3>
							<p className="text-left font-openSans text-sm">{item.content}</p>
						</motion.div>
					))}
				</div>
			</section>
			{/* <section className="flex w-full space-x-10 bg-primary p-24">
				<TeamMemberSlider />
			</section> */}
			{/* <section className="flex w-full items-center justify-between space-x-20 bg-white p-20 text-primary">
				<div className="flex w-1/2 flex-col space-y-20 pl-20">
					<motion.p
						className="text-md font-openSans"
						exit="offscreen"
						initial="offscreen"
						transition={{ duration: 0.2, delay: 0.2 }}
						variants={sectionTitleVariants}
						whileInView="onscreen"
					>
						STRUCTURE
					</motion.p>
					<motion.p
						className="font-anekDevanagari text-7xl font-extrabold"
						exit="offscreen"
						initial="offscreen"
						transition={{ duration: 0.2, delay: 0.2 }}
						variants={sectionSubtitleVariants}
						whileInView="onscreen"
					>
						The Part of the System
					</motion.p>
					<p className="text-lg">
						Sybil Resistance is the comprehensive solution to problems faced in
						modern blockchain development
					</p>
				</div>
				<div className="flex w-1/2 flex-col space-y-10">
					{projectStructure.map((item, index) => (
						<motion.div
							key={item.title}
							className="space-y-5 rounded-3xl border-2 border-primary border-opacity-30 p-10 font-openSans"
							initial="offscreen"
							transition={{ duration: 0.5, delay: index * 0.1 }}
							variants={structureVariants}
							viewport={{ once: false, amount: 0.8 }}
							whileInView="onscreen"
						>
							<h3 className="text-3xl font-bold">{item.title}</h3>
							<p className="text-sm">{item.description}</p>
						</motion.div>
					))}
				</div>
			</section> */}
			{/* <section className="flex h-auto w-full items-center justify-center bg-secondary p-60">
				<OrbitingIcons />
			</section> */}
		</div>
	);
};

export default LandingPage;
