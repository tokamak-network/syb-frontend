import React from 'react';
import { getBezierPath } from '@xyflow/react';

import { getEdgeParams } from '@/utils';
import { UserNode } from '@/types';

export const FloatingConnectionLine: React.FC<any> = ({
	toX,
	toY,
	fromPosition,
	toPosition,
	fromNode,
}) => {
	if (!fromNode) {
		return null;
	}

	const targetNode: UserNode = {
		id: 'connection-target',
		data: { label: '' }, // Provide a default label
		measured: {
			width: 1, // Default width
			height: 1, // Default height
		},
		position: { x: 0, y: 0 },
		__rf: {
			width: 1,
			height: 1,
		},
	};

	const { sx, sy } = getEdgeParams(fromNode, targetNode);
	const [edgePath] = getBezierPath({
		sourceX: sx,
		sourceY: sy,
		sourcePosition: fromPosition,
		targetPosition: toPosition,
		targetX: toX,
		targetY: toY,
	});

	return (
		<g>
			<path
				className="animated"
				d={edgePath}
				fill="none"
				stroke="#222"
				strokeWidth={1.5}
			/>
			<circle
				cx={toX}
				cy={toY}
				fill="#fff"
				r={3}
				stroke="#222"
				strokeWidth={1.5}
			/>
		</g>
	);
};
