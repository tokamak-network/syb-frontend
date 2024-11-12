'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Image from 'next/image';

export const ImageSlider: React.FC = () => {
	return (
		<Swiper
			autoplay={true}
			loop={true}
			modules={[Navigation, Pagination]}
			navigation={true}
			pagination={{ clickable: true }}
		>
			<SwiperSlide>
				<Image
					alt="Slide 1"
					height={1024}
					src="/images/slide/1.jpg"
					width={1920}
				/>
			</SwiperSlide>
			<SwiperSlide>
				<Image
					alt="Slide 2"
					height={1024}
					src="/images/slide/2.jpg"
					width={1920}
				/>
			</SwiperSlide>
			<SwiperSlide>
				<Image
					alt="Slide 3"
					height={1024}
					src="/images/slide/3.jpg"
					width={1920}
				/>
			</SwiperSlide>
			<SwiperSlide>
				<Image
					alt="Slide 4"
					height={1024}
					src="/images/slide/4.jpg"
					width={1920}
				/>
			</SwiperSlide>
		</Swiper>
	);
};
