'use client';

import React from 'react';

import { FooterSocialMedia } from '@/const';
import { LinkButton } from '../button/LinkButton';

export const SocialMediaLinks: React.FC = () => {
	return (
		<div className="flex flex-wrap gap-3">
			{FooterSocialMedia.map((item) => (
				<LinkButton
					key={item.label}
					href={item.link || ''}
					icon={item.icon}
					className="hover:bg-accent rounded-lg p-2 transition-colors"
				/>
			))}
		</div>
	);
};
