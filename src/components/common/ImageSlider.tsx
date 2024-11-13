'use client';

import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import {
	Navigation,
	Pagination,
	Autoplay,
	EffectCards,
	EffectCoverflow,
} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-cards';
import { GrNext, GrPrevious } from 'react-icons/gr';

export const ImageSlider: React.FC = () => {
	const [activeIndex, setActiveIndex] = useState<number>(0);
	const slides = [
		{
			image: '/images/slide/1.jpg',
			text: 'Welcome To Sybil Guard Project',
			textClass: 'slide1-text',
		},
		{
			image: '/images/slide/2.jpg',
			text: 'White Paper Will LAUNCH On 2025',
			textClass: 'slide2-text',
		},
		{
			image: '/images/slide/3.jpg',
			text: 'NEXT Generation BLOCKCHAIN\n SECURITY',
			textClass: 'slide3-text',
		},
		{
			image: '/images/slide/4.jpg',
			text: 'Solve The Significant Security ',
			textClass: 'slide4-text',
		},
	];

	useEffect(() => {
		const interval = setInterval(() => {
			setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
		}, 5000);

		return () => clearInterval(interval);
	}, [slides.length]);

	return (
		<div className="relative w-full">
			<Swiper
				autoplay={{ delay: 5000 }}
				className="w-full"
				coverflowEffect={{
					rotate: 50,
					stretch: 0,
					depth: 100,
					modifier: 1,
					slideShadows: true,
				}}
				effect={'coverflow'}
				loop={true}
				modules={[
					EffectCards,
					Navigation,
					Pagination,
					Autoplay,
					EffectCoverflow,
				]}
				navigation={{
					nextEl: '.custom-next',
					prevEl: '.custom-prev',
				}}
				pagination={{
					clickable: true,
					el: '.custom-pagination',
					renderBullet: (index, className) => {
						return `<div class="${className}"></div>`;
					},
				}}
				slidesPerView={'auto'}
			>
				{slides.map((slide, index) => (
					<SwiperSlide key={index} className="w-full">
						<div
							className={`relative h-[900px] bg-cover bg-center ${activeIndex === index ? 'slide-content' : 'slide-context-exit'}`}
							style={{ backgroundImage: `url(${slide.image})` }}
						>
							<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
								<h2 className={slide.textClass}>{slide.text.toUpperCase()}</h2>
							</div>
						</div>
					</SwiperSlide>
				))}
			</Swiper>
			<div className="absolute bottom-2 z-10 flex w-full justify-center">
				<div className="custom-pagination" />
			</div>
			<div className="custom-prev absolute left-0 top-1/2 z-10 -translate-y-1/2 transform cursor-pointer rounded-md bg-opacity-50 p-2">
				<GrPrevious />
			</div>
			<div className="custom-next absolute right-0 top-1/2 z-10 -translate-y-1/2 transform cursor-pointer rounded-md bg-opacity-50 p-2">
				<GrNext />
			</div>
		</div>
	);
};
