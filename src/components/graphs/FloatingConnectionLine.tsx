import React from 'react';
import { getBezierPath } from '@xyflow/react';

import { getEdgeParams } from '@/utils';

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

	const targetNode = {
		id: 'connection-target',
		__rf: {
			width: 1,
			height: 1,
		},
		positionAbsolute: { x: toX, y: toY },
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
