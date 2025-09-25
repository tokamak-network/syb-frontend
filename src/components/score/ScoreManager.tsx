'use client';

import React, { useState } from 'react';
import { useAccount } from 'wagmi';

import { ScoreUpdateButton } from '@/components/button';
import { Input, Tabs } from '@/components/common';

interface ScoreManagerProps {
	currentScore: number;
	batchNumber: number;
	userAddress?: string;
	onSuccess?: (txHash: string) => void;
	onError?: (error: string) => void;
}

export const ScoreManager: React.FC<ScoreManagerProps> = ({
	currentScore,
	batchNumber,
	userAddress,
	onSuccess,
	onError,
}) => {
	const { address } = useAccount();
	const [newScore, setNewScore] = useState<number>(0);
	const [targetAddress, setTargetAddress] = useState<string>(
		userAddress || address || '',
	);
	const [activeTab, setActiveTab] = useState<string>('prove');

	const handleSuccess = (txHash: string) => {
		onSuccess?.(txHash);
	};

	const handleError = (error: string) => {
		onError?.(error);
	};

	const tabs = [
		{ label: 'Prove Score', value: 'prove' },
		{ label: 'Update Score', value: 'update' },
	];

	return (
		<div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
			<div className="mb-6">
				<h3 className="text-lg font-semibold text-gray-900">
					Score Management
				</h3>
			</div>

			<div className="space-y-6">
				<div className="text-center">
					<span className="text-sm text-gray-600">Current Score</span>
					<p className="text-2xl font-bold text-blue-600">{currentScore}</p>
				</div>

				<Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

				{activeTab === 'prove' && (
					<div className="space-y-4">
						<div>
							<label htmlFor="prove-address" className="text-sm text-gray-600">
								User Address
							</label>
							<Input
								id="prove-address"
								value={targetAddress}
								onChange={(e) => setTargetAddress(e.target.value)}
								placeholder="0x..."
								className="mt-1"
							/>
						</div>
						<ScoreUpdateButton
							userAddress={targetAddress}
							batchNumber={batchNumber}
							variant="prove"
							onSuccess={handleSuccess}
							onError={handleError}
						/>
					</div>
				)}

				{activeTab === 'update' && (
					<div className="space-y-4">
						<div>
							<label htmlFor="update-address" className="text-sm text-gray-600">
								User Address
							</label>
							<Input
								id="update-address"
								value={targetAddress}
								onChange={(e) => setTargetAddress(e.target.value)}
								placeholder="0x..."
								className="mt-1"
							/>
						</div>
						<div>
							<label htmlFor="new-score" className="text-sm text-gray-600">
								New Score
							</label>
							<Input
								id="new-score"
								type="number"
								value={newScore}
								onChange={(e) => setNewScore(parseInt(e.target.value) || 0)}
								placeholder="Enter new score"
								className="mt-1"
							/>
						</div>
						<ScoreUpdateButton
							userAddress={targetAddress}
							batchNumber={batchNumber}
							variant="update"
							score={newScore}
							onSuccess={handleSuccess}
							onError={handleError}
						/>
					</div>
				)}
			</div>
		</div>
	);
};
