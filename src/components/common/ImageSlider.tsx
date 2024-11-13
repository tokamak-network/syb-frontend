'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export const ImageSlider: React.FC = () => {
	return (
		<div className="relative w-full">
			<Swiper
				autoplay={{ delay: 3000 }}
				className="w-full"
				loop={true}
				modules={[Navigation, Pagination, Autoplay]}
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
			>
				<SwiperSlide className="w-full">
					<div
						className="relative h-[900px] bg-cover bg-center"
						style={{ backgroundImage: "url('/images/slide/1.jpg')" }}
					>
						<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
							<h2 className="animate-fadeIn text-3xl font-bold text-white">
								Welcome to Slide 1
							</h2>
						</div>
					</div>
				</SwiperSlide>
				<SwiperSlide className="w-full">
					<div
						className="relative h-[900px] bg-cover bg-center"
						style={{ backgroundImage: "url('/images/slide/2.jpg')" }}
					>
						<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
							<h2 className="animate-fadeIn text-3xl font-bold text-white">
								Welcome to Slide 2
							</h2>
						</div>
					</div>
				</SwiperSlide>
			</Swiper>
			<div className="absolute bottom-2 z-10 flex w-full justify-center">
				<div className="custom-pagination" />
			</div>
			<div className="custom-prev absolute left-0 top-1/2 z-10 -translate-y-1/2 transform cursor-pointer bg-black bg-opacity-50 p-2 text-white">
				Prev
			</div>
			<div className="custom-next absolute right-0 top-1/2 z-10 -translate-y-1/2 transform cursor-pointer bg-black bg-opacity-50 p-2 text-white">
				Next
			</div>
		</div>
	);
};
