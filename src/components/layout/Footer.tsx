'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';

import { cn } from '@/utils/cn';
import {
	FooterLegals,
	FooterResources,
	FooterServices,
	FooterSiteMap,
	FooterSocialMedia,
} from '@/const';

import { LinkButton } from '../button/LinkButton';

export const Footer: React.FC<{ className?: string }> = ({ className }) => {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);
	return (
		<footer className={cn('', className)}>
			<div className="flex w-full flex-col-reverse items-center justify-between gap-14 lg:flex-row">
				<div className="flex w-full flex-col items-start space-y-10 lg:w-1/3">
					<h2 className="text-4xl font-bold">Sybil Guard</h2>
					<p className="max-w-full text-left">
						Creating an identity-proving algorithm and zk-rollup network for
						user identification.
					</p>
					<Image
						alt="partnership-primary-dark-logo"
						height={150}
						src={'/images/partnership-primary-dark-logo.png'}
						width={300}
					/>
					<div className="flex w-full flex-col justify-between gap-y-4 sm:flex-row lg:flex-col">
						<div className="min-w-72">
							<span>SYB © – All rights reserved. 2025</span>
						</div>
						<div className="flex flex-wrap gap-x-10 gap-y-2">
							{isClient &&
								FooterSocialMedia.map((item) => (
									<LinkButton
										key={item.label}
										href={item.link || ''}
										icon={item.icon}
									/>
								))}
						</div>
					</div>
				</div>
				<div className="flex w-full flex-row flex-wrap justify-between gap-x-5 gap-y-10 xl:w-2/3 xl:gap-x-14">
					<div className="flex flex-col gap-y-10">
						<h4 className="text-xl font-bold lg:text-2xl">Sitemap</h4>
						<ul className="flex flex-col gap-y-6">
							{FooterSiteMap.map((item) => (
								<li key={item.label}>
									<LinkButton href={item.link} label={item.label} />
								</li>
							))}
						</ul>
					</div>
					<div className="flex flex-col gap-y-10">
						<h4 className="text-xl font-bold lg:text-2xl">Developer</h4>
						<ul className="flex flex-col gap-y-6">
							{FooterServices.map((item) => (
								<li key={item.label}>
									<LinkButton href={item.link} label={item.label} />
								</li>
							))}
						</ul>
					</div>
					<div className="flex flex-col gap-y-10">
						<h4 className="text-xl font-bold lg:text-2xl">Resources</h4>
						<ul className="flex flex-col gap-y-6">
							{FooterResources.map((item) => (
								<li key={item.label}>
									<LinkButton href={item.link} label={item.label} />
								</li>
							))}
						</ul>
					</div>
					<div className="flex flex-col gap-y-10">
						<h4 className="text-xl font-bold lg:text-2xl">Legals</h4>
						<ul className="flex flex-col gap-y-6">
							{FooterLegals.map((item) => (
								<li key={item.label}>
									<LinkButton href={item.link} label={item.label} />
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</footer>
	);
};
