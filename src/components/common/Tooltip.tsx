// src/components/Tooltip.tsx
import React from 'react';

interface TooltipProps {
	address: string;
	balance: number;
	score: number;
	position: { x: number; y: number };
	visible: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({
	address,
	balance,
	score,
	position,
	visible,
}) => {
	return (
		<div
			className={`tooltip absolute rounded bg-black p-2 text-white shadow-lg ${visible ? 'tooltip-visible' : ''}`}
			style={{ top: position.y, left: position.x }}
		>
			<p>Address: {address}</p>
			<p>Balance: {balance}</p>
			<p>Score: {score}</p>
		</div>
	);
};
