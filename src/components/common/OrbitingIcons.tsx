import React from 'react';
import { motion } from 'framer-motion';

export const OrbitingIcons: React.FC = () => {
	const layers = Array.from({ length: 7 }, (_, i) => i + 1);
	const colors = [
		'#FF5733',
		'#33FF57',
		'#3357FF',
		'#FF33A1',
		'#A133FF',
		'#33FFF5',
		'#FF8C33',
	];

	return (
		<div className="relative flex h-[500px] w-[500px] items-center justify-center">
			{layers.map((layer) => (
				<div
					key={layer}
					className="absolute rounded-full"
					style={{
						backgroundColor: `${colors[layer - 1]}20`,
						width: `${100 + layer * 120}px`,
						height: `${100 + layer * 120}px`,
						zIndex: 10,
					}}
				/>
			))}
			{layers.map((layer) => (
				<motion.div
					key={`orbit-${layer}`}
					className={`absolute rounded-full border-2 border-dashed`}
					style={{
						animation: `rotate ${10 + layer * 2}s linear infinite`,
						transformOrigin: 'center',
						borderColor: colors[layer - 1],
						width: `${100 + layer * 120}px`,
						height: `${100 + layer * 120}px`,
					}}
				>
					<div
						className="absolute h-8 w-8 rounded-full"
						style={{
							backgroundColor: colors[layer - 1],
							top: '50%',
							left: '50%',
							transform: `translate(-50%, -50%) rotate(${layer * 45}deg) translateX(${(100 + layer * 120) / 2}px)`,
						}}
					/>
				</motion.div>
			))}
		</div>
	);
};
