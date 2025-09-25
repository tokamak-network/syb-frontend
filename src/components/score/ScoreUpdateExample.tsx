'use client';

import React from 'react';
import { useAccount } from 'wagmi';

import { ScoreManager } from './ScoreManager';

/**
 * Example component demonstrating how to use the ScoreManager
 * This component shows how to integrate score update functionality
 */
export const ScoreUpdateExample: React.FC = () => {
	const { address } = useAccount();

	// Example data - in a real app, this would come from your state management
	const currentScore = 150;
	const batchNumber = 1;

	if (!address) {
		return (
			<div className="flex items-center justify-center p-8">
				<p className="text-gray-600">
					Please connect your wallet to manage scores
				</p>
			</div>
		);
	}

	return (
		<div className="flex justify-center p-8">
			<ScoreManager currentScore={currentScore} batchNumber={batchNumber} />
		</div>
	);
};
