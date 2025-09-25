'use client';

import React, { useState } from 'react';
import { ImSpinner2 } from 'react-icons/im';
import {
	FaCheckCircle,
	FaTimesCircle,
	FaExternalLinkAlt,
} from 'react-icons/fa';

import { useScoreUpdate } from '@/hooks/useScoreUpdate';
import { Button } from '@/components/button/Button';

interface ScoreUpdateButtonProps {
	userAddress: string;
	batchNumber: number;
	onSuccess?: (txHash: string) => void;
	onError?: (error: string) => void;
	variant?: 'prove' | 'update';
	score?: number;
}

export const ScoreUpdateButton: React.FC<ScoreUpdateButtonProps> = ({
	userAddress,
	batchNumber,
	onSuccess,
	onError,
	variant = 'prove',
	score,
}) => {
	const [txHash, setTxHash] = useState<string | null>(null);
	const { proveScore, handleUpdateScore, isLoading, error } = useScoreUpdate();

	const handleClick = async () => {
		try {
			let hash: string;

			if (variant === 'prove') {
				hash = await proveScore(userAddress, batchNumber);
			} else {
				if (!score) {
					throw new Error('Score is required for update variant');
				}
				hash = await handleUpdateScore(userAddress, score);
			}

			setTxHash(hash);
			onSuccess?.(hash);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Unknown error';

			onError?.(errorMessage);
		}
	};

	if (txHash) {
		return (
			<div className="flex items-center gap-2 text-green-600">
				<FaCheckCircle className="h-4 w-4" />
				<span className="text-sm">
					{variant === 'prove'
						? 'Score proven successfully!'
						: 'Score updated successfully!'}
				</span>
				<a
					className="flex items-center gap-1 text-blue-600 hover:underline"
					href={`https://sepolia.etherscan.io/tx/${txHash}`}
					rel="noopener noreferrer"
					target="_blank"
				>
					<FaExternalLinkAlt className="h-3 w-3" />
					View on Etherscan
				</a>
			</div>
		);
	}

	return (
		<div className="space-y-2">
			<Button className="w-full" disabled={isLoading} onClick={handleClick}>
				{isLoading ? (
					<>
						<ImSpinner2 className="mr-2 h-4 w-4 animate-spin" />
						{variant === 'prove' ? 'Proving Score...' : 'Updating Score...'}
					</>
				) : variant === 'prove' ? (
					'Prove Score'
				) : (
					'Update Score'
				)}
			</Button>

			{error && (
				<div className="flex items-center gap-2 text-red-600">
					<FaTimesCircle className="h-4 w-4" />
					<span className="text-sm">{error}</span>
				</div>
			)}
		</div>
	);
};
