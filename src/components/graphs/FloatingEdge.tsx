import React from 'react';
import { getBezierPath, EdgeProps, useReactFlow } from 'reactflow';

import { getEdgeParams } from '@/utils';

export const FloatingEdge: React.FC<EdgeProps> = ({
	id,
	source,
	target,
	markerEnd,
	style,
}) => {
	const { getNode } = useReactFlow();
	const sourceNode = getNode(source);
	const targetNode = getNode(target);

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
				className="react-flow__edge-path"
				d={edgePath}
				id={id}
				markerEnd={markerEnd}
				style={style}
			/>
		</g>
	);
};
