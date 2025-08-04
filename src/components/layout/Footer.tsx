import Image from 'next/image';
import React from 'react';

import { cn } from '@/utils/cn';

export const Footer: React.FC<{ className?: string }> = ({ className }) => {
	return (
		<footer
			className={cn('border-border w-full border-t bg-background', className)}
		>
			<div className="container mx-auto px-6 py-12">
				{/* Main Footer Content */}
				<div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
					{/* Brand Section */}
					<div className="lg:col-span-2">
						<div className="flex flex-col space-y-6">
							{/* Logo and Title */}
							<div className="flex items-center space-x-4">
								<div className="relative h-12 w-12">
									<Image
										alt="Sybil Guard Logo"
										className="object-contain"
										height={48}
										src={'/images/logo-light.png'}
										width={48}
									/>
								</div>
								<h2 className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-2xl font-bold text-transparent md:text-3xl">
									Sybil Guard
								</h2>
							</div>

							{/* Description */}
							<p className="text-muted-foreground max-w-lg text-sm leading-relaxed md:text-base">
								Creating an identity-proving algorithm and zk-rollup network for
								user identification. Building the future of decentralized
								identity verification.
							</p>
						</div>
					</div>

					{/* Partnership Section */}
					<div className="flex flex-col items-center justify-center lg:items-end">
						<div className="text-center lg:text-right">
							<h3 className="text-muted-foreground mb-4 text-sm font-medium uppercase tracking-wide">
								Partnership
							</h3>
							<div className="relative">
								<Image
									alt="partnership-primary-dark-logo"
									className="object-contain md:h-16 md:w-32 lg:h-20 lg:w-40"
									height={60}
									src={'/images/partnership-primary-dark-logo.png'}
									width={120}
								/>
							</div>
						</div>
					</div>
				</div>

				{/* Divider */}
				<div className="border-border my-8 border-t" />

				{/* Copyright Section */}
				<div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
					<div className="text-muted-foreground text-center text-sm sm:text-left">
						<span>© 2025 Sybil Guard. All rights reserved.</span>
					</div>
					<div className="text-muted-foreground text-center text-sm">
						<span>Building the future of decentralized identity</span>
					</div>
				</div>
			</div>
		</footer>
	);
};
