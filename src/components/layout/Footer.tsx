import Image from 'next/image';
import React from 'react';

import { cn } from '@/utils/cn';
import {
	FooterLegals,
	FooterResources,
	FooterServices,
	FooterSiteMap,
	FooterSocialMedia,
} from '@/const';

import { LinkButton } from '../common/LinkButton';

export const Footer: React.FC<{ className?: string }> = ({ className }) => {
	return (
		<footer className={cn('', className)}>
			<div className="flex items-center justify-between border-b border-gray-600 p-20">
				<div className="items-left container mx-auto flex flex-col space-y-10">
					<h2 className="text-4xl font-bold">Sybil Guard</h2>
					<p className="max-w-lg text-left">
						SYB Real Estate describes itself as an asset-backed real estate
						marketplace. The team&apos;s approach in the real estate marketplace
						is to partner with a team of experienced developers and construction
						companies to help bring our project and vision from concept to
						completion.
					</p>
					<Image
						alt="partnership-primary-dark-logo"
						height={150}
						src={'/images/partnership-primary-dark-logo.png'}
						width={300}
					/>
					<span>SYB © – All rights reserved. 2024</span>
					<div className="flex space-x-10">
						{FooterSocialMedia.map((item) => (
							<LinkButton key={item.label} href={item.link} icon={item.icon} />
						))}
					</div>
				</div>
				<div className="container mx-auto flex items-center justify-between">
					<div className="flex flex-col space-y-4">
						<div className="flex space-x-20">
							<div className="space-y-10">
								<h4 className="text-2xl font-bold">Sitemap</h4>
								<ul className="space-y-6">
									{FooterSiteMap.map((item) => (
										<li key={item.label}>
											<LinkButton href={item.link} label={item.label} />
										</li>
									))}
								</ul>
							</div>
							<div className="space-y-10">
								<h4 className="text-2xl font-bold">Developer</h4>
								<ul className="space-y-6">
									{FooterServices.map((item) => (
										<li key={item.label}>
											<LinkButton href={item.link} label={item.label} />
										</li>
									))}
								</ul>
							</div>
							<div className="space-y-10">
								<h4 className="text-2xl font-bold">Resources</h4>
								<ul className="space-y-6">
									{FooterResources.map((item) => (
										<li key={item.label}>
											<LinkButton href={item.link} label={item.label} />
										</li>
									))}
								</ul>
							</div>
							<div className="space-y-10">
								<h4 className="text-2xl font-bold">Legals</h4>
								<ul className="space-y-6">
									{FooterLegals.map((item) => (
										<li key={item.label}>
											<LinkButton href={item.link} label={item.label} />
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};
