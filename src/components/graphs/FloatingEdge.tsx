import React from 'react';
import { getBezierPath, EdgeProps, useReactFlow } from '@xyflow/react';

import { getEdgeParams } from '@/utils';
import { UserNode } from '@/types';

interface FloatingEdgeProps extends EdgeProps {
	hoveredNodeId: string | null;
}

export const FloatingEdge: React.FC<FloatingEdgeProps> = ({
	id,
	source,
	target,
	markerEnd,
	style,
	hoveredNodeId,
}) => {
	const { getNode } = useReactFlow();
	const sourceNode = getNode(source) as UserNode;
	const targetNode = getNode(target) as UserNode;

	if (!sourceNode || !targetNode) {
		return null;
	}

	const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(
		sourceNode,
		targetNode,
	);

	const [edgePath] = getBezierPath({
		sourceX: sx,
		sourceY: sy,
		sourcePosition: sourcePos,
		targetPosition: targetPos,
		targetX: tx,
		targetY: ty,
	});

	return (
		<g className="react-flow__edge">
			<path
				className={`react-flow__edge-path ${
					hoveredNodeId === source || hoveredNodeId === target
						? 'highlighted'
						: ''
				}`}
				d={edgePath}
				id={id}
				markerEnd={markerEnd}
				style={{
					...style,
					strokeDasharray:
						hoveredNodeId === source || hoveredNodeId === target
							? '5,5'
							: 'none',
					stroke: hoveredNodeId === source ? '#ff6347' : '#4682b4', // Different colors for vouch and received
				}}
			/>
		</g>
	);
};
