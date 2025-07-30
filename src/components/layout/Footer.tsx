'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';

import { cn } from '@/utils/cn';
import { FooterSocialMedia } from '@/const';
import { LinkButton } from '../button/LinkButton';

export const Footer: React.FC<{ className?: string }> = ({ className }) => {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	return (
		<footer
			className={cn('border-border w-full border-t bg-background', className)}
		>
			<div className="container mx-auto px-4 py-12">
				<div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
					{/* Left Column - Brand & Description */}
					<div className="flex flex-col space-y-6">
						<div className="space-y-4">
							<h2 className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
								Sybil Guard
							</h2>
							<p className="text-muted-foreground max-w-md text-sm leading-relaxed md:text-base">
								Creating an identity-proving algorithm and zk-rollup network for
								user identification.
							</p>
						</div>

						{/* Partnership Logo */}
						<div className="relative">
							<Image
								alt="partnership-primary-dark-logo"
								height={120}
								src={'/images/partnership-primary-dark-logo.png'}
								width={240}
								className="object-contain"
							/>
						</div>
					</div>

					{/* Right Column - Social Media & Copyright */}
					<div className="flex flex-col justify-between space-y-6">
						{/* Social Media Links */}
						<div className="space-y-4">
							<h3 className="text-lg font-semibold text-foreground">
								Connect With Us
							</h3>
							<div className="flex flex-wrap gap-3">
								{isClient &&
									FooterSocialMedia.map((item) => (
										<LinkButton
											key={item.label}
											href={item.link || ''}
											icon={item.icon}
											className="hover:bg-accent rounded-lg p-2 transition-colors"
										/>
									))}
							</div>
						</div>

						{/* Copyright */}
						<div className="space-y-2">
							<div className="text-muted-foreground text-sm">
								<span>SYB © – All rights reserved. 2025</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};
