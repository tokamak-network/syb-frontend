'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Scrollbar, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/scrollbar';
import { motion } from 'framer-motion';
import Image from 'next/image';

import { teamMemberSlidesData } from '@/data';

export const TeamMemberSlider: React.FC = () => {
	const teamMemberVariants = {
		offscreen: { opacity: 0, x: 200 },
		onscreen: {
			opacity: 1,
			x: 0,
			transition: { duration: 0.8, type: 'spring', bounce: 0.5 },
		},
	};
	const teamVariants = {
		offscreen: { opacity: 0, x: -200 },
		onscreen: {
			opacity: 1,
			x: 0,
			transition: { duration: 0.8, type: 'spring', bounce: 0.5 },
		},
	};

	return (
		<div className="relative w-full">
			<Swiper
				breakpoints={{
					640: {
						slidesPerView: 1,
						spaceBetween: 20,
					},
					768: {
						slidesPerView: 2,
						spaceBetween: 40,
					},
					1024: {
						slidesPerView: 3,
						spaceBetween: 50,
					},
				}}
				className="w-full"
				modules={[Scrollbar, Navigation]}
				navigation={{
					nextEl: '.custom-next',
					prevEl: '.custom-prev',
				}}
				scrollbar={{ draggable: true, hide: false }}
				slidesPerView={'auto'}
				spaceBetween={30}
			>
				<SwiperSlide className="w-1/3 pb-20">
					<motion.div
						className="space-y-3"
						exit="offscreen"
						initial="offscreen"
						variants={teamVariants}
						viewport={{ once: false, amount: 0.2 }}
						whileInView="onscreen"
					>
						<p className="text-start font-openSans text-lg font-normal tracking-widest">
							Team
						</p>
						<p className="text-start font-anekDevanagari text-7xl font-extrabold">
							Strengthened
							<br />
							By Our
							<br />
							Professionals
						</p>
					</motion.div>
				</SwiperSlide>
				{teamMemberSlidesData.map((slide, index) => (
					<SwiperSlide key={index} className="w-1/4">
						<motion.div
							className="flex w-full items-center justify-center space-x-10"
							exit="offscreen"
							initial="offscreen"
							variants={teamMemberVariants}
							viewport={{ once: false, amount: 0.2 }}
							whileInView="onscreen"
						>
							<Image
								alt="avatar"
								className="rounded-lg"
								height={250}
								src={slide.image}
								width={250}
							/>
							<div className="w-1/2 space-y-3 pt-3">
								<p className="font-openSans text-2xl font-bold">{slide.name}</p>
								<p className="font-anekDevanagari text-lg font-semibold">
									{slide.position}
								</p>
								<p className="text-md font-anekDevanagari">
									{slide.description}
								</p>
							</div>
						</motion.div>
					</SwiperSlide>
				))}
			</Swiper>
		</div>
	);
};
